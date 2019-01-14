<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Matter;
use App\File;
use App\Contact;
use App\MatterNote;
use App\MatterFile;
use App\Library\Encryption;
use App\Library\EncryptionKey;
use Illuminate\Support\Facades\Storage;
use DB;
use Exception;
 use Carbon\Carbon;


function findClosestMatterType($input) {
    $best = -1;
    $match = null;
    foreach(Matter::MATTER_TYPES as $matterType) {
        $val = similar_text($matterType, $input);
        if($val > $best) {
            $best = $val;
            $match = $matterType;
        }
    }
    return $match;
}



class MatterController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $orgId = $request->user()->organisation_id;
        return Matter::where('organisation_id', $orgId)->with(['creator:preferred_name', 'clients', 'clients.contactable'])->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $data = $request->allJson();

        $matter = Matter::create(array_merge(
            $data,
            [
                'created_by_user_id' =>  $user->id,
                'organisation_id' => $user->organisation_id
            ]
        ));

        // FILES
        $fileIds = array_map(function($file) use ($user) {
            return $this->saveUploadedFile($file, $user)->id;
        }, $request->file('file', []));

        $matter->files()->attach($fileIds);

        $clients =  array_map(function ($i) {
            return $i['id'];
        }, $data['clients'] ?? []);


        $matter->clients()->sync($clients);

        $newNotes = array_map(function ($i) use ($user)  {
            return array_merge($i, ['created_by_user_id' => $user->id]);
        }, $data['notes'] ?? []);

        $matter->notes()->createMany($newNotes);

        return response()->json(['message' => 'Matter created', 'id' => $matter->id], 201);
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        //
        $matter = Matter::where('id', $id)->where('organisation_id', $request->user()->organisation_id)->with(['creator', 'referrer', 'files', 'clients', 'clients.contactable',  'notes', 'notes.creator'])->first();
        return $matter;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();
        $data = $request->allJson();
        $matter = Matter::where('id', $id)->where('organisation_id', $request->user()->organisation_id)->first();
        $matter->update($data);

        $fileIds = array_map(function($file) use ($user) {
            return $this->saveUploadedFile($file, $user)->id;
        }, $request->file('file', []));

        $existingFileIds = array_map(function ($i) {
            return (int)$i;
        }, $data['existing_files'] ?? []);

        $matter->files()->sync(array_merge($fileIds, $existingFileIds));

        $clients =  array_map(function ($i) {
            return $i['id'];
        }, $data['clients'] ?? []);


        $matter->clients()->sync($clients);

        $notes = array_filter($data['notes'] ?? [], function($note){
            return isset($note['id']);
        });

        $notes = array_reduce($notes,  function ($acc, $i) use ($id) {
            $acc[$i['id']] = MatterNote::where(['id' => $i['id'], 'matter_id' => $id])->first();
            if(!$acc[$i['id']]) {
                $acc[$i['id']] = new MatterNote($i);
            }
            $acc[$i['id']]->update($i);
            return $acc;
        }, []);



        $matter->notes()->saveMany($notes);

        $newNotes = array_filter($data['notes'] ?? [], function($note){
            return !isset($note['id']);
        });

        $newNotes = array_map(function ($i) use ($user) {
            return array_merge($i, ['created_by_user_id' => $user->id]);
        }, $newNotes);


        $matter->notes()->createMany($newNotes);

        return response()->json(['message' => 'Matter updated', 'id' => $matter->id], 200);
    }


    public function uploadDocuments(Request $request, $id)
    {
        $user = $request->user();
        $data = $request->allJson();
        $parentId = $data['parent_id'] ?? null;
        $newDirectory = $data['new_directory'] ?? null;
        $matter = Matter::where('id', $id)->where('organisation_id', $request->user()->organisation_id)->first();
        if($newDirectory) {
            $matter->files()->save(File::create([
                'filename'  => $newDirectory,
                'directory' => true,
                'protected' => false,
                'path' => '',
                'mimetype' => '',
                'parent_id' => $parentId
            ]));
        }
        else {
            $fileIds = array_map(function($file) use ($user, $parentId) {
                return $this->saveUploadedFile($file, $user, $parentId)->id;
            }, $request->file('file', []));
            $matter->files()->attach($fileIds);
        }

        return response()->json(['message' => 'Documents Uploaded', 'id' => $matter->id], 200);
    }

    public function updateDocument(Request $request, $matterId, $documentId)
    {
        $user = $request->user();
        $data = $request->allJson();
        $matter = Matter::where('id', $matterId)->where('organisation_id', $request->user()->organisation_id)->first();
        $document = $matter->files()->find($documentId);
        $document->update($data);
        return response()->json(['message' => 'Documents Updated', 'id' => $matter->id], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteDocument(Request $request, $matterId, $documentId)
    {
        $matter =Matter::where('id', $matterId)->where('organisation_id', $request->user()->organisation_id)->first();
        $document = $matter->files()->find($documentId);
        $document->delete();
        return response()->json(['message' => 'Matter deleted', 'id' => $matter->id], 200);
    }

    public function documents(Request $request)
    {
        $orgId = $request->user()->organisation_id;
        return MatterFile::with('file', 'matter')->whereHas('matter', function($q) use ($orgId) {
            $q->where('organisation_id', $orgId);
        })->get();
    }

    private function saveUploadedFile($file, $user, $parentId)
    {
        // Get the uploaded file contents
        $uploadedFilePath = $file->getRealPath();
        $contents = file_get_contents($uploadedFilePath);

        // Get the user's organisation's encryption key
        $encryptionKey = $user->organisation()->first()->encryption_key;

        // Encrypt the file contents
        $encryption = new Encryption($encryptionKey);
        $encryptedContents = $encryption->encrypt($contents);

        // Create a unique path for the file
        do {
            $storageName = time() . uniqid();
            $storagePath = 'matter-files/' . $storageName;
        } while (Storage::exists($storagePath));

        // Store the file
        Storage::put($storagePath, $encryptedContents);
        $file = File::create([
            'path'      => $storagePath,
            'filename'  => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'encrypted' => true,
            'parent_id' => $parentId
        ]);
        return $file;
      }

   public function syncMatters(Request $request)
    {
        DB::beginTransaction();
        $user = $request->user();
        $results = [];

        try {
            $orgId = $request->user()->organisation_id;
            $file = $request->file('file')[0];
            $escaped = mb_convert_encoding(file_get_contents($file->getRealPath()),  'UTF-8', 'UTF-8');

            $lines = preg_split('/[\r\n]{1,2}(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))/', $escaped);
            $rows   = array_map('str_getcsv', $lines);

            if(count($rows[0]) < 3){
                array_shift($rows); //sep
            }
            $header = array_shift($rows);
            $csv    = array();
            foreach($rows as $row) {
                if(count($row) == count($header)){
                    $csv[] = array_combine($header, array_map('trim', $row));
                }
            }

            foreach ($csv as $row) {
                $actionstepId = $row['ID'];
                if($row['Type'] == 'Deeds' or strpos($row['Type'], 'NA') === 0 || strpos($row['Type'], 'Evolution') !== false){
                    continue;
                }
                $matter_type = findClosestMatterType($row['Type']);

                $created_at = Carbon::createFromFormat('d M Y', $row['Created']);



                $matter = Matter::where('matter_number', $actionstepId)->first();
                $params = [
                        'matter_number' => $actionstepId,
                        'matter_name' => $row['Matter Name'],
                        'matter_type' => $matter_type,
                        'created_at' => $created_at,
                        'status' => $row['Status'],
                        'metadata' => json_encode($row),
                        'created_by_user_id' =>  $user->id,
                        'organisation_id' => $user->organisation_id
                    ];
                if(!$matter) {
                    $matter = new Matter;
                }
                $matter->fill($params);
                $matter->save(['timestamps' => false]);
                Matter::where('matter_number', $actionstepId)->update(['created_at' => $created_at]);
                $clients  = Contact::whereIn("metadata->Name", explode("\n", $row['Primary Participant']))->get();
                $matter->clients()->sync($clients);

            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollback();
            throw $e;
        }
        return response()->json(['message' => 'Matters updated.']);
    }

}

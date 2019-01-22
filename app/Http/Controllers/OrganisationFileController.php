<?php

namespace App\Http\Controllers;
use App\User;
use DB;
use App\OrganisationFile;
use App\File;
use Illuminate\Http\Request;
use App\Library\Encryption;
use App\Library\EncryptionKey;
use Illuminate\Support\Facades\Storage;
use App\Library\SQLFile;


class OrganisationFileController extends Controller
{
    /**
     * Return all addresses for a user.
     *
     * @param \App\User $user
     * @return mixed
     */
    public function all(Request $request)
    {
        return $request->user()->organisation()->first()->files; /*->map(function ($post) {
             return $post->with('creator');
         });; //*/
    }


    /**
     * Create a address for a user.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\User                $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $user = $request->user();
        $data = $request->allJson();
        $files = $request->file('file', []);
        $parentId = $data['parent_id'] ?? null;
        $newDirectory = $data['new_directory'] ?? null;
        if($newDirectory) {
            $organisation = $user->organisation()->first();
            $newFile = File::create([
                'filename'  => $newDirectory,
                'directory' => true,
                'protected' => false,
                'path' => '',
                'mimetype' => '',
                'parent_id' => $parentId
            ], ['created_by_user_id'  => $user->id]);
            $organisation->files()->save($newFile);

            return response()->json(['message' => 'Folder created.', 'id' => $newFile->id], 201);
        }

        $orgFiles = [];
        foreach ($files as $file) {
            $orgFiles[] = $this->saveFile($file, $request->user(), $parentId);
        }
        return response()->json(['message' => 'Files created.', 'id' => $orgFiles[count($orgFiles)-1]->file_id], 201);
    }

    public function update(Request $request, File $file)
    {
        $user = $request->user();
        $user = $request->user();
        if (!$this->canReadFile($user, $file)) {
            abort(403);
        }

        $data = $request->allJson();
        $file->update($data);
        return response()->json(['message' => 'Document Updated'], 200);
    }


    /**
     * Delete an address.
     *
     * @param \App\Address $address
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete(Request $request, File $file)
    {
        $user = $request->user();
        if (!$this->canReadFile($user, $file)) {
            abort(403);
        }
        OrganisationFile::where(['organisation_id' => $user->organisation_id, 'file_id' => $file->id])->delete();
        return response()->json(['message' => 'Document deleted.'], 200);
    }

    public function canReadFile($user, $file)
    {
        return File::canRead($file->id, $user);

    }


    private function saveFile($file, $user, $parentId=null)
    {
        // Get the uploaded file contents
        $uploadedFilePath = $file->getRealPath();
        $contents = file_get_contents($uploadedFilePath);
        $organisation = $user->organisation()->first();
        // Get the user's organisation's encryption key
        $encryptionKey = $organisation->encryption_key;

        // Encrypt the file contents
        $encryption = new Encryption($encryptionKey);
        $encryptedContents = $encryption->encrypt($contents);

        // Create a unique path for the file
        do {
            $storageName = time() . uniqid();
            $storagePath = 'files/' . $storageName;
        } while (Storage::exists($storagePath));

        // Store the file
        Storage::put($storagePath, $encryptedContents);
        // Create file record with encrypted set to true
       $file = File::create([
            'path'      => $storagePath,
            'filename'  => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'encrypted' => true,
            'parent_id' => $parentId
        ]);
        $orgFile = new OrganisationFile;

        $orgFile->file_id = $file->id;
        $orgFile->organisation_id  = $organisation->id;
        $orgFile->created_by_user_id  = $user->id;
        $orgFile->save();
        return $orgFile;
    }


}

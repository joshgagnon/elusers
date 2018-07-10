<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Matter;
use App\File;
use App\Library\Encryption;
use App\Library\EncryptionKey;
use Illuminate\Support\Facades\Storage;

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
        return Matter::where('organisation_id', $orgId)->with(['creator:preferred_name'])->get();
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

        $fileIds = array_map(function($file) use ($user) {
            return $this->saveUploadedFile($file, $user)->id;
        }, $request->file('file', []));
        $matter->files()->sync($fileIds);

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
        $matter = Matter::where('id', $id)->where('organisation_id', $request->user()->organisation_id)->with(['creator', 'referrer', 'files'])->first();
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

        return response()->json(['message' => 'Matter updated', 'id' => $matter->id], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $matter = Matter::findOrFail($id)->where('organisation_id', $request->user()->organisation_id)->first();
        $matter->delete();
        return response()->json(['message' => 'Matter deleted', 'id' => $matter->id], 200);
    }

    private function saveUploadedFile($file, $user)
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
            'encrypted' => true
        ]);
        return $file;
      }

}

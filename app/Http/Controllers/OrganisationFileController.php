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
        $files = function ($n) {
            return $n->files;
        };
        return $request->user()->organisation()->first()->organisationFiles()->with('file')->get()->map(function ($i) {
            return $i->file;
        });
    }


    /**
     * Create a address for a user.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\User                $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request, User $user)
    {
       ;
        $files = $request->file('file', []);
        foreach ($files as $file) {
            $this->saveFile($file, $request->user());
        }
        return response()->json(['message' => 'Files created.'], 201);
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

        $canReadFile = SQLFile::run('can_read_file', ['user_id' => $user->id, 'file_id' => $file->id]);
        $canReadFile = $canReadFile[0]->exists;

        if (!$canReadFile) {
            abort(403);
        }
        OrganisationFile::where(['organisation_id' => $user->organisation_id, 'file_id' => $file->id])->delete();
        return response()->json(['message' => 'Document deleted.'], 200);
    }


    private function saveFile($file, $user)
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
        ]);
        $orgFile = new OrganisationFile;

        $orgFile->file_id = $file->id;
        $orgFile->organisation_id  = $organisation->id;
        $orgFile->save();
        return $orgFile;
    }


}
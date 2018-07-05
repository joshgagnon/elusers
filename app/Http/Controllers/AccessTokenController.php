<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\AccessToken;
use App\File;
use App\AccessTokenFile;
use Illuminate\Support\Facades\Storage;

class AccessTokenController extends Controller
{
    public function get(Request $request, $token)
    {
        $accessToken = AccessToken::where('token', $token)->with('files.file')->first();
        if(!$accessToken){
            abort(404);
        }
        if($accessToken['submitted']){
            $data = $accessToken['data'];
            $data['files'] = array_map(function ($i) {
                return $i['file'];
            }, $accessToken['files']->toArray());

            return $data;
        }
        return $accessToken->model->tokenExtras();
    }

    public function update(Request $request, $token)
    {

        $accessToken = AccessToken::where('token', $token)->first();

        $accessToken->update(['data' => $request->allJson(), 'submitted' => true]);

        $files = $request->file('file', []);
        foreach ($files as $file) {
            $this->saveFile($file, $accessToken);
        }

        return response()->json(['message' => 'Resource updated.'], 200);
    }


    private function saveFile($file, $accessToken)
    {
        // Get the uploaded file contents
        $uploadedFilePath = $file->getRealPath();
        $contents = file_get_contents($uploadedFilePath);

        // Create a unique path for the file
        do {
            $storageName = time() . uniqid();
            $storagePath = 'access-token-files/' . $storageName;
        } while (Storage::exists($storagePath));

        // Store the file
        Storage::put($storagePath, $contents);
        $file = File::create([
            'path'      => $storagePath,
            'filename'  => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'encrypted' => false,
        ]);
        $accessTokenFile = new AccessTokenFile;

        $accessTokenFile->file_id = $file->id;
        $accessTokenFile->access_token_id  = $accessToken->id;
        $accessTokenFile->save();
        return $accessTokenFile;

    }

}

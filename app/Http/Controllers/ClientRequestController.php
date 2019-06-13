<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ClientRequest;
use App\File;
use App\ClientRequestFile;
use Illuminate\Support\Facades\Storage;

class ClientRequestController extends Controller
{
    public function get(Request $request, $token)
    {
        $clientRequest = ClientRequest::where('token', $token)->with('files')->first();
        if(!$clientRequest){
            abort(404);
        }
        if($clientRequest['submitted']){
            $data = $clientRequest['data'];
            $data['files'] = array_map(function ($i) {
                return $i;
            }, $clientRequest['files']->toArray());

            return $data;
        }
        return $clientRequest;
    }

    public function update(Request $request, $token)
    {

        $clientRequest = ClientRequest::where('token', $token)->first();

        $clientRequest->update(['data' => $request->allJson(), 'submitted' => true]);

        $files = $request->file('file', []);
        foreach ($files as $file) {
            $this->saveFile($file, $clientRequest);
        }

        return response()->json(['message' => 'Resource updated.'], 200);
    }


    private function saveFile($file, $clientRequest)
    {
        // Get the uploaded file contents
        $uploadedFilePath = $file->getRealPath();
        $contents = file_get_contents($uploadedFilePath);

        // Create a unique path for the file
        do {
            $storageName = time() . uniqid();
            $storagePath = 'client-token-files/' . $storageName;
        } while (Storage::exists($storagePath));

        // Store the file
        Storage::put($storagePath, $contents);
        $file = File::create([
            'path'      => $storagePath,
            'filename'  => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'encrypted' => false,
        ]);
        $clientRequestFile = new ClientRequestFile;

        $clientRequestFile->file_id = $file->id;
        $clientRequestFile->client_request_id  = $clientRequest->id;
        $clientRequestFile->save();
        return $clientRequestFile;

    }

    public function delete(Request $request, $token)
    {
        $clientRequest = ClientRequest::where('token', $token)->with('files')->first();
        $clientRequest->delete();
        return response()->json(['message' => 'Resource deleted.'], 200);
    }
}

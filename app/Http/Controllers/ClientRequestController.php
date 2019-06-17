<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ClientRequest;
use App\File;
use App\ClientRequestFile;
use Illuminate\Support\Facades\Storage;

class ClientRequestController extends Controller
{

    public function getSubmitted(Request $request)
    {
        if(!$request->user()->hasPermissionTo('view client requests')) {
            abort(403);
        }
        $orgId = $request->user()->organisation_id;
        return  ClientRequest::where('submitted', true)->where('organisation_id', $orgId)->with('files')->orderBy('updated_at')->get();
    }

    public function get(Request $request, $token)
    {
        $clientRequest = ClientRequest::where('token', $token)->where('submitted', false)->with('files')->first();
        if(!$clientRequest){
            abort(404);
        }
        $data = $clientRequest['data'];
        $data['files'] = array_map(function ($i) {
            return $i;
        }, $clientRequest['files']->toArray());
        return $data;
    }

    public function getFullRequest(Request $request, $clientRequestId)
    {
        if(!$request->user()->hasPermissionTo('view client requests')) {
            abort(403);
        }
        $orgId = $request->user()->organisation_id;
        $clientRequest = ClientRequest::where('id', $clientRequestId)->where('organisation_id', $orgId)->with('files')->first();
        if(!$clientRequest){
            abort(404);
        }
        $clientRequest = $clientRequest;
        $data = $clientRequest['data'];
        $data['files'] = array_map(function ($i) {
            return $i;
        }, $clientRequest['files']->toArray());

        return array_merge($clientRequest->toArray(), ['data' => $data]);
    }

    public function delete(Request $request,  $clientRequestId)
    {
        if(!$request->user()->hasPermissionTo('process client requests')) {
            abort(403);
        }
        $clientRequest = ClientRequest::where('id', $clientRequestId)->first();
        $clientRequest->delete();        return response()->json(['message' => 'Client request deleted.']);
    }

    public function update(Request $request, $token)
    {

        $clientRequest = ClientRequest::where('token', $token)->first();
        $data =  $request->allJson();
        $clientRequest->update(['data' => $data, 'submitted' => $data['submitted'] ?? false]);

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


}

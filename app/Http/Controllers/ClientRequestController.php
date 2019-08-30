<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ClientRequest;
use App\File;
use App\ClientRequestFile;
use App\Contact;
use App\Matter;
use Illuminate\Support\Facades\Storage;
use DB;
use Exception;
use App\Traits\ContactTrait;

class ClientRequestController extends Controller
{

    use ContactTrait;

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
        $orgId = $request->user()->organisation_id;

        $clientRequest = ClientRequest::where('id', $clientRequestId)->where('organisation_id', $orgId)->first();
        $clientRequest->delete();
        return response()->json(['message' => 'Client request deleted.']);
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


    public function createEntities(Request $request, $clientRequestId)
    {
        if(!$request->user()->hasPermissionTo('process client requests')) {
            abort(403);
        }
        $data =  $request->allJson();
        $user = $request->user();
        $orgId = $request->user()->organisation_id;
        DB::beginTransaction();
        $results = [];
        try{
            $capacity = $data['capacity'];
            // the primary contact
            $contactData = $data['contact'] ?? [];
            $contact = Contact::create(array_merge([
                'organisation_id' => $orgId
            ], []));

            $this->saveSubType($contact, $contactData);
            $this->saveContactInformations($contact, ['contact_informations' => [[
                'type' => 'phone',
                'data'=> ['phone' => $data['phone_number_simple'] ?? '', 'subtype' => 'Home']
            ], [
                'type' => 'email',
                'data'=> ['email' => $data['email_simple'] ?? '', 'subtype' => 'Personal']
            ], [
                'type' => 'address',
                'data' => array_merge(['subtype' => "Residential"], $data['address']['data'] ?? [])
            ]]]);
            #DB::rollback();
            #return array_merge(['subtype' => "Residential"], $data['address'] ?? []);

            $matterData = $data['matter'] ?? [];
            $matterType = $matterData['matter_type'] ?? 'Other';
            if($matterType == "Don't Know") {
                $matterType = 'Other';
            }

            $matter = Matter::create(
                [
                    'matter_number' => '',
                    'matter_name' => 'New Matter for '.$contact->contactable->first_name.' '.$contact->contactable->surname,
                    'matter_type' => $matterType,
                    'created_by_user_id' =>  $user->id,
                    'referrer_type' => $matterData['referrer_type'] ?? null,
                    'referrer_id' => $matterData['referrer_id'] ?? null,
                    'organisation_id' => $orgId
                ]
            );

            if($matterData['description'] ?? false) {
                $matter->notes()->create([
                    'created_by_user_id' => $user->id,
                    'note' => 'Described by client: '.$matterData['description']
                ]);
            }
            else{
                $matter->notes()->create([
                    'created_by_user_id' => $user->id,
                    'note' => 'Created from client request'
                ]);
            }

            $otherIndividuals = [];

            foreach(($data['other_individuals'] ?? []) as $other) {
                $otherContact = Contact::create(array_merge([
                    'organisation_id' => $orgId
                ], []));
                $this->saveSubType($otherContact, [
                    'contactable_type' => "Individual",
                    'contactable' => $other
                ]);
                $otherIndividuals[] = ['contact_id' => $otherContact->id];
            }

            $otherOrg = null;

            if($data['other_organisation'] ?? false) {
                $otherOrg = Contact::create(array_merge([
                    'organisation_id' => $orgId
                ], $data['other_organisation']));
                $this->saveSubType($otherOrg, [
                    'contactable_type' => $data['organisation_type'],
                    'contactable' => $data['other_organisation']
                ]);
            }


            if($capacity == 'Myself') {
                $matter->matterClients()->create(['contact_id' => $contact->id]);
            }
            else if($capacity == 'Myself and Others') {

                $matter->matterClients()->createMany(array_merge([['contact_id' => $contact->id]],  $otherIndividuals));
            }
            else if($capacity == 'Other Individuals') {
                if($data['capacity_type'] ?? false) {
                    $relationMap = [];
                    foreach ($otherIndividuals as $other) {
                         $relationMap[$other->id] = ['relationship_type' => $data['capacity_type'], 'second_contact_id' => $other->id];
                    }
                    $contact->relationshipsSyncable()->sync($relationMap);
                    $this->inverseRelationships($contact->id, $relationMap);
                }
                $matter->matterClients()->createMany($otherIndividuals);
            }
            else{
                if($data['capacity_type'] ?? false) {

                    $relationMap = [$otherOrg->id => ['relationship_type' => $data['capacity_type'], 'second_contact_id' => $otherOrg->id]];

                    $contact->relationshipsSyncable()->sync($relationMap);
                    $this->inverseRelationships($contact->id, $relationMap);
                }
                $matter->matterClients()->create(['contact_id' => $otherOrg->id]);
            }

            $fileIds = array_map(function($file) use ($request) {
                return $this->saveUploadedFile($file, $request->user())->id;
            }, $request->file('file', []));


            $contact->files()->sync($fileIds);

            if(isset($data['existing_files'])){
                // can read file
                foreach ($data['existing_files'] as $fileId) {
                    if(File::canRead($fileId, $user)){

                        $this->copyFile(File::find($fileId), $request->user(), $contact);
                    }
                }
            }


            $clientRequest = ClientRequest::where('id', $clientRequestId)->where('organisation_id', $orgId)->first();
            $clientRequest->delete();

            #throw new Exception('lols');
            $results['matter'] = $matter;
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollback();
            throw $e;
        }
        return response()->json(['message' => 'Client request completed', 'results' => $results]);
    }

}

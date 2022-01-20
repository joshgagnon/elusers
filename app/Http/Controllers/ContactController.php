<?php

namespace App\Http\Controllers;
use App\ContactFile;
use App\File;
use App\Contact;
use App\ContactNote;
use App\ContactIndividual;
use App\ContactCompany;
use App\ContactTrust;
use App\ContactPartnership;
use App\ContactCourt;
use App\ContactBank;
use App\ContactLocalAuthority;
use App\ContactGovernmentBody;
use App\ContactRelationship;
use App\AccessToken;
use App\ContactInformation;
use App\Matter;
use Illuminate\Http\Request;
use App\Library\Encryption;
use App\Library\EncryptionKey;
use App\Library\Encoding;
use App\Library\StringToStream;

use App\Library\SQLFile;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use DB;
use Exception;
use App\Traits\ContactTrait;

class ContactController extends Controller
{

    use ContactTrait;
    /**
     * Get all contacts.
     *
     * @param \Illuminate\Http\Request $request
     * @return mixed
     */
    public function all(Request $request)
    {
        $data = Contact::getAll($request->user());
        $response = \Response::make($data, 200);
        $response->header('Content-Type', 'application/json');
        return $response;
        /*
        $orgId = $request->user()->organisation_id;
        $contacts = Contact::where('organisation_id', $orgId)
            ->with('contactable')
            ->with(['contactInformations' => function ($query) {
                $query->whereIn('type', ['phone', 'email']);
        }])->orderBy('name', 'asc')->toSql();
        return $contacts;*/
    }

    /**
     * Get a contact.
     *
     * @param \Illuminate\Http\Request $request
     * @return mixed
     */
    public function get(Request $request, $contactId)
    {
        $orgId = $request->user()->organisation_id;

        $contact = Contact::where('organisation_id', $orgId)->where('id', $contactId)
            ->with('contactable', 'files', 'accessTokens',
                   'relationships', 'relationships.contact', 'relationships.contact.contactable',
                   'agents', 'agents.contact', 'agents.contact.contactable', 'contactInformations',
                   'matters', 'files.notes', 'notes',  'notes.creator'
               )->first();

        if (!$contact) {
            abort(404);
        }

        $contact = $contact->toArray();


        return $contact;
    }

    /**
     * Create a contact.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $this->validate($request, Contact::$validationRules);

        $user = $request->user();
        $data = $request->allJson();

        $orgId = $user->organisation_id;
        if(isset($data['agent_id'])){
            $agent = Contact::where('organisation_id', $orgId)->where('id', $data['agent_id'])->first();
            if(!$agent) {
                abort(403);
            }
        }

        $contact = Contact::create(array_merge([
            'organisation_id' => $user->organisation_id
        ], $data));

        $this->saveSubType($contact, $data);
        $this->saveContactInformations($contact, $data);
        $relations = array_reduce($data['relationships'] ?? [], function ($acc, $i) {
            $acc[$i['second_contact_id']] = $i;
            return $acc;
        }, []);

        $contact->relationshipsSyncable()->sync($relations);
        $this->inverseRelationships($contact->id, $data['relationships'] ?? []);

        $agents = array_reduce($data['agents'] ?? [], function ($acc, $i) {
            $acc[$i['agent_id']] = $i;
            return $acc;
        }, []);

        $contact->agentsSyncable()->sync($agents);

        $fileIds = array_map(function($file) use ($user) {
            return $this->saveUploadedFile($file, $user)->id;
        }, $request->file('file', []));
        $contact->files()->sync($fileIds);

        $newNotes = array_map(function ($i) use ($user)  {
            return array_merge($i, ['created_by_user_id' => $user->id]);
        }, $data['notes'] ?? []);

        $contact->notes()->createMany($newNotes);

        //agent_id, must be owned by org, can't be self
        return response()->json(['message' => 'Contact created.', 'contact_id' => $contact->id], 201);
    }

    /**
     * Update a contact.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Contact             $contact
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Contact $contact)
    {
        $this->validate($request, Contact::$validationRules);

        $user = $request->user();
        $data = $request->allJson();
        $id = $data['id'];
        $orgId = $user->organisation_id;

        if(isset($data['agent_id'])){
            $agent = Contact::where('organisation_id', $orgId)->where('id', $data['agent_id'])->first();
            if(!$agent) {
                abort(403);
            }
        }

        $contact->update(array_merge([
            'organisation_id' => $user->organisation_id,
        ], $data));

        $this->saveSubType($contact, $data);

        $this->saveContactInformations($contact, $data);

        $relations = array_reduce($data['relationships'] ?? [], function ($acc, $i) {
            $acc[$i['second_contact_id']] = $i;
            return $acc;
        }, []);

        $this->removeInverseRelations($contact->id);
        $contact->relationshipsSyncable()->sync($relations);
        $this->inverseRelationships($contact->id, $data['relationships'] ?? []);

        $agents = array_reduce($data['agents'] ?? [], function ($acc, $i) {
            $acc[$i['agent_id']] = $i;
            return $acc;
        }, []);

        $contact->agentsSyncable()->sync($agents);

        $fileIds = array_map(function($file) use ($request) {
            return $this->saveUploadedFile($file, $request->user())->id;
        }, $request->file('file', []));

        $existingFileIds = array_map(function ($i) {
            return (int)$i;
        }, $data['existing_files'] ?? []);


        $contact->files()->sync(array_merge($fileIds, $existingFileIds));

        if(isset($data['files_to_copy'])){
            // can read file
            foreach ($data['files_to_copy'] as $file) {
                if(isset($file['id']) && File::canRead($file['id'], $user)){
                    $this->copyFile(File::find($file['id']), $request->user(), $contact);
                }
            }
        }

        $notes = array_filter($data['notes'] ?? [], function($note){
            return isset($note['id']);
        });

        $contact->notes()->delete();

        $notes = array_reduce($notes,  function ($acc, $i) use ($id) {
            $acc[$i['id']] = ContactNote::where(['id' => $i['id'], 'contact_id' => $id])->first();
            if(!$acc[$i['id']]) {
                $acc[$i['id']] = new ContactNote($i);
            }
            $acc[$i['id']]->update($i);
            return $acc;
        }, []);

        $contact->notes()->saveMany($notes);

        $newNotes = array_filter($data['notes'] ?? [], function($note){
            return !isset($note['id']);
        });

        $newNotes = array_map(function ($i) use ($user) {
            return array_merge($i, ['created_by_user_id' => $user->id]);
        }, $newNotes);


        $contact->notes()->createMany($newNotes);


        return response()->json(['message' => 'Contact updated.', 'contact_id' => $contact->id]);
    }


    public function delete(Contact $contact)
    {
        $contact->delete();
        return response()->json(['message' => 'Contact deleted.']);
    }

    public function uploadDocuments(Request $request, $id)
    {
        $user = $request->user();
        $data = $request->allJson();
        $parentId = $data['parent_id'] ?? null;
        $newDirectory = $data['new_directory'] ?? null;
        $contact = Contact::where('id', $id)->where('organisation_id', $request->user()->organisation_id)->first();
        if($newDirectory) {
            $newFile = File::create([
                'filename'  => $newDirectory,
                'directory' => true,
                'protected' => false,
                'path' => '',
                'mimetype' => '',
                'parent_id' => $parentId
            ]);
            $contact->files()->save($newFile);
            return response()->json(['message' => 'Folder created.', 'id' => $newFile->id], 201);
        }
        else {
            $fileIds = array_map(function($file) use ($user, $parentId) {
                return $this->saveUploadedFile($file, $user, $parentId)->id;
            }, $request->file('file', []));
            $contact->files()->attach($fileIds);
        }

        return response()->json(['message' => 'Documents Uploaded', 'id' => array_values(array_slice($fileIds, -1))[0]], 200);
    }

    public function updateDocument(Request $request, $contactId, $fileId)
    {
        $user = $request->user();
        $data = $request->allJson();
        $contact = Contact::where('id', $contactId)->where('organisation_id', $request->user()->organisation_id)->first();
        File::canRead($fileId, $user);
        $document = $contact->files()->find($fileId);
        $document->update($data);
        return response()->json(['message' => 'Documents Updated', 'id' => $contact->id], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteDocument(Request $request, $contactId, $fileId)
    {
        $user = $request->user();
        $contact =Contact::where('id', $contactId)->where('organisation_id', $request->user()->organisation_id)->first();
        File::canRead($fileId, $user);
        $document = $contact->files()->find($fileId);
        $document->delete();
        return response()->json(['message' => 'Contact Document deleted', 'id' => $contact->id], 200);
    }


    public function createAccessToken(Contact $contact)
    {

        foreach($contact->accessTokens as $token) {
            $token->delete();
        }
        return $contact->accessTokens()->create(['token' => Str::random(40)]);
    }


    public function amlcft(Request $request)
    {
        $loadData = [];
        $loadData['user'] = false;
        return view('index')->with([
            'loadData' => json_encode($loadData)
        ]);
    }

    public function dedupeContacts(Request $request)
    {
        DB::beginTransaction();
        $results = [];
        try {
            $orgId = $request->user()->organisation_id;
            // for every contact without actionstepid, see if there is a version with the same name
            $contacts =Contact::get();

            $contacts = Contact::whereNull('metadata->actionstepId')->where(['organisation_id' => $orgId])->get();
            $actionStepContacts = Contact::whereNotNull('metadata->actionstepId')->where(['organisation_id' => $orgId])->get();
            $nameMap = $actionStepContacts->reduce(function($acc, $contact) {
                $acc[$contact->getName()] = $contact;
                return $acc;
            }, []);

            foreach($contacts as $contact) {
                $name = $contact->getName();
                $toRemove = $nameMap[$name] ?? false;

                if($toRemove) {
                    // we need to choose one of these guys, merge all the relations
                    // lets say $contact is the one to keep
                    $contact->update([
                        'metadata' => $toRemove->metadata
                    ]);
                    /*
                    DeedPacket
                    contact_files
                    contact_relationships
                    contact_agents
                    ContactAgent
                    ContactInformation
                    matter_clients */
                    /*$contact->contactInformations()->add*/
                    ;
                    $contact->matters()->attach($toRemove->matters);
                    $contact->contactInformations()->attach($toRemove->contactInformations);
                    $contact->deedPackets()->attach($toRemove->deedPackets);
                    $contact->files()->attach($toRemove->files);
                    if(count($toRemove->files)){
                        $results[] = [
                            $contact,
                            $toRemove->files
                        ];
                    }
                    $toRemove->forceDelete();

                }
            }

            #throw new Exception('lols');
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollback();
            throw $e;
        }
        return response()->json(['message' => 'Contacts merged.', 'results' => $results]);
    }


    public function syncContacts(Request $request)
    {
        DB::beginTransaction();
        set_time_limit(420);
        $user = $request->user();
        try {
            $orgId = $request->user()->organisation_id;
            $file = $request->file('file')[0];
            $escaped = Encoding::convert_cp1252_to_ascii(file_get_contents($file->getRealPath()));
            /*$lines = preg_split('/[\r\n]{1,2}(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))/', $escaped);
            $rows   = array_map('str_getcsv', $lines);
    */

            $fp = StringToStream::create($escaped);

            $rows= [];
            while ($row = fgetcsv($fp)) {
                $rows[] = $row;
            }
            fclose($fp);
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
                $contact = Contact::where('metadata->actionstepId', $actionstepId)->where(['organisation_id' => $orgId])->first();


                if ($contact) {
                    $contact->update([
                        'metadata' => json_encode(array_merge(['actionstepId' => $actionstepId], $row))
                    ]);
                    //update name?
                    if($row['Type'] == 'Individual'){
                        $names = explode(" ", $row['Name']);
                        $middle = null;
                        if(count($names) > 2){
                            $middle = array_slice($names, 1, count($names) - 2);
                            $middle = implode(' ', $middle);
                        }
                        $contact->contactable->update([
                            'first_name' => $names[0],
                            'middle_name' => $middle,
                            'surname' => $names[count($names) - 1]
                        ]);
                    }
                }
                else {
                    $fields = [
                        'organisation_id' => $user->organisation_id,
                        'contactable_type' => $row['Type'],
                        'name' => $row['Name'],
                        'metadata' => json_encode(['actionstepId' => $actionstepId, 'Name' => $row['Name']]),
                        'contactable' => []
                    ];

                    if($row['Type'] == 'Individual'){
                        $names = explode(" ", $row['Name']);
                        $middle = null;
                        if(count($names) > 2){
                            $middle = array_slice($names, 1, count($names) - 2);
                            $middle = implode(' ', $middle);
                        }
                        $fields['contactable'] = [
                            'first_name' => $names[0],
                            'middle_name' => $middle,
                            'surname' => $names[count($names) - 1]
                        ];
                    }

                    $contact = Contact::create($fields);
                    $this->saveSubType($contact, $fields);
                    // need to add contact information
                }

                // now update contact details
                $contactInfos = [];
                if(isset($row['Email Address'])) {
                    $contactInfos[] = ['type' => 'email', 'data' => ['subtype' => 'Business', 'email' => $row['Email Address']]];
                    //$this->saveContactInformations($contact, $data);
                }
                if(isset($row['Phone Numbers'])) {
                     $numbers = preg_split("/\[([^]]+)] /", $row['Phone Numbers'], -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);
                    if(count($numbers)) {
                        if(count($numbers) === 1) {
                             $contactInfos[] = [
                                'type' => 'phone',
                                'data' => [
                                    'subtype' => 'Mobile',
                                    'phone' => $contact->phone
                                ]
                            ];
                        }
                        else{
                            for ($n = 0; $n < count($numbers); $n+=2) {
                                $contactInfos[] = [
                                'type' => 'phone',
                                'data' => [
                                    'subtype' => $numbers[$n],
                                    'phone' => $numbers[$n+1]
                                ]];
                            }
                        }
                     }
                }
                foreach($contactInfos as $contactInfo) {
                    if(!$contact->contactInformations()->where('type', '=', $contactInfo['type'])->where('data->'.$contactInfo['type'], '=', $contactInfo['data'][$contactInfo['type']])->exists()) {
                        $contact->contactInformations()->attach(ContactInformation::create($contactInfo));
                    }
                }
                /*if($row['Address']){
                    $address = [
                        'address_one' => $row['Address'],
                        'city' => $row['City'],
                        'post_code' => $row['Zip/Post Code'],
                        'address_type' => 'postal',
                        'country' => 'New Zealand'
                    ];
                    $contact->addresses()->create($address);

                }*/

            }
            //throw new Exception('asdf');
            $this->dedupeContacts($request);
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollback();
            throw $e;
        }
        return response()->json(['message' => 'Contacts updated.']);
    }

    public function documents(Request $request)
    {
        $orgId = $request->user()->organisation_id;
        return ContactFile::with('file', 'contact', 'contact.contactable')->whereHas('contact', function($q) use ($orgId) {
            $q->where('organisation_id', $orgId);
        })->get();
    }

    public function addNote(Request $request, $contactId) {
        $user = $request->user();
        $data = $request->allJson();
        $contact = Contact::where('id', $contactId)->where('organisation_id', $request->user()->organisation_id)->first();
        $newNote = array_merge($data, ['created_by_user_id' => $user->id]);
        $contact->notes()->create($newNote);
        return response()->json(['message' => 'Note Added']);
    }

}

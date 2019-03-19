<?php

namespace App\Http\Controllers;
use App\ContactFile;
use App\File;
use App\Contact;
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
use Illuminate\Http\Request;
use App\Library\Encryption;
use App\Library\EncryptionKey;
use App\Library\Encoding;

use App\Library\SQLFile;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use DB;
use Exception;


class ContactController extends Controller
{
    /**
     * Get all contacts.
     *
     * @param \Illuminate\Http\Request $request
     * @return mixed
     */
    public function all(Request $request)
    {
        $orgId = $request->user()->organisation_id;

        $contacts = Contact::where('organisation_id', $orgId)->with('contactable')->with(['contactInformations' => function ($query) {
            $query->whereIn('type', ['phone', 'email']);
        }])->orderBy('name', 'asc')->get();
        return $contacts;
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
                   'matters', 'files.notes'
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

        return response()->json(['message' => 'Contact updated.', 'contact_id' => $contact->id]);
    }

    private function saveSubType(Contact $contact, $data) {
        switch($data['contactable_type']) {
            case 'Individual':
                ContactIndividual::create($data['contactable'] ?? [])->contact()->save($contact);
                break;
            case 'Company':
                ContactCompany::create($data['contactable'] ?? [])->contact()->save($contact);
                break;
            case 'Trust':
                ContactTrust::create($data['contactable'] ?? [])->contact()->save($contact);
                break;
            case 'Partnership':
                ContactPartnership::create([])->contact()->save($contact);
                break;
            case 'Court':
                ContactCourt::create([])->contact()->save($contact);
                break;
            case 'Bank':
                ContactBank::create([])->contact()->save($contact);
                break;
            case 'Local Authority':
                ContactLocalAuthority::create([])->contact()->save($contact);
                break;
            case 'Government Body':
                ContactGovernmentBody::create([])->contact()->save($contact);
                break;
        }
    }

    private function saveContactInformations(Contact $contact, $data) {

        if(isset($data['contact_informations']) && is_array($data['contact_informations'])) {
            $ids = array_map(function($contactInformation) use ($contact) {
                $info = null;
                if(isset($contactInformation['id'])){
                    $info = $contact->contactInformations()->find($contactInformation['id']);
                    if($info) {
                        $info->update($contactInformation);
                    }
                }
                if(!$info) {
                    $info = new ContactInformation($contactInformation);
                    $info->save();
                }
                return $info->id;
            }, $data['contact_informations']);

            $contact->contactInformations()->sync($ids);
        }
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
            $storagePath = 'contact-files/' . $storageName;
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


    public function syncContacts(Request $request)
    {
        DB::beginTransaction();
        $user = $request->user();
        try {
            $orgId = $request->user()->organisation_id;
            $file = $request->file('file')[0];
            $escaped = Encoding::convert_cp1252_to_ascii(file_get_contents($file->getRealPath()));
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
                $contact = Contact::where('metadata->actionstepId', $actionstepId)->first();
                if ($contact) {
                    $contact->update([
                        'metadata' => json_encode(array_merge(['actionstepId' => $actionstepId], $row))
                    ]);
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


    private function copyFile(File $file, $user, $contact)
    {
        // Get the user's organisation's encryption key
        $encryptionKey = $user->organisation()->first()->encryption_key;
        // Get the file and return it
        $contents = Storage::get($file->path);

        if ($file->encrypted) {
            $key = $user->organisation->encryption_key;
            $encryption = new Encryption($key);
            $content = $encryption->decrypt($content);
        }
        // Encrypt the file contents
        $encryption = new Encryption($encryptionKey);
        $encryptedContents = $encryption->encrypt($contents);
        // Create a unique path for the file
        do {
            $storageName = time() . uniqid();
            $storagePath = 'contact-files/' . $storageName;
        } while (Storage::exists($storagePath));
        // Store the file
        Storage::put($storagePath, $encryptedContents);
        $file = File::create([
            'path'      => $storagePath,
            'filename'  => $file->filename,
            'mime_type' => $file->mime_type,
            'encrypted' => true,
        ]);
        $contactFile = new ContactFile;

        $contactFile->file_id = $file->id;
        $contactFile->contact_id  = $contact->id;
        $contactFile->save();
        return $contactFile;
    }



    public $opposites = [
            'Employee' => 'Employer',
            'Employer' => 'Employee',
            'Parent' => 'Child',
            'Child' => 'Parent',
            'De Facto Partner' => 'De Facto Partner',
            'Grandparent' => 'Grandchild',
            'Grandchild' => 'Grandparent',
            'Partner' => 'Partner',
            'Sibling' => 'Sibling',
            'Spouse' => 'Spouse',
            'Parent Company' => 'Subsidary',
            'Subsidary' => 'Parent Company',
            'Trustee' => 'Trustee Of',
            'Trustee Of' => 'Trustee',
            'Authorised Person' => 'Authorised Person Of',
            'Authorised Person Of' => 'Authorised Person',
        ];

    private function removeInverseRelations($contactId) {
        ContactRelationship::where('second_contact_id', $contactId)->whereIn('relationship_type', array_keys($this->opposites))->delete();
    }

    private function inverseRelationships($contactId, $relationships) {
        foreach($relationships as $relationship) {
            if(isset($this->opposites[$relationship['relationship_type']])){

                ContactRelationship::firstOrCreate([
                    'first_contact_id' => $relationship['second_contact_id'],
                    'second_contact_id' => $contactId,
                    'relationship_type' => $this->opposites[$relationship['relationship_type']]
                ]);
            }
        }

    }

}

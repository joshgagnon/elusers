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
use Illuminate\Http\Request;
use App\Library\Encryption;
use App\Library\EncryptionKey;
use App\Library\SQLFile;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;




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

        $contacts = Contact::where('organisation_id', $orgId)->with('contactable') ->orderBy('name', 'asc')->get();
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

        $contact = Contact::where('organisation_id', $orgId)->where('id', $contactId)->with('contactable', 'files', 'accessTokens', 'relationships', 'relationships.contact', 'relationships.contact.contactable')->first();

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

        $relations = array_reduce($data['relationships'] ?? [], function ($acc, $i) {
            $acc[$i['second_contact_id']] = $i;
            return $acc;
        }, []);

        $contact->relationshipsSyncable()->sync($relations);
        $this->inverseRelationships($contact->id, $data['relationships'] ?? []);

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
            'organisation_id' => $user->organisation_id
        ], $data));

        $this->saveSubType($contact, $data);

        $relations = array_reduce($data['relationships'] ?? [], function ($acc, $i) {
            $acc[$i['second_contact_id']] = $i;
            return $acc;
        }, []);

        $this->removeInverseRelations($contact->id);
        $contact->relationshipsSyncable()->sync($relations);
        $this->inverseRelationships($contact->id, $data['relationships'] ?? []);

        /*foreach ($files as $file) {
            $this->saveUploadedFile($file, $request->user(), $contact);
        }*/

        $fileIds = array_map(function($file) use ($request) {
            return $this->saveUploadedFile($file, $request->user())->id;
        }, $request->file('file', []));

        $existingFileIds = array_map(function ($i) {
            return (int)$i;
        }, $data['existing_files'] ?? []);

        $contact->files()->sync(array_merge($fileIds, $existingFileIds));


        # if not in this list we get rid of
        /*$existingFileIds = array_map(function ($i) {
            return (int)$i;
        }, $data['existing_files'] ?? []);

        # USE A PIVOT AND sync() INSTEAD@!!!!!!!!!
        foreach($contact->files as $file) {
            if(!in_array($file->file_id, $existingFileIds)){
                $file->delete();
            }
        }

        if(isset($data['files_to_copy'])){
            // can read file
            foreach ($data['files_to_copy'] as $file) {
                if(isset($file['id']) && File::canRead($file['id'], $user)){
                    $this->copyFile(File::find($file['id']), $request->user(), $contact);
                }
            }
        }*/

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

    public function delete(Contact $contact)
    {
        $contact->delete();
        return response()->json(['message' => 'Contact deleted.']);
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
            $storagePath = 'contact-files/' . $storageName;
        } while (Storage::exists($storagePath));

        // Store the file
        Storage::put($storagePath, $encryptedContents);
        return  $file = File::create([
            'path'      => $storagePath,
            'filename'  => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'encrypted' => true
        ]);
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

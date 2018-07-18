<?php

namespace App\Http\Controllers;
use App\ContactFile;
use App\File;
use App\Contact;
use App\ContactIndividual;
use App\ContactCompany;
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

        $contact = Contact::where('organisation_id', $orgId)->where('id', $contactId)->with('contactable', 'files.file', 'accessTokens')->first();

        if (!$contact) {
            abort(404);
        }

        $contact = $contact->toArray();
        $contact['files'] = array_map(function ($i) {
            return $i['file'];
        }, $contact['files']);


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


        if($data['contactable_type'] == 'Individual') {
            ContactIndividual::create($data['contactable'])->contact()->save($contact);
        }

        if($data['contactable_type'] == 'Company') {
             ContactCompany::create($data['contactable'])->contact()->save($contact);
        }



        $files = $request->file('file', []);
        foreach ($files as $file) {
            $this->saveUploadedFile($file, $request->user(), $contact);
        }

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

        if($data['contactable_type'] == 'Individual') {
            ContactIndividual::create($data['contactable'])->contact()->save($contact);
        }

        if($data['contactable_type'] == 'Company') {
             ContactCompany::create($data['contactable'])->contact()->save($contact);
        }


        $files = $request->file('file', []);

        foreach ($files as $file) {
            $this->saveUploadedFile($file, $request->user(), $contact);
        }

        # if not in this list we get rid of
        $existingFileIds = array_map(function ($i) {
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
        }

        return response()->json(['message' => 'Contact updated.', 'contact_id' => $contact->id]);
    }

    public function delete(Contact $contact)
    {
        $contact->delete();
        return response()->json(['message' => 'Contact deleted.']);
    }

    private function saveUploadedFile($file, $user, $contact)
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
            'encrypted' => true
        ]);
        $contactFile = new ContactFile;

        $contactFile->file_id = $file->id;
        $contactFile->contact_id  = $contact->id;
        $contactFile->save();
        return $contactFile;
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

}

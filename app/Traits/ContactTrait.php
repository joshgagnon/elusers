<?php
namespace App\Traits;
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
use App\Library\StringToStream;

use App\Library\SQLFile;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use DB;
use Exception;

trait ContactTrait {
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
                    // security!
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
        $file->update(['metadata' => $file->parseMetadata($user)]);
        $contactFile = new ContactFile;

        $contactFile->file_id = $file->id;
        $contactFile->contact_id  = $contact->id;
        $contactFile->save();
        return $contactFile;
    }

    private function saveUploadedFile($file, $user, $parentId=null)
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
        $file->update(['metadata' => $file->parseMetadata($user)]);
        return $file;
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
            'Other' => 'Other'
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
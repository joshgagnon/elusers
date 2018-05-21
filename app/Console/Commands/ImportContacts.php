<?php

namespace App\Console\Commands;

use App\Contact;
use App\Address;
use Illuminate\Console\Command;

class ImportContacts extends Command
{
    protected $signature = 'import-contacts {organisation_id}';

    protected $description = 'Import contacts from CSV file: storage/contacts.csv';

    public function handle()
    {
        $orgId = $this->argument('organisation_id');
        $handle = fopen(storage_path() . '/contacts.csv', 'r');

        while ($csvLine = fgetcsv($handle, $delimiter = ",")) {
            //$this->info(join($csvLine, ', '));
            //$this->info(count($csvLine));
            if(count($csvLine) > 2 && $csvLine[0] != 'ID'){
                $name = trim($csvLine[2]);
                $type = $csvLine[10];
                if($type == 'Company'){
                    $fields = [
                        'name' => $name,
                        'type' => 'organisation',
                        'metadata' => json_encode(['actionstepId' => $csvLine[0]]),
                        'email' => trim($csvLine[8]),
                        'phone' => trim($csvLine[9]),
                        'organisation_id' => $orgId
                    ];
                }
                else{
                    $names = explode(" ", trim($csvLine[2]));
                    $middle = null;
                    if(count($names) > 2){
                        $middle = array_slice($names, 1, count($names) - 2);
                        $middle = implode(' ', $middle);
                    }

                    $fields = [
                        'name' => $name,
                        'first_name' => trim($names[0]),
                        'middle_name' => $middle,
                        'surname' => trim($names[count($names) - 1]),
                        'type' => 'individual',
                        'metadata' => json_encode(['actionstepId' => $csvLine[0]]),
                        'email' => trim($csvLine[8]),
                        'phone' => trim($csvLine[9]),
                        'organisation_id' => $orgId
                    ];
                }
                $this->info(json_encode($fields, JSON_PRETTY_PRINT));
                $contact = Contact::where('name', $name)->first();
                if($contact){
                    $contact->update($fields);
                }
                else{
                    $contact = Contact::create($fields);
                }
                if($csvLine[3]){
                    $contact->addresses()->delete();
                    $address = [
                        'address_one' => trim($csvLine[3]),
                        'city' => trim($csvLine[4]),
                        'post_code' => trim($csvLine[7]),
                        'address_type' => 'postal',
                        'country' => 'New Zealand'
                    ];
                    $contact->addresses()->create($address);
                    $this->info(json_encode($address, JSON_PRETTY_PRINT));

                }

            }

        }
    }
}
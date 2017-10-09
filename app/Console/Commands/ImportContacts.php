<?php

namespace App\Console\Commands;

use App\Contact;
use Illuminate\Console\Command;

class ImportContacts extends Command
{
    protected $signature = 'import-contacts {organisation_id}';

    protected $description = 'Import contacts from CSV file: storage/contacts.csv';

    public function handle()
    {
        $orgId = $this->argument('organisation_id');
        $handle = fopen(storage_path() . '/contacts.csv', 'r');

        while ($csvLine = fgetcsv($handle, 1000, ",")) {
            $name = $csvLine[0];
            $email = $csvLine[1];
            $phone = $csvLine[2];

            Contact::create([
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'organisation_id' => $orgId,
            ]);

            $this->info($orgId . ' | Added ' . $name . ' (email: ' . $email . ', phone: ' . $phone . ')');
        }
    }
}
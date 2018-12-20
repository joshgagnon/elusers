<?php

namespace App\Console\Commands;

use App\Contact;
use App\ContactFile;
use App\MatterFile;
use App\OrganisationFile;
use App\Address;
use App\File;
use Illuminate\Console\Command;

class ExportFiles extends Command
{
    protected $signature = 'export-files {organisation_id}';

    protected $description = 'Decrypt and export files';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $orgId = $this->argument('organisation_id');

        $contacts = Contact::where('organisation_id', $orgId)->with('contactable', 'files')->get();
      
        foreach($contacts as $contact) {
            $this->info($contact->getName());
        }
        $this->info($contacts);
        return;

    }
}
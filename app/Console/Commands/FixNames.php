<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Contact;


class FixNames extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix-names {organisation_id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $orgId = $this->argument('organisation_id');
        $handle = fopen(storage_path() . '/contacts.csv', 'r');

        while ($csvLine = fgetcsv($handle, $delimiter = ",")) {
            if(count($csvLine) > 2 && $csvLine[0] != 'ID'){
                $name = trim($csvLine[2]);
                $type = $csvLine[10];
                if($type == 'Company'){
                    $fields = [
                        'name' => $name,
                        'metadata' => json_encode(['actionstepId' => $csvLine[0]]),
                    ];
                    $contact = Contact::where('metadata->actionstepId', $csvLine[0])->whereNull('name')->first();
                    $contact->name = $name;
                    $contact->save();
                }
            }

        }
    }
}

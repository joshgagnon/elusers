<?php

namespace App\Console\Commands;

use DB;
use File;
use Illuminate\Console\Command;

class CreateOrUpdateDatabaseFunctions extends Command
{
    protected $signature = 'db:update-functions';

    protected $description = 'Create or update DB functions. All files from database/functions are executed in the DB';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        // Build the file path
        $functionFilePaths = File::files(base_path() . '/database/functions');

        $this->info('Running files from \'database/functions\'');

        foreach ($functionFilePaths as $functionFilePath) {
            $this->info($functionFilePath);

            $function = File::get($functionFilePath);
            DB::statement($function);
        }
    }
}

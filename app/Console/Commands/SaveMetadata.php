<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\MatterFile;
use App\ContactFile;
use App\OrganisationFile;

class SaveMetadata extends Command
{
    protected $signature = 'save-metadata';

    protected $description = '';

    public function handle()
    {
        $this->info('updating');
        MatterFile::whereNotNull('matter_id')->chunk(100, function($mfs) {


            foreach($mfs as $mf) {
               $file = $mf->file;


               if($mf->matter) {
                    try{
                        $file->update(['metadata' => $file->parseMetadata($mf->matter->creator)]);
                        $this->info('updated '.$file->id.' '.$file->filename);
                    }catch(\Illuminate\Contracts\Filesystem\FileNotFoundException $e){
                    };
                }
            }
        });

         ContactFile::whereNotNull('contact_id')->chunk(100, function($mfs) {
            foreach($mfs as $mf) {
               $file = $mf->file;
               if($mf->contact) {
                    try{
                        $file->update(['metadata' => $file->parseMetadata($mf->contact->creator)]);
                       $this->info('updated '.$file->id.' '.$file->filename);
                    }catch(\Illuminate\Contracts\Filesystem\FileNotFoundException $e){
                    };
                }
            }
        });

        OrganisationFile::chunk(100, function($mfs) {
            foreach($mfs as $mf) {
               $file = $mf->file;
                try{
                    $file->update(['metadata' => $file->parseMetadata($mf->creator)]);
                     $this->info('updated '.$file->id.' '.$file->filename);
                }catch(\Illuminate\Contracts\Filesystem\FileNotFoundException $e){
                };
            }
        });
    }
}
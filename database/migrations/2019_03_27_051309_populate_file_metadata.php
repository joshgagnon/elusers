<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\MatterFile;
use App\ContactFile;
use App\OrganisationFile;

class PopulateFileMetadata extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        MatterFile::whereNotNull('matter_id')->get()->chunk(100, function($mfs) {
            foreach($mfs as $mf) {
               $file = $mf->file;
               if($mf->matter) {
                    try{
                        $file->update(['metadata' => $file->parseMetadata($mf->matter->creator)]);
                    }catch(\Illuminate\Contracts\Filesystem\FileNotFoundException $e){
                    };
                }
            }
        });

         ContactFile::whereNotNull('contact_id')->get()->chunk(100, function($mfs) {
            foreach($mfs as $mf) {
               $file = $mf->file;
               if($mf->contact) {
                    try{
                        $file->update(['metadata' => $file->parseMetadata($mf->contact->creator)]);
                    }catch(\Illuminate\Contracts\Filesystem\FileNotFoundException $e){
                    };
                }
            }
        });

        OrganisationFile::get()->chunk(100, function($mfs) {
            foreach($mfs as $mf) {
               $file = $mf->file;
                try{
                    $file->update(['metadata' => $file->parseMetadata($mf->creator)]);
                }catch(\Illuminate\Contracts\Filesystem\FileNotFoundException $e){
                };
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}

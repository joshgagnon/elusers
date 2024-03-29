<?php

namespace App\Console\Commands;

use App\Contact;
use App\ContactFile;
use App\MatterFile;
use App\Matter;
use App\OrganisationFile;
use App\Organisation;
use App\Address;
use App\File;
use App\DeedPacketRecord;
use Illuminate\Console\Command;


class ExportFiles extends Command
{
    protected $signature = 'export-files {organisation_id} ${output_dir}';

    protected $description = 'Decrypt and export files';

    public function __construct()
    {
        parent::__construct();
    }


    public function clear($path) {

        $it = new \RecursiveDirectoryIterator($path, \RecursiveDirectoryIterator::SKIP_DOTS);
        $files = new \RecursiveIteratorIterator($it,
                     \RecursiveIteratorIterator::CHILD_FIRST);
        foreach($files as $file) {
            if ($file->isDir()){
                rmdir($file->getRealPath());
            } else {
                unlink($file->getRealPath());
            }
        }
        rmdir($path);
    }

    public function safeClear($path) {
        try {
            $this->clear($path);
        } catch(\Exception $e) {

        }
    }


    public function contacts($org, $outputDir) {
        $contacts = Contact::where('organisation_id', $org->id)->with('contactable', 'files')->get();

        foreach($contacts as $contact) {
            $path = $outputDir.'/Contact Files/'.$contact->getName();
            $this->safeClear($path);

            foreach($contact->files as $file) {
                if($file->directory) {
                    continue;
                }
                $subpath = $file->getFullPath();
                $finalPath = $path;
                if($subpath) {
                    $finalPath = $path.'/'.$subpath;
                }
                @mkdir($finalPath, 0777, true); // ignore result
                file_put_contents($finalPath.'/'.File::filterPath($file->filename), $file->getContent($org->encryption_key));
                // put file into
            }
        }
    }

    public function matters($org, $outputDir) {
        $matters = Matter::where('organisation_id', $org->id)->get();

        foreach($matters as $matter) {
                
            $path = $outputDir.'/Matter Files/'.$matter->matter_number;
            $this->safeClear($path);
            foreach($matter->files as $file) {
                if($file->directory) {
                    continue;
                }
                $subpath = $file->getFullPath();
                $finalPath = $path;
                if($subpath) {
                    $finalPath = $finalPath.'/'.$subpath;
                }
                @mkdir($finalPath, 0777, true); // ignore result
                echo $finalPath.'/'.File::filterPath($file->filename)."\n";
                file_put_contents($finalPath.'/'.File::filterPath($file->filename), $file->getContent($org->encryption_key));
                // put file into
            }
        }
    }

    public function orgFiles($org, $outputDir) {
        $files = OrganisationFile::where('organisation_id', $org->id)->get();
        $path = $outputDir.'/Organisation Files';
        $this->safeClear($path);

        foreach($files as $file) {
            if($file->file->directory) {
                continue;
            }
            $subpath = $file->file->getFullPath();
            $path = $outputDir.'/Organisation Files';
            if($subpath) {
                $path = $path.'/'.$subpath;
            }
            @mkdir($path, 0777, true); // ignore result
            file_put_contents($path.'/'.File::filterPath($file->file->filename), $file->file->getContent($org->encryption_key));
            // put file into
        }

    }


    public function deedFiles($org, $outputDir) {
        $deedPackets =  DeedPacketRecord::get();
        $path = $outputDir.'/Deed Packet Record Files';
        $this->safeClear($path);
        foreach($deedPackets as $deedPacket) {
            foreach ($deedPacket->files as $file) {
                if ($file->directory) {
                    continue;
                }
                $subpath = $file->getFullPath();
                $path = $outputDir . '/Deed Packet Record Files/' . File::filterPath($deedPacket->document_name);
                if ($subpath) {
                    $path = $path . '/' . File::filterPath($subpath);
                }
                @mkdir($path, 0777, true); // ignore result
                file_put_contents($path . '/' . File::filterPath($file->filename), $file->getContent($org->encryption_key));
                // put file into
            }
        }

    }

    public function handle()
    {
        ini_set('memory_limit','2G');
        $orgId = $this->argument('organisation_id');
        $outputDir = $this->argument('output_dir');

        $org = Organisation::find($orgId);

        #$this->contacts($org, $outputDir);
       # $this->matters($org, $outputDir);
        #$this->orgfiles($org, $outputDir);
        $this->deedFiles($org, $outputDir);



        return;

    }
}
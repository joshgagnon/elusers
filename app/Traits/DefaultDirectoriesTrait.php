<?php
namespace App\Traits;
use App\File;

trait DefaultDirectoriesTrait {
    public function populateDirectories()
    {
        // if have at least one directory then has been populated
        $hasDir = $this->files()->where('directory', true)->where('protected', true)->get();

        if(count($hasDir)) {
            return false;
        }
        foreach(get_class($this)::DEFAULT_DIRECTORIES as $name) {
            $this->files()->save(File::create([
                'filename'  => $name,
                'directory' => true,
                'protected' => true,
                'path' => '',
                'mimetype' => ''
            ]));
        }
    }
}
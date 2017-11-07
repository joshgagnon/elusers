<?php

namespace App\Library;

use DB;
use File;

class SQLFile
{
    public $filename;
    public $parameters;

    public static function run(string $filename, array $parameters = [])
    {
        $query = new static($filename, $parameters);
        return $query->get();
    }

    function __construct(string $filename, array $parameters = [])
    {
        $this->filename = $filename;
        $this->parameters = $parameters;
    }

    public function get()
    {
        // Build the file path
        $filePath = resource_path() . '/sql/' . $this->filename . '.sql';

        // Get the contents of the file
        $fileContents = File::get($filePath);

        // Run the query
        $result = DB::select($fileContents, $this->parameters);

        // Return the result
        return $result;
    }
}
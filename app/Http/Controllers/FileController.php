<?php

namespace App\Http\Controllers;

use App\File;

class FileController extends Controller
{
    public function get(File $file)
    {
        return response()->file(storage_path('app/' . $file->path));
    }
}

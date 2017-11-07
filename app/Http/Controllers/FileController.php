<?php

namespace App\Http\Controllers;

use App\File;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function get(File $file)
    {
        $content = Storage::get($file->path);
        $headers = [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $file->filename . '"',
        ];

        return response($content, 200, $headers);
    }


}

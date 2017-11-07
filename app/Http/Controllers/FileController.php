<?php

namespace App\Http\Controllers;

use App\File;
use App\Library\SQLFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function get(Request $request, File $file)
    {
        // Check if this user is allowed to read this file
        $user = $request->user();
        $canReadFile = SQLFile::run('can_read_file', ['user_id' => $user->id, 'file_id' => $file->id]);
        $canReadFile = $canReadFile[0]->exists;

        if (!$canReadFile) {
            abort(403);
        }

        // Get the file and return it
        $content = Storage::get($file->path);
        $headers = [
            'Content-Type' => $file->mime_type,
            'Content-Disposition' => 'attachment; filename="' . $file->filename . '"',
        ];

        return response($content, 200, $headers);
    }


}

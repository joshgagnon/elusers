<?php

namespace App\Http\Controllers;

use App\File;
use App\Library\Encryption;
use App\Library\SQLFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function get(Request $request, File $file)
    {
        // Check if this user is allowed to read this file
        $user = $request->user();

        if (!File::canRead($file->id, $user)) {
            abort(403);
        }
        // Get the file and return it
        $content = Storage::get($file->path);

        if ($file->encrypted) {
            $key = $user->organisation->encryption_key;
            $encryption = new Encryption($key);
            $content = $encryption->decrypt($content);
        }

        $headers = [
            'Content-Type' => $file->mime_type,
            'Content-Disposition' => 'attachment; filename="' . $file->filename . '"',
        ];

        return response($content, 200, $headers);
    }


}

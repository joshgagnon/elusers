<?php

namespace App\Http\Controllers;

use App\File;
use App\Library\Encryption;
use App\Library\SQLFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use GuzzleHttp\Client;
use GuzzleHttp\RequestOptions;

function endswith($string, $test) {
    $strlen = strlen($string);
    $testlen = strlen($test);
    if ($testlen > $strlen) return false;
    return substr_compare($string, $test, $strlen - $testlen, $testlen) === 0;
}

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

    public function preview(Request $request, File $file)
    {
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

        if(endswith($file->filename, '.doc') || endswith($file->filename, '.docx') || endswith($file->filename, '.odt')) {
            $convertUrl = 'https://convert.catalex.nz/convert';
            $client = new Client();
            $res = $client->request('POST', $convertUrl, [

                'multipart' => [
                    ['name' => 'fileType',
                    'contents' =>  'pdf'],
                    ['name'     => 'file',
                    'contents' => $content,
                    'filename' => $file->filename
                ]]]
            );
            $disp = $res->getHeader('Content-Disposition');
            return response($res->getBody())
                ->header('Content-Type', $res->getHeader('Content-Type'))
                ->header('Content-Disposition', $disp);
        }
        $headers = [
            'Content-Type' => $file->mime_type,
            'Content-Disposition' => 'attachment; filename="' . $file->filename . '"',
        ];

        return response($content, 200, $headers);

    }

}

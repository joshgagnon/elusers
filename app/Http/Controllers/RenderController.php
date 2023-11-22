<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\RequestOptions;
use App\File;
use App\Library\SQLFile;
use App\Library\Encryption;
use Illuminate\Support\Facades\Storage;

class RenderController extends Controller
{
    public function render(Request $request)
    {
        $user = $request->user();
        $client = new Client();
        $input = $request->allJson();
        $newDocs = [];
        $existingDocs = [];
        if(isset($input["documentsToAppend"])) {
            $newDocs = $input["documentsToAppend"];
        }
        if(isset($input["existingDocumentsToAppend"])) {
            $existingDocs = $input["existingDocumentsToAppend"];
        }
        if(isset($input['json'])){
            $input = json_decode($input['json']);
        }
       // $oddityUrl = 'https://oddity.catalex.nz/render';
        ///$oddityUrl = 'http://localhost:5771/render';
        $oddityUrl = 'http://localhost:5671/render';
        $res = $client->post($oddityUrl, [RequestOptions::JSON => $input]);
        $disp = $res->getHeader('Content-Disposition');
        if(count($existingDocs) or count($newDocs)) {
            $concatUrl = 'https://concat.catalex.nz/upload_concat';
           // $concatUrl = 'http://localhost:5669/upload_concat';
            $body = $res->getBody();
            $count = 1;
            $files = [[
                    'name'     => 'file[]',
                    'contents' => $body,
                    'filename' => $count++
                ]];

            foreach($newDocs as $file) {
                $files[] = [
                    'name'     => 'file[]',
                    'contents' => fopen($file->getPathName(), 'r'),
                    'filename' => $count++
                ];
            }

            foreach($existingDocs as $file) {
                $file = json_decode($file);
                $index = $file->index + 1; //we appended at begining
                $file = File::find($file->id);
                $canReadFile = SQLFile::run('can_read_file', ['user_id' => $user->id, 'file_id' => $file->id]);
                $canReadFile = $canReadFile[0]->exists;
                if (!$canReadFile) {
                    abort(403);
                }
                // Get the file and return it
                $content = Storage::get($file->path);

                if ($file->encrypted) {
                    $key = $user->organisation->encryption_key;
                    $encryption = new Encryption($key);
                    $content = $encryption->decrypt($content);
                }

                array_splice($files, $index, 0, [[
                    'name'     => 'file[]',
                    'contents' => $content,
                    'filename' => $count++
                ]]);

            }
            $res = $client->post($concatUrl, ['multipart' => $files]);
        }


        return response($res->getBody())
            ->header('Content-Type', $res->getHeader('Content-Type'))
            ->header('Content-Disposition', $disp);
    }
}

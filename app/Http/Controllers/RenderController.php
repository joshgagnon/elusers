<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\RequestOptions;



class RenderController extends Controller
{
    public function render(Request $request)
    {
        $client = new Client();
        $input = $request->all();
        $newDocs = false;
        if(isset($input["newDocumentsToAppend"])) {
            $newDocs = $input["newDocumentsToAppend"];
        }
        if(isset($input['json'])){
            $input = json_decode($input['json']);
        }
        $oddityUrl = 'https://oddity.catalex.nz/render';
        //$url = 'http://localhost:5771/render';
        $res = $client->post($oddityUrl, [RequestOptions::JSON => $input]);
        $disp = $res->getHeader('Content-Disposition');
        if($newDocs) {
            $concatUrl = 'https://concat.catalex.nz/upload_concat';
            //$concatUrl = 'http://localhost:5669/upload_concat';
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
            $res = $client->post($concatUrl, ['multipart' => $files]);
        }


        return response($res->getBody())
            ->header('Content-Type', $res->getHeader('Content-Type'))
            ->header('Content-Disposition', $disp);
    }
}

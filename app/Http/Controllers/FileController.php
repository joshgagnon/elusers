<?php

namespace App\Http\Controllers;

use App\File;
use App\FilePermission;
use App\FileNote;
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
        $content = $file->read($user);
        #return $file->metadata;

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

    public function replace(Request $request, File $file)
    {
        $user = $request->user();

        if (!File::canRead($file->id, $user)) {
            abort(403);
        }

        $oldVersion = File::create($file->toArray());

        $upload = $request->file('file', [])[0];
        $uploadedFilePath = $upload->getRealPath();
        $contents = file_get_contents($uploadedFilePath);

        if($file->encrypted) {
            $key = $user->organisation->encryption_key;
            $encryption = new Encryption($key);
            $contents = $encryption->encrypt($contents);
        }

        $path = explode('/', $file->path)[0].'/'.time() . uniqid();
        // Store the file
        Storage::put($path, $contents);

          // put new content on file
        $file->update(['path' => $path, 'previous_version_id' => $oldVersion->id]);

        $file->update(['metadata' => $file->parseMetadata($user)]);

        return response()->json(['message' => 'Documents Updated', 'id' => $file->id], 200);
    }

    public function permission(Request $request, File $file)
    {
        $user = $request->user();

        if (!File::canRead($file->id, $user)) {
            abort(403);
        }

        $data = $request->allJson();

        $perm = $data['permission'];
        foreach($perm as $permission => $value) {
            if($value) {
                FilePermission::create(['permission' => $permission, 'file_id' => $file->id]);
            }
            else{
                FilePermission::where(['permission' => $permission, 'file_id' => $file->id])->delete();
            }
        }

        return response()->json(['message' => 'Permission Updated', 'id' => $file->id], 200);
    }

    public function note(Request $request, File $file)
    {
        $user = $request->user();

        if (!File::canRead($file->id, $user)) {
            abort(403);
        }

        $data = $request->allJson();
        $note = $data['note'];
        if(count($file->notes)){
            $file->notes->first()->update(['created_by_user_id' => $user->id, 'note' => $note]);
        }
        else{
             $file->notes()->create(['created_by_user_id' => $user->id, 'note' => $note]);
        }
        return response()->json(['message' => 'Note Updated', 'id' => $file->id], 200);
    }


}

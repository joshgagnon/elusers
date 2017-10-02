<?php

namespace App\Http\Controllers;

use App\Client;
use App\DeedFile;
use App\Library\SQLFile;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DeedFileController extends Controller
{
    /**
     * Get all deed files for the current organisation.
     *
     * @param \Illuminate\Http\Request $request
     * @return mixed
     */
    public function all(Request $request)
    {
        $currentOrgId = $request->user()->organisation_id;

        $query = new SQLFile('deed_files', ['org_id' => $currentOrgId]);
        $result = $query->get();

        return $result;
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param                          $deedFileId
     * @return \Illuminate\Http\JsonResponse
     */
    public function get(Request $request, $deedFileId)
    {
        $orgId = $request->user()->organisation_id;

        $query = new SQLFile('deed_file', ['org_id' => $orgId, 'deed_file_id' => $deedFileId]);
        $result = $query->get();

        // 404 if no record
        if (count($result) === 0) {
            abort(404);
        }

        $deedFile = $result[0];

        $deedFile->document_date = Carbon::parse($deedFile->document_date)->format('d M Y');

        return response()->json($result[0], 200);
    }

    /**
     * Create a deed file. This may require creating a client.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $this->validate($request, DeedFile::$validationRules);

        $user = $request->user();
        $data = $request->all();

        $client = Client::findOrCreate($data['client_title'], $user->id);

        $deedFile = DeedFile::create([
            'client_id'          => $client->id,
            'document_date'      => Carbon::parse($data['document_date']),
            'parties'            => $data['parties'],
            'matter'             => $data['matter'],
            'created_by_user_id' => $user->id,
        ]);

        return response()->json(['message' => 'Deed file created', 'deed_file_id' => $deedFile->id], 201);
    }

    /**
     * Update a deed file.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\DeedFile            $deedFile
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, DeedFile $deedFile)
    {
        $this->validate($request, DeedFile::$validationRules);

        $user = $request->user();
        $data = $request->all();

        $client = Client::findOrCreate($data['client_title'], $user->id);

        $deedFile->update([
            'client_id'     => $client->id,
            'document_date' => Carbon::parse($data['document_date']),
            'parties'       => $data['parties'],
            'matter'        => $data['matter'],
        ]);

        return response()->json(['message' => 'Deed file updated', 'deed_file_id' => $deedFile->id], 200);
    }

    /**
     * Delete a deed file.
     *
     * @param \App\DeedFile $deedFile
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete(DeedFile $deedFile)
    {
        $deedFile->delete();
        return response()->json(['message' => 'Deed file deleted.'], 200);
    }
}

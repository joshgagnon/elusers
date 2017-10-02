<?php

namespace App\Http\Controllers;

use App\DeedFileRecord;
use Illuminate\Http\Request;

class DeedPacketRecordController extends Controller
{
    /**
     * Get all deed file records for the current organisation.
     *
     * @param \Illuminate\Http\Request $request
     * @return mixed
     */
    public function all(Request $request)
    {
        $orgId = $request->user()->organisation_id;

        $query = new SQLFile('all_deed_file_records', ['org_id' => $orgId]);
        $result = $query->get();

        return $result;
    }

    /**
     * Get a specific deed file record.
     *
     * @param \Illuminate\Http\Request $request
     * @param                          $recordId
     * @return \Illuminate\Http\JsonResponse
     */
    public function get(Request $request, $recordId)
    {
        $orgId = $request->user()->organisation_id;

        $query = new SQLFile('get_deed_file_record', ['org_id' => $orgId, 'record_id' => $recordId]);
        $result = $query->get();

        // 404 if no record
        if (count($result) === 0) {
            abort(404);
        }

        $record = $result[0];

        $record->document_date = Carbon::parse($record->document_date)->format('d M Y');

        return response()->json($record, 200);
    }

    /**
     * Create a deed file record. This may require creating a deed file.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $this->validate($request, DeedFileRecord::$validationRules);

        $user = $request->user();
        $data = $request->all();

        $client = DeedFile::findOrCreate($data['deed_file_title'], $user->id);

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
     * @param \App\DeedFile $deedFil
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete(DeedFile $deedFile)
    {
        $deedFile->delete();
        return response()->json(['message' => 'Deed file deleted.'], 200);
    }
}

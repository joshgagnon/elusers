<?php

namespace App\Http\Controllers;

use App\DeedPacketRecord;
use App\Library\SQLFile;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DeedPacketRecordController extends Controller
{
    /**
     * Get a specific deed packet record.
     *
     * @param \Illuminate\Http\Request $request
     * @param                          $recordId
     * @return \Illuminate\Http\JsonResponse
     */
    public function get(Request $request, $recordId)
    {
        $orgId = $request->user()->organisation_id;

        $query = new SQLFile('get_deed_record', ['org_id' => $orgId, 'record_id' => $recordId]);
        $result = $query->get();

        // 404 if no record
        if (count($result) === 0) {
            abort(404);
        }

        $record = $result[0];
        $record->document_date = $record->document_date ? Carbon::parse($record->document_date)->format('d M Y') : null;
        $record->destruction_date = $record->destruction_date ? Carbon::parse($record->destruction_date)->format('d M Y') : null;

        return response()->json($record, 200);
    }

    /**
     * Create a deed packet record.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $this->validate($request, DeedPacketRecord::$validationRules);

        $user = $request->user();
        $data = $request->all();

        $record = DeedPacketRecord::create([
            'document_date'      => Carbon::parse($data['document_date']),
            'parties'            => $data['parties'],
            'matter'             => $data['matter'],
            'created_by_user_id' => $user->id,
        ]);

        return response()->json(['message' => 'Deed packet record created', 'record_id' => $record->id], 201);
    }

    /**
     * Update a deed packet record.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\DeedPacketRecord    $record
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, DeedPacketRecord $record)
    {
        $this->validate($request, DeedPacketRecord::$validationRules);

        $data = $request->all();

        $record->update([
            'document_date'      => Carbon::parse($data['document_date']),
            'destruction_date'   => Carbon::parse($data['destruction_date']),
            'document_name'      => $data['document_name'],
            'parties'            => $data['parties'],
            'matter_id'          => $data['matter_id'],
            'office_location_id' => $data['office_location_id'],
        ]);

        return response()->json(['message' => 'Deed packet record updated', 'record_id' => $record->id], 200);
    }

    /**
     * Delete a deed packet record.
     *
     * @param \App\DeedPacketRecord $record
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete(DeedPacketRecord $record)
    {
        $record->delete();
        return response()->json(['message' => 'Deed packet record deleted.'], 200);
    }
}

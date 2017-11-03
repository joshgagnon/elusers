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
        $result = $result[0]->record;

        // 404 if no record
        if (count($result) === 0) {
            abort(404);
        }

        $record = json_decode($result)[0];
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

        // Create the deed record
        $deedRecord = DeedPacketRecord::create([
            'deed_packet_id'     => $data['deed_packet_id'],
            'document_date'      => Carbon::parse($data['document_date']),
            'destruction_date'   => !empty($data['destruction_date']) ? Carbon::parse($data['destruction_date']) : null,
            'document_name'      => $data['document_name'],
            'parties'            => $data['parties'],
            'matter_id'          => $data['matter_id'],
            'office_location_id' => !empty($data['office_location_id']) ? $data['office_location_id'] : null,
            'created_by_user_id' => $user->id,
            'notes'              => !empty($data['notes']) ? $data['notes'] : null,
        ]);

        // Create records for any files uploaded
        $files = $request->file('file');

        foreach ($files as $file) {
            $path = $file->store('deed-record-files');

            // Create file
            $deedRecord->files()->create([
                'path'     => $path,
                'filename' => $file->getClientOriginalName(),
            ]);
        }

        // Return successful response
        return response()->json(['message' => 'Deed packet record created', 'record_id' => $deedRecord->id], 201);
    }

    /**
     * Update a deed packet record.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\DeedPacketRecord    $deedRecord
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, DeedPacketRecord $deedRecord)
    {
        $this->validate($request, DeedPacketRecord::$validationRules);

        $data = $request->all();

        $deedRecord->update([
            'deed_packet_id'     => $data['deed_packet_id'],
            'document_date'      => Carbon::parse($data['document_date']),
            'destruction_date'   => !empty($data['destruction_date']) ? Carbon::parse($data['destruction_date']) : null,
            'document_name'      => $data['document_name'],
            'parties'            => $data['parties'],
            'matter_id'          => $data['matter_id'],
            'office_location_id' => !empty($data['office_location_id']) ? $data['office_location_id'] : null,
            'notes'              => !empty($data['notes']) ? $data['notes'] : null,
        ]);

        // Create records for any files uploaded
        $files = $request->file('file');
        $fileIds = $data['existing_files'];

        foreach ($files as $file) {
            $path = $file->store('deed-record-files');

            // Create file
            $newFile = $deedRecord->files()->create([
                'path'     => $path,
                'filename' => $file->getClientOriginalName(),
            ]);

            $fileIds[] = $newFile->id;
        }


        // loop on deedRecord files, if not in existing_files list then removed it
        $deedRecord->files()->sync($fileIds);

        return response()->json(['message' => 'Deed packet record updated', 'record_id' => $deedRecord->id], 200);
    }

    /**
     * Delete a deed packet record.
     *
     * @param \App\DeedPacketRecord $record
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete(DeedPacketRecord $record)
    {
        // TODO: Delete all files

        // Delete the record itself
        $record->delete();

        return response()->json(['message' => 'Deed packet record deleted.'], 200);
    }
}

<?php

namespace App\Http\Controllers;

use App\DeedRecordFile;
use Illuminate\Http\Request;

class DeedRecordFileController extends Controller
{
    public function create(Request $request, $deedRecordId)
    {
        $path = $request->file('file')->store('deed-record-files');

        $deedRecordFile = DeedRecordFile::create([
            'deed_packet_record_id' => $deedRecordId,
            'path' => $path
        ]);

        return response()->json(['message' => 'Deed packet record created', 'deed_record_file_id' => $deedRecordFile->id], 201);
    }
}

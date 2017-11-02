<?php

namespace App\Http\Controllers;

use App\DeedPacketRecord;
use Illuminate\Http\Request;

class DeedRecordFileController extends Controller
{
    public function create(Request $request, $deedRecordId)
    {
        $path = $request->file('file')->store('deed-record-files');

        return $path;
    }
}

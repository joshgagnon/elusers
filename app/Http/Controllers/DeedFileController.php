<?php

namespace App\Http\Controllers;

use App\DeedFile;
use App\Library\SQLFile;
use Illuminate\Http\Request;

class DeedFileController extends Controller
{
    public function all(Request $request)
    {
        $currentOrgId = $request->user()->organisation_id;

        $query = new SQLFile('deed_files', ['org_id' => $currentOrgId]);
        $result = $query->get();

        return $result;
    }
}

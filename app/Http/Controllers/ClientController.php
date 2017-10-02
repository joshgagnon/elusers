<?php

namespace App\Http\Controllers;

use App\Library\SQLFile;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function all(Request $request)
    {
        $orgId = $request->user()->organisation_id;

        $query = new SQLFile('clients', ['org_id' => $orgId]);
        $result = $query->get();

        return $result;
    }
}

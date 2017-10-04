<?php

namespace App\Http\Controllers;

use App\Library\SQLFile;
use Illuminate\Http\Request;

class OfficeLocationController extends Controller
{
    /**
     * Get all office locations.
     *
     * @param \Illuminate\Http\Request $request
     * @return mixed
     */
    public function all(Request $request)
    {
        $orgId = $request->user()->organisation_id;

        $query = new SQLFile('all_office_locations', ['org_id' => $orgId]);
        $result = $query->get();

        return $result;
    }
}

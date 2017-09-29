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
     * Create a deed file. This may require creating a client.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $user = $request->user();

        $this->validate($request, [
            'client_title'  => 'required',
            'document_date' => 'required|date',
            'parties'       => 'required',
            'matter'        => 'required',
        ]);

        $data = $request->all();

        $clientTitle = $data['client_title'];
        $client = Client::where('title', $clientTitle)->first();

        if (!$client) {
            $client = Client::create(['title' => $clientTitle, 'created_by_user_id' => $user->id]);
        }

        $deedFile = DeedFile::create([
            'client_id'          => $client->id,
            'document_date'      => Carbon::parse($data['document_date']),
            'parties'            => $data['parties'],
            'matter'             => $data['matter'],
            'created_by_user_id' => $user->id,
        ]);

        return response()->json(['message' => 'Deed file created', 'deed_file_id' => $deedFile->id], 201);
    }
}

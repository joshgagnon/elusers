<?php

namespace App\Http\Controllers;

use App\Client;
use App\DeedPacket;
use App\Library\SQLFile;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DeedPacketController extends Controller
{
    /**
     * Get all deed packets for the users organisation.
     *
     * @param \Illuminate\Http\Request $request
     * @return mixed
     */
    public function all(Request $request)
    {
        $orgId = $request->user()->organisation_id;

        $query = new SQLFile('all_deed_packets', ['org_id' => $orgId]);
        $result = $query->get();

        return $result;
    }

    /**
     * Get a specific deed packet
     *
     * @param \Illuminate\Http\Request $request
     * @param                          $deedPacketId
     * @return \Illuminate\Http\JsonResponse
     */
    public function get(Request $request, $deedPacketId)
    {
        $orgId = $request->user()->organisation_id;

        $query = new SQLFile('get_deed_packet', ['org_id' => $orgId, 'deed_packet_id' => $deedPacketId]);
        $result = $query->get();

        // 404 if no record
        if (count($result) === 0) {
            abort(404);
        }

        $deedPacket = $result[0];
        $deedPacket->document_date = Carbon::parse($deedPacket->document_date)->format('d M Y');

        return response()->json($deedPacket, 200);
    }

    /**
     * Create a deed packet.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $this->validate($request, DeedPacket::$validationRules);

        $user = $request->user();
        $data = $request->all();

        $deedPacket = DeedPacket::create([
            'title'              => $data['title'],
            'created_by_user_id' => $user->id,
        ]);

        return response()->json(['message' => 'Deed packet created', 'deed_packet_id' => $deedPacket->id], 201);
    }

    /**
     * Update a deed packet.
     *
     * @param \Illuminate\Http\Request         $request
     * @param \App\Http\Controllers\DeedPacket $deedPacket
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, DeedPacket $deedPacket)
    {
        $this->validate($request, DeedPacket::$validationRules);

        $data = $request->all();

        $deedPacket->update([
            'title' => $data['title'],
        ]);

        return response()->json(['message' => 'Deed packet updated', 'deed_packet_id' => $deedPacket->id], 200);
    }

    /**
     * Delete a deed packet
     *
     * @param \App\Http\Controllers\DeedPacket $deedPacket
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete(DeedPacket $deedPacket)
    {
        $deedPacket->delete();
        return response()->json(['message' => 'Deed packet deleted.'], 200);
    }
}

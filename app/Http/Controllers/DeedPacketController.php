<?php

namespace App\Http\Controllers;

use App\Client;
use App\DeedPacket;
use App\Library\SQLFile;
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

        return $result[0]->packets;
    }

    /**
     * Get a specific deed packet.
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

        return $result[0]->packet;
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
     * @param \Illuminate\Http\Request $request
     * @param \App\DeedPacket          $packet
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, DeedPacket $packet)
    {
        $this->validate($request, DeedPacket::$validationRules);

        $data = $request->all();

        $packet->update([
            'title' => $data['title'],
        ]);

        return response()->json(['message' => 'Deed packet updated', 'deed_packet_id' => $packet->id], 200);
    }

    /**
     * Delete a deed packet.
     *
     * @param \App\DeedPacket $packet
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete(DeedPacket $packet)
    {
        $packet->delete();
        return response()->json(['message' => 'Deed packet deleted.'], 200);
    }
}

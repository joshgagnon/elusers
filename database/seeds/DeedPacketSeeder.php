<?php

use App\DeedPacket;
use App\DeedPacketRecord;
use App\OfficeLocation;
use App\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DeedPacketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = User::get();
        $officeLocations = OfficeLocation::get();

        $user1 = $users[0];
        $user2 = $users[1];

        $office1 = $officeLocations[0];
        $office2 = $officeLocations[1];


        $packet1 = DeedPacket::create(['created_by_user_id' => $user1->id, 'title' => 'Cook family trust']);
        $packet2 = DeedPacket::create(['created_by_user_id' => $user1->id, 'title' => 'Johnson family trust']);
        $packet3 = DeedPacket::create(['created_by_user_id' => $user2->id, 'title' => 'Bloy family trust']);
        DeedPacket::create(['created_by_user_id' => $user2->id, 'title' => 'Martin family trust']);

        $this->createRecord($user1->id, $packet1->id, 'Packet 1 doc 1', 'p1d1');
        $this->createRecord($user1->id, $packet1->id, 'Packet 1 doc 2', 'p1d2');
        $this->createRecord($user1->id, $packet1->id, 'Packet 1 doc 3', 'p1d3');
        $this->createRecord($user2->id, $packet1->id, 'Packet 1 doc 4', 'p1d4');

        $this->createRecord($user2->id, $packet2->id, 'Packet 2 doc 1', 'p2d1', Carbon::now()->addMonths(12));
        $this->createRecord($user2->id, $packet2->id, 'Packet 2 doc 2', 'p2d2', Carbon::now()->addMonths(12));
        $this->createRecord($user2->id, $packet2->id, 'Packet 2 doc 3', 'p2d3', Carbon::now()->subMonths(1));
        $this->createRecord($user2->id, $packet2->id, 'Packet 2 doc 4', 'p2d4', null, $office1->id);

        $this->createRecord($user2->id, $packet3->id, 'Packet 3 doc 1', 'p3d1', Carbon::now()->addMonths(12), $office1->id);
        $this->createRecord($user1->id, $packet3->id, 'Packet 3 doc 2', 'p3d2', null, $office1->id);
        $this->createRecord($user2->id, $packet3->id, 'Packet 3 doc 3', 'p3d3', Carbon::now()->subMonths(14), $office2->id);
        $this->createRecord($user1->id, $packet3->id, 'Packet 3 doc 4', 'p3d4', null, $office2->id);
    }

    private function createRecord($userId, $packetId, $name, $matterId, $destructionDate = null, $officeLocationId = null)
    {
        return DeedPacketRecord::create([
            'created_by_user_id' => $userId,
            'deed_packet_id' => $packetId,
            'document_name' => $name,
            'document_date' => Carbon::now(),
            'parties' => 'Parties for ' . $name,
            'matter_id' => $matterId,
            'destruction_date' => $destructionDate,
            'office_location_id' => $officeLocationId ,
        ]);
    }
}

<?php

use App\DeedPacket;
use App\DeedPacketRecord;
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
        $users = App\User::get();

        $user1 = $users[0];
        $user2 = $users[1];

        $packet1 = DeedPacket::create(['created_by_user_id' => $user1->id, 'title' => 'Cook family trust']);
        $packet2 = DeedPacket::create(['created_by_user_id' => $user1->id, 'title' => 'Johnson family trust']);
        $packet3 = DeedPacket::create(['created_by_user_id' => $user2->id, 'title' => 'Bloy family trust']);
        $packet4 = DeedPacket::create(['created_by_user_id' => $user2->id, 'title' => 'Martin family trust']);

        DeedPacketRecord::create([
            'created_by_user_id' => $user1->id,
        ]);
    }
}

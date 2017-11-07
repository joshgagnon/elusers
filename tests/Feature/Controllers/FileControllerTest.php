<?php

namespace Tests\Feature\Controllers;

use App\DeedPacket;
use App\DeedPacketRecord;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class FileControllerTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * @test
     */
    public function file_cant_be_accessed_by_someone_in_another_org()
    {
        $org = $this->createOrganisation();
        $userInOrg = $this->createUser(['organisation_id' => $org->id]);
        $userOutOfOrg = $this->createUser();

        $packet = DeedPacket::create(['title' => 'abc', 'created_by_user_id' => $userInOrg->id]);
        $record = DeedPacketRecord::create([
            'deed_packet_id' => $packet->id,
            'created_by_user_id' => $userInOrg->id,
            'document_name' => 'skdjfh',
            'document_date' => Carbon::now(),
            'parties' => 'asasd',
            'matter_id' => '123asd',
        ]);

        $filePath = 'testing.txt';
        Storage::put($filePath, 'contents');
        $file = $record->files()->create(['filename' => 'asdf', 'path' => $filePath]);

        // Check we can access to file
        $this->actingAs($userInOrg)
            ->get(route('file', $file->id))
            ->assertStatus(200);

        // Check users in another org can't access the file
        $this->actingAs($userOutOfOrg)
            ->get(route('file', $file->id))
            ->assertStatus(403);
    }
}

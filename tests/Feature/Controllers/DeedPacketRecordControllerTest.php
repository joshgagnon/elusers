<?php

namespace Tests\Feature\Controllers;

use App\DeedPacket;
use App\DeedPacketRecord;
use App\Library\Encryption;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class DeedPacketRecordControllerTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * @test
     */
    public function create_deed_record_with_file()
    {
        $user = $this->createUser();

        $packet = DeedPacket::create([
            'title'              => 'test',
            'created_by_user_id' => $user->id,
        ]);

        // Get the expected file contents and create an instance of UploadedFile for it
        $expectedContents = Storage::disk('test_assets')->get('encryption.txt');
        $filesToUpload = [new UploadedFile(base_path('tests/test-assets/encryption.txt'), 'testing.txt')];

        $createDeedResponse = $this->actingAs($user)
                                   ->post('/api/deed-packet-records', [
                                       'deed_packet_id' => $packet->id,
                                       'document_date'  => Carbon::now(),
                                       'document_name'  => 'document_name',
                                       'parties'        => 'parties',
                                       'matter_id'      => 'matter_id',
                                       'file'           => $filesToUpload,
                                   ])
                                   ->assertStatus(201);

        // Get the deed record we created
        $recordId = $createDeedResponse->getData()->record_id;
        $record = DeedPacketRecord::find($recordId);

        // download the file
        $fileResponse = $this->actingAs($user)->get('api/files/' . $record->files[0]->id);

        // Check the contents matches
        $this->assertEquals($expectedContents, $fileResponse->content());
    }

    /**
     * @test
     */
    public function update_deed_record_with_file()
    {
        $user = $this->createUser();
        $record = $this->createDeedRecord($user->id);

        // Get the expected file contents and create an instance of UploadedFile for it
        $expectedContents = Storage::disk('test_assets')->get('encryption.txt');
        $filesToUpload = [new UploadedFile(base_path('tests/test-assets/encryption.txt'), 'testing.txt')];

        $updateDeedResponse = $this->actingAs($user)
                                   ->post('/api/deed-packet-records/' . $record->id, [
                                       'deed_packet_id' => $record->deed_packet_id,
                                       'document_date'  => $record->document_date,
                                       'document_name'  => $record->document_name,
                                       'parties'        => $record->parties,
                                       'matter_id'      => $record->matter_id,
                                       'file'           => $filesToUpload,
                                   ])
                                   ->assertStatus(200);

        // download the file
        $fileResponse = $this->actingAs($user)->get('api/files/' . $record->files[0]->id);

        // Check the contents matches
        $this->assertEquals($expectedContents, $fileResponse->content());
    }
}

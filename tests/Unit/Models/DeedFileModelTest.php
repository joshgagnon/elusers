<?php

namespace Tests\Unit\Models;

use App\Client;
use App\DeedFile;
use Carbon\Carbon;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class DeedFileModelTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * @test
     */
    public function deed_file_belongs_to_a_client()
    {
        // Create a user
        $user = $this->createUser();

        // Create a client
        $client = Client::create(['title' => 'testing', 'created_by_user_id' => $user->id]);

        // Create a deed file
        $deedFile = DeedFile::create([
            'client_id' => $client->id,
            'document_date' => Carbon::now(),
            'parties' => 'parties',
            'matter' => 'matter',
            'created_by_user_id' => $user->id
        ]);

        // Check the client in the relationship matches the client we created the deed file with
        $clientFromRelationship = $deedFile->client()->first();

        $this->assertEquals($client->id, $clientFromRelationship->id);
    }

    /**
     * @test
     */
    public function deed_file_was_created_by_a_user()
    {
        // Create a user
        $user = $this->createUser();

        // Create a client
        $client = Client::create(['title' => 'testing', 'created_by_user_id' => $user->id]);

        // Create a deed file
        $deedFile = DeedFile::create([
            'client_id' => $client->id,
            'document_date' => Carbon::now(),
            'parties' => 'parties',
            'matter' => 'matter',
            'created_by_user_id' => $user->id
        ]);

        // Check 'created by user' matches the user we specified when we created the deedfile
        $createdByFromRelationship = $deedFile->createdBy()->first();

        $this->assertEquals($user->id, $createdByFromRelationship->id);
    }
}

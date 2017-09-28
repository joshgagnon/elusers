<?php

namespace Tests\Unit\Models;

use App\Client;
use App\DeedFile;
use Carbon\Carbon;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ClientModelTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * @test
     */
    public function client_has_many_deed_files()
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

        // Check the deed file is in the relationship
        $deedFilesFromRelationship = $client->deedFiles()->get();

        $this->assertEquals(1, $deedFilesFromRelationship->count());
        $this->assertEquals($deedFile->id, $deedFilesFromRelationship->first()->id);
    }

    /**
     * @test
     */
    public function client_was_created_by_a_user()
    {
        // Create a user
        $user = $this->createUser();

        // Create a client
        $client = Client::create(['title' => 'testing', 'created_by_user_id' => $user->id]);

        // Check 'created by user' matches the user we specified when we created the client
        $createdByFromRelationship = $client->createdBy()->first();

        $this->assertEquals($user->id, $createdByFromRelationship->id);
    }
}

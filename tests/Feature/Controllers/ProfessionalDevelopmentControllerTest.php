<?php

namespace Tests\Feature\Controllers;

use App\ProfessionalDevelopmentRecord;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ProfessionalDevelopmentControllerTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * Create record
     *
     * @test
     */
    public function create_record()
    {
        // Create a user
        $user = $this->createUser();

        // Data for new record
        $data = ['user_id' => $user->id, 'date' => '2017-11-16', 'minutes' => 150, 'title' => 'Testing', 'reflection' => 'One two three'];

        // Make the create POST request
        $response = $this->actingAs($user)->post('api/cpdpr', $data);

        // Check the response status
        $response->assertStatus(201);

        // Get the response data and check it includes message and record_id
        $responseData = $response->getData(true);
        $this->assertEquals($responseData['message'], 'CPDPR record created.');
        $this->assertArrayHasKey('record_id', $responseData);

        // Get the created record
        $record = ProfessionalDevelopmentRecord::find($responseData['record_id']);

        // Check the created record matches the data we sent the api endpoint
        $this->assertTrue($this->arrayKeysMatch(['date', 'minutes', 'title', 'reflection'], $data, $record->toArray()));

        // Check the record was created for the correct user
        $this->assertEquals($data['user_id'], $record->user_id);
    }

    /**
     * Update record
     *
     * @test
     */
    public function update_record()
    {
        // Create a user
        $user = $this->createUser();

        // Create the record
        $record = ProfessionalDevelopmentRecord::forceCreate(['user_id' => $user->id, 'date' => '2017-11-16', 'minutes' => 150, 'title' => 'Testing', 'reflection' => 'One two three']);

        // Make the update request
        $updatedData = ['date' => '2014-03-01', 'minutes' => 10, 'title' => 'Updated', 'reflection' => 'a b c d e f'];
        $response = $this->actingAs($user)->put('api/cpdpr/' . $record->id, $updatedData);

        // Check the response status
        $response->assertStatus(200);

        // Get the response data and check it includes the updated message
        $responseData = $response->getData(true);
        $this->assertEquals($responseData['message'], 'CPDPR record updated.');

        // Get the created record
        $record = $record->fresh();

        // Check the created record matches the data we sent the api endpoint
        $this->assertTrue($this->arrayKeysMatch(['date', 'minutes', 'title', 'reflection'], $updatedData, $record->toArray()));

        // Check the record was created for the correct user
        $this->assertEquals($user->id, $record->user_id);
    }
}

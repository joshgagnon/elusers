<?php

namespace Tests\Feature\Controllers;

use App\ProfessionalDevelopmentRecord;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ProfessionalDevelopmentControllerTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * A basic test example.
     *
     * @return void
     */
    public function test_create_record()
    {
        // Create a user
        $user = $this->createUser();

        // Data for new record
        $data = [
            'user_id'    => $user->id,
            'date'       => '2017-11-16',
            'minutes'    => 150,
            'title'      => 'Testing',
            'reflection' => 'One two three',
        ];

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
}

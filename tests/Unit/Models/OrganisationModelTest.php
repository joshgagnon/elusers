<?php

namespace Tests\Unit\Models;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class OrganisationModelTests extends TestCase
{
    use DatabaseTransactions;

    /**
     * @test
     */
    public function organisation_has_many_users()
    {
        // Create the organisation
        $org = $this->createOrganisation();

        // Create the users
        $userIds = [
            $this->createUser(['organisation_id' => $org->id, 'email' => 'user1@gmail.com'])->id,
            $this->createUser(['organisation_id' => $org->id, 'email' => 'user2@gmail.com'])->id,
            $this->createUser(['organisation_id' => $org->id, 'email' => 'user3@gmail.com'])->id,
        ];

        // Get all users for the org
        $userIdsFromRelationship = $org->users()->get()->pluck('id')->toArray();

        // Check the expected users matches the users we got through the relationship
        $this->assertEquals($userIds, $userIdsFromRelationship);
    }
}

<?php

namespace Tests\Unit\Models;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class UserModelTests extends TestCase
{
    use DatabaseTransactions;

    /**
     * @test
     */
    public function user_belongs_to_an_organisation()
    {
        // Create the org and the user for the org
        $org = $this->createOrganisation();
        $user = $this->createUser(['organisation_id' => $org->id]);

        // Get the organisation that the user thinks it belongs to (if it thinks it belongs to one)
        $usersOrgFromRelationship = $user->organisation()->first();

        // Check the user actually belongs to the org
        $this->assertEquals($org->id, $usersOrgFromRelationship->id);
    }
}

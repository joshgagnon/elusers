<?php

namespace Tests\Feature;

use Auth;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class UserControllerTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * @test
     */
    public function index_only_list_users_in_authed_users_organisation()
    {
        // Create and organisation with some users
        $org1 = $this->createOrganisation();
        $org1User = $this->createUser(['organisation_id' => $org1->id]);
        $this->createUser(['organisation_id' => $org1->id]);

        // Create another organisation with a user
        $org2 = $this->createOrganisation();
        $this->createUser(['organisation_id' => $org2->id]);

        $this->actingAs($org1User)
            ->get('api/users')
            ->assertStatus(200)
            ->assertExactJson($org1->users()->get()->toArray());
    }
}

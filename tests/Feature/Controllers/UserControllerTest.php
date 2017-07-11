<?php

namespace Tests\Feature\Controllers;

use Auth;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class UserControllerTest extends TestCase
{
    use DatabaseTransactions;

    public function test_index_only_list_users_in_authed_users_organisation()
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

    public function test_current_returns_the_authed_user()
    {
        // Create a user
        $org = $this->createOrganisation();
        $user = $this->createUser(['organisation_id' => $org->id]);

        // Request the current user route as the user and check the output matches up
        $this->actingAs($user)
            ->get('api/user')
            ->assertStatus(200)
            ->assertExactJson($user->toArray());
    }

    public function test_show_returns_requested_user()
    {
        // Create an org with two users
        $org = $this->createOrganisation();
        $requestingUser = $this->createUser(['organisation_id' => $org->id]);
        $userToFind = $this->createUser(['organisation_id' => $org->id]);

        // Generate the route
        $routeForUserToFind = url('api/users', [$userToFind->id]);

        $this->actingAs($requestingUser)
            ->get($routeForUserToFind)
            ->assertStatus(200)
            ->assertExactJson($userToFind->toArray());
    }

    public function test_show_returns_404_if_user_is_in_another_org()
    {
        // Create an org with a user to make the request
        $org1 = $this->createOrganisation();
        $org1User = $this->createUser(['organisation_id' => $org1->id]);

        // Create another org with a user
        $org2 = $this->createOrganisation();
        $org2User = $this->createUser(['organisation_id' => $org2->id]);

        // Generate the route
        $routeForUserToFind = url('api/users', [$org2User->id]);

        $this->actingAs($org1User)
            ->get($routeForUserToFind)
            ->assertStatus(404);
    }
}

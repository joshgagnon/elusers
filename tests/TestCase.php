<?php

namespace Tests;

use App\Organisation;
use App\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * Helper method for creating users for tests.
     *
     * @param array $overrides
     *
     * @return mixed
     */
    protected function createUser($overrides=[])
    {
        $defaults = [
            'title' => 'Mrs',
            'first_name' => 'Test',
            'middle_name' => 'One',
            'surname' => 'Two',
            'preferred_name' => 'Three',
            'email' => 'testing@onetwo.com',
            'password' => Hash::make('password'),
        ];

        // Merge the defaults with the overrides
        $userData = array_merge($defaults, $overrides);

        // Create and return the user
        $user = User::create($userData);

        return $user;
    }

    /**
     * Helper method for creating organisations for tests
     *
     * @param array $overrides
     *
     * @return mixed
     */
    protected function createOrganisation($overrides=[])
    {
        $defaults = [
            'legal_name' => 'Some Law Firm Limited',
            'trading_name' => 'Some Law Firm',
        ];

        // Merge the defaults with the overrides
        $orgData = array_merge($defaults, $overrides);

        // Create and return the organisation
        $org = Organisation::create($orgData);

        return $org;
    }
}

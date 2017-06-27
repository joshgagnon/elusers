<?php

namespace Tests;

use App\Organisation;
use App\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Hash;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    private $emailIncrementer;

    /**
     * TestCase constructor.
     *
     * @param null   $name
     * @param array  $data
     * @param string $dataName
     */
    public function __construct($name = null, array $data = [], $dataName = '')
    {
        parent::__construct($name, $data, $dataName);

        $this->emailIncrementer = 0;
    }

    /**
     * Helper method for creating users for tests.
     *
     * @param array $overrides
     *
     * @return User
     */
    protected function createUser($overrides=[])
    {
        $defaults = [
            'title' => 'Mrs',
            'first_name' => 'Test',
            'middle_name' => 'One',
            'surname' => 'Two',
            'preferred_name' => 'Three',
            'email' => 'user' . ++$this->emailIncrementer . '@email.com', // use an incrementer to get unique, but not-random email addresses
            'password' => Hash::make('password'),
        ];

        // Merge the defaults with the overrides
        $userData = array_merge($defaults, $overrides);

        // Create and return the user
        $user = User::forceCreate($userData);

        return $user;
    }

    /**
     * Helper method for creating organisations for tests
     *
     * @param array $overrides
     *
     * @return Organisation
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

<?php

namespace App\Http\Controllers;

use App\User;
use Auth;

class UserController extends Controller
{
    /**
     * Get all users in the current organisation.
     *
     * @return \App\User[]
     */
    public function index()
    {
        $currentOrgId = Auth::user()->organisation_id;
        return User::inOrganisation($currentOrgId)->get();
    }

    /**
     * Get the current user.
     *
     * @return \App\User
     */
    public function current()
    {
        return Auth::user();
    }

    /**
     * Return an individual user.
     *
     * @param \App\User $user
     * @return \App\User
     */
    public function show(User $user)
    {
        // Check users are in the same org
        $usersInSameOrganisation = $user->organisation_id === Auth::user()->organisation_id;
        abort_if(!$usersInSameOrganisation, 404);

        // Return the user
        return $user;
    }
}

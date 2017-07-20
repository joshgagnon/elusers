<?php

namespace App\Http\Controllers;

use App\User;
use Auth;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Get all users in the current organisation.
     *
     * @return \App\User[]
     */
    public function index(Request $request)
    {
        $currentOrgId = $request->user()->organisation_id;

        return User::inOrganisation($currentOrgId)->get();
    }

    /**
     * Return an individual user.
     *
     * @param \App\User $user
     * @return \App\User
     */
    public function show(Request $request, User $user)
    {
        // Check users are in the same org
        $usersInSameOrganisation = $user->organisation_id === $request->user()->organisation_id;
        abort_if(!$usersInSameOrganisation, 404);

        // Return the user
        return $user;
    }
}

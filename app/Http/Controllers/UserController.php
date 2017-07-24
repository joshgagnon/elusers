<?php

namespace App\Http\Controllers;

use App\EmergencyContact;
use App\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
     * Update a user.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\User                $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, User $user)
    {
        $this->validate($request, User::$validationRules);

        $user->update($request->all());

        return response()->json(['message' => 'User updated.'], 200);
    }

    /**
     * Return an individual user.
     *
     * @param \App\User $user
     * @return \App\User
     */
    public function get(Request $request, User $user)
    {
        // Check users are in the same org
        $usersInSameOrganisation = $user->organisation_id === $request->user()->organisation_id;
        abort_if(!$usersInSameOrganisation, 404);

        // Return the user
        return $user;
    }

    /**
     * Create a new user.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $validationRules = array_merge(User::$validationRules, ['password' => 'required']);
        $this->validate($request, $validationRules);

        $data = $request->all();
        $user = new User($data);

        $user->organisation_id = $request->user()->organisation_id;
        $user->password = Hash::make($data['password']);

        $user->save();

        return response()->json(['message' => 'User created'], 201);
    }


    public function changePassword(Request $request, User $user)
    {
        $this->validate($request, [
            'current_password' => 'required',
            'new_password' => 'required',
            'new_password_confirmation' => 'required|same:new_password',
        ]);

        $data = $request->all();

        $currentPasswordMatches = Hash::check($data['current_password'], $user->password);

        if (!$currentPasswordMatches) {
            return response()->json(['current_password' => 'The current password doesn\'t match the user\'s current password'], 422);
        }

        $user->password = Hash::make($data['new_password']);
        $user->save();

        return response()->json(['message' => 'Password changed']);
    }
}

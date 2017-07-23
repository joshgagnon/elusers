<?php

namespace App\Http\Controllers;

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
        $this->validate($request, [
            'title'               => 'required|max:255',
            'first_name'          => 'required|max:255',
            'middle_name'         => 'required|max:255',
            'surname'             => 'required|max:255',
            'email'               => 'required|max:255|email',
            'law_admission_date'  => 'required|date',
            'ird_number'          => 'required|regex:/^[0-9]{8,9}$/',
            'bank_account_number' => 'required|regex:/^[0-9]{16}$/',
        ]);

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

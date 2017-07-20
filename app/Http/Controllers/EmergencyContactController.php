<?php

namespace App\Http\Controllers;

use App\EmergencyContact;
use App\User;
use Illuminate\Http\Request;

class EmergencyContactController extends Controller
{
    /**
     * Get the emergency contact for a user.
     *
     * @param \App\User $user
     * @return \App\EmergencyContact
     */
    public function get(User $user)
    {
        return $user->emergencyContact()->first();
    }

    /**
     * Update the emergency contact for a user.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\EmergencyContact    $contact
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, EmergencyContact $contact)
    {
        $this->validate($request, [
            'name'  => 'required|date',
            'email' => 'required|integer|min:1',
            'phone' => 'required|max:255',
        ]);

        $values = $request->only(['date', 'minutes', 'title', 'reflection']);
        $contact->update($values);

        return response()->json(['message' => 'Emergency contact updated.'], 200);
    }
}

<?php

namespace App\Http\Controllers;

use App\User;
use Auth;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

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
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     */
    public function show(User $user)
    {
        // Check the request user is in the logged-in user's organisation
        if ($user->organisation_id !== Auth::user()->organisation_id) {
            throw new NotFoundHttpException();
        }

        return $user;
    }
}

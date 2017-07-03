<?php

namespace App\Http\Controllers;

use App\User;

class ProfessionalDevelopmentController extends Controller
{
    public function forUser(User $user)
    {
        $records = $user->professionalDevelopmentRecords()->get();

        return [
            'records' => $records
        ];
    }
}

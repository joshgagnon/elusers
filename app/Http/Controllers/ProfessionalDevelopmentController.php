<?php

namespace App\Http\Controllers;

use App\Library\SQLFile;
use App\User;

class ProfessionalDevelopmentController extends Controller
{
    public function forUser(User $user)
    {
        $query = new SQLFile('user_cpdpr_summary', [$user->id]);
        $result = $query->get();

        $cpdpr_summary = $result[0]->user_pdr;

        return $cpdpr_summary;
    }
}

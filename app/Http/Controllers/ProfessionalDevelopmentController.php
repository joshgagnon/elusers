<?php

namespace App\Http\Controllers;

use App\User;
use Carbon\Carbon;

class ProfessionalDevelopmentController extends Controller
{
    public function forUser(User $user)
    {
        $yearStart = Carbon::parse('April 1');

        if ($yearStart->gt(Carbon::now())) {
            $yearStart->subYear();
        }

        $yearEnd = $yearStart->copy()->addYear()->subDay();

        $records = $user->professionalDevelopmentRecords()
                        ->where('date', '>=', $yearStart)
                        ->where('date', '<=', $yearEnd)
                        ->get();

        $subtotalMinutes = 0;

        foreach ($records as $record) {
            $subtotalMinutes += $record->minutes;
        }

        return [
            'subtotalMinutes' => $subtotalMinutes,
            'rolloverMinutes' => 10,
            'totalMinutes' => 10,
            'records' => $records,
        ];
    }
}

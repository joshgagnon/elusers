<?php

namespace App\Http\Controllers;

use App\Library\SQLFile;
use App\ProfessionalDevelopmentRecord;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ProfessionalDevelopmentController extends Controller
{
    public function forUser(User $user)
    {
        $query = new SQLFile('user_cpdpr_summary', [$user->id]);
        $result = $query->get();

        $cpdpr_summary = $result[0]->user_pdr;

        // Handle the case of no records
        if (!$cpdpr_summary) {
            $currentCPDPRYear = Carbon::now()->lt(Carbon::parse('31 March')) ? Carbon::now()->year : Carbon::now()->addYear()->year;

            return [[
                'minutes' => 0,
                'records' => [],
                'year_ending' => $currentCPDPRYear
            ]];
        }

        return $cpdpr_summary;
    }

    public function create(Request $request, User $user)
    {
        $values = $request->only(['date', 'minutes', 'title', 'reflection']);

        $this->validate($request, [
            'date'       => 'required|date',
            'minutes'    => 'required|integer|min:1',
            'title'      => 'required|max:255',
            'reflection' => 'required'
        ]);

        $values['date'] = Carbon::parse($values['date']); // because laravel date casting cant handle both dates and datetimes in the same model
        $user->professionalDevelopmentRecords()->create($values);

        return response()->json(['message' => 'CPDPR record created.'], 201);
    }

    public function delete(ProfessionalDevelopmentRecord $record)
    {
        $record->delete();
        return response()->json(['message' => 'CPDPR record deleted.'], 200);
    }
}

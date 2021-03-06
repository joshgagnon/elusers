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

    public function get(ProfessionalDevelopmentRecord $record)
    {
        $response = $record->toArray();
        $response['date'] = Carbon::parse($record->date)->format('d M Y');
        return $response;
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'user_id'    => 'required|exists:users,id',
            'date'       => 'required|date',
            'minutes'    => 'required|integer|min:1',
            'title'      => 'required|max:255',
            'reflection' => 'required',
        ]);

        $values = $request->only(['user_id', 'date', 'minutes', 'title', 'reflection']);

        $values['date'] = Carbon::parse($values['date']); // because laravel date casting cant handle both dates and datetimes in the same model
        $record = ProfessionalDevelopmentRecord::forceCreate($values);

        return response()->json(['message' => 'CPDPR record created.', 'record_id' => $record->id], 201);
    }

    public function update(Request $request, ProfessionalDevelopmentRecord $record)
    {
        $this->validate($request, [
            'date'       => 'required|date',
            'minutes'    => 'required|integer|min:1',
            'title'      => 'required|max:255',
            'reflection' => 'required'
        ]);

        $values = $request->only(['date', 'minutes', 'title', 'reflection']);

        $record->update($values);
        return response()->json(['message' => 'CPDPR record updated.'], 200);
    }

    public function delete(ProfessionalDevelopmentRecord $record)
    {
        $record->delete();
        return response()->json(['message' => 'CPDPR record deleted.'], 200);
    }
}

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

    }
}

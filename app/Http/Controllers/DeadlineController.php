<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Deadline;


class DeadlineController extends Controller
{
    public function index(Request $request)
    {
        if(!$request->user()->hasPermissionTo('view deadlines')) {
            abort(403);
        }
        return Deadline::where(['organisation_id' => $request->user()->organisation_id])->get();
    }

}
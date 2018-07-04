<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $loadData = [];
        $loadData['user'] = $request->user();

        return view('index')->with([
            'loadData' => json_encode($loadData)
        ]);
    }

    public function amlcft(Request $request)
    {

        $loadData = [];
        $loadData['user'] = false;
        return view('index')->with([
            'loadData' => json_encode($loadData)
        ]);
    }
}

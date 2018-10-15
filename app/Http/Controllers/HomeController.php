<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $loadData = [];
        $loadData['user'] = $request->user()->toArray();
        $loadData['user']['roles'] = $request->user()->roles->pluck('name');
        $loadData['user']['permissions'] = $request->user()->getAllPermissions()->pluck('name');

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
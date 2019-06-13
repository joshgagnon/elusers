<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ClientRequest;
use Illuminate\Support\Str;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $loadData = [];
        $loadData['user'] = $request->user()->toArray();
        $loadData['user']['roles'] = $request->user()->roles->pluck('name');
        $loadData['user']['permissions'] = $request->user()->getAllPermissions();

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


    public function startContact(Request $request)
    {
       $token = Str::random(40);
       ClientRequest::create(['token' => $token]);
       return redirect('contact-us/'.$token);
    }

    public function contact(Request $request)
    {
        $loadData = [];
        $loadData['user'] = false;
        return view('index')->with([
            'loadData' => json_encode($loadData)
        ]);
    }


}
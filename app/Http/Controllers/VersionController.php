<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class VersionController extends Controller
{
    public function index(Request $request)
    {
        $hash = (string)mix('main.js');

        return response()
            ->json(['ASSET_HASH' => $hash]);
    }
}

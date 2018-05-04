<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\RequestOptions;

class RenderController extends Controller
{
    public function render(Request $request)
    {
        $client = new Client();
        $res = $client->post('https://oddity.catalex.nz/render', [RequestOptions::JSON => $request->all()]);
        //return response($res->getBody())->withHeaders($res->getHeaders());
        return response($res->getBody())
            ->header('Content-Type', $res->getHeader('Content-Type'))
            ->header('Content-Disposition', $res->getHeader('Content-Disposition'));
    }
}

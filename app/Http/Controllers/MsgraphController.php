<?php

namespace App\Http\Controllers;

use DB;
use Dcblogdev\MsGraph\Facades\MsGraph;
use Facades\App\Library\MsGraphage;

class MsgraphController extends Controller
{
    public function connect()
    {
        return MsGraph::connect();
    }

    public function disconnect()
    {
        return MsGraph::disconnect('/', false);
    }

    public function search($skip=0)
    {
        $params = http_build_query([
            "\$top" => 1000,
            "\$skip" => $skip,
            "\$count" => "true",
        ]);
        return MsGraph::get('/me/messages?'.$params);


        $id = 'AQMkADAwATM0MDAAMS1kMDJkLWM1NQBiLTAwAi0wMAoARgAAA3AJdMcNnEpMnVRrB3uI4iQHAAAAQ2Is2WKxRYhozFpirrVfAAACAQkAAAFDYizZYrFFiGjMWmKutV8AA3sJI2EAAAA=';

        return MsGraphage::mime($id);
        $mime = MsGraph::get('/me/messages/'.$id.'/$value');
        return $mime;
        return MsGraph::emails()->find($id);
        dd(count($mime));

        return MsGraph::post('/search/query', [
            "requests" => [
                [
                    "entityTypes" => ["message"],
                    "query" => ["queryString" => "josh"],
                    "from" => 0,
                    "size" => 100
                ],
            ]
        ]);
    }

}
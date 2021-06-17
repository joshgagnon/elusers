<?php

namespace App\Http\Controllers;

use DB;
use Dcblogdev\MsGraph\Facades\MsGraph;

class MsgraphController extends Controller
{
    public function connect()
    {
        return MsGraph::connect();
    }

    public function disconnect()
    {
        return MsGraph::disconnect();
    }

    public function search()
    {
        /*
         * {
  "requests": [
    {
      "entityTypes": [
        "message"
      ],
      "query": {
        "queryString": "contoso"
      },
      "from": 0,
      "size": 25
    }
  ]
}
         */

        return MsGraph::post('/search/query', [
            "requests" => [
                [
                    "entityTypes" => ["messages"],
                    "query" => ["queryString" => "josh"],
                    "from" => 0,
                    "size" => 100
                ],

            ]
        ]);
    }

}
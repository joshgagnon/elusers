<?php

namespace App\Http\Controllers;

use DB;
use Dcblogdev\MsGraph\Facades\MsGraph;
use Facades\App\Library\MsGraphage;
use Illuminate\Http\Request;

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

    public function search(Request $request)
    {
        return MsGraph::post('/search/query', [
            "requests" => [
                [
                    "entityTypes" => ["message"],
                    "query" => ["queryString" => $request->query('query', '')],
                    "from" => 0,
                    "size" => 100
                ],
            ]
        ]);
    }

    public function mime(Request $request)
    {
        $results = MsGraph::get("/me/messages?\$filter=internetMessageId eq '".urlencode('<ME3P282MB0818F3252A79829FAE1C5F6DC0029@ME3P282MB0818.AUSP282.PROD.OUTLOOK.COM>')."'");
        $id = $results['value'][0]['id'];;
        return MsGraphage::mime($id);
    }
}
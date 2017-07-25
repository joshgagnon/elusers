<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Wiki;
use DB;
use Carbon\Carbon;

class WikiController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //return Wiki::select('title', 'categories->>0', 'path')->get();
        $record = DB::select('SELECT json_agg(x) as wiki from (select json_agg((SELECT x FROM (SELECT title, path order by title) x)) as articles, categories->>0 as category from wiki where deleted_at is null group by category) x');
        return json_decode($record[0]->wiki);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request, $url)
    {
        $values = array_merge($request->all(), ['path' => $url]);
        if(!$values['data']) {
            $values['data'] = '';
        }
        Wiki::where('path', $url)->delete();
        $record = Wiki::create($values);
        return response()->json(['message' => 'Wiki entry created', 'record_id' => $record->id], 201);
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function get($url)
    {
        $record = Wiki::where('path', $url)->first();
        if($record['categories']){
            $record = $record->toArray();
            $categories = json_decode($record['categories']);
            if(count($categories) && $categories[0]){
                $record['categoryGroup'] = DB::select('select title, path from wiki where categories->>0 = ? order by title', [$categories[0]]);
            }
        }
        return $record;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $url)
    {
        $values = array_merge($request->all(), ['path' => $url]);
        if(!$values['data']) {
            $values['data'] = '';
        }
        $date = Carbon::now();
        Wiki::where('path', $url)->update(['path' => $url.'/'.$date->timestamp, 'deleted_at' => $date]);
        $record = Wiki::create($values);
        return response()->json(['message' => 'Wiki entry updated'], 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}

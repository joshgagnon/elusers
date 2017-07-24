<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Wiki;

class WikiController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Wiki::select('title', 'path')->get();
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
        return Wiki::where('path', $url)->first();
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

        Wiki::where('path', $url)
          ->update($values);
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

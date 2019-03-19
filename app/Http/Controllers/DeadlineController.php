<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Deadline;


class DeadlineController extends Controller
{
    public function index(Request $request)
    {
        if(!$request->user()->hasPermissionTo('view deadlines')) {
            abort(403);
        }
        return Deadline::where(['organisation_id' => $request->user()->organisation_id])->get();
    }

    public function store(Request $request)
    {
        if(!$request->user()->hasPermissionTo('create deadline')) {
            abort(403);
        }

        $user = $request->user();
        $data = $request->allJson();

        $deadline = Deadline::create(array_merge(
            $data,
            [
                'created_by_user_id' =>  $user->id,
                'organisation_id' => $user->organisation_id
            ]
        ));

        // FILES
        //$fileIds = array_map(function($file) use ($user) {
        //    return $this->saveUploadedFile($file, $user)->id;
        //}, $request->file('file', []));

        //$deadline->files()->attach($fileIds);


        //$newNotes = array_map(function ($i) use ($user)  { 
        //    return array_merge($i, ['created_by_user_id' => $user->id]);
        //}, $data['notes'] ?? []);

        //$deadline->notes()->createMany($newNotes);

        return response()->json(['message' => 'Deadline created', 'id' => $deadline->id], 201);
    }

    public function update(Request $request, $id)
    {
        if(!$request->user()->hasPermissionTo('edit deadlines')) {
            abort(403);
        }
        $user = $request->user();
        $data = $request->allJson();
        $deadline = Deadline::where('id', $id)->where('organisation_id', $request->user()->organisation_id)->first();
        $deadline->update($data);
        return response()->json(['message' => 'Deadline updated', 'id' => $deadline->id], 201);
    }

    public function destroy(Request $request, $id) {
        $user = $request->user();
        if(!$request->user()->hasPermissionTo('edit deadlines')) {
            abort(403);
        }
        $deadline = Deadline::where('id', $id)->where('organisation_id', $request->user()->organisation_id)->first();
        #TODO, check edit permissions
        $deadline->delete();
        return response()->json(['message' => 'Deadline deleted']);
    }

}
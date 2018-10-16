<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Auth;
//Importing laravel-permission models
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

use Session;

class RoleController extends Controller {

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request) {
        $organisation_id = $request->user()->organisation_id;
        $roles = Role::where(function($q) use ($organisation_id) {
            $q
            ->where('organisation_id', null)
            ->orWhere('organisation_id', $organisation_id);
        })
        ->where(function($q) {
            $q
            ->where('protected', '!=', true)
            ->orWhere('protected', null);
        })->with('permissions')->get();

        $permissions = Permission::select('name','id', 'category')
            ->where(function($q) use ($organisation_id) {
                $q
                ->where('organisation_id', null)
                ->orWhere('organisation_id', $organisation_id);
            })
        ->where(function($q) {
            $q
            ->where('protected', '!=', true)
            ->orWhere('protected', null);
        })->get();
        return [
            'roles' => $roles,
            'permissions' => $permissions
        ];
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {
    //Validate name and permissions field
        $this->validate($request, [
            'name'=>'required'
            ]
        );

        $name = $request['name'];
        $role = new Role();
        $role->name = $name;
        $role->organisation_id = $request->user()->organisation_id;
        $role->protected = false;
        $permissions = $request['permissions'];

        $role->save();
    //Looping thru selected permissions
        foreach ($permissions as $permission) {
            $p = Permission::where('name', $permission)->first();
            if(!$p->protected) {
                $role->givePermissionTo($p);
            }
        }

        return $role;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id) {

        $role = Role::findOrFail($id);//Get role with the given id
    //Validate name and permission fields
        if($role->protected) {
            abort(403);
        }
        $this->validate($request, [
            'name'=>'required'
        ]);

        $input = $request->except(['permissions']);
        $permissions = $request['permissions'];
        $role->fill($input)->save();

        $p_all = Permission::all();//Get all permissions

        foreach ($p_all as $p) {
            $role->revokePermissionTo($p); //Remove all permissions associated with role
        }

        foreach ($permissions as $permission) {
            $p = Permission::where('name', $permission)->firstOrFail(); //Get corresponding form //permission in db
            if(!$p->protected) {
                $role->givePermissionTo($p);  //Assign permission to role
            }
        }

        return $role;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return response()->json(['message' => 'Role deleted', 'id' => $matter->id], 200);

    }
}
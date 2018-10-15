<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\User;
use App\Role;
use App\Permission;

class AdminPermissions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        $admin = Role::where(['name' => 'admin'])->first();
        $orgAdmin = Role::create(['name' => 'organisation admin']);

        Permission::create(['name' => 'administer roles']);
        Permission::create(['name' => 'administer permissions']);
        Permission::create(['name' => 'administer organisation']);
        Permission::create(['name' => 'administer organisation roles']);
        Permission::create(['name' => 'administer organisation permissions']);
        Permission::create(['name' => 'administer organisation users']);
        Permission::create(['name' => 'administer matters']);


        $admin->givePermissionTo('administer roles');
        $admin->givePermissionTo('administer permissions');
        $admin->givePermissionTo('administer organisation');
        $admin->givePermissionTo('administer organisation roles');
        $admin->givePermissionTo('administer organisation permissions');


        $orgAdmin->givePermissionTo('administer organisation roles');
        $orgAdmin->givePermissionTo('administer organisation permissions');
        $orgAdmin->givePermissionTo('administer organisation users');
        $orgAdmin->givePermissionTo('administer matters');
        try{
            User::where('email', 'thomas@evolutionlawyers.nz')->first()->assignRole([$admin, $orgAdmin]);
            User::where('email', 'josh@catalex.nz')->first()->assignRole($orgAdmin);
        }catch(e){};
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

    }
}

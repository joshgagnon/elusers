<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Role;
use App\Permission;


class MorePermissionsAgainWooo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Permission::where(['name' =>'view matter'])->delete();
        Permission::where(['name' => 'view matters'])->delete();
        $fixed = Permission::create(['name' => 'view matters', 'category' =>'matters']);
        $admin = Role::where(['name' => 'admin'])->first();
        $orgAdmin = Role::where(['name' => 'organisation admin'])->first();
        $admin->givePermissionTo(Permission::all());
        $orgAdmin->givePermissionTo($fixed);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}

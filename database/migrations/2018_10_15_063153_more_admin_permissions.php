<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\User;
use App\Role;
use App\Permission;

class MoreAdminPermissions extends Migration


{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        $admin = Role::where(['name' => 'admin'])->first();
        Permission::create(['name' => 'administer']);
        $admin->givePermissionTo('administer');


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

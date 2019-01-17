<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Role;
use App\Permission;


class DocumentPermissions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        $admin = Role::where(['name' => 'admin'])->first();
        $orgAdmin = Role::where(['name' => 'organisation admin'])->first();

        Permission::create(['name' => 'manage organisation documents']);

        $admin->givePermissionTo('manage organisation documents');
        $orgAdmin->givePermissionTo('manage organisation documents');
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

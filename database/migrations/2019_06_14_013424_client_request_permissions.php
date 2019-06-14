<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Role;
use App\Permission;


class ClientRequestPermissions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $perms = [
            Permission::create(['name' => 'view client requests']),
            Permission::create(['name' => 'process client requests'])
        ];

        $admin = Role::where(['name' => 'admin'])->first();
        $orgAdmin = Role::where(['name' => 'organisation admin'])->first();
        $admin->givePermissionTo(Permission::all());
        $orgAdmin->givePermissionTo($perms);

        Schema::table('client_requests', function(Blueprint $table)
        {
            $table->softDeletes();
        });

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

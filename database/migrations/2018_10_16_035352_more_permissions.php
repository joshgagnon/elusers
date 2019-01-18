<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Role;
use App\Permission;


class MorePermissions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->boolean('protected')->nullable()->defaultValue(false);
        });

        Schema::table('permissions', function (Blueprint $table) {
            $table->boolean('protected')->nullable()->defaultValue(false);
            $table->string('category')->nullable();
        });

        $admin = Role::where(['name' => 'admin'])->first();
        $admin->update(['protected' => true]);

        $admin = Role::where(['name' => 'organisation admin'])->first();
        $admin->update(['protected' => true]);

        $perm = Permission::where(['name' => 'administer roles']);
        $perm->update(['protected' => true]);

        $perm = Permission::where(['name' => 'administer permissions']);
        $perm->update(['protected' => true]);

        $perms = [Permission::create(['name' => 'view matters']),

        Permission::create(['name' => 'view matter', 'category' =>'matters']),
        Permission::create(['name' => 'create matter', 'category' =>'matters']),
        Permission::create(['name' => 'edit matters', 'category' =>'matters']),
        Permission::create(['name' => 'view contacts', 'category' =>'contacts']),
        Permission::create(['name' => 'create contact', 'category' =>'contacts']),
        Permission::create(['name' => 'edit contact', 'category' =>'contacts']),
        Permission::create(['name' => 'view deeds', 'category' =>'deeds']),
        Permission::create(['name' => 'create deed packet', 'category' =>'deeds']),
        Permission::create(['name' => 'create deed record', 'category' =>'deeds']),
        Permission::create(['name' => 'edit deed packet', 'category' =>'deeds']),
        Permission::create(['name' => 'edit deed record', 'category' =>'deeds']),
        Permission::create(['name' => 'create template', 'category' =>'templates'])];

        $admin = Role::where(['name' => 'admin'])->first();
        $orgAdmin = Role::where(['name' => 'organisation admin'])->first();
        $admin->givePermissionTo(Permission::all());
        $orgAdmin->givePermissionTo($perms);
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

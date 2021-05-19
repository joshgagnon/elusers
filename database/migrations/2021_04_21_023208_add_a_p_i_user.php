<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\User;
use App\Organisation;
use App\Role;
use App\Permission;



class AddAPIUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $apiAdmin = Role::create(['name' => 'organisation api']);
        $apiAdmin->givePermissionTo('administer matters');
        $evolutionLawyers = Organisation::where('legal_name', 'Evolution Lawyers')->first();

        $apiUser = User::forceCreate([
            'title' => 'Mr',
            'first_name' => 'Evolution',
            'surname' => 'API',
            'preferred_name' => 'Elf API',
            'email' => 'api@evolutionlawyers.nz',
            'password' => Hash::make('thiscanneverlogin'),
            'organisation_id' => $evolutionLawyers->id
        ]);
        $apiUser->roles()->save($apiAdmin);
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

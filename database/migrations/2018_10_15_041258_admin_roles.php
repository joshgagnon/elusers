<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

use App\User;
use App\Role;

class AdminRoles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {


        Schema::table('roles', function (Blueprint $table) {
            $table->integer('organisation_id')->nullable()->unsigned();
            $table->foreign('organisation_id')->references('id')->on('organisations')->onDelete('cascade');
        });

        Schema::table('permissions', function (Blueprint $table) {
            $table->integer('organisation_id')->nullable()->unsigned();
            $table->foreign('organisation_id')->references('id')->on('organisations')->onDelete('cascade');
        });
       Role::create(['name' => 'admin']);

       $user = User::where('email', 'josh@catalex.nz')->first();
       if($user){
            $user->assignRole('admin');
       }

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

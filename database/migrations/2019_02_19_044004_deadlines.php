<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Role;
use App\Permission;



class Deadlines extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('deadlines', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->dateTime('resolved_at')->nullable();

            $table->string('title');
            $table->string('description')->nullable();
            $table->integer('created_by_user_id')->unsigned();
            $table->foreign('created_by_user_id')->references('id')->on('users')->onDelete('cascade');

            $table->integer('organisation_id')->unsigned();
            $table->foreign('organisation_id')->references('id')->on('organisations')->onDelete('cascade');
        });

        $admin = Role::where(['name' => 'admin'])->first();
        $orgAdmin = Role::where(['name' => 'organisation admin'])->first();

        Permission::create(['name' => 'view deadlines', 'category' => 'deadlines']);
        $admin->givePermissionTo('view deadlines');
        $orgAdmin->givePermissionTo('view deadlines');
        Permission::create(['name' => 'edit deadlines', 'category' => 'deadlines']);
        $admin->givePermissionTo('edit deadlines');
        $orgAdmin->givePermissionTo('edit deadlines');
        Permission::create(['name' => 'create deadline', 'category' => 'deadlines']);
        $admin->givePermissionTo('create deadline');
        $orgAdmin->givePermissionTo('create deadline');


    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('deadlines');
    }
}

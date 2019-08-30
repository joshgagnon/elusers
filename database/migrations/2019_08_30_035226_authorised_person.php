<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AuthorisedPerson extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('matter_clients', function (Blueprint $table) {
            $table->integer('authorised_contact_id')->unsigned()->nullable();
            $table->foreign('authorised_contact_id')->references('id')->on('contacts')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('matter_clients', function (Blueprint $table) {
            //
        });
    }
}

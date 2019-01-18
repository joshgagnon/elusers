<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Individuals extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contact_individual', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->softDeletes();
            $table->string('title')->nullable();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('surname');
            $table->string('occupation')->nullable();
            $table->string('gender')->nullable();
            $table->enum('marital_status', ['single', 'de facto', 'married', 'divorced', 'widow(er)']);
            $table->string('county_of_citizenship')->nullable();
            $table->date('date_of_birth');
            $table->date('date_of_death');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contact_individual');
    }
}

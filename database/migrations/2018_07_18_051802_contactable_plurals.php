<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ContactablePlurals extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('contact_company');
        Schema::create('contact_companies', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->softDeletes();
            $table->string('companyNumber')->nullable();
            $table->boolean('enhanced_cdd_required')->default(false);
            $table->string('enhanced_cdd_reason')->nullable();
            $table->string('source_of_funds')->nullable();
        });
        Schema::dropIfExists('contact_individual');
        Schema::create('contact_individuals', function (Blueprint $table) {
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

    }
}

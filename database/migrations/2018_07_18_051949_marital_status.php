<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MaritalStatus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::table('contact_individuals', function (Blueprint $table) {
            $table->dropColumn('marital_status');
        });

        Schema::table('contact_individuals', function (Blueprint $table) {

            $table->enum('marital_status', ['single', 'de facto', 'married', 'divorced', 'widow(er)'])->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('contact_individuals', function (Blueprint $table) {
            //
        });
    }
}

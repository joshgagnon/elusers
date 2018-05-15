<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddressFormat extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->renameColumn('address_three', 'city');
            $table->string('county')->nullable();
            $table->string('state')->nullable();
            $table->renameColumn('country_code', 'country');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->renameColumn('city', 'address_three');
            $table->dropColumnn('county');
            $table->dropColumn('state');
            $table->renameColumn('country', 'country_code');
        });
    }
}

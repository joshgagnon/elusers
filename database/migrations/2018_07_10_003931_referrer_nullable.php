<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ReferrerNullable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('matters', function (Blueprint $table) {
            $table->integer('referrer_id')->unsigned()->nullable()->change();;
            $table->string('referrer_type')->nullable()->change();;
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('matters', function (Blueprint $table) {
            //
        });
    }
}

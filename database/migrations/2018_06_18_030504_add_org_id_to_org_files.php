<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddOrgIdToOrgFiles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('organisation_files', function (Blueprint $table) {
            $table->integer('organisation_id')->unsigned();
            $table->foreign('organisation_id')->references('id')->on('files')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('organisation_files', function (Blueprint $table) {
            $table->dropColumn(organisation_id);
        });
    }
}

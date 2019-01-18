<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddOfficeLocationToDeedPacketRecords extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('deed_packet_records', function (Blueprint $table) {
            $table->integer('office_location_id')->unsigned();
            $table->foreign('office_location_id')->references('id')->on('office_locations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('deed_packet_records', function (Blueprint $table) {
            $table->dropColumn(['office_location_id']); // since the first argument is an array, the foreign key is automatically dropped.
        });
    }
}

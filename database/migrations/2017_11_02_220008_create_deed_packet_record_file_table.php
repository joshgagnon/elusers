<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDeedPacketRecordFileTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('deed_packet_record_file', function (Blueprint $table) {
            $table->integer('deed_packet_record_id')->unsigned();
            $table->foreign('deed_packet_record_id')->references('id')->on('deed_packet_records')->onDelete('cascade');

            $table->integer('file_id')->unsigned();
            $table->foreign('file_id')->references('id')->on('files')->onDelete('cascade');

            $table->primary(['deed_packet_record_id', 'file_id']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('deed_packet_record_file');
    }
}

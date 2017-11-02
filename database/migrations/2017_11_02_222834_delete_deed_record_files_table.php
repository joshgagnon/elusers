<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DeleteDeedRecordFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('deed_record_files');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('deed_record_files', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('deed_packet_record_id')->unsigned();
            $table->foreign('deed_packet_record_id')->references('id')->on('deed_packet_records')->onDelete('cascade');

            $table->text('path');

            $table->timestamps();
            $table->softDeletes();
        });
    }
}

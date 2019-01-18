<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateContactDeedPacketTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contact_deed_packet', function (Blueprint $table) {
            $table->integer('contact_id')->unsigned();
            $table->foreign('contact_id')->references('id')->on('contacts')->onDelete('cascade');

            $table->integer('deed_packet_id')->unsigned();
            $table->foreign('deed_packet_id')->references('id')->on('deed_packets')->onDelete('cascade');

            $table->primary(['contact_id', 'deed_packet_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contact_deed_packet');
    }
}

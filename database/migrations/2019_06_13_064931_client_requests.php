<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ClientRequests extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('client_requests', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('token')->unique();
            $table->json('data')->nullable();
            $table->boolean('submitted')->default('false');
        });

        Schema::create('client_request_files', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('file_id')->unsigned();
            $table->integer('client_request_id')->unsigned();
            $table->foreign('file_id')->references('id')->on('files')->onDelete('cascade');
            $table->foreign('client_request_id')->references('id')->on('client_requests')->onDelete('cascade');

        });



    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
          Schema::dropIfExists('client_request_files');
          Schema::dropIfExists('client_requests');
    }
}

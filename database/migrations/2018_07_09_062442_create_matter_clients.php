<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMatterClients extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('matter_clients', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('matter_id')->unsigned();
            $table->foreign('matter_id')->references('id')->on('matters')->onDelete('cascade');
            $table->integer('contact_id')->unsigned();
            $table->foreign('contact_id')->references('id')->on('contacts')->onDelete('cascade');
            $table->enum('capacity',[
                'personally',
                'as_trustee'
            ]);
            $table->json('attributes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('matter_clients');
    }
}

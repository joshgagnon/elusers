<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ContactRelationships extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contact_relationships', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('first_contact_id')->unsigned();
            $table->integer('second_contact_id')->unsigned();
            $table->foreign('first_contact_id')->references('id')->on('contacts')->onDelete('cascade');
            $table->foreign('second_contact_id')->references('id')->on('contacts')->onDelete('cascade');
            $table->string('relationship_type');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contact_relationships');
    }
}

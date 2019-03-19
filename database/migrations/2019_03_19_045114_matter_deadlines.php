<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MatterDeadlines extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
          Schema::create('matter_deadlines', function(Blueprint $table)
          {
              $table->integer('matter_id')->unsigned()->nullable();
              $table->foreign('matter_id')->references('id')
                    ->on('matters')->onDelete('cascade');

              $table->integer('deadline_id')->unsigned()->nullable();
              $table->foreign('deadline_id')->references('id')
                    ->on('deadlines')->onDelete('cascade');

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
        //
    }
}

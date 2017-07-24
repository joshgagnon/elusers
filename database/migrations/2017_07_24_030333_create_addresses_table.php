<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAddressesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->increments('id');

            $table->text('address_name')->nullable();
            $table->text('dpid')->nullable();
            $table->text('address_one');
            $table->text('address_two')->nullable();
            $table->text('address_three')->nullable();
            $table->text('address_type');
            $table->text('post_code');
            $table->text('country_code');

            $table->integer('addressable_id')->unsigned();
            $table->text('addressable_type');

            $table->softDeletes();
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
        Schema::dropIfExists('addresses');
    }
}

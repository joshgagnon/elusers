<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ContactTrusts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contact_trusts', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('trust_type');
            $table->boolean('enhanced_cdd_required')->default(false);
            $table->string('enhanced_cdd_reason')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contact_trusts');
    }
}

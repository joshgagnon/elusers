<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MoveCdd extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->string('enhanced_cdd_reason')->nullable();
            $table->boolean('enhanced_cdd_required')->default(false);
            $table->string('source_of_funds')->nullable();
        });

        Schema::table('contact_trusts', function (Blueprint $table) {
            $table->dropColumn('enhanced_cdd_reason');
            $table->dropColumn('enhanced_cdd_required');
            $table->dropColumn('source_of_funds');
        });

        Schema::table('contact_companies', function (Blueprint $table) {
            $table->dropColumn('enhanced_cdd_reason');
            $table->dropColumn('source_of_funds');
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

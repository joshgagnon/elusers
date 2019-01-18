<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ContactTrustFieldsFix extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('contact_trusts', function (Blueprint $table) {
            $table->renameColumn('clause_of_trust_deeds', 'clause_of_trust_deed');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('contact_trusts', function (Blueprint $table) {
            //
        });
    }
}

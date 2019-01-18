<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AccessTokenFileFix extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('access_token_files', function (Blueprint $table) {
            //
            $table->dropForeign('access_token_files_access_token_id_foreign');
            $table->foreign('access_token_id')->references('id')->on('access_tokens')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('access_token_files', function (Blueprint $table) {
            //
        });
    }
}

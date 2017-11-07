<?php

use App\Library\EncryptionKey;
use App\Organisation;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddEncryptionKeyToOrganisations extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('organisations', function (Blueprint $table) {
            $table->text('encryption_key')->nullable();
        });

        $organisations = Organisation::get();

        foreach ($organisations as $org) {
            $org->encryption_key = EncryptionKey::create();
            $org->save();
        }

        Schema::table('organisations', function (Blueprint $table) {
            $table->text('encryption_key')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('organisations', function (Blueprint $table) {
            $table->dropColumn('encryption_key');
        });
    }
}

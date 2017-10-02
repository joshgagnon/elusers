<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class NewChangesToDeedFiles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::rename('deed_files', 'deed_packets');
        Schema::rename('deed_file_records', 'deed_packet_records');

        Schema::table('deed_packet_records', function(Blueprint $table) {
            $table->renameColumn('archive_date', 'destruction_date');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('deed_packet_records', function(Blueprint $table) {
            $table->renameColumn('destruction_date', 'archive_date');
        });

        Schema::rename('deed_packets', 'deed_files');
        Schema::rename('deed_packet_records', 'deed_file_records');
    }
}

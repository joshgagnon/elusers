<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class FixDeedFiles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::drop('deed_files');
        Schema::drop('clients');

        Schema::create('deed_files', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('created_by_user_id')->unsigned();
            $table->foreign('created_by_user_id')->references('id')->on('users')->onDelete('cascade');

            $table->text('title');

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('deed_file_records', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('created_by_user_id')->unsigned();
            $table->foreign('created_by_user_id')->references('id')->on('users')->onDelete('cascade');

            $table->integer('deed_file_id')->unsigned();
            $table->foreign('deed_file_id')->references('id')->on('deed_files')->onDelete('cascade');

            $table->text('document_name');
            $table->date('document_date');
            $table->text('parties');
            $table->text('matter_id');
            $table->date('archive_date');

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
        Schema::drop('deed_file_records');
        Schema::drop('deed_files');

        Schema::create('clients', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('created_by_user_id')->unsigned();
            $table->foreign('created_by_user_id')->references('id')->on('users')->onDelete('cascade');

            $table->text('title');

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('deed_files', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('client_id')->unsigned();
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('cascade');

            $table->integer('created_by_user_id')->unsigned();
            $table->foreign('created_by_user_id')->references('id')->on('users')->onDelete('cascade');

            $table->date('document_date');
            $table->text('parties');
            $table->text('matter');

            $table->timestamps();
            $table->softDeletes();
        });
    }
}

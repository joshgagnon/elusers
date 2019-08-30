<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CddOtherEnum extends Migration
{

    protected function alterEnum($table, $field, array $options) {

        $check = "${table}_${field}_check";

        $enumList = [];

        foreach($options as $option) {
            $enumList[] = sprintf("'%s'::CHARACTER VARYING", $option);
        }

        $enumString = implode(", ", $enumList);

        DB::transaction(function () use ($table, $field, $check, $options, $enumString) {
            DB::statement(sprintf('ALTER TABLE %s DROP CONSTRAINT %s;', $table, $check));
            DB::statement(sprintf('ALTER TABLE %s ADD CONSTRAINT %s CHECK (%s::TEXT = ANY (ARRAY[%s]::TEXT[]))', $table, $check, $field, $enumString));
        });

    }

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('contacts', function (Blueprint $table) {
            $this->alterEnum('contacts', 'cdd_type', ['Simplified', 'Standard', 'Enhanced', 'Other']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('contacts', function (Blueprint $table) {
            //
        });
    }
}

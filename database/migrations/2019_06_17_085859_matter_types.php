<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MatterTypes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::table('matters', function (Blueprint $table) {
            $table->enum('matter_typex', [
                "Bankruptcy and Liquidation",
                "Business Acquisitions and Investment",
                "Commercial Advice",
                "Commercial Documentation",
                "Company Governance and Shareholding",
                "Company Incorporation and Administration",
                "Conveyancing – Sale / Purchase",
                "Conveyancing – Refinance",
                "Criminal Process",
                "Debt Recovery",
                "Disputes and Litigation",
                "Employment",
                "General Advice",
                "Insolvency Advice",
                "Relationship Property",
                "Property Advice",
                "Wills and Estates",
                "Trust Advice",
                "Trust Creation and Administration",
                "Other"
            ])->nullable();
        });

        DB::statement("UPDATE matters SET matter_typex = matter_type;");


        Schema::table('matters', function (Blueprint $table) {
            $table->dropColumn('matter_type');
        });

        Schema::table('matters', function (Blueprint $table) {
            $table->renameColumn('matter_typex', 'matter_type');
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

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMatters extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('matters', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('matter_name');
            $table->enum('matter_type', [
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
                "Trust Creation and Administration"
            ]);
            $table->integer('creator_id')->unsigned();
            $table->foreign('creator_id')->references('id')->on('users')->onDelete('cascade');
            //referrer
            //contact or user
            $table->integer('referrer_id')->unsigned();
            $table->string('referrer_type');

            //client_ids  -- contacts
            // agent_ids -- contact
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('matters');
    }
}

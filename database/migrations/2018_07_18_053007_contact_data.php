<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ContactData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        DB::beginTransaction();
       foreach(App\Contact::all() as $contact){
            if($contact->type == 'individual'){
                $individual = App\ContactIndividual::create($contact->toArray());
                $individual->contact()->save($contact);
            }
            else{
                $company = App\ContactCompany::create($contact->toArray());
                $company->contact()->save($contact);
            }
       }
       DB::commit();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::rollBack();
        //
    }
}

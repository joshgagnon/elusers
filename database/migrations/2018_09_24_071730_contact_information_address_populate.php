<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Contact;
use App\ContactInformation;


class ContactInformationAddressPopulate extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        $contacts = Contact::all();
        foreach($contacts as $contact) {

            foreach($contact->addresses as $address){

                $info = new ContactInformation([
                    'type' => 'address',
                    'data' => [
                        'subtype' => 'Postal',
                        'addressOne' => $address->address_one,
                        'addressTwo' => $address->address_two,
                        'city' => $address->city,
                        'postCode' => $address->post_code,
                        'county' => $address->county,
                        'country' => $address->country,
                        'state' => $address->state
                    ]
                ]);
                $info->save();
                $contact->contactInformations()->attach($info->id);
            }
        }

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

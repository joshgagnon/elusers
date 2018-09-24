<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Contact;
use App\ContactInformation;

class ContactInformationPopulate extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        $contacts = Contact::all();
        foreach($contacts as $contact) {
            if($contact->email) {
                $info = new ContactInformation([
                    'type' => 'email',
                    'data' => [
                        'email' => $contact->email
                    ]
                ]);
                $info->save();
                $contact->contactInformations()->attach($info->id);
            }
            if($contact->phone) {
                $info = new ContactInformation([
                    'type' => 'phone',
                    'data' => [
                        'subtype' => 'work',
                        'phone' => $contact->phone
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

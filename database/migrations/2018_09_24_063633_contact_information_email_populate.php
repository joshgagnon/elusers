<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Contact;
use App\ContactInformation;

class ContactInformationEmailPopulate extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        ContactInformation::whereNotNull('id')->delete();
        $contacts = Contact::all();
        foreach($contacts as $contact) {


            if($contact->email) {
                $emails = preg_split("/ /", $contact->email, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);
                foreach($emails as $email) {
                    $info = new ContactInformation([
                        'type' => 'email',
                        'data' => [
                            'email' => $email
                        ]
                    ]);
                    $info->save();
                    $contact->contactInformations()->attach($info->id);
                }
            }

            if($contact->phone) {

                $numbers = preg_split("/\[([^]]+)] /", $contact->phone, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);
                if(count($numbers)) {
                    if(count($numbers) === 1) {
                        $info = new ContactInformation([
                            'type' => 'phone',
                            'data' => [
                                'subtype' => 'Mobile',
                                'phone' => $contact->phone
                            ]
                        ]);
                        $info->save();
                        $contact->contactInformations()->attach($info->id);
                    }
                    else{
                        for ($n = 0; $n < count($numbers); $n+=2) {

                            $info = new ContactInformation([
                                'type' => 'phone',
                                'data' => [
                                    'subtype' => $numbers[$n],
                                    'phone' => $numbers[$n+1]
                                ]
                            ]);
                            $info->save();
                            $contact->contactInformations()->attach($info->id);
                        }
                    }


                }

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
<?php

use App\Contact;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Contact::create([
            'organisation_id' => 1,
            'name' => 'Elliott Murphy',
            'email' => 'elliott@murphy.com',
            'phone' => '021 111 1111',
        ]);

        Contact::create([
            'organisation_id' => 1,
            'name' => 'Jess Johnson',
            'email' => 'jess@johnson.com',
            'phone' => '021 222 2222',
        ]);

        Contact::create([
            'organisation_id' => 1,
            'name' => 'Mia Martin',
            'email' => 'mia@martin.com',
            'phone' => '021 333 3333',
        ]);
    }
}

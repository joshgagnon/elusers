<?php

use App\Organisation;
use App\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $evolutionLawyers = Organisation::where('legal_name', 'Evolution Lawyers Limited')->first();

        User::create([
            'title' => 'Mr',
            'first_name' => 'Thomas',
            'middle_name' => 'David',
            'surname' => 'Bloy',
            'preferred_name' => 'Tom',
            'email' => 'thomas@evolutionlawyers.nz',
            'password' => Hash::make('password'),
            'organisation_id' => $evolutionLawyers->id,
            'law_admission_date' => '30 Sep 2011',
            'ird_number' => '07441122',
            'bank_account_number' => '0905219955005000',
        ]);

        User::create([
            'title' => 'Ms',
            'first_name' => 'Tamina',
            'middle_name' => 'Kelly',
            'surname' => 'Cunningham-Adams',
            'email' => 'tamina@evolutionlawyers.nz',
            'password' => Hash::make('password'),
            'organisation_id' => $evolutionLawyers->id,
        ]);

        User::create([
            'title' => 'Mr',
            'first_name' => 'Patrick',
            'middle_name' => 'Daniel',
            'surname' => 'Moran',
            'email' => 'paddy@catalex.nz',
            'preferred_name' => 'Paddy',
            'password' => Hash::make('password'),
            'organisation_id' => $evolutionLawyers->id,
        ]);

        User::create([
            'title' => 'Mr',
            'first_name' => 'Joshua',
            'middle_name' => 'Normand',
            'surname' => 'Gagnon',
            'email' => 'josh@catalex.nz',
            'preferred_name' => 'Josh',
            'password' => Hash::make('password'),
            'organisation_id' => $evolutionLawyers->id,
        ]);

        User::create([
            'title' => 'Ms',
            'first_name' => 'Sarah',
            'surname' => 'Thompson',
            'email' => 'me@no-middle-name.nz',
            'password' => Hash::make('password'),
            'organisation_id' => $evolutionLawyers->id,
        ]);
    }
}

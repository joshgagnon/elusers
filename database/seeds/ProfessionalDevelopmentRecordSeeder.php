<?php

use App\ProfessionalDevelopmentRecord;
use App\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ProfessionalDevelopmentRecordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user1 = User::find(1);

        ProfessionalDevelopmentRecord::forceCreate([
            'user_id' => $user1->id,
            'title' => 'Training of some form',
            'date' => Carbon::parse('16 June 2017'),
            'minutes' => 120,
            'reflection' => 'Something about someone',
        ]);

        ProfessionalDevelopmentRecord::forceCreate([
            'user_id' => $user1->id,
            'title' => 'Training of some other form',
            'date' => Carbon::parse('15 June 2017'),
            'minutes' => 90,
            'reflection' => 'Something about someone',
        ]);

        ProfessionalDevelopmentRecord::forceCreate([
            'user_id' => $user1->id,
            'title' => 'Five six seven eight',
            'date' => Carbon::parse('1 March 2016'),
            'minutes' => 180,
            'reflection' => 'Something about someone',
        ]);

        ProfessionalDevelopmentRecord::forceCreate([
            'user_id' => $user1->id,
            'title' => 'One two thre four',
            'date' => Carbon::parse('31 October 2016'),
            'minutes' => 150,
            'reflection' => 'Something about someone',
        ]);
    }
}

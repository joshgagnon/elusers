<?php

use App\ProfessionalDevelopmentRecord;
use App\User;
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
        $user1 = User::first();

        $user1Records = [];

        // 2017 - 2018: 3.5
        $user1Records[] = ['date' => '16 Jun 2017', 'minutes' => 120, 'title' => 'Training of some form', 'reflection' => 'Something about someone'];
        $user1Records[] = ['date' => '15 Jun 2017', 'minutes' => 90, 'title' => 'Training of some other form', 'reflection' => 'Something about someone'];

        // 2016 - 2017: 11.5
        $user1Records[] = ['date' => '31 Oct 2016', 'minutes' => 210, 'title' => 'Criminal Law - discharge without conviction', 'reflection' => 'Something about someone'];
        $user1Records[] = ['date' => '01 Mar 2017', 'minutes' => 180, 'title' => 'Employment Law Pleadings', 'reflection' => 'Something about someone'];
        $user1Records[] = ['date' => '31 Oct 2016', 'minutes' => 300, 'title' => 'Newton\'s law of universal gravitation', 'reflection' => 'Something about someone'];

        // 2015 - 2016: 15
        $user1Records[] = ['date' => '01 Mar 2016', 'minutes' => 210, 'title' => 'Five six seven eight', 'reflection' => 'Something about someone'];
        $user1Records[] = ['date' => '19 Nov 2015', 'minutes' => 150, 'title' => 'Five six seven eight', 'reflection' => 'Something about someone'];
        $user1Records[] = ['date' => '21 Sep 2015', 'minutes' => 300, 'title' => 'Five six seven eight', 'reflection' => 'Something about someone'];
        $user1Records[] = ['date' => '02 Aug 2015', 'minutes' => 60, 'title' => 'Five six seven eight', 'reflection' => 'Something about someone'];
        $user1Records[] = ['date' => '23 Feb 2016', 'minutes' => 180, 'title' => 'Five six seven eight', 'reflection' => 'Something about someone'];

        // 2014 - 2015: skip a year

        // 2013 - 2014: 17
        $user1Records[] = ['date' => '22 Jan 2014', 'minutes' => 210, 'title' => 'Five six seven eight', 'reflection' => 'Something about someone'];
        $user1Records[] = ['date' => '19 Apr 2013', 'minutes' => 150, 'title' => 'Five six seven eight', 'reflection' => 'Something about someone'];
        $user1Records[] = ['date' => '22 May 2013', 'minutes' => 300, 'title' => 'Five six seven eight', 'reflection' => 'Something about someone'];
        $user1Records[] = ['date' => '31 Mar 2014', 'minutes' => 360, 'title' => 'Five six seven eight', 'reflection' => 'Something about someone'];


        foreach ($user1Records as $record) {
            $record['user_id'] = $user1->id;
            ProfessionalDevelopmentRecord::forceCreate($record);
        }
    }
}

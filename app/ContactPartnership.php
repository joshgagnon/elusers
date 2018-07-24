<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class ContactPartnership extends Model
{

    #protected $fillable = [];

    public static $validationRules = [
    ];


    public function contact() {
        return $this->morphOne(Contact::class, 'contactable');
    }
}
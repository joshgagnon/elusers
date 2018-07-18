<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class ContactCompany extends Model
{

    protected $fillable = ['company_number', 'enhanced_ccd_required', 'enhanced_cdd_reason', 'source_of_funds'];

    public static $validationRules = [
    ];



    public function contact() {
        return $this->morphOne(Contact::class, 'contactable');
    }
}
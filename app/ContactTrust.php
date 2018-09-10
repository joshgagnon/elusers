<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class ContactTrust extends Model
{

    protected $fillable = ['trust_type', 'enhanced_ccd_required', 'enhanced_cdd_reason', 'source_of_funds', 'clause_of_trust_deed'];

    public static $validationRules = [
    ];


    public function contact() {
        return $this->morphOne(Contact::class, 'contactable');
    }
}
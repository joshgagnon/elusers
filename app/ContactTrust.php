<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use OwenIt\Auditing\Contracts\Auditable;
class ContactTrust extends Model  implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    protected $fillable = ['trust_type', 'clause_of_trust_deed'];

    public static $validationRules = [
    ];


    public function contact() {
        return $this->morphOne(Contact::class, 'contactable');
    }
}
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use OwenIt\Auditing\Contracts\Auditable;
class ContactCompany extends Model  implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    protected $fillable = ['company_number'];

    public static $validationRules = [
    ];



    public function contact() {
        return $this->morphOne(Contact::class, 'contactable');
    }
}
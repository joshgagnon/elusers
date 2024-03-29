<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use OwenIt\Auditing\Contracts\Auditable;
class ContactIndividual extends Model  implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    protected $fillable = ['first_name', 'middle_name', 'surname', 'date_of_birth', 'date_of_death', 'occupation', 'gender', 'marital_status', 'country_of_citizenship', 'preferred_name'];

    public static $validationRules = [
    ];
    protected $dates = [
        'date_of_birth',
        'date_of_death',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    protected $casts = [
        'date_of_birth' => 'datetime:d M Y',
        'date_of_death' => 'datetime:d M Y',
    ];

    public function setDateOfBirthAttribute($value)
    {
        $this->attributes['date_of_birth'] = $this->parseDate($value);
    }

    public function setDateOfDeathAttribute($value)
    {
        $this->attributes['date_of_death'] = $this->parseDate($value);
    }

/*
    public function getDateOfBirthAttribute()
    {
        return $this->parseDate($value);
    }
*/
    public function parseDate($date=null)
    {
        if(isset($date))
        {
            try{
                return Carbon::createFromFormat('d M Y',$date);
            }
            catch (\Exception $e) {
                return Carbon::parse($date);
            }
        }
        return null;
    }

    public function contact() {
        return $this->morphOne(Contact::class, 'contactable');
    }
}
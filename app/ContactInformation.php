<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;

class ContactInformation extends Model  implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    use SoftDeletes;

    protected $casts = [
        'data' => 'array',
    ];

    protected $fillable = ['type', 'data'];

    public static $validationRules = [
    ];
    protected $table = 'contact_information';

}
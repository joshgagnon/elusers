<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;


class ContactInformation extends Model
{
    use SoftDeletes;

    protected $casts = [
        'data' => 'array',
    ];

    protected $fillable = ['type', 'data'];

    public static $validationRules = [
    ];
    protected $table = 'contact_information';

}
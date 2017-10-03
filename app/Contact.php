<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $fillable = ['name', 'email', 'phone', 'organisation_id'];

    public function organisation()
    {
        return $this->belongsTo(Organisation::class);
    }
}

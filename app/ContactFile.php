<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ContactFile extends Model
{
    protected $fillable = [];

    public function file()
    {
        return $this->belongsTo(File::class);
    }

    public function contact()
    {
        return $this->belongsTo(Contact::class);
    }
}

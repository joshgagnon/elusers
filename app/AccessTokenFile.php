<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AccessTokenFile extends Model
{
    protected $fillable = [];

    public function file()
    {
        return $this->belongsTo(File::class);
    }
}

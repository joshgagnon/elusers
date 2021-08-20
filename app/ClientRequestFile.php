<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClientRequestFile extends Model q
{
    protected $fillable = [];

    public function file()
    {
        return $this->belongsTo(File::class);
    }
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClientRequestFile extends Model
{
    protected $fillable = [];

    public function file()
    {
        return $this->belongsTo(File::class);
    }
}

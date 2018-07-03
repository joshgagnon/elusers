<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AccessToken extends Model
{
    protected $fillable = ['token', 'data'];

   public function model()
    {
        return $this->morphTo();
    }
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AccessToken extends Model
{
    protected $fillable = ['token', 'data'];
    protected $visible = ['token', 'data'];

   public function model()
    {
        return $this->morphTo();
    }

    public function files()
    {
        return $this->hasMany(AccessTokenFile::class);
    }

}

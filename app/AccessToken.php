<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AccessToken extends Model
{
    protected $fillable = ['token', 'data', 'submitted'];
    protected $visible = ['token', 'data', 'submitted'];
    protected $casts = [
        'data' => 'array',
    ];

   public function model()
    {
        return $this->morphTo();
    }

    public function files()
    {
        return $this->hasMany(AccessTokenFile::class);
    }

}

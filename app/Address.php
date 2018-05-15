<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = ['address_name', 'address_one', 'address_two', 'city', 'county', 'state', 'address_type', 'post_code', 'country'];

    protected $visible = ['id', 'address_name', 'address_one', 'address_two', 'city', 'county', 'state', 'address_type', 'post_code', 'country'];

    public function addressable()
    {
        return $this->morphTo();
    }
}

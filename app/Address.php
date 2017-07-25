<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = ['address_name', 'address_one', 'address_two', 'address_three', 'address_type', 'post_code', 'country_code'];

    protected $visible = ['id', 'address_name', 'address_one', 'address_two', 'address_three', 'address_type', 'post_code', 'country_code'];

    public function addressable()
    {
        return $this->morphTo();
    }
}

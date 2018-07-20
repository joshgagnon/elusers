<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Contact extends Model
{

    protected $fillable = ['name', 'email', 'phone', 'organisation_id',  'metadata', 'agent_id', 'amlcft_complete'];

    public static $validationRules = [
    ];

    /**
     * Organisation relationship: a contact belongs to an organisation.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function organisation()
    {
        return $this->belongsTo(Organisation::class);
    }

    public function addresses()
    {
        return $this->morphMany(Address::class, 'addressable');
    }

    /**
     * Deed packet relationship: a contact belongs to many deed packets.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function deedPackets()
    {
        return $this->belongsToMany(DeedPacket::class);
    }

    public function files()
    {
        return $this->hasMany(ContactFile::class);
    }

    public function accessTokens()
    {
        return $this->morphMany(AccessToken::class, 'model');
    }


    public function tokenExtras() {
        $this->load('addresses');
        $this->load('contactable');
        return $this;
    }


    public function contactable()
    {
        return $this->morphTo();
    }


}



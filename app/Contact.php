<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Contact extends Model
{

    protected $fillable = ['name', 'email', 'phone', 'organisation_id', 'first_name', 'middle_name', 'surname', 'type', 'metadata', 'agent_id', 'date_of_birth', 'capacity', 'amlcft_complete'];

    public static $validationRules = [
        'name' => 'required',
    ];
    protected $dates = [
        'date_of_birth',
        'created_at', 'updated_at', 'deleted_at'
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

    public function setDateOfBirthAttribute($value)
    {
        $this->attributes['date_of_birth'] = $this->parseDate($value);
    }


    public function parseDate($date=null)
    {
        if(isset($date))
        {
            return Carbon::createFromFormat('d M Y',$date);
        }
        return null;
    }


    public function tokenExtras() {
        $this->load('addresses');
        return $this;
    }
}

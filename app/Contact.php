<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Contact extends Model
{

    protected $fillable = ['name', 'email', 'phone', 'organisation_id',  'metadata', 'agent_id', 'cdd_required', 'cdd_type',
                            'cdd_completion_date', 'bank_account_number', 'ird_number'];

    public static $validationRules = [
    ];
    protected $dates = [
        'cdd_completion_date',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    protected $casts = [
        'cdd_completion_date' => 'datetime:d M Y'
    ];

    public function setCddCompletionDateAttribute($value)
    {
        $this->attributes['cdd_completion_date'] = $this->parseDate($value);
    }

    public function parseDate($date=null)
    {
        if(isset($date))
        {
            try{
                return Carbon::createFromFormat('d M Y',$date);
            }
            catch (\Exception $e) {
                return Carbon::parse($date);
            }
        }
        return null;
    }

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
        return $this->belongsToMany(File::Class, 'contact_files', "contact_id", "file_id")->withTimestamps();
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


    public function relationshipsSyncable()
    {
        return $this->belongsToMany('App\Contact', 'contact_relationships', 'first_contact_id', 'second_contact_id')->using('App\ContactRelationship');
    }

    public function relationships()
    {
        return $this->hasMany(ContactRelationship::class, 'first_contact_id');
    }

    public function relationshipInverse()
    {
        return $this->hasMany(ContactRelationship::class, 'second_contact_id');
    }


}



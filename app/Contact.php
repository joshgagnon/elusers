<?php

namespace App;

use App\Library\SQLFile;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Traits\DefaultDirectoriesTrait;
use OwenIt\Auditing\Contracts\Auditable;

class Contact extends Model  implements Auditable
{
    use DefaultDirectoriesTrait;
    use \OwenIt\Auditing\Auditable;

    protected $fillable = ['name',  'organisation_id',  'metadata', 'agent_id', 'cdd_required', 'reason_no_cdd_required', 'cdd_type',
                            'enhanced_cdd_reason', 'other_cdd_reason', 'source_of_funds', 'enhanced_ccd_required',
                            'cdd_completion_date', 'bank_account_number', 'ird_number'];

    public static $validationRules = [
    ];

    const DEFAULT_DIRECTORIES = [
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
        $this->attributes['cdd_completion_date'] = $value ? $this->parseDate($value) : null;
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

    public static function getAll($user)
    {
        $orgId = $user->organisation_id;
        $query = new SQLFile('contacts', ['orgId' => $orgId]);
        $result = $query->get();

        return $result[0]->contacts;
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

    public function notes()
    {
        return $this->hasMany(ContactNote::Class);
    }

    public function tokenExtras() {
        $this->load('contactInformations');
        $this->load('contactable');
        return $this;
    }

    public function addresses()
    {
        return $this->morphMany(Address::class, 'addressable');
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

    public function agentsSyncable()
    {
        return $this->belongsToMany('App\Contact', 'contact_agents', 'contact_id', 'agent_id')->using('App\ContactAgent');
    }

    public function agents()
    {
        return $this->hasMany(ContactAgent::class, 'contact_id');
    }

    public function contactInformations()
    {
        return $this->belongsToMany(ContactInformation::Class);
    }

    public function matters()
    {
        return $this->belongsToMany(Matter::Class, 'matter_clients', 'contact_id', 'matter_id')->using('App\MatterClient');
    }

    public function getName()
    {
        if($this->contactable_type === 'Individual'){
            $contactable = $this->contactable;
            return $contactable->first_name.' '.$contactable->surname;
        }
        return $this->name;
    }
}



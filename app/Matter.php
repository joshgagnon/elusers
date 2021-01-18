<?php

namespace App;

use App\File;
use App\Deadline;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\DefaultDirectoriesTrait;
use App\Library\SQLFile;

class Matter extends Model
{
    use SoftDeletes;
    use DefaultDirectoriesTrait;

    const MATTER_TYPES = [
        "Bankruptcy and Liquidation",
        "Business Acquisitions and Investment",
        "Commercial Advice",
        "Commercial Documentation",
        "Company Governance and Shareholding",
        "Company Incorporation and Administration",
        "Conveyancing – Sale / Purchase",
        "Conveyancing – Refinance",
        "Criminal Process",
        "Debt Recovery",
        "Disputes and Litigation",
        "Employment",
        "General Advice",
        "Insolvency Advice",
        "Relationship Property",
        "Property Advice",
        "Wills and Estates",
        "Trust Advice",
        "Trust Creation and Administration",
        "Other"
    ];


    protected $casts = [
        'metadata' => 'json',
        'matter_fields' => 'json'
    ];

    const DEFAULT_DIRECTORIES = [
        'Accounts',
        'Documents',
        'Emails',
        'Letters and Faxes'
    ];

    protected $fillable = ['matter_number', 'matter_name', 'matter_type', 'status', 'approved_by_user_id', 'metadata', 'matter_fields', 'created_by_user_id',  'organisation_id', 'referrer_id', 'referrer_type'];

   # protected $visible = ['id', 'matter_number', 'matter_name', 'matter_type', 'created_by_user_id', 'referrer_id', 'organisation_id', 'created_at', 'updated_at'];

    public static $validationRules = [
        'matter_number'  => 'required',
        'matter_name' => 'required',
        'matter_type' => 'required'
    ];

    public function files()
    {
        return $this->belongsToMany(File::Class, 'matter_files', "matter_id", "file_id")->withTimestamps();
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function referrer()
    {
        return $this->morphTo();
    }

    /*public function clients()
    {
        return $this->belongsToMany(Contact::Class, 'matter_clients', 'matter_id', 'contact_id')->using('App\MatterClient');
    }
    */

    public function matterClients()
    {
        return $this->hasMany(MatterClient::class);
    }

    public function notes()
    {
        return $this->hasMany(MatterNote::Class);
    }

    public function deadlines()
    {
        return $this->belongsToMany(Deadline::Class, 'matter_deadlines', "matter_id", "deadline_id")->withTimestamps();
    }

    public static function getAll($user)
    {
        $orgId = $user->organisation_id;
        $query = new SQLFile('matters', ['orgId' => $orgId]);
        $result = $query->get();

        return $result[0]->matters;
    }

    public function setDeadlines($user)
    {

        $this->deadlines()->where('type', 'settlement_date')->delete();
        if($this->matter_fields && !empty($this->matter_fields['settlement_date'])) {
            $this->deadlines()->create([
                'title' => 'Settlement Date: '.$this->matter_name,
                'due_at' => $this->matter_fields['settlement_date'],
                'type' => 'settlement_date',
                'created_by_user_id' =>  $user->id,
                'organisation_id' => $user->organisation_id
            ]);
        }

        $this->deadlines()->where('type', 'condition_date')->delete();
        if($this->matter_fields && !empty($this->matter_fields['condition_date'])) {
            $this->deadlines()->create([
                'title' => 'Condition Date: '.$this->matter_name,
                'due_at' => $this->matter_fields['condition_date'],
                'type' => 'condition_date',
                'created_by_user_id' =>  $user->id,
                'organisation_id' => $user->organisation_id
            ]);
        }
    }


}

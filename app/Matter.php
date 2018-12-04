<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Matter extends Model
{
    use SoftDeletes;

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
        "Trust Creation and Administration"
    ];


    protected $fillable = ['matter_number', 'matter_name', 'matter_type', 'status', 'approved_by_user_id', 'metadata', 'created_by_user_id',  'organisation_id', 'referrer_id', 'referrer_type'];
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

    public function clients()
    {
        return $this->belongsToMany(Contact::Class, 'matter_clients', 'matter_id', 'contact_id')->using('App\MatterClient');
    }

    public function notes()
    {
        return $this->hasMany(MatterNote::Class);
    }
}

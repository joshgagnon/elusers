<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Matter extends Model
{
    use SoftDeletes;

    protected $fillable = ['matter_number', 'matter_name', 'matter_type', 'created_by_user_id', 'referrer_id', 'organisation_id', 'referrer_type'];
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
        return $this->belongsTo(User::class, 'referrer_id');
    }

}

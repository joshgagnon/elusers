<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OrganisationFile extends Model
{
    protected $fillable = [];

    public function file()
    {
        return $this->belongsTo(File::class);
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }
}

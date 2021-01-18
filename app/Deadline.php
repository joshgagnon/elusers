<?php

namespace App;

use App\Matter;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Deadline extends Model
{

    protected $fillable = ['resolved_at', 'title', 'created_by_user_id', 'description', 'due_at', 'organisation_id', 'type'];


    public function matters()
    {
        return $this->belongsToMany(Matter::Class, 'matter_deadlines', "deadline_id", "matter_id")->withTimestamps();
    }
}
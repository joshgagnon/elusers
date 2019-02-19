<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Deadline extends Model
{

    protected $fillable = ['resovled_at', 'title', 'created_by_user_id', 'description'];


}
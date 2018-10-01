<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MatterNote extends Model
{
    protected $fillable = ['matter_id', 'note', 'created_by_user_id'];

}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Wiki extends Model
{

    protected $table = 'wiki';

    protected $fillable = ['title', 'path', 'data', 'categories', 'keywords'];

    protected $visible = ['title', 'path', 'data', 'categories', 'keywords'];

}
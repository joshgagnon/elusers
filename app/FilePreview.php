<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class FilePreview extends Model
{
    protected $fillable = ['file_id', 'data'];
    protected $casts = [
        'data' => 'array'
    ];
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FilePermission extends Model
{
    protected $fillable = ['permission', 'file_id'];

    public function file()
    {
        return $this->belongsTo(File::class);
    }
}

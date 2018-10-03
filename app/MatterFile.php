<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MatterFile extends Model
{
    protected $fillable = [];

    public function file()
    {
        return $this->belongsTo(File::class);
    }

    public function matter()
    {
        return $this->belongsTo(Matter::class);
    }
}

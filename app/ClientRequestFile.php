<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClientRequestFile extends Model  implements Auditable
{
    protected $fillable = [];

    public function file()
    {
        return $this->belongsTo(File::class);
    }
}

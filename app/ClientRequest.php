<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClientRequest extends Model
{
    protected $fillable = ['token', 'data', 'submitted'];
    protected $visible = ['token', 'data', 'submitted'];
    protected $casts = [
        'data' => 'array',
    ];

   public function model()
    {
        return $this->morphTo();
    }

    public function files()
    {
        return $this->belongsToMany(File::Class, 'client_request_files', "client_request_id", "file_id")->withTimestamps();
    }
}

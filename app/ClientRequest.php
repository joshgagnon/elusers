<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClientRequest extends Model
{
    protected $fillable = ['token', 'data', 'submitted', 'organisation_id'];
    protected $visible = ['id', 'token', 'data', 'submitted'];
    protected $casts = [
        'data' => 'array',
    ];
    use SoftDeletes;
    
   public function model()
    {
        return $this->morphTo();
    }

    public function files()
    {
        return $this->belongsToMany(File::Class, 'client_request_files', "client_request_id", "file_id")->withTimestamps();
    }
}

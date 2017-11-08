<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class File extends Model
{
    protected $fillable = ['path', 'filename', 'mime_type', 'encrypted'];

    public static function boot() {
        parent::boot();

        static::creating(function ($organisation) {
            $organisation->encryption_key = EncryptionKey::create();
        });

        static::deleting(function ($file) {
            Storage::delete($file->path);
            $file->deedRecords()->detach();
        });
    }

    /**
     * Deed records relationship: a file belongs to many deed records.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function deedRecords()
    {
        return $this->belongsToMany(DeedPacketRecord::class);
    }
}

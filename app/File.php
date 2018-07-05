<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use App\Library\SQLFile;

class File extends Model
{
    protected $fillable = ['path', 'filename', 'mime_type', 'encrypted'];

    public static function boot() {
        parent::boot();

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

    public static function canRead($id, $user) {
        $canReadFile = SQLFile::run('can_read_file', ['user_id' => $user->id, 'file_id' => $id]);
        $canReadFile = $canReadFile[0]->exists;
        return !!$canReadFile;
    }


}




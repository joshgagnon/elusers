<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use App\FilePermission;
use App\Library\SQLFile;
use App\Library\Encryption;


class File extends Model
{
    protected $fillable = ['path', 'filename', 'mime_type', 'encrypted', 'directory', 'parent_id', 'previous_version_id', 'protected'];

    public static function boot()
    {
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

    public static function canRead($id, $user)
    {
        $canReadFile = SQLFile::run('can_read_file', ['user_id' => $user->id, 'file_id' => $id]);
        $canReadFile = $canReadFile[0]->exists;

        $hasPermission = true;
        $permissions = array_map(function($p) {
            return $p['permission'];
        }, FilePermission::where(['file_id' => $id])->get()->toArray());

        if(count($permissions)) {
            $hasPermission = $user->hasAnyPermission($permissions);
        }
        return !!$canReadFile && $hasPermission;
    }

    public function parent()
    {
        return $this->belongsTo(File::class, 'parent_id');
    }

    public function getContent($key)
    {
        $content = Storage::get($this->path);
        if ($this->encrypted) {
            $encryption = new Encryption($key);
            $content = $encryption->decrypt($content);
        }
        return $content;

    }

    public function getFullPath()
    {
        $path = [];
        $file = $this;
        while($file->parent) {
            $file = $file->parent;
            $path[] = $file->filename;
        }
        return implode(DIRECTORY_SEPARATOR, array_reverse($path));
    }

    public function permissions()
    {
        return $this->hasMany(FilePermission::class);
    }

}



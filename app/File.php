<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use App\FilePermission;
use App\FileNote;
use App\Library\SQLFile;
use App\Library\Encryption;
use Phemail\MessageParser;
use pear\mail\Mail;

class File extends Model
{
    protected $fillable = ['path', 'filename', 'mime_type', 'encrypted', 'directory', 'parent_id', 'previous_version_id', 'protected', 'metadata'];

    protected $casts = [
        'metadata' => 'array'
    ];

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

    public function getContent($key=null)
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

    public function notes()
    {
        return $this->hasMany(FileNote::Class);
    }

    public function read($user) {
        return $this->getContent($user->organisation->encryption_key);
    }


    public function parseMetadata($user)
    {
        $contents = $this->read($user);

        if(endswith($this->filename, '.eml')) {
            $parser = new MessageParser();
            $message = $parser->parse(preg_split("/\r\n|\n|\r/", $contents));
            function address($value) {
                $addresses = (new \Mail_RFC822)->parseAddressList($value);
                return array_map(function($address) {
                    return [
                        'name' => $address->personal,
                        'address' => $address->mailbox.'@'.$address->host
                    ];
                }, $addresses);
            }
            return [
                'date' => $message->getHeaderValue('subject'),
                'subject' => $message->getHeaderValue('date'),
                'to' => address($message->getHeaderValue('to')),
                'from' =>  address($message->getHeaderValue('from'))
            ];
         }

        return [];
    }


}



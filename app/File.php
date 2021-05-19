<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use App\FilePermission;
use App\FileNote;
use App\Library\SQLFile;
use App\Library\Encryption;
use Phemail\MessageParser;
use Illuminate\Support\Facades\Log;
use App\Library\StringToStream;
use Illuminate\Support\Str;
 use App\Library\Encoding;
use OwenIt\Auditing\Contracts\Auditable;

function address($value) {
    $default = [['name' => 'Unknown', 'address' => '']];
    if(!$value) {
        return $default;
    }
    $addresses = (new \Mail_RFC822)->parseAddressList($value);
    if(!is_array($addresses)) {
      $addresses = (new \Mail_RFC822)->parseAddressList(preg_replace('/\\\/', '', $value));
    }
    if(!is_array($addresses)) {
        return $default;
    }
    return array_map(function($address) {
        return [
            'name' => preg_replace('/^"|"$/', '', $address->personal),
            'address' => $address->mailbox.'@'.$address->host
        ];
    }, $addresses);
}


class File extends Model  implements Auditable
{
    use \OwenIt\Auditing\Auditable;
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
         try{
            if(Str::endsWith($this->filename, '.eml')) {
                $metadata = $this->getEmlData($user);
                return [
                    'date' => $metadata['date'],
                    'subject' => $metadata['subject'],
                    'to' => $metadata['to'],
                    'from' => $metadata['from'],
                ];
             }
            if(Str::endsWith($this->filename, '.msg')) {
                $metadata = $this->getMsgData($user);
                return [
                    'date' => $metadata['date'],
                    'subject' => $metadata['subject'],
                    'to' => $metadata['to'],
                    'from' => $metadata['from'],
                ];
             }

        }
        catch(\Throwable $e) {
            Log::error($e);
        }
        return [];
    }

    protected function decodeContentTransfer($encodedString, $encodingType)
    {
        $encodingType = strtolower($encodingType);

        if ($encodingType == 'base64') {
            return base64_decode($encodedString);
        } elseif ($encodingType == 'quoted-printable') {
            return quoted_printable_decode($encodedString);
        } else {
            return $encodedString;
        }
    }

    protected function upperListEncode() { //convert mb_list_encodings() to uppercase
        $encodes=mb_list_encodings();
        foreach ($encodes as $encode) $tencode[]=strtoupper($encode);
        return $tencode;
    }

    protected function decode($string) {
        $tabChaine=imap_mime_header_decode($string);
        $texte='';
        for ($i=0; $i<count($tabChaine); $i++) {

            switch (strtoupper($tabChaine[$i]->charset)) { //convert charset to uppercase
                case 'UTF-8': $texte.= $tabChaine[$i]->text; //utf8 is ok
                    break;
                case 'DEFAULT': $texte.= $tabChaine[$i]->text; //no convert
                    break;
                default: if (in_array(strtoupper($tabChaine[$i]->charset),upperListEncode())) //found in mb_list_encodings()
                            {$texte.= mb_convert_encoding($tabChaine[$i]->text,'UTF-8',$tabChaine[$i]->charset);}
                         else { //try to convert with iconv()
                              $ret = iconv($tabChaine[$i]->charset, "UTF-8", $tabChaine[$i]->text);
                              if (!$ret) $texte.=$tabChaine[$i]->text;  //an error occurs (unknown charset)
                              else $texte.=$ret;
                            }
                    break;
                }
            }
        return $texte;
    }


    public function processEmailData($contents)
    {
        $parser = new MessageParser();
        $message = $parser->parse(preg_split("/\r\n|\n|\r/", $contents));
        $encoding = $message->getHeaderValue('content-transfer-encoding');
        $mainBody = $this->decodeContentTransfer($message->getContents(), $encoding);
        if($mainBody) {
            $body = [
                ['value' => $mainBody, 'contentType' => $message->getHeaderValue('content-type')]
            ];
        } else {
            $body = array_map(function($part) {
                $value = $this->decodeContentTransfer($part->getContents(), $part->getHeaderValue('content-transfer-encoding'));
                return ['value' => $value, 'contentType' => $part->getHeaderValue('content-type')];
            }, $message->getParts(true));
        }
        return [
            'date' => $message->getHeaderValue('date'),
            'subject' => $this->decode($message->getHeaderValue('subject')),
            'to' => address($message->getHeaderValue('to')),
            'from' =>  address($message->getHeaderValue('from'))[0],
            'body' => Encoding::utf8ize($body)
        ];

    }

    public function getEmlData($user) {
        try{
            $contents = $this->read($user);
            return $this->processEmailData($contents);
        }catch(\Throwable $e) {
            Log::error($e);
        }
        return [
            'date' => null,
            'subject' => 'Unknown Subject',
            'to' => [],
            'from' =>  ['name' => 'Unknown', 'address' => '' ],
            'body' => 'Could not read message'
        ];
    }


    public function getMsgData($user) {
        try{
             // convert to eml
            $contents = $this->read($user);
            $tmp = tmpfile();
            $data = stream_get_meta_data($tmp);
            $file = $data['uri'];
            fwrite($tmp, $contents);
            $command = sprintf('python3 %s %s', implode(DIRECTORY_SEPARATOR, [__DIR__, '..', 'resources','scripts', 'outlookmsgfile.py']), $file);
            exec($command);
            fclose($tmp);
            $resultFile = $data['uri'].'.eml';
            $results = file_get_contents($resultFile);
            unlink($resultFile);
            return $this->processEmailData($results);
        }catch(\Throwable $e) {
           Log::error($e);
        }
        return [
            'date' => null,
            'subject' => 'Unknown Subject',
            'to' => [],
            'from' =>  ['name' => 'Unknown', 'address' => '' ],
            'body' => 'Could not read message'
        ];

    }




}



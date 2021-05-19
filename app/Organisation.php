<?php

namespace App;

use App\Library\EncryptionKey;
use App\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\DefaultDirectoriesTrait;
use OwenIt\Auditing\Contracts\Auditable;
class Organisation extends Model  implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    protected $table = 'organisations';
    use SoftDeletes;
    use DefaultDirectoriesTrait;

    const DEFAULT_DIRECTORIES = [
    ];

    protected $fillable = ['legal_name', 'trading_name'];

    protected $hidden = ['encryption_key'];

    public static function boot() {
        parent::boot();

        static::creating(function ($organisation) {
            $organisation->encryption_key = EncryptionKey::create();
        });
    }

    /**
     * Users relationship: an organisation has many users
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }


    public function files()
    {
        return $this->belongsToMany(File::Class, 'organisation_files', "organisation_id", "file_id")->withTimestamps()->withPivot('created_by_user_id');;
    }

}

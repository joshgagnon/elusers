<?php

namespace App;

use App\Library\EncryptionKey;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organisation extends Model
{
    protected $table = 'organisations';
    use SoftDeletes;

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

    public function organisationFiles()
    {
        return $this->hasMany(OrganisationFile::class);
    }


}

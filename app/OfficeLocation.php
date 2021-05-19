<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
class OfficeLocation extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    protected $fillable = ['name'];

    /**
     * Deed packet records relationship: a office location has many deed packet records.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function deedPacketRecords()
    {
        return $this->hasMany(DeedPacketRecord::class);
    }
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
class OrganisationFile extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    protected $fillable = [];

    public function file()
    {
        return $this->belongsTo(File::class);
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }
}

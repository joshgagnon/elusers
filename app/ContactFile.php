<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
class ContactFile extends Model  implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable = [];

    public function file()
    {
        return $this->belongsTo(File::class);
    }

    public function contact()
    {
        return $this->belongsTo(Contact::class);
    }
}

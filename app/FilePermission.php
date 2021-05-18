<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
class FilePermission extends Model  implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    protected $fillable = ['permission', 'file_id'];

    public function file()
    {
        return $this->belongsTo(File::class);
    }
}

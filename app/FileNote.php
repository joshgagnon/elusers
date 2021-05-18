<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
class FileNote extends Model  implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    protected $fillable = ['file_id', 'note', 'created_by_user_id'];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }
}

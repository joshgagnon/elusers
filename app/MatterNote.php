<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
class MatterNote extends Model  implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    protected $fillable = ['matter_id', 'note', 'created_by_user_id'];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }
}

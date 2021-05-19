<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;
class ProfessionalDevelopmentRecord extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    use SoftDeletes;

    protected $fillable = ['title', 'date', 'minutes', 'reflection'];

    protected $visible = ['id', 'title', 'date', 'minutes', 'reflection'];

    /**
     * User relationship: a Professional Development Record belongs to a user
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

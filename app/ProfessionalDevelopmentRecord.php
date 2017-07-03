<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProfessionalDevelopmentRecord extends Model
{
    use SoftDeletes;

    protected $fillable = ['title', 'date', 'minutes', 'reflection'];

    protected $visible = ['title', 'date', 'minutes', 'reflection'];

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

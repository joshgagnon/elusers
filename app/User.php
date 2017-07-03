<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;


class User extends Authenticatable
{
    use Notifiable, SoftDeletes;

    protected $fillable = ['title', 'first_name', 'middle_name', 'surname', 'preferred_name'];

    protected $visible = ['id', 'title', 'first_name', 'middle_name', 'surname', 'preferred_name', 'email'];

    /**
     * Organisation relationship: a user belongs to an organisation
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function organisation()
    {
        return $this->belongsTo(Organisation::class);
    }

    /**
     * Query scope: limit users to an organisation.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param \App\Organisation $organisation
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeInOrganisation($query, $organisation)
    {
        if (!is_int($organisation)) {
            $organisation = $organisation->id;
        }

        return $query->where('users.organisation_id', $organisation);
    }
}

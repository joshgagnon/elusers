<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeedPacket extends Model
{
    use SoftDeletes;

    protected $fillable = ['title', 'created_by_user_id'];

    public static $validationRules = [
        'title' => 'required',
    ];

    /**
     * Created by relationship: a deed packet was created by a user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    /**
     * Contact relationship: a deed packet belongs to many contacts.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function contacts()
    {
        return $this->belongsToMany(Contact::class);
    }
}

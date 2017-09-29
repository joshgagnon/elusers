<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use SoftDeletes;

    protected $fillable = ['title', 'created_by_user_id'];

    protected $visible = ['id', 'title', 'created_by_user_id'];

    /**
     * Deed file relationship: a client has many deed files.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function deedFiles()
    {
        return $this->hasMany(DeedFile::class);
    }

    /**
     * Created by relationship: a client was created by a user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }
}

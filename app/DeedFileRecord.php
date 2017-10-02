<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DeedFileRecord extends Model
{
    protected $fillable = ['deed_file_id', 'created_by_user_id', 'document_name', 'document_date', 'parties', 'matter_id', 'archive_date'];

    protected $dates = ['document_date'];

    public static $validationRules = [
        'created_by_user_id' => 'required|exists:users',
        'document_name' => 'required',
        'document_date' => 'required|date',
        'parties' => 'required',
        'matter_id' => 'required',
        'archive_date' => 'nullable|date',
    ];

    /**
     * Created by relationship: a deed file record was created by a user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }
}
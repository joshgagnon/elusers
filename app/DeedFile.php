<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeedFile extends Model
{
    use SoftDeletes;

    protected $fillable = ['client_id', 'document_date', 'parties', 'matter', 'created_by_user_id'];

    protected $visible = ['id', 'client_id', 'document_date', 'parties', 'matter', 'created_by_user_id'];

    protected $dates = ['document_date'];

    public static $validationRules = [
        'client_title'  => 'required',
        'document_date' => 'required|date',
        'parties'       => 'required',
        'matter'        => 'required',
    ];

    /**
     * Client relationship: a deed file belongs to a client
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function client()
    {
        return $this->belongsTo(Client::class);
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

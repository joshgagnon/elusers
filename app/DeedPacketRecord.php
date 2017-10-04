<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeedPacketRecord extends Model
{
    use SoftDeletes;

    protected $fillable = ['deed_file_id', 'created_by_user_id', 'document_name', 'document_date', 'parties', 'matter_id', 'archive_date', 'office_location_id', 'organisation_id'];

    protected $dates = ['document_date'];

    public static $validationRules = [
        'document_name' => 'required',
        'document_date' => 'required|date',
        'parties' => 'required',
        'matter_id' => 'required',
        'destruction_date' => 'nullable|date',
        'office_location_id' => 'nullable|exists:office_locations,id',
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

    /**
     * Location relationship: a deed packet record has a location.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function location()
    {
        return $this->belongsTo(OfficeLocation::class);
    }
}
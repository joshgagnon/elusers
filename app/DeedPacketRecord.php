<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeedPacketRecord extends Model
{
    use SoftDeletes;

    protected $fillable = ['deed_packet_id', 'created_by_user_id', 'document_name', 'document_date', 'destruction_date', 'parties', 'matter_id', 'archive_date', 'office_location_id', 'organisation_id', 'notes'];

    protected $dates = ['document_date'];

    public static $validationRules = [
        'deed_packet_id'     => 'required|exists:deed_packets,id',
        'document_name'      => 'required',
        'document_date'      => 'required|date',
        'parties'            => 'required',
        'matter_id'          => 'required',
        'destruction_date'   => 'nullable|date',
        'office_location_id' => 'nullable|exists:office_locations,id',
    ];

    /**
     * Created by relationship: a deed packet record was created by a user.
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
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function location()
    {
        return $this->belongsTo(OfficeLocation::class);
    }

    /**
     * Deed record file relationship: a deed record has many files.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function files()
    {
        return $this->hasMany(DeedRecordFile::class);
    }
}
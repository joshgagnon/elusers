<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DeedRecordFile extends Model
{
    protected $fillable = ['deed_packet_record_id', 'path'];

    /**
     * Deed record relationship: a deed record file belongs to a deed record.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function deedRecord()
    {
        return $this->belongsTo(DeedPacketRecord::class);
    }
}

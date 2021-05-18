<?php

namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;


class MatterClient extends Pivot
{


    public $table = 'matter_clients';
    protected $fillable = ['matter_id', 'contact_id', 'authorised_contact_id'];

    public function client()
    {
        return $this->belongsTo(Contact::class, 'contact_id');
    }

    public function authorisedContact()
    {
        return $this->belongsTo(Contact::class);
    }

    public function matter()
    {
        return $this->belongsTo(Matter::class);
    }
}

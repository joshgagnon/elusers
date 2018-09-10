<?php

namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;


class ContactAgent extends Pivot
{
    public $table = 'contact_agents';
    protected $fillable = ['contact_id', 'agent_id', 'start_date', 'end_date'];

    public function contact()
    {
        return $this->belongsTo(Contact::class, 'agent_id');
    }

}

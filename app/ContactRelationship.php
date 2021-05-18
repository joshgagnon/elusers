<?php

namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ContactRelationship extends Pivot
{

    public $table = 'contact_relationships';
    protected $fillable = ['first_contact_id', 'second_contact_id', 'relationship_type', 'start_date', 'end_date'];

    public function contact()
    {
        return $this->belongsTo(Contact::class, 'second_contact_id');
    }

}

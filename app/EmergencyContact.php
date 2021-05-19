<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;
class EmergencyContact extends Model  implements Auditable
{
    use SoftDeletes;
    use \OwenIt\Auditing\Auditable;

    protected $fillable = ['name', 'email', 'phone'];
    protected $visible = ['id', 'name', 'email', 'phone'];

    public static $validationRules = [
        'name'  => 'required|max:255',
        'email' => 'required|max:255|email',
        'phone' => 'required|max:255',
    ];

    /**
     * User relationship: the user that this emergency contact is for.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

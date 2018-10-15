<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Notifications\MyResetPassword;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Relations\MorphToMany;


class User extends Authenticatable
{
    use Notifiable, SoftDeletes, HasRoles;

    protected $fillable = ['title', 'first_name', 'middle_name', 'surname', 'preferred_name', 'email', 'law_admission_date', 'ird_number', 'bank_account_number', 'phone', 'mobile', 'position'];

    protected $visible = ['id', 'title', 'first_name', 'middle_name', 'surname', 'preferred_name', 'email', 'law_admission_date', 'ird_number', 'bank_account_number', 'phone', 'mobile', 'position', 'roles'];

    public static $validationRules = [
        'title'               => 'required',
        'first_name'          => 'required',
        'surname'             => 'required',
        'email'               => 'required|email',
        'law_admission_date'  => 'nullable|date'
    ];



    /**
     * Organisation relationship: a user belongs to an organisation.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function organisation()
    {
        return $this->belongsTo(Organisation::class, 'organisation_id');
    }

    /**
     * Professional Development Record relationship: a User has many Professional Development Records.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function professionalDevelopmentRecords()
    {
        return $this->hasMany(ProfessionalDevelopmentRecord::class);
    }

    /**
     * Emergency Contact relationship: the emergency contact for this user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function emergencyContact()
    {
        return $this->hasOne(EmergencyContact::class);
    }

    public function addresses()
    {
        return $this->morphMany(Address::class, 'addressable');
    }

    /**
     * Created deed files: a user creates has deed files.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function createdDeedFiles()
    {
        return $this->hasMany(DeedFile::class, 'created_by_user_id');
    }

    /**
     * Query scope: limit users to an organisation.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param \App\Organisation                     $organisation
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeInOrganisation($query, $organisation)
    {
        if (!is_int($organisation)) {
            $organisation = $organisation->id;
        }

        return $query->where('users.organisation_id', $organisation);
    }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new MyResetPassword($token));
    }
}

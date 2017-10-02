<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeedFile extends Model
{
    use SoftDeletes;

    protected $fillable = ['title', 'created_by_user_id'];

    /**
     *
     *
     * @param $title
     * @param $createdByUserId
     * @return DeedFile
     */
    public static function findOrCreate($title, $createdByUserId)
    {
        $deedFile = self::where('title', $title)->first();

        if (!$deedFile) {
            $deedFile = self::create(['title' => $title, 'create_by_user_id' => $createdByUserId]);
        }

        return $deedFile;
    }

    /**
     * Created by relationship: a deed file was created by a user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }
}

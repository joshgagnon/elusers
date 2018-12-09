<?php

namespace App\Observers;

use App\Matter;

class MatterObserver
{
        /**
     * Handle to the matter "created" event.
     *
     * @param  \App\Matter  $matter
     * @return void
     */
    public function creating(Matter $matter)
    {

    }

    /**
     * Handle to the matter "created" event.
     *
     * @param  \App\Matter  $matter
     * @return void
     */
    public function created(Matter $matter)
    {
        // create folder named after matter id,
        // populate with default directories
        $matter->populateDirectories();
    }

    /**
     * Handle the matter "updated" event.
     *
     * @param  \App\Matter  $matter
     * @return void
     */
    public function updated(Matter $matter)
    {
        //
    }

    /**
     * Handle the matter "deleted" event.
     *
     * @param  \App\Matter  $matter
     * @return void
     */
    public function deleted(Matter $matter)
    {
        //
    }
}

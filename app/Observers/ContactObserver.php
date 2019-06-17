<?php

namespace App\Observers;

use App\Contact;

class ContactObserver
{
        /**
     * Handle to the Contact "created" event.
     *
     * @param  \App\Contact  $Contact
     * @return void
     */
    public function creating(Contact $Contact)
    {

    }

    /**
     * Handle to the Contact "created" event.
     *
     * @param  \App\Contact  $Contact
     * @return void
     */
    public function created(Contact $contact)
    {
        // create folder named after Contact id,
        // populate with default directories
        $contact->populateDirectories();
    }

    /**
     * Handle the Contact "updated" event.
     *
     * @param  \App\Contact  $Contact
     * @return void
     */
    public function updated(Contact $Contact)
    {
        //
    }

    /**
     * Handle the Contact "deleted" event.
     *
     * @param  \App\Contact  $Contact
     * @return void
     */
    public function deleted(Contact $Contact)
    {
        //
    }
}

<?php

namespace App\Observers;

use App\ClientRequest;
use App\User;
use App\Notifications\NewClient;
use App\Notifications\NewClientThankYou;
use Illuminate\Notifications\Notification;


class ClientRequestObserver
{
        /**
     * Handle to the ClientRequest "created" event.
     *
     * @param  \App\ClientRequest  $ClientRequest
     * @return void
     */
    public function creating(ClientRequest $clientRequest)
    {

    }

    /**
     * Handle to the ClientRequest "created" event.
     *
     * @param  \App\ClientRequest  $ClientRequest
     * @return void
     */
    public function created(ClientRequest $clientRequest)
    {


    }

    /**
     * Handle the ClientRequest "updated" event.
     *
     * @param  \App\ClientRequest  $ClientRequest
     * @return void
     */
    public function updated(ClientRequest $clientRequest)
    {
        if($clientRequest->isDirty('submitted') && $clientRequest->submitted && !$clientRequest->getOriginal('submitted')){
            $users = User::where(['organisation_id' => $clientRequest->organisation_id])->get();
            foreach($users as $user) {
                if($user->hasPermissionTo('view client requests')) {
                    $user->notify(new NewClient($clientRequest->id));
                }
            }
            Notification::send([[
                'email' => $clientRequest->data['emailSimple']
            ]], new NewClientThankYou($invoice));   
        }
    }

    /**
     * Handle the ClientRequest "deleted" event.
     *
     * @param  \App\ClientRequest  $ClientRequest
     * @return void
     */
    public function deleted(ClientRequest $clientRequest)
    {
        //
    }
}

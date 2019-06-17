<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Relations\Relation;
use App\Matter;
use App\Observers\MatterObserver;
use App\Contact;
use App\Observers\ContactObserver;
use App\ClientRequest;
use App\Observers\ClientRequestObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {

        Matter::observe(MatterObserver::class);
        Contact::observe(ContactObserver::class);
        ClientRequest::observe(ClientRequestObserver::class);
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        Request::macro('allJson', function () {
            $data = $this->all();
            if(isset($data['__json'])){
                $data = array_merge($data, json_decode($data['__json'], true));
                unset($data['__json']);
            }
            return $data;
        });



        Relation::morphMap([
            'User' => \App\User::class,
            'Contact' => \App\Contact::class,
            'Individual' => \App\ContactIndividual::class,
            'Company' => \App\ContactCompany::class,
            'Trust' => \App\ContactTrust::class,
            'Partnership' => \App\ContactPartnership::class,
            'Court' => \App\ContactCourt::class,
            'Bank' => \App\ContactBank::class,
            'Local Authority' => \App\ContactLocalAuthority::class,
            'Government Body' => \App\ContactGovernmentBody::class
        ]);




    }
}

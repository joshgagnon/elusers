<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
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
    }
}

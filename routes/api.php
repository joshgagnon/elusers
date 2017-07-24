<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group(['middleware' => 'auth'], function() {
    /**
     * Users
     */
    Route::get('users', 'UserController@index');
    Route::get('users/{user}', 'UserController@get');
    Route::put('users/{user}', 'UserController@update');

    // Passwords
    Route::put('users/{user}/password', 'UserController@changePassword');

    // Emergency contact
    Route::get('users/{user}/emergency-contact', 'EmergencyContactController@get');
    Route::put('emergency-contact/{contact}', 'EmergencyContactController@update');

    // User based address routes
    Route::get('users/{user}/addresses', 'UserAddressController@all');
    Route::post('users/{user}/addresses', 'UserAddressController@create');

    /**
     * Addresses
     */
    Route::get('addresses/{address}', 'UserAddressController@get');
    Route::put('addresses/{address}', 'UserAddressController@update');
    Route::delete('addresses/{address}', 'UserAddressController@delete');

    /**
     * CPDPR
     */
    Route::get('users/{user}/cpdpr', 'ProfessionalDevelopmentController@forUser');

    Route::post('cpdpr', 'ProfessionalDevelopmentController@create');
    Route::get('cpdpr/{record}', 'ProfessionalDevelopmentController@get');
    Route::put('cpdpr/{record}', 'ProfessionalDevelopmentController@update');
    Route::delete('cpdpr/{record}', 'ProfessionalDevelopmentController@delete');


    Route::get('wiki', 'WikiController@index');
    Route::get('wiki/{url}', 'WikiController@get')->where('url', '.*');
    Route::post('wiki/{url}', 'WikiController@create')->where('url', '.*');
    Route::put('wiki/{url}', 'WikiController@update')->where('url', '.*');
});
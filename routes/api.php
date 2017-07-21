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


    Route::put('users/{user}/password', 'UserController@changePassword');

    Route::get('users/{user}/emergency-contact', 'EmergencyContactController@get');
    Route::put('emergency-contact/{contact}', 'EmergencyContactController@update');

    /**
     * CPDPR
     */
    Route::get('users/{user}/cpdpr', 'ProfessionalDevelopmentController@forUser');

    Route::post('cpdpr', 'ProfessionalDevelopmentController@create');
    Route::get('cpdpr/{record}', 'ProfessionalDevelopmentController@get');
    Route::put('cpdpr/{record}', 'ProfessionalDevelopmentController@update');
    Route::delete('cpdpr/{record}', 'ProfessionalDevelopmentController@delete');
});
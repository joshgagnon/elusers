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
    Route::post('users', 'UserController@create');
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
     * Deed packets
     */
    Route::get('deed-packets', 'DeedPacketController@all');
    Route::get('deed-packets/{packetId}', 'DeedPacketController@get');
    Route::post('deed-packets', 'DeedPacketController@create');
    Route::put('deed-packets/{packet}', 'DeedPacketController@update');
    Route::delete('deed-packets/{packet}', 'DeedPacketController@delete');

    /**
     * Deed packet records
     */
    Route::get('deed-packet-records/{recordId}', 'DeedPacketRecordController@get');
    Route::post('deed-packet-records', 'DeedPacketRecordController@create');
    Route::post('deed-packet-records/{deedRecord}', 'DeedPacketRecordController@update');// needs to be post as it is multipart/form-data
    Route::delete('deed-packet-records/{record}', 'DeedPacketRecordController@delete');

    /**
     * Office locations
     */
    Route::get('office-locations', 'OfficeLocationController@all');

    /**
     * Contacts
     */
    Route::get('contacts', 'ContactController@all');
    Route::get('contacts/{contactId}', 'ContactController@get');
    Route::post('contacts', 'ContactController@create');
    Route::put('contacts/{contact}', 'ContactController@update');
    Route::delete('contacts/{contact}', 'ContactController@delete');

    /**
     * Files
     */
    Route::get('files/{file}', 'FileController@get')->name('file');

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
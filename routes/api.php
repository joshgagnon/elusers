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
Route::group(['middleware' => ['auth', '2fa']], function() {
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

    Route::put('users/{user}/roles', 'UserController@updateRoles');

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
    Route::post('deed-packets/{packet}', 'DeedPacketController@update');
    Route::delete('deed-packets/{packet}', 'DeedPacketController@delete');

    /**
     * Deed packet records
     */
    Route::get('deed-packet-records/{recordId}', 'DeedPacketRecordController@get');
    Route::post('deed-packet-records', 'DeedPacketRecordController@create');
    Route::post('deed-packet-records/{deedRecord}', 'DeedPacketRecordController@update');// needs to be post as it is multipart/form-data
    Route::put('deed-packet-records/{deedRecord}', 'DeedPacketRecordController@update');// needs to be post as it is multipart/form-data
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
    Route::post('contacts/{contact}', 'ContactController@update'); // needs to be post as it is multipart/form-data
    Route::delete('deed-packet-records/{record}', 'DeedPacketRecordController@delete');
    Route::put('contacts/{contact}', 'ContactController@update');
    Route::delete('contacts/{contact}', 'ContactController@delete');
    Route::post('contacts/{contact}/access-token', 'ContactController@createAccessToken');
    Route::post('contacts/{contact}/notes', 'ContactController@addNote');

    Route::post('contacts-sync', 'ContactController@syncContacts');
    Route::get('contacts-dedupe', 'ContactController@dedupeContacts');

    Route::post('contacts/{contact}/documents', 'ContactController@uploadDocuments');
    Route::put('contacts/{contact}/documents/{file}', 'ContactController@updateDocument');
    Route::delete('contacts/{contact}/documents/{file}', 'ContactController@deleteDocument');

    Route::get('contact-files', 'ContactController@documents');


    /* client requests */
    Route::get('client-requests', 'ClientRequestController@getSubmitted');
    Route::get('client-requests/{clientRequestId}/full', 'ClientRequestController@getFullRequest');
    Route::post('client-requests/{clientRequestId}/create-entities', 'ClientRequestController@createEntities');
    Route::delete('client-requests/{clientRequestId}', 'ClientRequestController@delete')->name('ClientRequest.delete');
    /**
     * Files
     */
    Route::get('files/{file}', 'FileController@get')->name('file');
    Route::get('files/{file}/preview', 'FileController@preview');
    Route::post('files/{file}/replace', 'FileController@replace');
    Route::post('files/{file}/permission', 'FileController@permission');
    Route::put('files/{file}/permission', 'FileController@permission');
    Route::put('files/{file}/note', 'FileController@note');


    Route::get('organisation-files', 'OrganisationFileController@all');
    Route::post('organisation-files/documents', 'OrganisationFileController@create');
    Route::put('organisation-files/documents/{file}', 'OrganisationFileController@update');
    Route::delete('organisation-files/documents/{file}', 'OrganisationFileController@delete');

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



    Route::apiResource('matters', 'MatterController');
    Route::apiResource('roles', 'RoleController');

    Route::apiResource('permissions', 'PermissionController');
    Route::apiResource('deadlines', 'DeadlineController');

    Route::post('matters/{matter}', 'MatterController@update');
    Route::post('matters/{matter}/documents', 'MatterController@uploadDocuments');
    Route::put('matters/{matter}/documents/{file}', 'MatterController@updateDocument');
    Route::delete('matters/{matter}/documents/{file}', 'MatterController@deleteDocument');


    Route::post('matters/{matter}/notes', 'MatterController@addNote');

    Route::post('matters/{matter}/import-outlook', 'MatterController@addOutlookEmailsToMatter');

    Route::get('matter-files', 'MatterController@documents');

    Route::post('matters-sync', 'MatterController@syncMatters');

    Route::post('render', 'RenderController@render');

});

Route::group(['middleware' => ['auth', '2fa', 'MsGraphAuthenticated']], function() {
    return [
        Route::get('outlook-emails', 'MsgraphController@search'),
        Route::get('outlook-mime', 'MsgraphController@mime')
    ];
});


// public routes
Route::get('version', 'VersionController@index');


Route::get('access-token/{token}', 'AccessTokenController@get')->name('AccessToken.get');
Route::put('access-token/{token}', 'AccessTokenController@update')->name('AccessToken.update');
Route::post('access-token/{token}', 'AccessTokenController@update')->name('AccessToken.update');
Route::delete('access-token/{token}', 'AccessTokenController@delete')->name('AccessToken.delete');

Route::get('client-requests/{token}', 'ClientRequestController@get')->name('ClientRequest.get');
Route::put('client-requests/{token}', 'ClientRequestController@update')->name('ClientRequest.update');
Route::post('client-requests/{token}', 'ClientRequestController@update')->name('ClientRequest.update');

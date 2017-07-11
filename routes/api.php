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

Route::get('user', 'UserController@current');
Route::get('users', 'UserController@index');
Route::get('users/{user}', 'UserController@show');

Route::get('users/{user}/cpdpr', 'ProfessionalDevelopmentController@forUser');
Route::post('users/{user}/cpdpr', 'ProfessionalDevelopmentController@create');
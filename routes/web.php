<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Authentication routes
Route::get('login', 'Auth\LoginController@showLoginForm')->name('login');
Route::post('login', 'Auth\LoginController@login');
Route::get('logout', 'Auth\LoginController@logout')->name('logout');

// Password reset routes
Route::get('password/reset', 'Auth\ForgotPasswordController@showLinkRequestForm')->name('password.request');
Route::post('password/reset', 'Auth\ResetPasswordController@reset');
Route::get('password/reset/{token}', 'Auth\ResetPasswordController@showResetForm')->name('password.reset');

Route::get('amlcft/{token}', 'HomeController@amlcft')->name('home.amlcft');
Route::post('contact-us', 'HomeController@startContact')->name('home.startContact');
Route::get('contact-us', 'HomeController@startContact')->name('home.startContact');
Route::get('contact-us/{token}', 'HomeController@contact')->name('home.contact');


// Catch all and serve the main app
Route::group(['middleware' => 'auth'], function() {
    Route::get('render-mail', function() {
        return  (new \App\Notifications\NewClientThankYou())->toMail(null);
        $markdown = new \Illuminate\Mail\Markdown(view(), config('mail.markdown'));
        return $markdown->render('vendor.notifications.email', $message->data());
    });;
    Route::get('{path?}', 'HomeController@index')->where('path', '.*');
});
Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

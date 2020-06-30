<?php

use Illuminate\Support\Facades\Route;

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

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::resource('contacts', 'ContactController');
Route::apiResource('contacts', 'ContactController');
Route::post('/home/session', 'HomeController@getSession');
Route::get('/home/pdf/{id}/yoursession.pdf', 'HomeController@getPdf');
Route::get('/home/handling-pdf', 'HomeController@overridePdf');
Route::get('/home/view-pdf', 'HomeController@viewPdf')->name('pdf');
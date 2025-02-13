<?php

use App\Http\Controllers\VideosController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
})->name('home');

// Ruta del show per als vídeos
Route::get('/videos/{id}', [VideosController::class, 'show'])->name('videos.show');
Route::get('/videos/tested-by/{userId}', [VideosController::class, 'testedBy'])->name('videos.tested-by');

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');
});

Route::get('/videos', [VideosController::class, 'index'])->name('videos.index');

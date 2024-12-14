<?php

use Illuminate\Support\Facades\Route;

// Auth Controllers
use App\Http\Controllers\Auth\{
    AuthenticatedSessionController,
    ConfirmablePasswordController,
    EmailVerificationNotificationController,
    EmailVerificationPromptController,
    NewPasswordController,
    PasswordController,
    PasswordResetLinkController,
    RegisteredUserController,
    VerifyEmailController
};

use App\Http\Controllers\ProfileController;

/*
|--------------------------------------------------------------------------
| Guest Routes
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    // Authentication Routes
    Route::controller(AuthenticatedSessionController::class)->group(function () {
        Route::get('login', 'create')->name('login');
        Route::post('login', 'store');
    });

    // Registration Routes
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');
    Route::post('register', [RegisteredUserController::class, 'store'])
        ->name('kayit_oldu');

    // Password Reset Routes
    Route::controller(PasswordResetLinkController::class)->group(function () {
        Route::get('forgot-password', 'create')->name('password.request');
        Route::post('forgot-password', 'store')->name('password.email');
    });

    Route::controller(NewPasswordController::class)->group(function () {
        Route::get('reset-password/{token}', 'create')->name('password.reset');
        Route::post('reset-password', 'store')->name('password.store');
    });
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    // Profile Management
    Route::controller(ProfileController::class)
        ->prefix('profile')
        ->name('profile.')
        ->group(function () {
            Route::get('/', 'edit')->name('edit');
            Route::patch('/', 'update')->name('update');
            Route::delete('/', 'destroy')->name('destroy');
            Route::post('/set-password', 'setInitialPassword')->name('set-password');
        });

    // Email Verification
    Route::controller(EmailVerificationPromptController::class)->group(function () {
        Route::get('verify-email', '__invoke')->name('verification.notice');
    });

    Route::controller(EmailVerificationNotificationController::class)->group(function () {
        Route::post('email/verification-notification', '__invoke')
            ->middleware('throttle:6,1')
            ->name('verification.send');
    });

    Route::controller(VerifyEmailController::class)->group(function () {
        Route::get('verify-email/{id}/{hash}', '__invoke')
            ->middleware(['signed', 'throttle:6,1'])
            ->name('verification.verify');
    });

    // Password Management
    Route::controller(PasswordController::class)->group(function () {
        Route::put('password', 'update')->name('password.update');
    });

    Route::controller(ConfirmablePasswordController::class)->group(function () {
        Route::get('confirm-password', 'show')->name('password.confirm');
        Route::post('confirm-password', 'store');
    });

    // Logout
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});

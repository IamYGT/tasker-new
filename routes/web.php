<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Foundation\Application;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

// Controllers
use App\Http\Controllers\{
    ProfileController,
    LanguageController,
    UserController,
    TransactionController,
    WithdrawalController,
    TicketController,
    UserIbanController
};

// Admin Controllers
use App\Http\Controllers\Admin\{
    AdminDashboardController,
    AdminTransactionController,
    AdminTicketController,
    AdminLogController,
    AdminWithdrawalController,
    AdminUserController,
    AdminSettingController,
    AdminReportController
};

// Auth Controllers
use App\Http\Controllers\Auth\{
    GoogleController,
    FacebookController,
    GitHubController
};

use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| Language Switch Route
|--------------------------------------------------------------------------
*/
Route::get('/language/{lang}', [LanguageController::class, 'switchLanguage'])
    ->name('language.switch');

/*
|--------------------------------------------------------------------------
| Guest Routes
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    // Ana sayfa direkt login'e yönlendirilsin
    Route::get('/', function () {
        return redirect()->route('login');
    });
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | User Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware(['role:user'])->group(function () {
        // Withdrawal Routes
        Route::prefix('withdrawal')->name('withdrawal.')->group(function () {
            Route::get('/request', [WithdrawalController::class, 'create'])->name('request');
            Route::post('/request', [WithdrawalController::class, 'store'])->name('store');
        });

        // Transaction Routes
        Route::prefix('transactions')->name('transactions.')->group(function () {
            Route::get('/history', [TransactionController::class, 'history'])->name('history');
            Route::get('/pending', [TransactionController::class, 'pending'])->name('pending');
        });

        // Ticket Routes
        Route::prefix('tickets')->name('tickets.')->group(function () {
            Route::get('/', [TicketController::class, 'index'])->name('index');
            Route::get('/create', [TicketController::class, 'create'])->name('create');
            Route::post('/', [TicketController::class, 'store'])->name('store');
            Route::get('/{ticket}', [TicketController::class, 'show'])->name('show');
            Route::post('/{ticket}/reply', [TicketController::class, 'reply'])->name('reply');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Admin Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('admin')->middleware(['auth', 'role:admin'])->group(function () {
        // Dashboard
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])
            ->name('admin.dashboard');

        // Transactions
        Route::prefix('transactions')->name('admin.transactions.')->group(function () {
            Route::get('/', [AdminTransactionController::class, 'index'])->name('index');
            Route::get('/{transaction}', [AdminTransactionController::class, 'show'])->name('show');
            Route::get('/{transaction}/edit', [AdminTransactionController::class, 'edit'])->name('edit');
            Route::put('/{transaction}', [AdminTransactionController::class, 'update'])->name('update');
            Route::put('/{transaction}/status', [AdminTransactionController::class, 'updateStatus'])->name('update-status');
        });

        // Tickets
        Route::prefix('tickets')->name('admin.tickets.')->group(function () {
            Route::get('/', [AdminTicketController::class, 'index'])->name('index');
            Route::get('/{ticket}', [AdminTicketController::class, 'show'])->name('show');
            Route::post('/{ticket}/reply', [AdminTicketController::class, 'reply'])->name('reply');
            Route::put('/{ticket}/status', [AdminTicketController::class, 'updateStatus'])->name('update-status');
            Route::post('/create-for-user/{user}', [AdminTicketController::class, 'createForUser'])->name('create-for-user');
        });

        // Users
        Route::prefix('users')->name('admin.users.')->group(function () {
            Route::get('/', [AdminUserController::class, 'index'])->name('index');
            Route::get('/create', [AdminUserController::class, 'create'])->name('create');
            Route::post('/', [AdminUserController::class, 'store'])->name('store');
            Route::get('/{user}', [AdminUserController::class, 'show'])->name('show');
            Route::get('/{user}/edit', [AdminUserController::class, 'edit'])->name('edit');
            Route::put('/{user}', [AdminUserController::class, 'update'])->name('update');
            Route::delete('/{user}', [AdminUserController::class, 'destroy'])->name('destroy');

            // Şifre işlemleri
            Route::post('/store-password', [AdminUserController::class, 'storePassword'])->name('store-password');
            Route::post('/{user}/send-credentials', [AdminUserController::class, 'sendCredentials'])->name('send-credentials');
            Route::get('/{user}/reset-password', [AdminUserController::class, 'resetPasswordForm'])->name('reset-password-form');
            Route::post('/{user}/reset-password', [AdminUserController::class, 'resetPassword'])->name('reset-password.update');
        });

        // Withdrawals
        Route::prefix('withdrawals')->name('admin.withdrawals.')->group(function () {
            Route::get('/', [AdminWithdrawalController::class, 'index'])->name('index');
            Route::get('/{withdrawal}', [AdminWithdrawalController::class, 'show'])->name('show');
            Route::put('/{withdrawal}/status', [AdminWithdrawalController::class, 'updateStatus'])->name('update-status');
        });

        // Admin API Routes
        Route::prefix('api')->group(function () {
            Route::get('/dashboard/stats', [AdminDashboardController::class, 'getStats']);
        });
    });

    Route::middleware(['auth', 'role:admin'])->prefix('api/admin')->group(function () {
        Route::get('/dashboard/stats', [AdminDashboardController::class, 'getStats']);
    });

    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/ibans', [UserIbanController::class, 'index'])->name('ibans');
        Route::post('/ibans', [UserIbanController::class, 'store'])->name('ibans.store');
        Route::put('/ibans/{iban}', [UserIbanController::class, 'update'])->name('ibans.update');
        Route::delete('/ibans/{iban}', [UserIbanController::class, 'destroy'])->name('ibans.destroy');
    });
});

Route::middleware(['auth'])->group(function () {
    // ... diğer route'lar

    // Transaction routes
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show'])
        ->name('transactions.show');
});

/*
|--------------------------------------------------------------------------
| Social Authentication Routes
|--------------------------------------------------------------------------
*/
// Google Authentication
Route::controller(GoogleController::class)->group(function () {
    Route::get('auth/google', 'redirectToGoogle')->name('auth.google');
    Route::get('auth/google/callback', 'handleGoogleCallback')->name('auth.google.callback');
});

// Facebook Authentication
Route::controller(FacebookController::class)->group(function () {
    Route::get('auth/facebook', 'redirectToFacebook')->name('auth.facebook');
    Route::get('auth/facebook/callback', 'handleFacebookCallback')->name('auth.facebook.callback');
});

// GitHub Authentication
Route::controller(GitHubController::class)->group(function () {
    Route::get('auth/github', 'redirectToGithub')->name('auth.github');
    Route::get('auth/github/callback', 'handleGithubCallback')->name('auth.github.callback');
});

/*
|--------------------------------------------------------------------------
| File Access Routes
|--------------------------------------------------------------------------
*/
Route::get('storage/ticket-attachments/{year}/{month}/{day}/{filename}', function ($year, $month, $day, $filename) {
    $path = "ticket-attachments/{$year}/{$month}/{$day}/{$filename}";

    if (!Storage::disk('public')->exists($path)) {
        abort(404);
    }

    return Storage::disk('public')->response($path, null, [
        'Cache-Control' => 'public, max-age=86400',
    ]);
})->where([
    'year' => '[0-9]{4}',
    'month' => '[0-9]{2}',
    'day' => '[0-9]{2}',
    'filename' => '[a-zA-Z0-9_\-\.]+',
])->middleware(['auth', 'verified']);

// Auth Routes
require __DIR__.'/auth.php';

/*
|--------------------------------------------------------------------------
| Test Route
|--------------------------------------------------------------------------
*/
Route::match(['get', 'post'], '/test', function () {
    return Inertia::render('Test');
})->name('test');

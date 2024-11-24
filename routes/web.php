<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Foundation\Application;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\{
    ProfileController,
    LanguageController,
    UserController,
    TransactionController,
    WithdrawalController,
    TicketController
};

// Admin Controllers
use App\Http\Controllers\Admin\{
    AdminDashboardController,
    AdminTransactionController,
    AdminTicketController,
    AdminLogController,
    AdminWithdrawalController
};

// Auth Controllers
use App\Http\Controllers\Auth\{
    GoogleController,
    FacebookController,
    GitHubController
};

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
    // Dashboard Route
    Route::get('/dashboard', function (Request $request) {
        $user = Auth::user();
        return $user && $user->hasRole('admin')
            ? redirect()->route('admin.dashboard')
            : Inertia::render('Dashboard', [
                'showWelcomeToast' => $request->query('showWelcomeToast', false),
            ]);
    })->name('dashboard');

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
    Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
        // Dashboard
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])
            ->name('dashboard');
        
        // Resource Routes - transactions hariç diğer resource'lar
        Route::resources([
            'users' => UserController::class,
            'tickets' => AdminTicketController::class,
            'logs' => AdminLogController::class,
        ]);

        // Transactions Routes - manuel tanımlama
        Route::group(['prefix' => 'transactions'], function () {
            Route::get('/', [AdminTransactionController::class, 'index'])
                ->name('transactions.index');
            Route::get('/{transaction}', [AdminTransactionController::class, 'show'])
                ->name('transactions.show');
            Route::get('/{transaction}/edit', [AdminTransactionController::class, 'edit'])
                ->name('transactions.edit');
            Route::put('/{transaction}', [AdminTransactionController::class, 'update'])
                ->name('transactions.update');
            Route::put('/{transaction}/status', [AdminTransactionController::class, 'updateStatus'])
                ->name('transactions.update-status');
        });

        // Status Update Routes - transactions hariç
        Route::put('tickets/{ticket}/status', [AdminTicketController::class, 'updateStatus'])
            ->name('tickets.update-status');
        Route::post('tickets/{ticket}/reply', [AdminTicketController::class, 'reply'])
            ->name('tickets.reply');

        // Password Reset Routes
        Route::get('/users/{user}/reset-password', [UserController::class, 'resetPasswordForm'])
            ->name('users.reset-password-form');
        Route::post('/users/{user}/reset-password', [UserController::class, 'resetPassword'])
            ->name('users.reset-password.update');

        // Withdrawal Routes
        Route::resource('withdrawals', AdminWithdrawalController::class);
        Route::put('withdrawals/{withdrawal}/status', [AdminWithdrawalController::class, 'updateStatus'])
            ->name('withdrawals.update-status');
    });
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
| Test Route
|--------------------------------------------------------------------------
*/
Route::match(['get', 'post'], '/test', function () {
    return Inertia::render('Test');
})->name('test');

// Auth Routes
require __DIR__.'/auth.php';

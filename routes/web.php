<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Foundation\Application;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

// Controllers
use App\Http\Controllers\{
    ProfileController,
    LanguageController,
    UserController,
    TransactionController,
    WithdrawalController,
    TicketController,
    UserIbanController,
    UserCryptoController

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
    Route::get('/', function () {
        return redirect()->route('login');
    });
});

/*
|--------------------------------------------------------------------------
| Auth Check & Redirect
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    // Ana dashboard route'u - role göre yönlendirme yapar
    Route::get('/dashboard', function () {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        try {
            if ($user->hasRole('admin')) {
                return redirect()->route('admin.dashboard');
            }

            if ($user->hasRole('user')) {
                return redirect()->route('user.dashboard');
            }

            // Eğer rol atanmamışsa varsayılan olarak user rolü ata
            $userRole = Role::where('name', 'user')->firstOrFail();
            $user->assignRole($userRole);

            return redirect()->route('user.dashboard');
        } catch (\Exception $e) {
            Log::error('Role check error:', [
                'error' => $e->getMessage(),
                'user_id' => $user->id
            ]);
            return redirect()->route('user.dashboard');
        }
    })->name('dashboard');

    // User Dashboard - Sadece normal kullanıcılar için
    Route::get('/user/dashboard', [DashboardController::class, 'index'])
        ->name('user.dashboard')
        ->middleware('role:user');

    // Admin Dashboard - Sadece adminler için
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])
        ->name('admin.dashboard')
        ->middleware('role:admin');

    // Para Çekme İşlemleri
    Route::get('/withdrawal/request', [WithdrawalController::class, 'create'])->name('withdrawal.create');
    Route::post('/withdrawal/store', [WithdrawalController::class, 'store'])->name('withdrawal.store');
});

/*
|--------------------------------------------------------------------------
| User Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    // Withdrawal Routes
    Route::prefix('withdrawal')->name('withdrawal.')->group(function () {
        Route::get('/request', [WithdrawalController::class, 'create'])->name('request');
        Route::post('/store', [TransactionController::class, 'store'])->name('store');
    });

    // Transaction Routes
    Route::prefix('transactions')->name('transactions.')->group(function () {
        Route::get('/history', [TransactionController::class, 'history'])->name('history');
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
    // Transactions
    Route::prefix('transactions')->name('transactions.')->group(function () {
        Route::get('/', [AdminTransactionController::class, 'index'])->name('index');
        Route::get('/{transaction}', [AdminTransactionController::class, 'show'])->name('show');
        Route::get('/{transaction}/edit', [AdminTransactionController::class, 'edit'])->name('edit');
        Route::put('/{transaction}', [AdminTransactionController::class, 'update'])->name('update');
        Route::put('/{transaction}/status', [AdminTransactionController::class, 'updateStatus'])->name('update-status');
    });

    // Tickets
    Route::prefix('tickets')->name('tickets.')->group(function () {
        Route::get('/', [AdminTicketController::class, 'index'])->name('index');
        Route::get('/{ticket}', [AdminTicketController::class, 'show'])->name('show');
        Route::post('/{ticket}/reply', [AdminTicketController::class, 'reply'])->name('reply');
        Route::put('/{ticket}/status', [AdminTicketController::class, 'updateStatus'])->name('update-status');
        Route::post('/create-for-user/{user}', [AdminTicketController::class, 'createForUser'])->name('create-for-user');
    });

    // Users
    Route::prefix('users')->name('users.')->group(function () {
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
    Route::prefix('withdrawals')->name('withdrawals.')->group(function () {
        Route::get('/', [AdminWithdrawalController::class, 'index'])->name('index');
        Route::get('/{withdrawal}', [AdminWithdrawalController::class, 'show'])->name('show');
        Route::put('/{withdrawal}/status', [AdminWithdrawalController::class, 'updateStatus'])->name('update-status');
    });

    // Admin API Routes
    Route::prefix('api')->group(function () {
        Route::get('/dashboard/stats', [AdminDashboardController::class, 'getStats']);
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
| File Access Routes
|--------------------------------------------------------------------------
*/
Route::get('storage/ticket-attachments/{year}/{month}/{day}/{filename}', function ($year, $month, $day, $filename) {
    $path = "ticket-attachments/{$year}/{$month}/{$day}/{$filename}";

    if (!Storage::disk('public')->exists($path)) {
        abort(404);
    }

    return response()->file(Storage::disk('public')->path($path), [
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
| User Profile Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');

        // IBAN Routes
        Route::prefix('ibans')->name('ibans.')->group(function () {
            Route::get('/', [UserIbanController::class, 'index'])->name('index');
            Route::post('/', [UserIbanController::class, 'store'])->name('store');
            Route::put('/{iban}', [UserIbanController::class, 'update'])->name('update');
            Route::delete('/{iban}', [UserIbanController::class, 'destroy'])->name('destroy');
        });
    });
});

Route::middleware(['auth'])->group(function () {
    // Transactions
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::get('/transactions/history', [TransactionController::class, 'history'])->name('transactions.history');
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
});

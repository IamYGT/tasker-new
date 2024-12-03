<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            Log::info('Dashboard yükleniyor...');

            // Stats verilerini hazırla
            $stats = [
                'transactions' => [
                    'total' => (int)Transaction::count(),
                    'pending' => (int)Transaction::where('status', 'pending')->count(),
                    'completed' => (int)Transaction::where('status', 'completed')->count(),
                    'totalAmount' => (float)Transaction::where('status', 'completed')->sum('amount') ?? 0,
                    'totalAmount_usd' => (float)Transaction::where('status', 'completed')->sum('amount_usd') ?? 0,
                    'exchange_rate' => (float)Transaction::avg('exchange_rate') ?? 0,
                ],
                'users' => [
                    'total' => User::count(),
                    'activeToday' => User::where('last_login_at', '>=', now()->subDay())->count(),
                    'newThisWeek' => User::where('created_at', '>=', now()->subWeek())->count(),
                ],
                'tickets' => [
                    'total' => Ticket::count(),
                    'open' => Ticket::where('status', 'open')->count(),
                    'answered' => Ticket::where('status', 'answered')->count(),
                    'closed' => Ticket::where('status', 'closed')->count(),
                ],
                'recentActivity' => $this->getRecentActivity(),
            ];

            // Sayısal değerleri kontrol et
            $stats['transactions'] = array_map(function($value) {
                return is_numeric($value) ? (float)$value : $value;
            }, $stats['transactions']);

            Log::info('Dashboard verileri hazırlandı', ['stats' => $stats]);

            return Inertia::render('Dashboard', [
                'stats' => $stats,
                'showWelcomeToast' => session('showWelcomeToast', false)
            ]);

        } catch (\Exception $e) {
            Log::error('Dashboard yüklenirken hata:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return Inertia::render('Dashboard', [
                'stats' => [
                    'transactions' => [
                        'total' => 0,
                        'pending' => 0,
                        'completed' => 0,
                        'totalAmount' => 0,
                        'totalAmount_usd' => 0,
                        'exchange_rate' => 0,
                    ],
                    'users' => [
                        'total' => 0,
                        'activeToday' => 0,
                        'newThisWeek' => 0,
                    ],
                    'tickets' => [
                        'total' => 0,
                        'open' => 0,
                        'answered' => 0,
                        'closed' => 0,
                    ],
                    'recentActivity' => [],
                ],
                'error' => 'Veriler yüklenirken bir hata oluştu.'
            ]);
        }
    }

    private function getRecentActivity()
    {
        try {
            return collect([])
                ->merge(Transaction::with('user')->latest()->take(5)->get())
                ->merge(Ticket::with('user')->latest()->take(5)->get())
                ->sortByDesc('created_at')
                ->take(10)
                ->map(function ($item) {
                    $type = match (true) {
                        $item instanceof Transaction => 'transaction',
                        $item instanceof Ticket => 'ticket',
                        default => 'unknown'
                    };

                    return [
                        'id' => $item->id,
                        'type' => $type,
                        'user' => $item->user->name,
                        'amount' => $item->amount ?? null,
                        'amount_usd' => $item->amount_usd ?? null,
                        'status' => $item->status,
                        'created_at' => $item->created_at->diffForHumans(),
                    ];
                })
                ->values()
                ->all();
        } catch (\Exception $e) {
            Log::error('Son aktiviteler yüklenirken hata:', [
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }
}

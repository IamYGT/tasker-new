<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Ticket;
use App\Models\User;
use App\Models\UserIban;
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

            $user = auth()->user();

            // İşlem istatistikleri - Query Builder'ı düzeltiyoruz
            $transactions = Transaction::query()
                ->where('user_id', $user->id);

            $withdrawals = Transaction::query()
                ->where('user_id', $user->id)
                ->where('type', 'withdrawal')
                ->where('status', 'completed');

            // Ticket istatistikleri - Query Builder'ı düzeltiyoruz
            $tickets = Ticket::query()
                ->where('user_id', $user->id);

            // IBAN'ları getir
            $ibans = UserIban::query()
                ->with('bank') // bank ilişkisini kontrol et
                ->where('user_id', $user->id)
                ->where('is_active', true)
                ->get();

            // Çekilmiş (withdrawn) toplam tutarı hesapla
            $totalWithdrawn = Transaction::query()
                ->where('user_id', $user->id)
                ->whereIn('type', ['bank_withdrawal', 'crypto_withdrawal']) // Yeni tipleri kullan
                ->where('status', 'completed') // Sadece tamamlanmış işlemleri al
                ->sum('amount_usd');

            $exchangeRate = $transactions->clone()
                ->where('status', 'completed')
                ->avg('exchange_rate');

            $stats = [
                'transactions' => [
                    'total' => $transactions->count(),
                    'pending' => $transactions->clone()
                        ->whereIn('type', ['bank_withdrawal', 'crypto_withdrawal'])
                        ->where('status', 'pending')
                        ->count(),
                    'completed' => $transactions->clone()
                        ->whereIn('type', ['bank_withdrawal', 'crypto_withdrawal'])
                        ->where('status', 'completed')
                        ->count(),
                    'totalAmount' => $transactions->sum('amount'),
                    'totalAmount_usd' => $transactions->sum('amount_usd'),
                    'totalWithdrawn_usd' => (float) $totalWithdrawn,
                    'exchange_rate' => $exchangeRate ?? 30.0,
                ],
                'tickets' => [
                    'total' => $tickets->count(),
                    'open' => $tickets->clone()
                        ->whereIn('status', ['open', 'answered'])
                        ->count(),
                    'closed' => $tickets->clone()
                        ->where('status', 'closed')
                        ->count(),
                ],
                'ibans' => $ibans->map(function ($iban) {
                    return [
                        'id' => $iban->id,
                        'bank_name' => $iban->bank->name ?? 'Banka Adı Bulunamadı',
                        'iban' => $iban->formatted_iban ?? $iban->iban,
                        'is_default' => (bool) $iban->is_default,
                    ];
                }),
                'recentActivity' => $this->getRecentActivity($user->id),
            ];

            Log::info('Dashboard başarıyla yüklendi', ['stats' => $stats]);

            return Inertia::render('Dashboard', [
                'stats' => $stats,
                'showWelcomeToast' => session('showWelcomeToast', false)
            ]);

        } catch (\Exception $e) {
            Log::error('Dashboard yüklenirken hata:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Hata durumunda varsayılan değerler
            return Inertia::render('Dashboard', [
                'stats' => [
                    'transactions' => [
                        'total' => 0,
                        'pending' => 0,
                        'completed' => 0,
                        'totalAmount' => 0,
                        'totalAmount_usd' => 0,
                        'totalWithdrawn_usd' => 0,
                        'exchange_rate' => 30.0,
                    ],
                    'tickets' => [
                        'total' => 0,
                        'open' => 0,
                        'closed' => 0,
                    ],
                    'ibans' => [],
                    'recentActivity' => [],
                ],
                'error' => 'Veriler yüklenirken bir hata oluştu: ' . $e->getMessage()
            ]);
        }
    }

    private function getRecentActivity($userId)
    {
        $activities = collect([])
            ->merge(Transaction::with('user')
                ->where('user_id', $userId)
                ->latest()
                ->take(3)
                ->get())
            ->merge(Ticket::with('user')
                ->where('user_id', $userId)
                ->latest()
                ->take(3)
                ->get())
            ->sortByDesc('created_at')
            ->take(6);

        if ($activities->isEmpty()) {
            return [];
        }

        return $activities->map(function ($item) {
            $type = $item instanceof Transaction ? 'transaction' : 'ticket';

            return [
                'id' => $item->id,
                'type' => $type,
                'user' => $item->user->name,
                'amount' => $type === 'transaction' ? $item->amount : null,
                'amount_usd' => $type === 'transaction' ? $item->amount_usd : null,
                'status' => $item->status,
                'created_at' => $item->created_at->diffForHumans(),
                'message' => $type === 'transaction'
                    ? translate('activity.transaction', ['amount' => '$' . number_format($item->amount_usd, 2)])
                    : translate('activity.ticket')
            ];
        })->values()->all();
    }
}

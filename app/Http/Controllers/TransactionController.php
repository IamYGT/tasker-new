<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function history()
    {
        $user = Auth::user();

        // İşlem istatistiklerini hesapla ve float'a dönüştür
        $stats = [
            'total_amount_usd' => (float) $user->transactions()
                ->whereIn('status', ['completed', 'approved'])
                ->sum('amount_usd'),

            'total_amount_try' => (float) $user->transactions()
                ->whereIn('status', ['completed', 'approved'])
                ->sum('amount'),

            'pending_count' => (int) $user->transactions()
                ->whereIn('status', ['pending', 'waiting'])
                ->count(),

            'completed_count' => (int) $user->transactions()
                ->whereIn('status', ['completed', 'approved'])
                ->count(),
        ];

        // İşlemleri getir
        $transactions = $user->transactions()
            ->with(['user']) // Eager loading
            ->latest()
            ->paginate(10);

        return Inertia::render('Transactions/History', [
            'transactions' => $transactions,
            'stats' => $stats,
            'filters' => [
                'search' => request('search', ''),
                'type' => request('type', 'all'),
            ],
        ]);
    }

    public function pending()
    {
        $user = Auth::user();

        $stats = [
            'total_amount_usd' => $user->transactions()
                ->whereIn('status', ['completed', 'approved'])
                ->sum('amount_usd'),

            'total_amount_try' => $user->transactions()
                ->whereIn('status', ['completed', 'approved'])
                ->sum('amount'),

            'pending_count' => $user->transactions()
                ->whereIn('status', ['pending', 'waiting'])
                ->count(),

            'completed_count' => $user->transactions()
                ->whereIn('status', ['completed', 'approved'])
                ->count(),
        ];

        $pendingTransactions = $user->transactions()
            ->with(['user'])
            ->whereIn('status', ['pending', 'waiting'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Transactions/Pending', [
            'transactions' => $pendingTransactions,
            'stats' => $stats,
            'filters' => [
                'search' => request('search', ''),
                'type' => request('type', 'all'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        \Log::info('Withdrawal request:', $request->all());

        // Validasyon kurallarını ayır
        $commonRules = [
            'amount_usd' => 'required|numeric|min:1',
            'type' => 'required|in:withdrawal,deposit,transfer,crypto_withdrawal',
            'description' => 'nullable|string|max:255',
        ];

        $bankRules = [
            'bank_id' => 'required_if:type,withdrawal|string|max:50',
            'bank_account' => 'required_if:type,withdrawal|string|size:26',
        ];

        $cryptoRules = [
            'wallet_address' => 'required_if:type,crypto_withdrawal|string|max:255',
            'network' => 'required_if:type,crypto_withdrawal|string|in:trc20',
        ];

        // İşlem tipine göre validasyon kurallarını birleştir
        $rules = $commonRules;
        if ($request->input('type') === 'withdrawal') {
            $rules = array_merge($rules, $bankRules);
        } elseif ($request->input('type') === 'crypto_withdrawal') {
            $rules = array_merge($rules, $cryptoRules);
        }

        try {
            $validated = $request->validate($rules);

            // Döviz kuru bilgisini al
            $exchangeRate = config('exchange.usd_try', 34.77);

            // Temel transaction verilerini hazırla
            $transactionData = [
                'amount_usd' => $validated['amount_usd'],
                'amount' => $validated['amount_usd'] * $exchangeRate,
                'type' => $validated['type'],
                'status' => 'pending',
                'description' => $validated['description'] ?? null,
                'reference_id' => $this->generateReferenceId($validated['type']),
                'exchange_rate' => $exchangeRate,
            ];

            // İşlem tipine göre ek alanları ekle
            if ($validated['type'] === 'withdrawal') {
                $transactionData = array_merge($transactionData, [
                    'bank_id' => $validated['bank_id'],
                    'bank_account' => $validated['bank_account'],
                ]);
            } elseif ($validated['type'] === 'crypto_withdrawal') {
                $transactionData = array_merge($transactionData, [
                    'crypto_address' => $validated['wallet_address'],
                    'crypto_network' => $validated['network'],
                    'crypto_fee' => 1.00, // Sabit USDT ücreti
                ]);

                // Kripto işlemleri için özel alanları null yap
                $transactionData['bank_id'] = null;
                $transactionData['bank_account'] = null;
            }

            // İşlem geçmişini kaydet
            $transactionData['history'] = json_encode([
                [
                    'status' => 'pending',
                    'timestamp' => now(),
                    'note' => $validated['type'] === 'crypto_withdrawal'
                        ? 'Crypto withdrawal request created'
                        : 'Bank withdrawal request created'
                ]
            ]);

            try {
                $transaction = Auth::user()->transactions()->create($transactionData);

                $successMessage = $validated['type'] === 'crypto_withdrawal'
                    ? 'transaction.crypto.created'
                    : 'transaction.created';

                // history sayfasına yönlendir
                return redirect()
                    ->route('transactions.history')
                    ->with('success', translate($successMessage));
            } catch (\Exception $e) {
                \Log::error('Transaction creation failed:', [
                    'error' => $e->getMessage(),
                    'data' => $transactionData
                ]);

                $errorMessage = $validated['type'] === 'crypto_withdrawal'
                    ? 'transaction.crypto.error'
                    : 'transaction.error';

                return redirect()
                    ->back()
                    ->with('error', translate($errorMessage))
                    ->withInput();
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed:', [
                'errors' => $e->errors(),
                'request' => $request->all()
            ]);
            throw $e;
        }
    }

    // İşlem detaylarını görüntüleme
    public function show(Transaction $transaction)
    {
        // Yetkilendirme kontrolü
        if ($transaction->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction->load(['user']),
        ]);
    }

    /**
     * Benzersiz referans ID oluştur
     */
    private function generateReferenceId(string $type): string
    {
        $prefix = match($type) {
            'withdrawal' => 'WD',
            'crypto_withdrawal' => 'CR',
            'deposit' => 'DP',
            'transfer' => 'TR',
            default => 'TX'
        };

        return $prefix . '-' . strtoupper(uniqid());
    }
}

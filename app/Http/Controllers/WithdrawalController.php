<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class WithdrawalController extends Controller
{
    public function create()
    {
        // Döviz kurunu cache'den al veya API'den çek
        $exchangeRate = Cache::remember('usd_try_rate', 3600, function () {
            try {
                $response = Http::get('https://api.exchangerate-api.com/v4/latest/USD');
                return $response->json()['rates']['TRY'] ?? 30.0;
            } catch (\Exception $e) {
                \Log::error('Exchange rate API error: ' . $e->getMessage());
                return 30.0; // Fallback değeri
            }
        });

        // Kullanıcının kayıtlı IBAN'larını getir
        $savedIbans = auth()->user()->ibans()
            ->where('is_active', true)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Withdrawal/Create', [
            'exchangeRate' => $exchangeRate,
            'savedIbans' => $savedIbans
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount_usd' => 'required|numeric|min:1',
            'bank_id' => 'required|string|max:50',
            'bank_account' => [
                'required',
                'string',
                'max:26',
                'regex:/^TR[0-9]{24}$/', // IBAN formatı kontrolü
            ]
        ], [
            'bank_account.regex' => translate('withdrawal.invalidIBAN')
        ]);

        // Döviz kurunu al
        $exchangeRate = Cache::remember('usd_try_rate', 3600, function () {
            try {
                $response = Http::get('https://api.exchangerate-api.com/v4/latest/USD');
                return $response->json()['rates']['TRY'] ?? 30.0;
            } catch (\Exception $e) {
                \Log::error('Exchange rate API error: ' . $e->getMessage());
                return 30.0;
            }
        });

        try {
            // Benzersiz referans numarası oluştur
            $referenceId = 'WD-' . strtoupper(Str::random(8));

            $transaction = Transaction::create([
                'user_id' => auth()->id(),
                'amount_usd' => $validated['amount_usd'],
                'amount' => $validated['amount_usd'] * $exchangeRate, // TL tutarı
                'exchange_rate' => $exchangeRate,
                'type' => Transaction::TYPE_WITHDRAWAL,
                'status' => Transaction::STATUS_WAITING,
                'bank_id' => $validated['bank_id'],
                'bank_account' => $validated['bank_account'],
                'reference_id' => $referenceId,
            ]);

            // İşlem geçmişine ekle
            $transaction->addToHistory('withdrawal.created', 'create', [
                'amount_usd' => $validated['amount_usd'],
                'amount_try' => $transaction->amount
            ]);

            return redirect()
                ->route('transactions.history')
                ->with('success', translate('withdrawal.requestCreated'));

        } catch (\Exception $e) {
            \Log::error('Withdrawal creation error:', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
                'data' => $validated
            ]);

            return back()
                ->withInput()
                ->with('error', translate('withdrawal.createError'));
        }
    }
}

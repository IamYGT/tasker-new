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

        // Kullanıcının kayıtlı IBAN'larını getir ve banka detaylarını ekle
        $savedIbans = auth()->user()->ibans()
            ->where('is_active', true)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($iban) {
                // Banka bilgilerini ekle
                $banksJson = file_get_contents(resource_path('js/Data/turkey_banks.json'));
                $banks = json_decode($banksJson, true)['banks'];
                $bankDetails = collect($banks)->firstWhere('id', $iban->bank_id);

                return [
                    'id' => $iban->id,
                    'bank_id' => $iban->bank_id,
                    'iban' => $iban->iban,
                    'title' => $iban->title,
                    'is_default' => $iban->is_default,
                    'is_active' => $iban->is_active,
                    'bank_details' => [
                        'name' => $bankDetails['name'] ?? '',
                        'code' => $bankDetails['code'] ?? '',
                        'swift' => $bankDetails['swift'] ?? ''
                    ]
                ];
            });

        return Inertia::render('Withdrawal/Create', [
            'exchangeRate' => $exchangeRate,
            'savedIbans' => $savedIbans
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount_usd' => 'required|numeric|min:1',
            'bank_id' => 'required|string',
            'bank_account' => 'required|string',
            'type' => 'required|in:withdrawal'
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

            // Yönlendirmeyi pending transactions sayfasına değiştir
            return redirect()
                ->route('transactions.pending')
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

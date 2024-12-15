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

        // Aktif bankaları getir
        $banks = \DB::table('banks')
            ->where('is_active', true)
            ->get(['id', 'name', 'code', 'swift', 'logo']);

        // Kullanıcının kayıtlı IBAN'larını getir ve banka detaylarını ekle
        $savedIbans = auth()->user()->ibans()
            ->where('is_active', true)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($iban) use ($banks) {


                $bankDetails = $banks->firstWhere('id', $iban->bank_id);

                return [
                    'id' => $iban->id,
                    'bank_id' => $iban->bank_id,
                    'iban' => $iban->iban,
                    'title' => $iban->title,
                    'is_default' => $iban->is_default,
                    'is_active' => $iban->is_active,
                    'name' => $iban->name,        // İsim
                    'surname' => $iban->surname,  // Soyisim
                    'bank_details' => $bankDetails ? [
                        'name' => $bankDetails->name,
                        'code' => $bankDetails->code,
                        'swift' => $bankDetails->swift
                    ] : null
                ];
            });

       

        return Inertia::render('Withdrawal/Create', [
            'exchangeRate' => $exchangeRate,
            'savedIbans' => $savedIbans,
            'banks' => $banks // Banka listesini frontend'e gönder
        ]);
    }

    public function store(Request $request)
    {
        \Log::info('Withdrawal request started:', [
            'type' => $request->input('type'),
            'all_data' => $request->all()
        ]);

        // Temel kurallar
        $commonRules = [
            'amount_usd' => 'required|numeric|min:1',
            'type' => 'required|string|in:bank_withdrawal,crypto_withdrawal',
        ];

        // Banka çekimi için kurallar
        $bankRules = [
            'bank_id' => 'required_if:type,bank_withdrawal|string',
            'bank_account' => 'required_if:type,bank_withdrawal|string',
            'customer_name' => 'required_if:type,bank_withdrawal|string|max:255',
            'customer_surname' => 'required_if:type,bank_withdrawal|string|max:255',
            'customer_meta_id' => 'nullable|string|max:255',
        ];

        // Kripto çekimi için kurallar
        $cryptoRules = [
            'wallet_address' => 'required|string|max:255',
            'network' => 'required|string|in:trc20',
        ];

        // İşlem tipine göre kuralları belirle
        if ($request->input('type') === 'crypto_withdrawal') {
            $rules = array_merge($commonRules, $cryptoRules);
        } else {
            $rules = array_merge($commonRules, $bankRules);
        }

        \Log::info('Applied validation rules:', [
            'type' => $request->input('type'),
            'rules' => $rules
        ]);

        try {
            $validated = $request->validate($rules);
            \Log::info('Validation passed:', $validated);

            $exchangeRate = Cache::remember('usd_try_rate', 3600, function () {
                try {
                    $response = Http::get('https://api.exchangerate-api.com/v4/latest/USD');
                    return $response->json()['rates']['TRY'] ?? 30.0;
                } catch (\Exception $e) {
                    \Log::error('Exchange rate API error: ' . $e->getMessage());
                    return 30.0;
                }
            });

            // Temel transaction verilerini hazırla
            $transactionData = [
                'user_id' => auth()->id(),
                'amount_usd' => $validated['amount_usd'],
                'amount' => $validated['amount_usd'] * $exchangeRate,
                'type' => $validated['type'],
                'status' => Transaction::STATUS_PENDING,
                'reference_id' => $this->generateReferenceId($validated['type']),
                'exchange_rate' => $exchangeRate,
            ];

            // İşlem tipine göre ek verileri ekle
            if ($validated['type'] === 'bank_withdrawal') {
                $transactionData = array_merge($transactionData, [
                    'bank_id' => $validated['bank_id'],
                    'bank_account' => $validated['bank_account'],
                    'customer_name' => $validated['customer_name'],
                    'customer_surname' => $validated['customer_surname'],
                    'customer_meta_id' => $validated['customer_meta_id'] ?? null,
                ]);
            } elseif ($validated['type'] === 'crypto_withdrawal') {
                $transactionData = array_merge($transactionData, [
                    'crypto_address' => $validated['wallet_address'],
                    'crypto_network' => $validated['network'],
                    'crypto_fee' => 1.00,
                    // Kripto işlemlerinde müşteri bilgilerini null olarak ayarla
                    'customer_name' => null,
                    'customer_surname' => null,
                    'customer_meta_id' => null,
                ]);
            }

            \Log::info('Transaction data prepared:', [
                'type' => $validated['type'],
                'data' => $transactionData
            ]);

            try {
                $transaction = Transaction::create($transactionData);

                \Log::info('Transaction created successfully:', [
                    'id' => $transaction->id,
                    'type' => $transaction->type,
                    'all_attributes' => $transaction->getAttributes()
                ]);

                // İşlem geçmişini ekle
                $historyMessage = $validated['type'] === 'crypto_withdrawal'
                    ? 'crypto_withdrawal.created'
                    : 'bank_withdrawal.created';

                $transaction->addToHistory($historyMessage, 'create', [
                    'amount_usd' => $validated['amount_usd'],
                    'amount_try' => $transaction->amount
                ]);

                \Log::info('Transaction history added');

                return redirect()
                    ->route('transactions.pending')
                    ->with('success', translate('withdrawal.requestCreated'));

            } catch (\Exception $e) {
                \Log::error('Transaction creation failed:', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                    'data' => $transactionData
                ]);

                throw $e;
            }

        } catch (\Exception $e) {
            \Log::error('Withdrawal process failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return back()
                ->withInput()
                ->with('error', translate('withdrawal.createError'));
        }
    }
}

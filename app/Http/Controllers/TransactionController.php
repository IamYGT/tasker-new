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
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'bank_account' => 'required|string',
            'type' => 'required|in:withdrawal,deposit,transfer',
            'description' => 'nullable|string|max:255'
        ]);

        $transaction = Auth::user()->transactions()->create([
            ...$validated,
            'status' => 'pending',
            'reference_id' => 'TRX-' . uniqid()
        ]);

        return redirect()->back()->with('success', translate('transaction.created'));
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
}

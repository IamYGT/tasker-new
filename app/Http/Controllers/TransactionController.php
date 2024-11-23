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
        $transactions = Auth::user()->transactions()
            ->latest()
            ->paginate(10);

        return Inertia::render('Transactions/History', [
            'transactions' => $transactions
        ]);
    }

    public function pending()
    {
        $pendingTransactions = Auth::user()->transactions()
            ->where('status', 'pending')
            ->latest()
            ->paginate(10);

        return Inertia::render('Transactions/Pending', [
            'transactions' => $pendingTransactions
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

        return redirect()->back()->with('success', 'İşleminiz başarıyla oluşturuldu.');
    }
} 
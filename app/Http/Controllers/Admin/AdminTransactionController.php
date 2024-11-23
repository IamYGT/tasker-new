<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminTransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with('user')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->whereRaw('LOWER(reference_id) LIKE ?', ['%' . strtolower($search) . '%'])
                        ->orWhere('amount', 'like', "%{$search}%")
                        ->orWhereRaw('LOWER(bank_account) LIKE ?', ['%' . strtolower($search) . '%'])
                        ->orWhereHas('user', function ($query) use ($search) {
                            $query->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
                                ->orWhereRaw('LOWER(email) LIKE ?', ['%' . strtolower($search) . '%']);
                        });
                });
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->when($request->filled('type'), function ($query) use ($request) {
                $query->where('type', $request->type);
            })
            ->latest();

        $transactions = $query->paginate(10)
            ->appends($request->query());

        return Inertia::render('Admin/Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'status', 'type']),
            'statuses' => Transaction::STATUSES,
            'types' => Transaction::TYPES,
        ]);
    }

    public function updateStatus(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,completed,cancelled',
            'notes' => 'nullable|string|max:1000'
        ]);

        $transaction->update($validated);

        return back()->with('success', translate('transaction.statusUpdated'));
    }

    public function edit(Transaction $transaction)
    {
        return Inertia::render('Admin/Transactions/Edit', [
            'transaction' => $transaction->load('user'),
            'statuses' => Transaction::STATUSES,
        ]);
    }

    public function update(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'status' => 'required|in:' . implode(',', Transaction::STATUSES),
            'notes' => 'nullable|string|max:1000'
        ]);

        $transaction->update($validated);

        return redirect()
            ->route('admin.transactions.index')
            ->with('success', translate('transaction.statusUpdated'));
    }

    public function show(Transaction $transaction)
    {
        return Inertia::render('Admin/Transactions/Show', [
            'transaction' => $transaction->load('user'),
            'history' => $transaction->history ?? [], // Eğer history ilişkisi varsa
        ]);
    }
} 
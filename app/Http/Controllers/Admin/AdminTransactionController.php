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
        $baseQuery = Transaction::with('user')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->whereRaw('LOWER(reference_id) LIKE ?', ['%' . strtolower($search) . '%'])
                        ->orWhere('amount', 'like', "%{$search}%")
                        ->orWhere('amount_usd', 'like', "%{$search}%")
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
            });

        $stats = [
            'total_usd' => Transaction::where('status', 'completed')
                ->sum('amount_usd'),
            'total_try' => Transaction::where('status', 'completed')
                ->sum('amount'),
            'average_rate' => Transaction::where('status', 'completed')
                ->whereNotNull('exchange_rate')
                ->avg('exchange_rate') ?? null,
            'counts' => [
                'total' => $baseQuery->count(),
                'completed' => $baseQuery->clone()->where('status', 'completed')->count(),
                'pending' => $baseQuery->clone()->where('status', 'pending')->count(),
                'cancelled' => $baseQuery->clone()->where('status', 'cancelled')->count(),
            ],
            'today' => [
                'total_usd' => Transaction::where('status', 'completed')
                    ->whereDate('created_at', today())
                    ->sum('amount_usd'),
                'total_try' => Transaction::where('status', 'completed')
                    ->whereDate('created_at', today())
                    ->sum('amount'),
                'count' => Transaction::whereDate('created_at', today())->count(),
            ],
            'this_month' => [
                'total_usd' => Transaction::where('status', 'completed')
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->sum('amount_usd'),
                'total_try' => Transaction::where('status', 'completed')
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->sum('amount'),
                'count' => Transaction::whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
            ]
        ];

        $transactions = $baseQuery->latest()->paginate(10)
            ->appends($request->query());

        return Inertia::render('Admin/Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'status', 'type']),
            'statuses' => Transaction::STATUSES,
            'types' => Transaction::TYPES,
            'stats' => $stats,
        ]);
    }

    public function updateStatus(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,completed,cancelled,rejected',
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
            'status' => 'required|in:pending,completed,cancelled,rejected',
            'notes' => 'nullable|string|max:1000'
        ]);

        $oldStatus = $transaction->status;

        $transaction->update($validated);

        // İşlem geçmişine kaydet
        if ($oldStatus !== $validated['status']) {
            $transaction->addToHistory(
                'transaction.statusChangeMessage',
                'status_change',
                [
                    'old' => $oldStatus,
                    'new' => $validated['status']
                ]
            );
        }

        if ($validated['notes'] && $validated['notes'] !== $transaction->getOriginal('notes')) {
            $transaction->addToHistory('transaction.notesUpdated', 'notes_update');
        }

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

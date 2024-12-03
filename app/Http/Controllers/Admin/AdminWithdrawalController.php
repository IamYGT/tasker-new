<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Withdrawal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminWithdrawalController extends Controller
{
    public function index(Request $request)
    {
        $query = Withdrawal::with('user')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->whereRaw('LOWER(bank_account) LIKE ?', ['%' . strtolower($search) . '%'])
                        ->orWhere('amount', 'like', "%{$search}%")
                        ->orWhere('amount_usd', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($query) use ($search) {
                            $query->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
                                ->orWhereRaw('LOWER(email) LIKE ?', ['%' . strtolower($search) . '%']);
                        });
                });
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->status);
            });

        $withdrawals = $query->latest()->paginate(10)
            ->appends($request->query());

        return Inertia::render('Admin/Withdrawals/Index', [
            'withdrawals' => $withdrawals,
            'filters' => $request->only(['search', 'status']),
            'statuses' => Withdrawal::STATUSES
        ]);
    }

    public function show(Withdrawal $withdrawal)
    {
        return Inertia::render('Admin/Withdrawals/Show', [
            'withdrawal' => $withdrawal->load('user'),
            'history' => $withdrawal->history ?? []
        ]);
    }

    public function updateStatus(Request $request, Withdrawal $withdrawal)
    {
        $validated = $request->validate([
            'status' => 'required|in:' . implode(',', Withdrawal::STATUSES),
            'notes' => 'nullable|string|max:1000'
        ]);

        $oldStatus = $withdrawal->status;

        $withdrawal->update([
            'status' => $validated['status'],
            'notes' => $validated['notes'],
            'processed_at' => in_array($validated['status'], ['completed', 'rejected']) ? now() : null
        ]);

        if ($oldStatus !== $validated['status']) {
            $withdrawal->addToHistory(
                'withdrawal.statusChangeMessage',
                'status_change',
                [
                    'old' => $oldStatus,
                    'new' => $validated['status']
                ]
            );
        }

        if ($validated['notes'] && $validated['notes'] !== $withdrawal->getOriginal('notes')) {
            $withdrawal->addToHistory('withdrawal.notesUpdated', 'notes_update');
        }

        return back()->with('success', translate('withdrawal.statusUpdated'));
    }
}

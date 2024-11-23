<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Withdrawal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminWithdrawalController extends Controller
{
    public function index()
    {
        $withdrawals = Withdrawal::with('user')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Withdrawals/Index', [
            'withdrawals' => $withdrawals
        ]);
    }

    public function show(Withdrawal $withdrawal)
    {
        return Inertia::render('Admin/Withdrawals/Show', [
            'withdrawal' => $withdrawal->load('user')
        ]);
    }

    public function updateStatus(Request $request, Withdrawal $withdrawal)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected,completed',
            'notes' => 'nullable|string|max:1000'
        ]);

        $withdrawal->update([
            'status' => $validated['status'],
            'notes' => $validated['notes'],
            'processed_at' => $validated['status'] === 'completed' ? now() : null
        ]);

        return back()->with('success', translate('withdrawal.statusUpdated'));
    }
} 
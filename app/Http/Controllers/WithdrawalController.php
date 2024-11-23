<?php

namespace App\Http\Controllers;

use App\Models\Withdrawal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WithdrawalController extends Controller
{
    public function create()
    {
        return Inertia::render('Withdrawal/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'bank_account' => 'required|string|max:255',
        ]);

        $withdrawal = Withdrawal::create([
            'user_id' => auth()->id(),
            'amount' => $validated['amount'],
            'bank_account' => $validated['bank_account'],
            'status' => Withdrawal::STATUS_PENDING
        ]);

        return redirect()->back()->with('success', translate('withdrawal.requestCreated'));
    }
} 
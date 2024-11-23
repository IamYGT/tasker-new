<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Transaction;
use App\Models\Ticket;
use App\Models\Withdrawal;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'totalUsers' => User::count(),
            'activeUsers' => User::where('is_active', true)->count(),
            'totalTransactions' => Transaction::count(),
            'pendingTransactions' => Transaction::where('status', 'pending')->count(),
            'totalTickets' => Ticket::count(),
            'openTickets' => Ticket::where('status', 'open')->count(),
            'totalWithdrawals' => Withdrawal::count(),
            'pendingWithdrawals' => Withdrawal::where('status', 'pending')->count(),
            'recentActivity' => $this->getRecentActivity(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }

    private function getRecentActivity()
    {
        $activity = collect();

        // Son işlemler
        $transactions = Transaction::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'type' => 'transaction',
                    'description' => "{$transaction->user->name} tarafından {$transaction->amount} tutarında işlem",
                    'created_at' => $transaction->created_at,
                    'status' => $transaction->status,
                ];
            });

        // Son biletler
        $tickets = Ticket::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($ticket) {
                return [
                    'id' => $ticket->id,
                    'type' => 'ticket',
                    'description' => "{$ticket->user->name} tarafından yeni destek talebi",
                    'created_at' => $ticket->created_at,
                    'status' => $ticket->status,
                ];
            });

        return $activity->concat($transactions)
            ->concat($tickets)
            ->sortByDesc('created_at')
            ->take(10)
            ->values()
            ->all();
    }
} 
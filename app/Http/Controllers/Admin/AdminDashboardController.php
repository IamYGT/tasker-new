<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    private function getStatsData(): array
    {
        return [
            'users' => [
                'total' => User::count(),
                'activeToday' => DB::table('sessions')
                    ->where('last_activity', '>=', now()->subDay()->getTimestamp())
                    ->distinct('user_id')
                    ->count(),
                'newThisWeek' => User::where('created_at', '>=', now()->subWeek())->count(),
            ],
            'tickets' => [
                'total' => Ticket::count(),
                'open' => Ticket::where('status', 'open')->count(),
                'answered' => Ticket::where('status', 'answered')->count(),
                'closed' => Ticket::where('status', 'closed')->count(),
            ],
            'transactions' => [
                'total' => Transaction::count(),
                'pending' => Transaction::where('status', 'pending')->count(),
                'completed' => Transaction::where('status', 'completed')->count(),
                'totalAmount' => Transaction::where('status', 'completed')->sum('amount'),
                'totalAmount_usd' => Transaction::where('status', 'completed')->sum('amount_usd'),
                'exchange_rate' => Transaction::avg('exchange_rate') ?? 0,
            ],
            'recentActivity' => $this->getRecentActivity(),
        ];
    }

    public function index()
    {
        $now = Carbon::now();
        $monthStart = $now->startOfMonth();

        $stats = [
            'users' => [
                'total' => User::count(),
                'activeToday' => DB::table('sessions')
                    ->where('last_activity', '>=', now()->subDay()->getTimestamp())
                    ->distinct('user_id')
                    ->count(),
                'newThisWeek' => User::where('created_at', '>=', now()->subWeek())->count(),
            ],
            'tickets' => [
                'total' => Ticket::count(),
                'open' => Ticket::where('status', 'open')->count(),
                'answered' => Ticket::where('status', 'answered')->count(),
                'closed' => Ticket::where('status', 'closed')->count(),
            ],
            'transactions' => [
                'total' => Transaction::count(),
                'pending' => Transaction::where('status', 'pending')->count(),
                'completed' => Transaction::where('status', 'completed')->count(),
                'totalAmount' => Transaction::where('status', 'completed')->sum('amount'),
                'totalAmount_usd' => Transaction::where('status', 'completed')->sum('amount_usd'),
                'exchange_rate' => Transaction::avg('exchange_rate') ?? 0,
            ],
            'recentActivity' => $this->getRecentActivity(),
        ];

        return Inertia::render('Admin/AdminDashboard', [
            'stats' => $stats
        ]);
    }

    private function calculateTransactionGrowth()
    {
        $currentMonth = Transaction::where('status', 'completed')
            ->where('created_at', '>=', now()->startOfMonth())
            ->count();

        $lastMonth = Transaction::where('status', 'completed')
            ->whereBetween('created_at', [
                now()->subMonth()->startOfMonth(),
                now()->subMonth()->endOfMonth()
            ])
            ->count();

        return $this->calculateGrowth($lastMonth, $currentMonth);
    }

    private function calculateAverageTransactionAmount()
    {
        return Cache::remember('avg_transaction_amount', 300, function () {
            return Transaction::where('status', 'completed')
                ->where('created_at', '>=', now()->subDays(30))
                ->avg('amount') ?? 0;
        });
    }

    private function getRecentActivity()
    {
        return Cache::remember('recent_activity', 60, function () {
            return collect([])
                ->merge(Transaction::with(['user'])->latest()->take(5)->get())
                ->merge(Ticket::with(['user', 'histories'])->latest()->take(5)->get())
                ->sortByDesc('created_at')
                ->take(10)
                ->map(function ($item) {
                    $type = match (true) {
                        $item instanceof Transaction => 'transaction',
                        $item instanceof Ticket => 'ticket',
                        default => 'unknown'
                    };

                    return [
                        'id' => $item->id,
                        'type' => $type,
                        'user_name' => $item->user->name,
                        'description' => $this->getActivityDescription($item),
                        'created_at' => $item->created_at->diffForHumans(),
                        'status' => $item->status ?? 'unknown',
                        'amount' => $item instanceof Transaction ? (float) $item->amount : null,
                        'amount_usd' => $item instanceof Transaction ? (float) $item->amount_usd : null,
                        'exchange_rate' => $item instanceof Transaction ? (float) $item->exchange_rate : null,
                        'history' => $item instanceof Transaction ? $item->history : []
                    ];
                })
                ->values()
                ->all();
        });
    }

    private function getActivityDescription($item)
    {
        if ($item instanceof Transaction) {
            return translate('dashboard.activity.transaction', [
                'type' => $item->type,
                'amount' => number_format($item->amount, 2),
                'currency' => 'TL'
            ]);
        }

        if ($item instanceof Ticket) {
            return translate('dashboard.activity.ticket', [
                'subject' => $item->subject
            ]);
        }

        return translate('dashboard.activity.unknown');
    }

    public function getStats(): JsonResponse
    {
        $stats = $this->getStatsData();
        return response()->json($stats);
    }

    private function calculateGrowth($previous, $current)
    {
        if ($previous == 0)
            return $current > 0 ? 100 : 0;
        return round((($current - $previous) / $previous) * 100, 2);
    }

    private function calculateAverageTicketResponseTime()
    {
        return Cache::remember('average_ticket_response_time', 300, function () {
            $tickets = Ticket::with(['messages' => function ($query) {
                $query->orderBy('created_at', 'asc');
            }])
                ->whereHas('messages', function ($query) {
                    $query->where('is_admin', true);
                })
                ->get();

            $totalResponseTime = 0;
            $respondedTickets = 0;

            foreach ($tickets as $ticket) {
                $firstUserMessage = $ticket->messages->where('is_admin', false)->first();
                $firstAdminResponse = $ticket->messages->where('is_admin', true)->first();

                if ($firstUserMessage && $firstAdminResponse) {
                    $totalResponseTime += $firstAdminResponse->created_at->diffInMinutes($firstUserMessage->created_at);
                    $respondedTickets++;
                }
            }

            return $respondedTickets > 0 ? round($totalResponseTime / $respondedTickets) : 0;
        });
    }
}

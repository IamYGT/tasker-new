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
        $now = Carbon::now();
        $monthStart = $now->startOfMonth();
        $lastMonthStart = $now->copy()->subMonth()->startOfMonth();

        // System Health
        $activeSessions = DB::table('sessions')
            ->where('last_activity', '>=', now()->subMinutes(5)->getTimestamp())
            ->count();
        $failedJobs = DB::table('failed_jobs')->count();

        // User Statistics
        $totalUsers = User::count();
        $activeUsers = DB::table('sessions')
            ->where('last_activity', '>=', now()->subDays(7)->getTimestamp())
            ->distinct('user_id')
            ->count();
        $newUsersThisMonth = User::where('created_at', '>=', $monthStart)->count();

        // User Growth Trend (last 6 months)
        $userGrowth = collect(range(5, 0))->map(function ($months) {
            $start = now()->subMonths($months)->startOfMonth();
            $end = $start->copy()->endOfMonth();
            return [
                'month' => $start->format('M'),
                'users' => User::whereBetween('created_at', [$start, $end])->count()
            ];
        });

        // Transaction Statistics
        $totalTransactions = Transaction::count();
        $pendingTransactions = Transaction::where('status', 'pending')->count();
        $monthlyVolume = Transaction::where('created_at', '>=', $monthStart)
            ->where('status', 'completed')
            ->sum('amount');

        // Calculate trends
        $lastMonthUsers = User::where('created_at', '>=', $lastMonthStart)
            ->where('created_at', '<', $monthStart)
            ->count();

        $userTrend = $lastMonthUsers > 0
            ? round(($newUsersThisMonth - $lastMonthUsers) / $lastMonthUsers * 100, 1)
            : 100;

        $lastMonthVolume = Transaction::where('created_at', '>=', $lastMonthStart)
            ->where('created_at', '<', $monthStart)
            ->where('status', 'completed')
            ->sum('amount');

        $volumeTrend = $lastMonthVolume > 0
            ? round(($monthlyVolume - $lastMonthVolume) / $lastMonthVolume * 100, 1)
            : 100;

        // Recent Activity
        $recentActivity = collect([])
            ->merge(Transaction::with('user')->latest()->take(5)->get())
            ->merge(User::latest()->take(5)->get())
            ->merge(Ticket::with('user')->latest()->take(5)->get())
            ->sortByDesc('created_at')
            ->take(10)
            ->map(function ($item) {
                if ($item instanceof Transaction) {
                    return [
                        'id' => $item->id,
                        'type' => 'transaction',
                        'description' => "New {$item->type} transaction ({$item->reference_id})",
                        'status' => $item->status,
                        'user' => $item->user->name,
                        'timestamp' => $item->created_at->toIso8601String()
                    ];
                } elseif ($item instanceof User) {
                    return [
                        'id' => $item->id,
                        'type' => 'user',
                        'description' => 'New user registration',
                        'status' => $item->email_verified_at ? 'verified' : 'pending',
                        'user' => $item->name,
                        'timestamp' => $item->created_at->toIso8601String()
                    ];
                } else {
                    return [
                        'id' => $item->id,
                        'type' => 'ticket',
                        'description' => "New ticket: {$item->subject}",
                        'status' => $item->status,
                        'user' => $item->user->name,
                        'timestamp' => $item->created_at->toIso8601String()
                    ];
                }
            })
            ->values()
            ->all();

        return [
            'systemHealth' => [
                'activeSessions' => $activeSessions,
                'failedJobs' => $failedJobs,
            ],
            'userStats' => [
                'total' => $totalUsers,
                'active' => $activeUsers,
                'newThisMonth' => $newUsersThisMonth,
                'trend' => $userTrend,
            ],
            'userGrowth' => $userGrowth,
            'transactionStats' => [
                'total' => $totalTransactions,
                'pending' => $pendingTransactions,
                'monthlyVolume' => $monthlyVolume,
                'volumeTrend' => $volumeTrend,
            ],
            'recentActivity' => $recentActivity ?: [],
        ];
    }

    public function index()
    {
        $stats = Cache::remember('admin_dashboard_stats', 300, function () {
            return $this->getStatsData();
        });

        return Inertia::render('Admin/Dashboard', compact('stats'));
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

    private function getActivityDescription($item)
    {
        if ($item instanceof Transaction) {
            return "New {$item->type} transaction ({$item->amount} TL)";
        }

        return "New ticket: {$item->subject}";
    }
}

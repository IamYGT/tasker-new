<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TicketReplyRequest;
use App\Models\Ticket;
use App\Services\TicketAttachmentService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AdminTicketController extends Controller
{
    protected $attachmentService;

    public function __construct(TicketAttachmentService $attachmentService)
    {
        $this->attachmentService = $attachmentService;
    }

    public function index(Request $request)
    {
        $query = Ticket::with('user')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->whereRaw('LOWER(subject) LIKE ?', ['%' . strtolower($search) . '%'])
                        ->orWhereHas('user', function ($query) use ($search) {
                            $query->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
                                ->orWhereRaw('LOWER(email) LIKE ?', ['%' . strtolower($search) . '%']);
                        });
                });
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->when($request->filled('priority'), function ($query) use ($request) {
                $query->where('priority', $request->priority);
            })
            ->when($request->filled('category'), function ($query) use ($request) {
                $query->where('category', $request->category);
            })
            ->latest('last_reply_at');

        $stats = [
            'total' => Ticket::count(),
            'open' => Ticket::where('status', 'open')->count(),
            'answered' => Ticket::where('status', 'answered')->count(),
            'high_priority' => Ticket::where('priority', 'high')->count(),
        ];

        $tickets = $query->paginate(10)
            ->appends($request->query());

        return Inertia::render('Admin/Tickets/Index', [
            'tickets' => $tickets,
            'filters' => $request->only(['search', 'status', 'priority', 'category']),
            'statuses' => Ticket::STATUSES,
            'priorities' => Ticket::PRIORITIES,
            'categories' => Ticket::CATEGORIES,
            'stats' => $stats,
        ]);
    }

    public function show(Ticket $ticket)
    {
        return Inertia::render('Admin/Tickets/Show', [
            'ticket' => $ticket->load(['user', 'replies.user']),
            'statuses' => Ticket::STATUSES,
            'priorities' => Ticket::PRIORITIES,
            'categories' => Ticket::CATEGORIES,
        ]);
    }

    public function reply(TicketReplyRequest $request, Ticket $ticket)
    {
        DB::beginTransaction();
        
        try {
            $reply = $ticket->replies()->create([
                'user_id' => auth()->id(),
                'message' => $request->message,
                'quote' => $request->quote,
                'is_admin' => auth()->user()->hasRole('admin')
            ]);

            if ($request->hasFile('attachments')) {
                $this->attachmentService->uploadAttachments(
                    $request->file('attachments'),
                    $reply
                );
            }

            if ($ticket->status === 'open') {
                $ticket->updateStatus('answered');
            } elseif ($request->status) {
                $ticket->updateStatus($request->status);
            }

            $ticket->addToHistory('ticket.replied');

            DB::commit();
            return back()->with('success', 'ticket.replySent');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Ticket yanıt hatası:', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticket->id
            ]);
            
            return back()->with('error', 'ticket.replyError');
        }
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'status' => 'required|in:' . implode(',', Ticket::STATUSES)
        ]);

        $oldStatus = $ticket->status;
        $ticket->update([
            'status' => $validated['status'],
            'last_reply_at' => now(),
        ]);

        $ticket->addToHistory('ticket.statusChanged', 'info', [
            'old' => $oldStatus,
            'new' => $validated['status']
        ]);

        return back()->with('success', 'ticket.statusUpdated');
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Services\TicketAttachmentService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TicketController extends Controller
{
    protected $attachmentService;

    public function __construct(TicketAttachmentService $attachmentService)
    {
        $this->attachmentService = $attachmentService;
    }

    public function index()
    {
        $tickets = Ticket::where('user_id', auth()->id())
            ->with('user')
            ->latest('last_reply_at')
            ->paginate(10);

        $stats = [
            'total' => Ticket::where('user_id', auth()->id())->count(),
            'open' => Ticket::where('user_id', auth()->id())->where('status', 'open')->count(),
            'answered' => Ticket::where('user_id', auth()->id())->where('status', 'answered')->count(),
        ];

        return Inertia::render('Tickets/Index', [
            'tickets' => $tickets,
            'stats' => $stats,
            'statuses' => Ticket::STATUSES,
            'priorities' => Ticket::PRIORITIES,
            'categories' => Ticket::CATEGORIES,
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Tickets/Create', [
            'subject' => $request->input('subject'),
            'message' => $request->input('message'),
            'priority' => $request->input('priority', 'medium'),
            'category' => $request->input('category', 'general'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'priority' => 'required|in:' . implode(',', Ticket::PRIORITIES),
            'category' => 'required|in:' . implode(',', Ticket::CATEGORIES),
            'attachments.*' => 'nullable|file|mimes:jpeg,png,gif,pdf,doc,docx|max:10240'
        ]);

        DB::beginTransaction();

        try {
            $ticket = Ticket::create([
                'user_id' => auth()->id(),
                'subject' => $validated['subject'],
                'message' => $validated['message'],
                'status' => 'open',
                'priority' => $validated['priority'],
                'category' => $validated['category'],
                'last_reply_at' => now()
            ]);

            $message = $ticket->replies()->create([
                'user_id' => auth()->id(),
                'message' => $validated['message'],
                'is_admin' => false
            ]);

            if ($request->hasFile('attachments')) {
                $this->attachmentService->uploadAttachments(
                    $request->file('attachments'),
                    $message
                );
            }

            $ticket->addToHistory('ticket.created', 'create');

            DB::commit();

            return redirect()
                ->route('tickets.show', $ticket)
                ->with('success', 'tickets.created');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Ticket oluşturma hatası:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()
                ->withInput()
                ->with('error', 'tickets.createError');
        }
    }

    public function show(Ticket $ticket)
    {
        // Yetkilendirme kontrolü
        if ($ticket->user_id !== auth()->id()) {
            abort(403);
        }

        $ticket->load(['replies.user', 'replies.attachments', 'histories']);

        return Inertia::render('Tickets/Show', [
            'ticket' => $ticket,
            'statuses' => Ticket::STATUSES,
        ]);
    }

    public function reply(Request $request, Ticket $ticket)
    {
        // Yetkilendirme kontrolü
        if ($ticket->user_id !== auth()->id()) {
            abort(403);
        }

        DB::beginTransaction();

        try {
            $reply = $ticket->replies()->create([
                'user_id' => auth()->id(),
                'message' => $request->message,
                'quote' => $request->quote,
                'is_admin' => false
            ]);

            if ($request->hasFile('attachments')) {
                $this->attachmentService->uploadAttachments(
                    $request->file('attachments'),
                    $reply
                );
            }

            $ticket->updateStatus('open');
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
}

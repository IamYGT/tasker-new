<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;

class TicketController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    public function index()
    {
        $tickets = Auth::user()->tickets()
            ->with('lastMessage')
            ->latest()
            ->paginate(10);

        return Inertia::render('Tickets/Index', [
            'tickets' => $tickets
        ]);
    }

    public function create()
    {
        return Inertia::render('Tickets/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'priority' => 'required|in:low,medium,high'
        ]);

        $ticket = Auth::user()->tickets()->create([
            'subject' => $validated['subject'],
            'status' => 'open',
            'priority' => $validated['priority']
        ]);

        $ticket->messages()->create([
            'user_id' => Auth::id(),
            'message' => $validated['message']
        ]);

        return redirect()->route('tickets.show', $ticket)
            ->with('success', 'Ticket başarıyla oluşturuldu.');
    }

    public function show(Ticket $ticket)
    {
        $this->authorize('view', $ticket);

        $ticket->load(['messages.user', 'user']);

        return Inertia::render('Tickets/Show', [
            'ticket' => $ticket
        ]);
    }

    public function reply(Request $request, Ticket $ticket)
    {
        $this->authorize('reply', $ticket);

        $validated = $request->validate([
            'message' => 'required|string'
        ]);

        $ticket->messages()->create([
            'user_id' => Auth::id(),
            'message' => $validated['message']
        ]);

        return back()->with('success', 'Yanıtınız gönderildi.');
    }
} 
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminTicketController extends Controller
{
    public function index()
    {
        $tickets = Ticket::with('user')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Tickets/Index', [
            'tickets' => $tickets
        ]);
    }

    public function show(Ticket $ticket)
    {
        return Inertia::render('Admin/Tickets/Show', [
            'ticket' => $ticket->load(['user', 'replies.user'])
        ]);
    }

    public function reply(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'message' => 'required|string'
        ]);

        $ticket->replies()->create([
            'user_id' => auth()->user()->id,
            'message' => $validated['message']
        ]);

        return redirect()->back()->with('success', translate('tickets.replySuccess'));
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'status' => 'required|in:open,closed,pending'
        ]);

        $ticket->update($validated);

        return redirect()->back()->with('success', translate('tickets.statusUpdated'));
    }
} 
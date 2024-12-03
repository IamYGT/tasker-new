<?php

namespace App\Http\Controllers\Admin;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;

class TicketController
{
    public function createForUser(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        $ticket = Ticket::create([
            'user_id' => $userId,
            'subject' => $request->subject,
            'message' => $request->message,
            'status' => 'open',
            'priority' => 'medium',
            'category' => 'user_info'
        ]);

        return response()->json(['message' => 'Ticket created successfully', 'ticket' => $ticket]);
    }
}

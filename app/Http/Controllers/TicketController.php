<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class TicketController extends Controller
{
    public function index()
    {
        return Inertia::render('Tickets/Index');
    }

    // Diğer metodlar...
} 
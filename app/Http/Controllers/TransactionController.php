<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class TransactionController extends Controller
{
    public function history()
    {
        return Inertia::render('Transactions/History');
    }

    public function pending()
    {
        return Inertia::render('Transactions/Pending');
    }
} 
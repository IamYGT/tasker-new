<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class WithdrawalController extends Controller
{
    public function create()
    {
        return Inertia::render('Withdrawal/Create');
    }

    public function store()
    {
        // İşlem mantığı
    }
} 
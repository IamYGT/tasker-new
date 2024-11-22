<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AdminPaymentController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Payments/Index');
    }

    public function show($payment)
    {
        return Inertia::render('Admin/Payments/Show', [
            'payment' => $payment
        ]);
    }

    public function approve($payment)
    {
        // Ödeme onaylama mantığı
    }

    public function reject($payment)
    {
        // Ödeme reddetme mantığı
    }
} 
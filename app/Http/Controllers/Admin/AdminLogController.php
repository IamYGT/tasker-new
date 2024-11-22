<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AdminLogController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Logs/Index');
    }

    public function show($log)
    {
        return Inertia::render('Admin/Logs/Show', [
            'log' => $log
        ]);
    }
} 
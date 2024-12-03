<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AdminReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Reports/Index');
    }
}

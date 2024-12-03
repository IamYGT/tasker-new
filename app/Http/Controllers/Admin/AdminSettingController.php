<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AdminSettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Index');
    }

    public function update()
    {
        // Ayarları güncelleme mantığı
    }
}

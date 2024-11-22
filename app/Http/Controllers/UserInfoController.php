<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class UserInfoController extends Controller
{
    public function show()
    {
        return Inertia::render('User/Info');
    }
} 
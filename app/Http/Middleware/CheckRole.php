<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, $role)
    {
        if (!$request->user() || !$request->user()->roles()->where('name', $role)->exists()) {
            session()->flash('error', 'Bu sayfaya erişim yetkiniz yok.');
            
            $user = Auth::user();
            if ($user) {
                if ($user->hasRole('admin')) {
                    return redirect()->route('admin.dashboard');
                } else if ($user->hasRole('user')) {
                    return redirect()->route('dashboard');
                }
            }
            
            return redirect()->route('login');
        }

        return $next($request);
    }
} 
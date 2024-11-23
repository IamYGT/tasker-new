<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectBasedOnRole
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            $user = Auth::user();
            
            if ($user->hasRole('admin')) {
                // Admin kullanıcısı user route'larına erişmeye çalışıyorsa
                if ($request->routeIs('dashboard') || 
                    $request->routeIs('withdrawal.*') || 
                    $request->routeIs('transactions.*') || 
                    $request->routeIs('tickets.*')) {
                    return redirect()->route('admin.dashboard');
                }
            } else {
                // Normal kullanıcı admin route'larına erişmeye çalışıyorsa
                if ($request->routeIs('admin.*')) {
                    return redirect()->route('dashboard');
                }
            }
        }

        return $next($request);
    }
} 
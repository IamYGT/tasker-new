<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, $role)
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        if (!$request->user()->hasRole($role)) {
            if ($request->user()->hasRole('admin')) {
                return redirect()->route('admin.dashboard');
            }

            if ($request->user()->hasRole('user')) {
                return redirect()->route('user.dashboard');
            }

            // Eğer rol atanmamışsa varsayılan olarak user rolü ata
            $request->user()->assignRole('user');
            return redirect()->route('user.dashboard');
        }

        return $next($request);
    }
}

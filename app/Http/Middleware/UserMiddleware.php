<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class UserMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && $request->user()->hasRole('admin')) {
            if ($request->wantsJson()) {
                return response()->json(['error' => translate('errors.unauthorized')], 403);
            }
            return redirect()->route('admin.dashboard')->with('error', translate('errors.unauthorized'));
        }

        return $next($request);
    }
} 
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();
        $userRole = $user && $user->role ? $user->role->role : null;
        if (!$user || !in_array($userRole, $roles)) {
            return response()->json(['message' => 'Forbidden', 'success' => $userRole], 403);
        }

        return $next($request);
    }
}

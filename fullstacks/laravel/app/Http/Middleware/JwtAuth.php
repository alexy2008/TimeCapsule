<?php

namespace App\Http\Middleware;

use App\Services\AdminService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JwtAuth
{
    public function __construct(private AdminService $adminService) {}

    public function handle(Request $request, Closure $next): Response
    {
        $header = $request->header('Authorization', '');
        if (!str_starts_with($header, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Missing or invalid authorization header',
                'errorCode' => 'UNAUTHORIZED',
            ], 401);
        }

        $token = substr($header, 7);
        if (!$this->adminService->verifyToken($token)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
                'errorCode' => 'UNAUTHORIZED',
            ], 401);
        }

        return $next($request);
    }
}

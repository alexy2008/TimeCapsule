<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class HealthController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'status' => 'UP',
                'timestamp' => now()->utc()->toIso8601ZuluString(),
                'techStack' => [
                    'framework' => 'Laravel ' . app()->version(),
                    'language' => 'PHP ' . PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION,
                    'database' => 'SQLite',
                ],
            ],
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CapsuleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CapsuleController extends Controller
{
    public function __construct(private CapsuleService $capsuleService) {}

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'content' => 'required|string',
            'creator' => 'required|string|max:30',
            'openAt' => 'required|string',
        ]);

        try {
            $capsule = $this->capsuleService->create($validated);
            return response()->json([
                'success' => true,
                'data' => [
                    'code' => $capsule->code,
                    'title' => $capsule->title,
                    'creator' => $capsule->creator,
                    'openAt' => $capsule->open_at->toIso8601ZuluString(),
                    'createdAt' => $capsule->created_at->toIso8601ZuluString(),
                ],
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'errorCode' => 'VALIDATION_ERROR',
            ], 400);
        }
    }

    public function show(string $code): JsonResponse
    {
        $data = $this->capsuleService->getByCode($code);
        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Capsule not found',
                'errorCode' => 'CAPSULE_NOT_FOUND',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}

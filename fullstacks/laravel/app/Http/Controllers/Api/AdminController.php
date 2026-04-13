<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AdminService;
use App\Services\CapsuleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function __construct(
        private AdminService $adminService,
        private CapsuleService $capsuleService,
    ) {}

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'password' => 'required|string',
        ]);

        $token = $this->adminService->login($validated['password']);
        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid password',
                'errorCode' => 'UNAUTHORIZED',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'data' => ['token' => $token],
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $page = (int) $request->query('page', 0);
        $size = (int) $request->query('size', 20);

        $data = $this->capsuleService->listPaginated($page, $size);

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function destroy(string $code): JsonResponse
    {
        $deleted = $this->capsuleService->delete($code);
        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Capsule not found',
                'errorCode' => 'CAPSULE_NOT_FOUND',
            ], 404);
        }

        return response()->json(['success' => true]);
    }
}

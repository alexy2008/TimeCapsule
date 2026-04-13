<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;

class AdminService
{
    public function login(string $password): ?string
    {
        if ($password !== config('hellotime.admin_password')) {
            return null;
        }
        return $this->generateToken();
    }

    public function verifyToken(string $token): bool
    {
        try {
            JWT::decode($token, new Key(config('hellotime.jwt_secret'), 'HS256'));
            return true;
        } catch (ExpiredException|\Exception $e) {
            return false;
        }
    }

    private function generateToken(): string
    {
        $now = time();
        $payload = [
            'sub' => 'admin',
            'iat' => $now,
            'exp' => $now + (config('hellotime.jwt_expiration_hours') * 3600),
        ];
        return JWT::encode($payload, config('hellotime.jwt_secret'), 'HS256');
    }
}

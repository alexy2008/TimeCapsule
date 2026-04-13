<?php

return [
    'admin_password' => env('ADMIN_PASSWORD', 'timecapsule-admin'),
    'jwt_secret' => env('JWT_SECRET', 'hellotime-jwt-secret-key-that-is-long-enough-for-hs256'),
    'jwt_expiration_hours' => 2,
];

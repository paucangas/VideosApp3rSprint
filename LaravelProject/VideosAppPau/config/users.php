<?php

return [
    'default_user' => [
        'name' => env('DEFAULT_USER_NAME', 'Default User'),
        'email' => env('DEFAULT_USER_EMAIL', 'default_user@example.com'),
        'password' => env('DEFAULT_USER_PASSWORD', 'password123'),
    ],

    'default_teacher' => [
        'name' => env('DEFAULT_TEACHER_NAME', 'Default Teacher'),
        'email' => env('DEFAULT_TEACHER_EMAIL', 'default_teacher@example.com'),
        'password' => env('DEFAULT_TEACHER_PASSWORD', 'password123'),
    ],

    'default_team' => [
        'name' => env('DEFAULT_TEAM_NAME', 'Default Team'),
        'user_id' => env('DEFAULT_TEAM_USER_ID', 1),
        'personal_team' => env('DEFAULT_TEAM_PERSONAL_TEAM', false),
    ]
];

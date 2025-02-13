<?php
use App\Models\Team;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;


function createDefaultUser()
{
    $user = User::create([
        'name' => config('DEFAULT_USER_NAME'),
        'email' => config('DEFAULT_USER_EMAIL'),
        'password' => bcrypt(config('DEFAULT_USER_PASSWORD')),
    ]);

    $user->save();


    add_personal_team($user, 'Default Team');

    return $user;
}

function createDefaultTeacher()
{
    $teacher = User::create([
        'name' => config('DEFAULT_TEACHER_NAME'),
        'email' => config('DEFAULT_TEACHER_EMAIL'),
        'password' => bcrypt(config('DEFAULT_TEACHER_PASSWORD')),
        'super_admin' => true,
    ]);

    $teacher->save();

    add_personal_team($teacher, 'Default Teacher Team');


    return $teacher;
}


function add_personal_team(User $user, string $teamName)
{
    $team = Team::create([
        'name' => $teamName,
        'user_id' => $user->id,
    ]);

    $user->team()->associate($team);
    $user->save();
}


function create_regular_user()
{
    $user = User::create([
        'name' => 'Regular',
        'email' => 'regular@videosapp.com',
        'password' => bcrypt('123456789'),
    ]);

    return $user;
}

function create_video_manager_user()
{
    $user = User::create([
        'name' => 'Video Manager',
        'email' => 'videosmanager@videosapp.com',
        'password' => bcrypt('123456789'),
    ]);
    return $user;
}



function create_superadmin_user()
{
    $user = User::create([
        'name' => 'Super Admin',
        'email' => 'superadmin@videosapp.com',
        'password' => bcrypt('123456789'),
        'super_admin' => true,
    ]);

    return $user;
}

function define_gates()
{
    Gate::define('manage-videos', function (\App\Models\User $user) {
        return $user->hasRole('video_manager') || $user->isSuperAdmin();
    });

    Gate::define('manage-users', function (\App\Models\User $user) {
        return $user->isSuperAdmin();
    });
}


function create_permissions()
{
    $permissions = [
        'create videos',
        'edit videos',
        'delete videos',
        'manage users'
    ];

    foreach ($permissions as $permission) {
        Permission::firstOrCreate(['name' => $permission]);
    }

    $roles = [
        'regular' => [],
        'video_manager' => ['create videos', 'edit videos', 'delete videos'],
        'super_admin' => Permission::pluck('name')->toArray(),
    ];

    foreach ($roles as $role => $perms) {
        $roleInstance = Role::firstOrCreate(['name' => $role]);
        $roleInstance->syncPermissions($perms);
    }
}

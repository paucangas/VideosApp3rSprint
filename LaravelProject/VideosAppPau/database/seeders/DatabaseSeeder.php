<?php

namespace Database\Seeders;

use App\Helpers\DefaultVideoHelper;
use App\Models\User;
use App\Models\Video;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use function Laravel\Prompts\password;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {

        create_permissions();

        $superAdmin = create_superadmin_user();
        $superAdmin->save();
        $regularUser = create_regular_user();
        $regularUser->save();
        $videoManager = create_video_manager_user();
        $videoManager->save();


        $superAdmin->assignRole('super_admin');
        $regularUser->assignRole('regular');
        $videoManager->assignRole('video_manager');

        createDefaultTeacher();
        createDefaultUser();

        DefaultVideoHelper::createDefaultVideo();

        define_gates();

    }
}

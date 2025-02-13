<?php

namespace Tests\Feature\Videos;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class VideosManageControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_with_permissions_can_manage_videos()
    {
        $videoManager = $this->loginAsVideoManager();

        $response = $this->actingAs($videoManager)->get(route('videos.manage'));

        $response->assertStatus(200);
    }

    public function test_regular_users_cannot_manage_videos()
    {
        $regularUser = $this->loginAsRegularUser();

        $response = $this->actingAs($regularUser)->get(route('videos.manage'));

        $response->assertStatus(403); // Forbidden
    }

    public function test_guest_users_cannot_manage_videos()
    {
        $response = $this->get(route('videos.manage'));

        $response->assertRedirect(route('login'));
    }

    public function test_superadmins_can_manage_videos()
    {
        $superAdmin = $this->loginAsSuperAdmin();

        $response = $this->actingAs($superAdmin)->get(route('videos.manage'));

        $response->assertStatus(200);
    }

    // Funcions de login per a cada tipus d'usuari
    private function loginAsVideoManager()
    {
        $user = create_video_manager_user();
        $user->save();

        $user->assignRole('video_manager');
        return $user;
    }

    private function loginAsSuperAdmin()
    {
        $user = create_superadmin_user();
        $user->save();

        $user->assignRole('super_admin');
        return $user;
    }

    private function loginAsRegularUser()
    {
        $user = create_regular_user();
        $user->save();

        $user->assignRole('regular');
        return $user;
    }
}

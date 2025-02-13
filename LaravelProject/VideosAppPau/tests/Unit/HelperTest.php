<?php

namespace Tests\Unit;

use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use App\Helpers\DefaultVideoHelper;

class HelperTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_default_user_and_professor()
    {
        $teamDefaultUser = Team::factory()->create();
        $teamProfessor = Team::factory()->create();

        $defaultUser = createDefaultUser();
        $professorUser = createDefaultTeacher();

        $this->assertNotNull($defaultUser);
        $this->assertNotNull($professorUser);

        $this->assertTrue(Hash::check('password123', $defaultUser->password));
        $this->assertTrue(Hash::check('password123', $professorUser->password));

        $this->assertEquals($teamDefaultUser->id, $defaultUser->current_team_id);
        $this->assertEquals($teamProfessor->id, $professorUser->current_team_id);
    }

    public function test_can_create_videos()
    {
        $video = DefaultVideoHelper::createDefaultVideoHelper();

        $this->assertDatabaseHas('videos', [
            'title' => 'Vídeo de prova',
            'description' => 'Descripció del vídeo de prova',
            'url' => 'https://www.youtube.com/watch?v=123456',
        ]);

        $this->assertNotNull($video->published_at);
        //dd($video->toArray());
    }
}

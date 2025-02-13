<?php

namespace Tests\Feature;

use App\Models\Video;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VideosTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Comprova que els usuaris poden veure els vídeos existents.
     *
     * @return void
     */
    public function test_users_can_view_videos()
    {
        // Arrange: Crear un vídeo al sistema
        $video = Video::factory()->create([
            'title' => 'Vídeo de prova',
            'description' => 'Aquesta és una descripció de prova.',
            'url' => 'https://www.youtube.com/watch?v=example',
        ]);

        // Act: Fer una petició GET al vídeo
        $response = $this->get("/videos/{$video->id}");

        // Assert: Comprovar que el vídeo es mostra correctament
        $response->assertStatus(200);
        $response->assertSee($video->title);
        $response->assertSee($video->description);
        $response->assertSee($video->url);
    }

    /**
     * Comprova que els usuaris no poden veure vídeos inexistents.
     *
     * @return void
     */
    public function test_users_cannot_view_not_existing_videos()
    {
        // Act: Fer una petició GET a un ID de vídeo que no existeix
        $response = $this->get('/videos/999');

        // Assert: Comprovar que es mostra un error 404
        $response->assertStatus(404);
    }
}

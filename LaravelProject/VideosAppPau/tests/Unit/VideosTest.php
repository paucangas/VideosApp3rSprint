<?php

namespace Tests\Unit;

use App\Models\Video;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VideosTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Comprova que es pot obtenir la data de publicació en format "9 de gener de 2025".
     *
     * @return void
     */
    public function test_can_get_formatted_published_at_date()
    {
        $video = Video::factory()->make([
            'published_at' => Carbon::create(2025, 1, 9), // Corregit el nom del camp
        ]);

        $this->assertEquals('9 de gener de 2025', $video->formatted_published_at);
    }

    /**
     * Comprova que es pot obtenir la data de publicació en format humà, com "fa 1 hora".
     *
     * @return void
     */
    public function test_can_get_formatted_published_at_date_for_humans()
    {
        $video = Video::factory()->make([
            'published_at' => Carbon::now()->subHours(1), // Corregit el nom del camp
        ]);

        $this->assertEquals('fa 1 hora', $video->formatted_for_humans_published_at);
    }

    /**
     * Comprova que es pot obtenir el timestamp Unix de la data de publicació.
     *
     * @return void
     */
    public function test_can_get_published_at_timestamp()
    {
        $publishedAt = Carbon::create(2025, 1, 9);
        $video = Video::factory()->make([
            'published_at' => $publishedAt, // Corregit el nom del camp
        ]);

        $this->assertEquals($publishedAt->timestamp, $video->published_at_timestamp);
    }
}

<?php

namespace Database\Factories;

use App\Models\Video;
use Illuminate\Database\Eloquent\Factories\Factory;

class VideoFactory extends Factory
{
    protected $model = Video::class;

    public function definition()
    {
        return [
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'url' => $this->faker->url,
            'published_at' => $this->faker->dateTimeThisYear,
            'previous' => null,
            'next' => null,
            'series_id' => null, // ID de la serie (opcional)
        ];
    }
}

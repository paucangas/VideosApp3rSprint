<?php

namespace App\Helpers;

use App\Models\Video;

use Carbon\Carbon;

class DefaultVideoHelper
{
    /**
     * Retorna una llista de vídeos per defecte.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getDefaultVideos()
    {
        // Exemple de retorn d'una llista de vídeos per defecte. Això es pot personalitzar
        return Video::where('published_at', '<=', now()) // Vídeos ja publicats
        ->orderBy('published_at', 'desc') // Ordenats per data de publicació
        ->limit(5) // Límits a 5 vídeos per defecte
        ->get();
    }

    public static function createDefaultVideoHelper($title = 'Vídeo de prova', $description = 'Descripció del vídeo de prova', $url = 'https://www.youtube.com/watch?v=123456')
    {
        return Video::create([
            'title' => $title,
            'description' => $description,
            'url' => $url,
            'published_at' => Carbon::now(),
        ]);
    }
    public static function createDefaultVideo(array $overrides = []){
        $defaultData = [
            'title' => 'Default Video',
            'description' => 'This is a default video',
            'url' => 'https://www.youtube.com/watch?v=gsLvizl5j4E&ab_channel=Mattye',
            'published_at' => Carbon::now()->toDateTimeString(),
            'previous' => null,
            'next' => null,
            'series_id' => 1
        ];

        $data = array_merge($defaultData, $overrides);

        return Video::create($data);
    }
}

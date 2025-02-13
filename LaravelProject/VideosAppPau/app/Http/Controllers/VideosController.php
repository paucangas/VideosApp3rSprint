<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Contracts\View\View;
use Tests\Unit\VideosTest;

class VideosController extends Controller
{
    /**
     * Mostra els detalls d'un video por el seu ID.
     *
     * @param int $id
     * @return \Illuminate\Contracts\View\View
     */
    public function show($id): View
    {
        // Buscar el vídeo per ID
        $video = Video::findOrFail($id);

        // Retornar una vista amb les dades del vídeo
        return view('videos.show', compact('video'));
    }

    public function index(): View
    {
        // Obtenir tots els vídeos
        $videos = Video::all();

        // Retornar una vista amb tots els vídeos
        return view('videos.index', compact('videos'));
    }

    /**
     * Retorna la clase de test dels vídeos.
     *
     * @return string
     */
    public function testedBy(): string
    {
        return VideosTest::class;
    }
}

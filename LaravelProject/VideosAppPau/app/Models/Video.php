<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Tests\Unit\VideosTest;

class Video extends Model
{
    use HasFactory;

    // Defineix el nom de la taula
    protected $table = 'videos';

    // Defineix els atributs que es poden omplir
    protected $fillable = [
        'title', 'description', 'url', 'published_at', 'previous', 'next', 'series_id',
    ];

    // Defineix els atributs que són de tipus data
    protected $casts = [
        'published_at' => 'datetime', // Assegura que published_at sempre és un objecte Carbon
    ];

    /**
     * Retorna la data de publicació en format "13 de gener de 2025".
     *
     * @return string
     */
    public function getFormattedPublishedAtAttribute(): string
    {
        return Carbon::parse($this->published_at) // Convertim directament a instància de Carbon
        ->locale('ca') // Configurem la localització a català
        ->isoFormat('D [de] MMMM [de] YYYY');
    }

    /**
     * Retorna la data de publicació en format "fa 2 hores".
     *
     * @return string
     */
    public function getFormattedForHumansPublishedAtAttribute(): string
    {
        return Carbon::parse($this->published_at) // Convertim a Carbon explícitament
        ->locale('ca')
            ->diffForHumans();
    }

    /**
     * Retorna el Unix timestamp de la data de publicació.
     *
     * @return int
     */
    public function getPublishedAtTimestampAttribute(): int
    {
        return Carbon::parse($this->published_at)->timestamp; // Utilitzem Carbon per al timestamp
    }
    public function testedBy(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(User::class, 'video_user_tested', 'video_id', 'user_id');
    }


}

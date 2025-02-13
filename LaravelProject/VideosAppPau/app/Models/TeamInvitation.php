<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Laravel\Jetstream\Jetstream;
use Laravel\Jetstream\TeamInvitation as JetstreamTeamInvitation;

/**
 * @property int $id
 * @property string $email
 * @property string|null $role
 * @property int $team_id
 * @property-read Team $team
 */
class TeamInvitation extends JetstreamTeamInvitation
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'role',
    ];

    /**
     * Get the team that the invitation belongs to.
     */
    public function team(): BelongsTo
    {
        /** @var class-string<Model> $teamModel */
        $teamModel = Jetstream::teamModel();
        return $this->belongsTo($teamModel, 'team_id');
    }
}

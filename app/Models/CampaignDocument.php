<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Stored on the private disk; served through DocumentController so that
 * non-public documents never get a guessable URL.
 */
class CampaignDocument extends Model
{
    protected $fillable = ['campaign_id', 'title', 'path', 'original_name', 'mime', 'size', 'is_public'];

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
            'size' => 'integer',
        ];
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function extension(): string
    {
        return strtolower(pathinfo($this->original_name, PATHINFO_EXTENSION));
    }
}

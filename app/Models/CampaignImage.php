<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampaignImage extends Model
{
    protected $fillable = ['campaign_id', 'path', 'caption_fr', 'caption_en', 'position'];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function url(): string
    {
        return str_starts_with($this->path, '/') ? $this->path : '/storage/'.$this->path;
    }
}

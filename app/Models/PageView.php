<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class PageView extends Model
{
    public const UPDATED_AT = null;

    protected $fillable = ['path', 'campaign_id', 'visitor', 'referrer_host', 'device'];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function scopeBetween(Builder $query, Carbon $from, Carbon $to): void
    {
        $query->where('created_at', '>=', $from)->where('created_at', '<', $to);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Donation extends Model
{
    public const METHODS = [
        'mtn' => 'MTN Mobile Money',
        'orange' => 'Orange Money',
        'especes' => 'Espèces',
        'virement' => 'Virement bancaire',
        'autre' => 'Autre',
    ];

    public const STATUSES = ['pending', 'confirmed', 'rejected'];

    protected $fillable = [
        'campaign_id',
        'donor_name',
        'donor_phone',
        'donor_email',
        'is_anonymous',
        'amount',
        'method',
        'reference',
        'message',
        'status',
        'source',
        'donated_at',
        'confirmed_at',
        'confirmed_by',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'is_anonymous' => 'boolean',
            'donated_at' => 'date',
            'confirmed_at' => 'datetime',
        ];
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function confirmer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }

    /** The name as given (people or organisations), or "Anonyme" when the donor asked for it. */
    public function publicName(): string
    {
        if ($this->is_anonymous || blank($this->donor_name)) {
            return 'Anonyme';
        }

        return trim($this->donor_name);
    }

    /**
     * @return array<string, mixed>
     */
    public function toAdminArray(): array
    {
        return [
            'id' => $this->id,
            'campaignId' => $this->campaign_id,
            'campaignTitle' => $this->relationLoaded('campaign') ? $this->campaign?->title_fr : null,
            'donorName' => $this->donor_name,
            'donorPhone' => $this->donor_phone,
            'donorEmail' => $this->donor_email,
            'anonymous' => $this->is_anonymous,
            'amount' => $this->amount,
            'method' => $this->method,
            'reference' => $this->reference,
            'message' => $this->message,
            'status' => $this->status,
            'source' => $this->source,
            'donatedAt' => $this->donated_at->format('Y-m-d'),
            'confirmedAt' => $this->confirmed_at?->toIso8601String(),
            'confirmedBy' => $this->relationLoaded('confirmer') ? $this->confirmer?->name : null,
        ];
    }
}

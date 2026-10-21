<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Campaign extends Model
{
    /**
     * Fields of action a campaign can belong to. Keys are stored in the
     * database; the front end owns the FR/EN labels.
     */
    public const DOMAINS = ['sante', 'education', 'dignite', 'mental', 'communaute', 'leadership', 'autre'];

    public const STATUSES = ['draft', 'published'];

    /** Layouts the public campaign page can use for its photo gallery. */
    public const GALLERY_LAYOUTS = ['grid', 'carousel', 'mosaic'];

    protected $fillable = [
        'slug',
        'title_fr',
        'title_en',
        'summary_fr',
        'summary_en',
        'description_fr',
        'description_en',
        'domain',
        'location',
        'starts_at',
        'ends_at',
        'goal_amount',
        'raised_amount',
        'beneficiaries',
        'image_path',
        'gallery_layout',
        'status',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'date:Y-m-d',
            'ends_at' => 'date:Y-m-d',
            'goal_amount' => 'integer',
            'raised_amount' => 'integer',
            'beneficiaries' => 'integer',
            'is_featured' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Campaign $campaign) {
            if (blank($campaign->slug)) {
                $campaign->slug = static::uniqueSlug($campaign->title_fr, $campaign->id);
            }
        });
    }

    public static function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'campagne';
        $slug = $base;
        $suffix = 2;

        while (static::where('slug', $slug)->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }

    public function views(): HasMany
    {
        return $this->hasMany(PageView::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(CampaignImage::class)->orderBy('position')->orderBy('id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(CampaignDocument::class)->latest();
    }

    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    /**
     * Only confirmed donations count as raised; called whenever a donation
     * is confirmed, rejected, edited or removed.
     */
    public function refreshRaised(): void
    {
        $this->forceFill([
            'raised_amount' => (int) $this->donations()->where('status', 'confirmed')->sum('amount'),
        ])->saveQuietly();
    }

    public function scopePublished(Builder $query): void
    {
        $query->where('status', 'published');
    }

    public function scopeForDisplay(Builder $query): void
    {
        $query->orderByDesc('is_featured')->orderByDesc('starts_at')->orderByDesc('id');
    }

    /**
     * Relative URL so uploads resolve on whatever host serves the site,
     * regardless of APP_URL. Seeded campaigns may point at /images/… directly.
     */
    public function imageUrl(): ?string
    {
        if (blank($this->image_path)) {
            return null;
        }

        return str_starts_with($this->image_path, '/') ? $this->image_path : '/storage/'.$this->image_path;
    }

    /**
     * Shape sent to the public pages: bilingual pairs with French fallback.
     *
     * @return array<string, mixed>
     */
    public function toPublicArray(): array
    {
        return [
            'slug' => $this->slug,
            'title' => ['fr' => $this->title_fr, 'en' => $this->title_en ?: $this->title_fr],
            'summary' => ['fr' => $this->summary_fr, 'en' => $this->summary_en ?: $this->summary_fr],
            'description' => [
                'fr' => $this->description_fr ?? '',
                'en' => $this->description_en ?: ($this->description_fr ?? ''),
            ],
            'domain' => $this->domain,
            'location' => $this->location,
            'startsAt' => $this->starts_at?->format('Y-m-d'),
            'endsAt' => $this->ends_at?->format('Y-m-d'),
            'goalAmount' => $this->goal_amount,
            'raisedAmount' => $this->raised_amount,
            'beneficiaries' => $this->beneficiaries,
            'image' => $this->imageUrl(),
            'featured' => $this->is_featured,
        ];
    }

    /**
     * The public shape plus what only the campaign page needs: gallery,
     * public documents and the latest confirmed donors.
     *
     * @return array<string, mixed>
     */
    public function toPublicDetailArray(): array
    {
        return [
            ...$this->toPublicArray(),
            'galleryLayout' => $this->gallery_layout,
            'gallery' => $this->images->map(fn (CampaignImage $image) => [
                'id' => $image->id,
                'url' => $image->url(),
                'caption' => [
                    'fr' => $image->caption_fr ?? '',
                    'en' => $image->caption_en ?: ($image->caption_fr ?? ''),
                ],
            ])->values(),
            'documents' => $this->documents->where('is_public', true)->map(fn (CampaignDocument $document) => [
                'id' => $document->id,
                'title' => $document->title,
                'url' => route('documents.show', $document),
                'extension' => $document->extension(),
                'size' => $document->size,
            ])->values(),
            'donorsCount' => $this->donations()->where('status', 'confirmed')->count(),
            'recentDonors' => $this->donations()->where('status', 'confirmed')->latest('donated_at')->latest('id')->limit(6)->get()
                ->map(fn (Donation $donation) => [
                    'name' => $donation->publicName(),
                    'date' => $donation->donated_at->format('Y-m-d'),
                ]),
        ];
    }

    /**
     * Shape sent to the admin screens: raw columns, camelCased.
     *
     * @return array<string, mixed>
     */
    public function toAdminArray(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'titleFr' => $this->title_fr,
            'titleEn' => $this->title_en ?? '',
            'summaryFr' => $this->summary_fr,
            'summaryEn' => $this->summary_en ?? '',
            'descriptionFr' => $this->description_fr ?? '',
            'descriptionEn' => $this->description_en ?? '',
            'domain' => $this->domain,
            'location' => $this->location ?? '',
            'startsAt' => $this->starts_at?->format('Y-m-d') ?? '',
            'endsAt' => $this->ends_at?->format('Y-m-d') ?? '',
            'goalAmount' => $this->goal_amount,
            'raisedAmount' => $this->raised_amount,
            'beneficiaries' => $this->beneficiaries,
            'image' => $this->imageUrl(),
            'status' => $this->status,
            'featured' => $this->is_featured,
            'galleryLayout' => $this->gallery_layout,
            'views' => (int) ($this->views_count ?? 0),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}

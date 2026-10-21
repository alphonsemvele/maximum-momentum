<?php

namespace App\Http\Requests;

use App\Models\Campaign;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'titleFr' => ['required', 'string', 'max:160'],
            'titleEn' => ['nullable', 'string', 'max:160'],
            'summaryFr' => ['required', 'string', 'max:600'],
            'summaryEn' => ['nullable', 'string', 'max:600'],
            'descriptionFr' => ['nullable', 'string', 'max:20000'],
            'descriptionEn' => ['nullable', 'string', 'max:20000'],
            'domain' => ['required', Rule::in(Campaign::DOMAINS)],
            'location' => ['nullable', 'string', 'max:160'],
            'startsAt' => ['nullable', 'date'],
            'endsAt' => ['nullable', 'date', 'after_or_equal:startsAt'],
            'goalAmount' => ['nullable', 'integer', 'min:0'],
            'beneficiaries' => ['nullable', 'integer', 'min:0'],
            'image' => ['nullable', 'image', 'max:5120'],
            'removeImage' => ['boolean'],
            'status' => ['required', Rule::in(Campaign::STATUSES)],
            'featured' => ['boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'titleFr' => 'titre (FR)',
            'summaryFr' => 'résumé (FR)',
            'domain' => 'domaine',
            'endsAt' => 'date de fin',
            'startsAt' => 'date de début',
            'image' => 'image',
        ];
    }

    /**
     * Map the camelCased form fields onto the table's columns.
     *
     * @return array<string, mixed>
     */
    public function columns(): array
    {
        $data = $this->validated();

        return [
            'title_fr' => $data['titleFr'],
            'title_en' => $data['titleEn'] ?? null,
            'summary_fr' => $data['summaryFr'],
            'summary_en' => $data['summaryEn'] ?? null,
            'description_fr' => $data['descriptionFr'] ?? null,
            'description_en' => $data['descriptionEn'] ?? null,
            'domain' => $data['domain'],
            'location' => $data['location'] ?? null,
            'starts_at' => $data['startsAt'] ?? null,
            'ends_at' => $data['endsAt'] ?? null,
            'goal_amount' => $data['goalAmount'] ?? null,
            'beneficiaries' => $data['beneficiaries'] ?? null,
            'status' => $data['status'],
            'is_featured' => $data['featured'] ?? false,
        ];
    }
}

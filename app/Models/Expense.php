<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    public const CATEGORIES = [
        'materiel' => 'Matériel & fournitures',
        'transport' => 'Transport & logistique',
        'sante' => 'Soins & médicaments',
        'communication' => 'Communication',
        'restauration' => 'Restauration',
        'autre' => 'Autre',
    ];

    protected $fillable = ['campaign_id', 'label', 'category', 'amount', 'spent_at', 'receipt_path', 'receipt_name', 'notes'];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'spent_at' => 'date',
        ];
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function toAdminArray(): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'category' => $this->category,
            'amount' => $this->amount,
            'spentAt' => $this->spent_at->format('Y-m-d'),
            'receiptName' => $this->receipt_name,
            'receiptUrl' => $this->receipt_path ? route('admin.expenses.receipt', $this) : null,
            'notes' => $this->notes,
        ];
    }
}

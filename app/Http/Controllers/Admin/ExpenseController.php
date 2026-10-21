<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Expense;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExpenseController extends Controller
{
    public function store(Request $request, Campaign $campaign): RedirectResponse
    {
        $data = $request->validate([
            'label' => ['required', 'string', 'max:160'],
            'category' => ['required', Rule::in(array_keys(Expense::CATEGORIES))],
            'amount' => ['required', 'integer', 'min:1'],
            'spentAt' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'receipt' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png,webp', 'max:10240'],
        ], attributes: ['label' => 'libellé', 'amount' => 'montant', 'spentAt' => 'date', 'receipt' => 'justificatif']);

        $receipt = $request->file('receipt');

        $campaign->expenses()->create([
            'label' => $data['label'],
            'category' => $data['category'],
            'amount' => $data['amount'],
            'spent_at' => $data['spentAt'],
            'notes' => $data['notes'] ?? null,
            'receipt_path' => $receipt?->store("campaigns/{$campaign->id}/receipts", 'local'),
            'receipt_name' => $receipt?->getClientOriginalName(),
        ]);

        return back()->with('success', 'Dépense enregistrée.');
    }

    public function receipt(Expense $expense): StreamedResponse
    {
        abort_unless($expense->receipt_path && Storage::disk('local')->exists($expense->receipt_path), 404);

        return Storage::disk('local')->response($expense->receipt_path, $expense->receipt_name);
    }

    public function destroy(Expense $expense): RedirectResponse
    {
        if ($expense->receipt_path) {
            Storage::disk('local')->delete($expense->receipt_path);
        }

        $expense->delete();

        return back()->with('success', 'Dépense supprimée.');
    }
}

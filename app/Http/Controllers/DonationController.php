<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Donation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Donors declare the Mobile Money transfer they made. The declaration stays
 * pending — and is not counted as raised — until an admin confirms receipt.
 */
class DonationController extends Controller
{
    public function store(Request $request, string $slug): RedirectResponse
    {
        $campaign = Campaign::published()->where('slug', $slug)->firstOrFail();

        // Honeypot: real visitors never see nor fill this field.
        if (filled($request->input('website'))) {
            return back()->with('donation', 'declared');
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:40'],
            'email' => ['nullable', 'email', 'max:190'],
            'amount' => ['required', 'integer', 'min:100', 'max:100000000'],
            'method' => ['required', Rule::in(['mtn', 'orange', 'virement', 'autre'])],
            'reference' => ['nullable', 'string', 'max:120'],
            'message' => ['nullable', 'string', 'max:1000'],
            'anonymous' => ['boolean'],
        ], attributes: [
            'name' => 'nom',
            'phone' => 'téléphone',
            'amount' => 'montant',
            'method' => 'moyen de paiement',
        ]);

        $campaign->donations()->create([
            'donor_name' => $data['name'],
            'donor_phone' => $data['phone'],
            'donor_email' => $data['email'] ?? null,
            'is_anonymous' => $request->boolean('anonymous'),
            'amount' => $data['amount'],
            'method' => $data['method'],
            'reference' => $data['reference'] ?? null,
            'message' => $data['message'] ?? null,
            'status' => 'pending',
            'source' => 'site',
            'donated_at' => now()->toDateString(),
        ]);

        return back()->with('donation', 'declared');
    }
}

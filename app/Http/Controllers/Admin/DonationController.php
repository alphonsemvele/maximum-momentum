<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Donation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DonationController extends Controller
{
    /** A donation entered by staff (cash, bank transfer, a MoMo transfer seen on the phone…). */
    public function store(Request $request, Campaign $campaign): RedirectResponse
    {
        $data = $request->validate([
            'donorName' => ['nullable', 'string', 'max:120'],
            'donorPhone' => ['nullable', 'string', 'max:40'],
            'donorEmail' => ['nullable', 'email', 'max:190'],
            'anonymous' => ['boolean'],
            'amount' => ['required', 'integer', 'min:1'],
            'method' => ['required', Rule::in(array_keys(Donation::METHODS))],
            'reference' => ['nullable', 'string', 'max:120'],
            'message' => ['nullable', 'string', 'max:1000'],
            'donatedAt' => ['required', 'date', 'before_or_equal:today'],
            'confirmed' => ['boolean'],
        ], attributes: ['amount' => 'montant', 'method' => 'moyen de paiement', 'donatedAt' => 'date du don']);

        $confirmed = $request->boolean('confirmed');

        $campaign->donations()->create([
            'donor_name' => $data['donorName'] ?? null,
            'donor_phone' => $data['donorPhone'] ?? null,
            'donor_email' => $data['donorEmail'] ?? null,
            'is_anonymous' => $request->boolean('anonymous'),
            'amount' => $data['amount'],
            'method' => $data['method'],
            'reference' => $data['reference'] ?? null,
            'message' => $data['message'] ?? null,
            'donated_at' => $data['donatedAt'],
            'source' => 'admin',
            'status' => $confirmed ? 'confirmed' : 'pending',
            'confirmed_at' => $confirmed ? now() : null,
            'confirmed_by' => $confirmed ? $request->user()->id : null,
        ]);

        $campaign->refreshRaised();

        return back()->with('success', $confirmed ? 'Don enregistré et crédité à la campagne.' : 'Don enregistré en attente de confirmation.');
    }

    public function confirm(Request $request, Donation $donation): RedirectResponse
    {
        $donation->update(['status' => 'confirmed', 'confirmed_at' => now(), 'confirmed_by' => $request->user()->id]);
        $donation->campaign->refreshRaised();

        return back()->with('success', 'Don de '.number_format($donation->amount, 0, ',', ' ').' FCFA confirmé et crédité.');
    }

    public function reject(Donation $donation): RedirectResponse
    {
        $donation->update(['status' => 'rejected', 'confirmed_at' => null, 'confirmed_by' => null]);
        $donation->campaign->refreshRaised();

        return back()->with('success', 'Don marqué comme non reçu.');
    }

    public function destroy(Donation $donation): RedirectResponse
    {
        $campaign = $donation->campaign;
        $donation->delete();
        $campaign->refreshRaised();

        return back()->with('success', 'Don supprimé.');
    }
}

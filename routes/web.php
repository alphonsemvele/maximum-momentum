<?php

use App\Http\Controllers\Admin\AccountController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CampaignController;
use App\Http\Controllers\Admin\CampaignDocumentController;
use App\Http\Controllers\Admin\CampaignManageController;
use App\Http\Controllers\Admin\CampaignMediaController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DonationController as AdminDonationController;
use App\Http\Controllers\Admin\ExpenseController;
use App\Http\Controllers\Admin\FinanceController;
use App\Http\Controllers\Admin\StatisticsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\DeployController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/campagnes/{slug}', [PageController::class, 'campaign'])->name('campaigns.show');
Route::post('/campagnes/{slug}/dons', [DonationController::class, 'store'])->middleware('throttle:6,1')->name('campaigns.donate');
Route::get('/documents/{document}', [DocumentController::class, 'show'])->name('documents.show');
Route::post('/_deploy', DeployController::class)->middleware('throttle:5,1')->name('deploy');

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('login', [AuthController::class, 'create'])->name('login');
        Route::post('login', [AuthController::class, 'store'])->name('login.store');
    });

    Route::middleware('auth')->group(function () {
        Route::get('/', DashboardController::class)->name('dashboard');
        Route::get('statistiques', StatisticsController::class)->name('statistics');
        Route::post('logout', [AuthController::class, 'destroy'])->name('logout');

        Route::get('campagnes', [CampaignController::class, 'index'])->name('campaigns.index');
        Route::get('campagnes/nouvelle', [CampaignController::class, 'create'])->name('campaigns.create');
        Route::post('campagnes', [CampaignController::class, 'store'])->name('campaigns.store');
        Route::get('campagnes/{campaign}', [CampaignManageController::class, 'show'])->whereNumber('campaign')->name('campaigns.show');
        Route::get('campagnes/{campaign}/modifier', [CampaignController::class, 'edit'])->name('campaigns.edit');
        Route::put('campagnes/{campaign}', [CampaignController::class, 'update'])->name('campaigns.update');
        Route::patch('campagnes/{campaign}/statut', [CampaignController::class, 'toggle'])->name('campaigns.toggle');
        Route::delete('campagnes/{campaign}', [CampaignController::class, 'destroy'])->name('campaigns.destroy');

        Route::get('finances', FinanceController::class)->name('finances');

        Route::post('campagnes/{campaign}/dons', [AdminDonationController::class, 'store'])->name('donations.store');
        Route::patch('dons/{donation}/confirmer', [AdminDonationController::class, 'confirm'])->name('donations.confirm');
        Route::patch('dons/{donation}/rejeter', [AdminDonationController::class, 'reject'])->name('donations.reject');
        Route::delete('dons/{donation}', [AdminDonationController::class, 'destroy'])->name('donations.destroy');

        Route::post('campagnes/{campaign}/depenses', [ExpenseController::class, 'store'])->name('expenses.store');
        Route::get('depenses/{expense}/justificatif', [ExpenseController::class, 'receipt'])->name('expenses.receipt');
        Route::delete('depenses/{expense}', [ExpenseController::class, 'destroy'])->name('expenses.destroy');

        Route::post('campagnes/{campaign}/images', [CampaignMediaController::class, 'store'])->name('images.store');
        Route::patch('campagnes/{campaign}/galerie', [CampaignMediaController::class, 'layout'])->name('images.layout');
        Route::patch('images/{image}', [CampaignMediaController::class, 'update'])->name('images.update');
        Route::patch('images/{image}/deplacer', [CampaignMediaController::class, 'move'])->name('images.move');
        Route::patch('images/{image}/couverture', [CampaignMediaController::class, 'cover'])->name('images.cover');
        Route::delete('images/{image}', [CampaignMediaController::class, 'destroy'])->name('images.destroy');

        Route::post('campagnes/{campaign}/documents', [CampaignDocumentController::class, 'store'])->name('documents.store');
        Route::patch('documents/{document}', [CampaignDocumentController::class, 'update'])->name('documents.update');
        Route::delete('documents/{document}', [CampaignDocumentController::class, 'destroy'])->name('documents.destroy');

        Route::get('administrateurs', [UserController::class, 'index'])->name('users.index');
        Route::post('administrateurs', [UserController::class, 'store'])->name('users.store');
        Route::delete('administrateurs/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        Route::get('compte', [AccountController::class, 'edit'])->name('account.edit');
        Route::put('compte', [AccountController::class, 'update'])->name('account.update');
        Route::put('compte/mot-de-passe', [AccountController::class, 'password'])->name('account.password');
    });
});

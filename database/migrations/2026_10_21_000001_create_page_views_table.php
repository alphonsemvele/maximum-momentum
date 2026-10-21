<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('page_views', function (Blueprint $table) {
            $table->id();
            $table->string('path');
            $table->foreignId('campaign_id')->nullable()->constrained()->nullOnDelete();
            // Daily-rotating hash of IP + user agent: counts unique visitors without storing either.
            $table->string('visitor', 64);
            $table->string('referrer_host')->nullable();
            $table->string('device', 16);
            $table->timestamp('created_at')->index();

            $table->index(['campaign_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('page_views');
    }
};

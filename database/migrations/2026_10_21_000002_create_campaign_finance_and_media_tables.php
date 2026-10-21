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
        Schema::table('campaigns', function (Blueprint $table) {
            // How the public campaign page lays out its photo gallery.
            $table->string('gallery_layout', 16)->default('grid')->after('image_path');
        });

        Schema::create('campaign_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->string('caption_fr')->nullable();
            $table->string('caption_en')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('campaign_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('path');
            $table->string('original_name');
            $table->string('mime')->nullable();
            $table->unsignedBigInteger('size')->default(0);
            $table->boolean('is_public')->default(false);
            $table->timestamps();
        });

        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->string('donor_name')->nullable();
            $table->string('donor_phone', 40)->nullable();
            $table->string('donor_email')->nullable();
            $table->boolean('is_anonymous')->default(false);
            $table->unsignedBigInteger('amount');
            $table->string('method', 16);
            $table->string('reference')->nullable();
            $table->text('message')->nullable();
            // pending → confirmed (credited to the campaign) or rejected.
            $table->string('status', 16)->default('pending')->index();
            // 'site' when declared by the donor, 'admin' when entered by staff.
            $table->string('source', 8)->default('admin');
            $table->date('donated_at');
            $table->timestamp('confirmed_at')->nullable();
            $table->foreignId('confirmed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['campaign_id', 'status']);
        });

        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->string('label');
            $table->string('category', 32);
            $table->unsignedBigInteger('amount');
            $table->date('spent_at');
            $table->string('receipt_path')->nullable();
            $table->string('receipt_name')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('donations');
        Schema::dropIfExists('campaign_documents');
        Schema::dropIfExists('campaign_images');

        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn('gallery_layout');
        });
    }
};

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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();

            // Copy is bilingual; English falls back to French when left empty.
            $table->string('title_fr');
            $table->string('title_en')->nullable();
            $table->text('summary_fr');
            $table->text('summary_en')->nullable();
            $table->longText('description_fr')->nullable();
            $table->longText('description_en')->nullable();

            $table->string('domain', 32)->index();
            $table->string('location')->nullable();
            $table->date('starts_at')->nullable();
            $table->date('ends_at')->nullable();

            $table->unsignedBigInteger('goal_amount')->nullable();
            $table->unsignedBigInteger('raised_amount')->default(0);
            $table->unsignedInteger('beneficiaries')->nullable();

            $table->string('image_path')->nullable();
            $table->string('status', 16)->default('draft')->index();
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};

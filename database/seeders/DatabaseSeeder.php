<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // The repository is public: no default password lives in the code.
        // Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before the first seed
        // (the deploy pipeline seeds once, while the users table is empty).
        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');

        if (blank($email) || blank($password)) {
            $this->command?->warn('ADMIN_EMAIL / ADMIN_PASSWORD absents du .env : aucun compte admin créé.');
        } else {
            User::firstOrCreate(['email' => $email], ['name' => 'Administrateur', 'password' => $password]);
        }

        $this->call(CampaignSeeder::class);
    }
}

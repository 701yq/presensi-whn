<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User default untuk testing login
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin Test',
                'password' => bcrypt('password'),
            ]
        );

        // Jika mau tambah data lain, taruh di sini
    }
}

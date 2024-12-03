<?php

namespace Database\Factories;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'amount' => $this->faker->randomFloat(2, 10, 1000),
            'type' => $this->faker->randomElement(Transaction::TYPES),
            'status' => $this->faker->randomElement(Transaction::STATUSES),
            'description' => $this->faker->sentence(),
            'bank_account' => $this->faker->iban('TR'),
            'reference_id' => fake()->unique()->regexify('[0-9a-f]{12}'),
        ];
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ticket;
use App\Models\User;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        
        foreach($users as $user) {
            $tickets = rand(1, 3);
            
            for($i = 0; $i < $tickets; $i++) {
                $ticket = Ticket::create([
                    'user_id' => $user->id,
                    'subject' => fake()->sentence(),
                    'message' => fake()->paragraph(),
                    'status' => fake()->randomElement(['open', 'answered', 'closed']),
                    'priority' => fake()->randomElement(['low', 'medium', 'high']),
                    'category' => fake()->randomElement(['general', 'technical', 'billing', 'other']),
                    'last_reply_at' => now(),
                ]);

                // replies() methodunu kullanalım (messages() yerine)
                $ticket->replies()->create([
                    'user_id' => $user->id,
                    'message' => $ticket->message
                ]);
            }
        }
    }
} 
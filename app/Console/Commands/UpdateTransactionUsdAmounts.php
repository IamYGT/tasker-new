<?php

namespace App\Console\Commands;

use App\Models\Transaction;
use Illuminate\Console\Command;

class UpdateTransactionUsdAmounts extends Command
{
    protected $signature = 'transactions:update-usd';
    protected $description = 'Update USD amounts for all transactions';

    public function handle()
    {
        $this->info('Updating USD amounts for transactions...');

        Transaction::chunk(100, function ($transactions) {
            foreach ($transactions as $transaction) {
                $transaction->convertToUSD($transaction->amount);
                $transaction->save();
                $this->line("Updated transaction {$transaction->reference_id}");
            }
        });

        $this->info('All transactions updated successfully!');
    }
}

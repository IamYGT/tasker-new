<?php

namespace Database\Seeders;

use App\Models\CryptoNetworks;
use Illuminate\Database\Seeder;

class CryptoNetworkSeeder extends Seeder
{
    public function run(): void
    {
        $networks = [
            [
                'id' => 'btc',
                'name' => 'Bitcoin',
                'symbol' => 'BTC',
                'chain' => 'Bitcoin',
                'validation_regex' => '^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$',
                'explorer_url' => 'https://www.blockchain.com/btc/address/',
                'icon' => '/images/crypto/btc.svg',
                'sort_order' => 1
            ],
            [
                'id' => 'eth',
                'name' => 'Ethereum',
                'symbol' => 'ETH',
                'chain' => 'Ethereum',
                'validation_regex' => '^0x[a-fA-F0-9]{40}$',
                'explorer_url' => 'https://etherscan.io/address/',
                'icon' => '/images/crypto/eth.svg',
                'sort_order' => 2
            ],
            [
                'id' => 'trx',
                'name' => 'TRON',
                'symbol' => 'TRX',
                'chain' => 'TRON',
                'validation_regex' => '^T[a-zA-Z0-9]{33}$',
                'explorer_url' => 'https://tronscan.org/#/address/',
                'icon' => '/images/crypto/trx.svg',
                'sort_order' => 3
            ],
            // Diğer networkler...
        ];

        foreach ($networks as $network) {
            CryptoNetworks::updateOrCreate(
                ['id' => $network['id']],
                $network
            );
        }
    }
}

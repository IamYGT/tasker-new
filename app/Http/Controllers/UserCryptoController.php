<?php

namespace App\Http\Controllers;

use App\Models\CryptoNetworks;
use App\Models\UserCrypto;
use App\Services\LogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserCryptoController extends Controller
{
    private function getNetworks(): array
    {
        return Cache::remember('crypto_networks', 3600, function () {
            return CryptoNetworks::query()
                ->select([
                    'id',
                    'name',
                    'symbol',
                    'chain',
                    'validation_regex',
                    'explorer_url',
                    'icon',
                    'is_active',
                    'sort_order'
                ])
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get()
                ->toArray();
        });
    }

    public function index()
    {
        try {
            $cryptos = UserCrypto::where('user_id', Auth::id())
                ->orderBy('is_default', 'desc')
                ->orderBy('created_at', 'desc')
                ->get();

            $networks = $this->getNetworks();

            LogService::cryptoActivity('view_crypto_list', [
                'crypto_count' => $cryptos->count(),
                'networks_available' => count($networks),
                'networks_data' => $networks
            ]);

            return Inertia::render('Profile/Cryptos/UserCryptoIndex', [
                'cryptos' => $cryptos,
                'networks' => array_values($networks),
            ]);
        } catch (\Exception $e) {
            LogService::error('Failed to load crypto list', $e);
            return Inertia::render('Profile/Cryptos/UserCryptoIndex', [
                'cryptos' => [],
                'networks' => [],
            ]);
        }
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $network = CryptoNetworks::findOrFail($request->network_id);

            LogService::cryptoActivity('store_attempt', [
                'network_id' => $network->id,
                'network_name' => $network->name
            ]);

            $validated = $request->validate([
                'network_id' => [
                    'required',
                    'string',
                    Rule::exists('crypto_networks', 'id')->where('is_active', true)
                ],
                'address' => [
                    'required',
                    'string',
                    'min:26',
                    'max:42',
                    Rule::unique('user_cryptos')->where(function ($query) {
                        return $query->where('user_id', Auth::id())
                                   ->whereNull('deleted_at');
                    }),
                    function ($attribute, $value, $fail) use ($network) {
                        if (!preg_match('/' . $network->validation_regex . '/', $value)) {
                            $fail(translate('crypto.errors.invalid_address_format'));
                        }
                    },
                ],
                'title' => 'required|string|max:255',
                'is_default' => 'boolean',
            ]);

            if ($validated['is_default']) {
                UserCrypto::where('user_id', Auth::id())
                    ->where('network_id', $validated['network_id'])
                    ->update(['is_default' => false]);
            }

            $crypto = UserCrypto::create([
                'user_id' => Auth::id(),
                ...$validated
            ]);

            DB::commit();

            LogService::cryptoActivity('store_success', [
                'crypto_id' => $crypto->id,
                'network_id' => $crypto->network_id
            ]);

            return redirect()->back()->with('success', translate('crypto.created'));

        } catch (\Exception $e) {
            DB::rollBack();
            LogService::error('Failed to create crypto address', $e, [
                'request_data' => $request->except(['address'])
            ]);

            return redirect()->back()
                ->with('error', translate('crypto.errors.create_failed'))
                ->withInput();
        }
    }

    public function update(Request $request, UserCrypto $crypto)
    {
        try {
            $this->authorize('update', $crypto);

            DB::beginTransaction();

            $oldData = $crypto->toArray();

            $validated = $request->validate([
                'network_id' => ['required', 'string', 'exists:networks,id'],
                'address' => [
                    'required',
                    'string',
                    'min:26',
                    'max:42',
                    Rule::unique('user_cryptos')->where(function ($query) use ($crypto) {
                        return $query->where('user_id', Auth::id())
                                   ->where('id', '!=', $crypto->id)
                                   ->whereNull('deleted_at');
                    })
                ],
                'title' => 'required|string|max:255',
                'is_default' => 'boolean',
            ]);

            if ($validated['is_default'] ?? false) {
                UserCrypto::where('user_id', Auth::id())
                    ->where('id', '!=', $crypto->id)
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
            }

            $crypto->update($validated);

            DB::commit();

            LogService::cryptoActivity('update_success', [
                'crypto_id' => $crypto->id,
                'old_data' => array_diff_assoc($oldData, $crypto->toArray()),
                'network_id' => $crypto->network_id
            ]);

            return redirect()->back()->with('success', translate('crypto.updated'));

        } catch (\Exception $e) {
            DB::rollBack();
            LogService::error('Failed to update crypto address', $e, [
                'crypto_id' => $crypto->id,
                'request_data' => $request->except(['address'])
            ]);
            return redirect()->back()->with('error', translate('crypto.errors.update_failed'));
        }
    }

    public function destroy(UserCrypto $crypto)
    {
        try {
            $this->authorize('delete', $crypto);

            DB::beginTransaction();

            $cryptoData = $crypto->toArray();
            $deleted = $crypto->forceDelete();

            if (!$deleted) {
                throw new \Exception('Kripto adres silinemedi');
            }

            DB::commit();

            LogService::cryptoActivity('delete_success', [
                'crypto_id' => $crypto->id,
                'network_id' => $crypto->network_id,
                'was_default' => $crypto->is_default
            ]);

            return redirect()->back()->with('success', translate('crypto.deleted'));

        } catch (\Exception $e) {
            DB::rollBack();
            LogService::error('Failed to delete crypto address', $e, [
                'crypto_id' => $crypto->id
            ]);
            return redirect()->back()->with('error', translate('crypto.errors.delete_failed'));
        }
    }
}

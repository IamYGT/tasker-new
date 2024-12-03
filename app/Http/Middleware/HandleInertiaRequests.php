<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use Illuminate\Support\Facades\View;
use App\Models\LanguageWord;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'roles' => $request->user()->roles,
                ] : null,
            ],
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'languages' => View::shared('languages', []),
            'secili_dil' => View::shared('secili_dil'),
            'translations' => $this->getTranslations(),
            'locale' => App::getLocale(),
            'csrf_token' => csrf_token(),
            'scroll' => [
                'y' => $request->header('X-Scroll-Y', 0),
            ],
            'banks' => $this->getTurkeyBanks(),
            'user_ibans' => $request->user() ? $this->getUserIbans($request->user()) : [],
        ];
    }

    private function getTranslations(): array
    {
        $locale = App::getLocale();
        return Cache::remember("translations_{$locale}", 60 * 24, function () use ($locale) {
            return LanguageWord::where('kod', $locale)
                ->pluck('deger', 'anahtar')
                ->toArray();
        });
    }

    private function getTurkeyBanks(): array
    {
        return Cache::remember('turkey_banks', 60 * 24, function () {
            $banksJson = file_get_contents(resource_path('js/Data/turkey_banks.json'));
            return json_decode($banksJson, true)['banks'];
        });
    }

    private function getUserIbans($user): array
    {
        return $user->ibans()
            ->with('user')
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($iban) {
                $bankDetails = collect($this->getTurkeyBanks())
                    ->firstWhere('id', $iban->bank_id);

                return [
                    'id' => $iban->id,
                    'bank_id' => $iban->bank_id,
                    'iban' => $iban->iban,
                    'formatted_iban' => $iban->formatted_iban,
                    'title' => $iban->title,
                    'is_default' => $iban->is_default,
                    'is_active' => $iban->is_active,
                    'created_at' => $iban->created_at,
                    'bank_details' => $bankDetails,
                ];
            })
            ->toArray();
    }
}

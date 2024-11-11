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
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'avatar' => $request->user()->avatar,
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
        ]);
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
}
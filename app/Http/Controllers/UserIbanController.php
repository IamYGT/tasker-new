<?php

namespace App\Http\Controllers;

use App\Models\UserIban;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UserIbanController extends Controller
{
    public function index()
    {
        $ibans = Auth::user()->ibans()
            ->with('user')
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        // Banka listesini JSON dosyasından oku
        $banksJson = file_get_contents(resource_path('js/Data/turkey_banks.json'));
        $banks = json_decode($banksJson, true)['banks'];

        return Inertia::render('Profile/Ibans/UserIbanIndex', [
            'ibans' => $ibans,
            'banks' => $banks,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'bank_id' => 'required|string',
            'iban' => ['required', 'string', 'size:26',
                Rule::unique('user_ibans')->where(function ($query) {
                    return $query->where('user_id', Auth::id())
                        ->whereNull('deleted_at');
                })
            ],
            'title' => 'required|string|max:255',
            'is_default' => 'boolean',
        ]);

        $validated['user_id'] = Auth::id();

        if ($validated['is_default']) {
            UserIban::where('user_id', Auth::id())->update(['is_default' => false]);
        }

        UserIban::create($validated);

        return redirect()->back()->with('success', __('messages.iban_added'));
    }

    public function update(Request $request, UserIban $iban)
    {
        $this->authorize('update', $iban);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'is_default' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if ($validated['is_default']) {
            UserIban::where('user_id', Auth::id())
                ->where('id', '!=', $iban->id)
                ->update(['is_default' => false]);
        }

        $iban->update($validated);

        return redirect()->back()->with('success', __('messages.iban_updated'));
    }

    public function destroy(UserIban $iban)
    {
        $this->authorize('delete', $iban);

        $iban->delete();

        return redirect()->back()->with('success', __('messages.iban_deleted'));
    }
}

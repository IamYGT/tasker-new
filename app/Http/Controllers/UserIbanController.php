<?php

namespace App\Http\Controllers;

use App\Models\UserIban;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class UserIbanController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        try {
            $ibans = UserIban::where('user_id', Auth::id())
                ->orderBy('is_default', 'desc')
                ->orderBy('created_at', 'desc')
                ->with('user')
                ->get();

            $banks = cache()->rememberForever('turkey_banks', function () {
                return json_decode(file_get_contents(resource_path('data/turkey_banks.json')), true);
            });

            return Inertia::render('Profile/Ibans/UserIbanIndex', [
                'ibans' => $ibans,
                'banks' => $banks,
            ]);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            // IBAN kontrolü - Silinen kayıtları da kontrol et
            $existingIban = UserIban::withTrashed()
                ->where('user_id', Auth::id())
                ->where('iban', $request->iban)
                ->first();

            if ($existingIban) {
                if ($existingIban->trashed()) {
                    // Silinmiş IBAN'ı geri yükle
                    $existingIban->restore();
                    DB::commit();
                    return redirect()->back()->with('success', translate('iban.restored'));
                }

                return redirect()->back()->withErrors([
                    'iban' => translate('iban.errors.iban_exists')
                ]);
            }

            $validated = $request->validate([
                'bank_id' => ['required', 'string', 'exists:banks,id'],
                'iban' => [
                    'required',
                    'string',
                    'min:26',
                    'max:34',
                    'regex:/^TR[0-9]{24}$/',
                    Rule::unique('user_ibans')->where(function ($query) {
                        return $query->where('user_id', Auth::id())
                                   ->whereNull('deleted_at');
                    })
                ],
                'title' => 'required|string|max:255',
                'is_default' => 'boolean',
                'name' => 'required|string|max:255',
                'surname' => 'required|string|max:255',
            ], [
                'bank_id.required' => translate('iban.errors.bank_required'),
                'bank_id.exists' => translate('iban.errors.bank_invalid'),
                'iban.required' => translate('iban.errors.iban_required'),
                'iban.regex' => translate('iban.errors.iban_invalid_format'),
                'iban.unique' => translate('iban.errors.iban_exists'),
                'title.required' => translate('iban.errors.title_required'),
                'name.required' => translate('iban.errors.name_required'),
                'surname.required' => translate('iban.errors.surname_required'),
            ]);

            // Eğer yeni IBAN varsayılan olarak ayarlanacaksa, diğer varsayılan IBAN'ları kaldır
            if ($validated['is_default'] ?? false) {
                UserIban::where('user_id', Auth::id())
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
            }

            $iban = UserIban::create([
                'user_id' => Auth::id(),
                'bank_id' => $validated['bank_id'],
                'iban' => $validated['iban'],
                'title' => $validated['title'],
                'is_default' => $validated['is_default'] ?? false,
                'is_active' => true,
                'name' => $validated['name'],
                'surname' => $validated['surname'],
            ]);

            DB::commit();

            return redirect()->back()->with('success', translate('iban.added'));
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return redirect()->back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', translate('iban.errors.create_failed'));
        }
    }

    public function update(Request $request, UserIban $iban)
    {
        try {
            $this->authorize('update', $iban);

            DB::beginTransaction();

            $validated = $request->validate([
                'bank_id' => ['required', 'string', 'exists:banks,id'],
                'iban' => [
                    'required',
                    'string',
                    'min:26',
                    'max:34',
                    'regex:/^TR[0-9]{24}$/',
                    Rule::unique('user_ibans')->where(function ($query) use ($iban) {
                        return $query->where('user_id', Auth::id())
                                   ->where('id', '!=', $iban->id)
                                   ->whereNull('deleted_at');
                    })
                ],
                'title' => 'required|string|max:255',
                'is_default' => 'boolean',
                'name' => 'required|string|max:255',
                'surname' => 'required|string|max:255',
            ], [
                'bank_id.required' => translate('iban.errors.bank_required'),
                'bank_id.exists' => translate('iban.errors.bank_invalid'),
                'iban.required' => translate('iban.errors.iban_required'),
                'iban.regex' => translate('iban.errors.iban_invalid_format'),
                'iban.unique' => translate('iban.errors.iban_exists'),
                'title.required' => translate('iban.errors.title_required'),
                'name.required' => translate('iban.errors.name_required'),
                'surname.required' => translate('iban.errors.surname_required'),
            ]);

            // Eğer yeni IBAN varsayılan olarak ayarlanacaksa, diğer varsayılan IBAN'ları kaldır
            if ($validated['is_default'] ?? false) {
                UserIban::where('user_id', Auth::id())
                    ->where('id', '!=', $iban->id)
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
            }

            $iban->update([
                'bank_id' => $validated['bank_id'],
                'iban' => $validated['iban'],
                'title' => $validated['title'],
                'is_default' => $validated['is_default'] ?? false,
                'name' => $validated['name'],
                'surname' => $validated['surname'],
            ]);

            DB::commit();

            return redirect()->back()->with('success', translate('iban.updated'));
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return redirect()->back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', translate('iban.errors.update_failed'));
        }
    }

    public function destroy(UserIban $iban)
    {
        try {
            $this->authorize('delete', $iban);

            DB::beginTransaction();

            $deleted = $iban->forceDelete();

            if (!$deleted) {
                throw new \Exception('IBAN silinemedi');
            }

            DB::commit();

            return redirect()->back()->with('success', translate('iban.deleted'));

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', translate('iban.errors.delete_failed'));
        }
    }
}

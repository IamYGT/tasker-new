<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserCredentialsMail;

class UserController extends Controller
{
    public function storePassword(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'password' => 'required|string',
            'email' => 'required|email'
        ]);

        $passwordsFile = storage_path('app/passwords.json');
        $passwords = [];

        if (file_exists($passwordsFile)) {
            $passwords = json_decode(file_get_contents($passwordsFile), true) ?? [];
        }

        $passwords[$data['user_id']] = [
            'email' => $data['email'],
            'password' => $data['password'],
            'created_at' => now()->toDateTimeString()
        ];

        file_put_contents($passwordsFile, json_encode($passwords, JSON_PRETTY_PRINT));

        return response()->json(['message' => 'Password stored successfully']);
    }

    public function sendCredentials($userId)
    {
        $user = User::findOrFail($userId);
        $passwordsFile = storage_path('app/passwords.json');

        if (!file_exists($passwordsFile)) {
            return response()->json(['message' => 'No password data found'], 404);
        }

        $passwords = json_decode(file_get_contents($passwordsFile), true);
        $userPassword = $passwords[$userId] ?? null;

        if (!$userPassword) {
            return response()->json(['message' => 'Password not found for this user'], 404);
        }

        Mail::to($user->email)->send(new UserCredentialsMail($user, $userPassword['password']));

        return response()->json(['message' => 'Credentials sent successfully']);
    }
}

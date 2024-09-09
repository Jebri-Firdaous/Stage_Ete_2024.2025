<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\PasswordReset;



class AuthController extends Controller
{
    //
    public function login(LoginRequest $request)
    {
        $data = $request->validated();
        
        if (!Auth::attempt($data)) {
            return response([
                'message' => 'email or password are wrong'
            ]);
        }

        $user = auth()->user(); 
        
        $token = $user->createToken('main')->plainTextToken;


        return response()->json([
            'user' => $user,
            'token' => $token
        ]);

    }

    public function register(RegisterRequest $request)
{
    $data = $request->validated();

    // Handle file upload (photo)
    if ($request->hasFile('photo')) {
        $photoPath = $request->file('photo')->store('photos', 'public');
        $data['photo'] = $photoPath;
    }

    try {
        $user = User::create([
            'name' => $data['name'],
            'prenom' => $data['prenom'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'role' => $data['role'],
            'telephone' => $data['telephone'],
            'age' => $data['age'],
            'genre' => $data['genre'],
            'photo' => $data['photo'],
        ]);

        $token = $user->createToken('main')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }catch (\Illuminate\Validation\ValidationException $e) {
        $validator = $e->validator;
        $errors = $validator->getMessageBag()->all();
        return response()->json(['errors' => $errors], 422);
    }
}
public function logout(Request $request)
{
    $user = $request->user();
    $user->currentAccessToken()->delete();
    return response()->json(['message' => 'Token removed'], 200);
}
public function forgottenPassword(Request $request)
{
    $request->validate([
        'email' => 'required|email',
    ]);

    $user = User::whereEmail($request->input('email'))->first();

    if ($user) {
        $token = Str::random(60);
        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => $token,
            'created_at' => Carbon::now()
        ]);

        $resetUrl = route('password.reset', ['token' => $token]);

        Mail::to($user->email)->send(new PasswordReset ($resetUrl));

        return response()->json(['message' => 'Reset link sent to your email']);
    } else {
        return response()->json(['message' => 'Email not found'], 404);
    }
}

}

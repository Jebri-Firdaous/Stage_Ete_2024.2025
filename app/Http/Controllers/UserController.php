<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
    
        $user->isBanned = $request->input('isBanned');
        $user->save();
    
        return response()->json(['message' => 'User ban status updated successfully']);
    }    
    
    public function showProfile(Request $request)
{
    return response()->json($request->user());
}
public function updateUser(Request $request, $id)
{
    $user = User::find($id);
    if (!$user) {
        return response()->json(['error' => 'User not found'], 404);
    }

    $user->name = $request->input('name');
    $user->prenom = $request->input('prenom');
    $user->email = $request->input('email');
    $user->telephone = $request->input('telephone');

    $user->save();

    return response()->json($user);
}

    
}
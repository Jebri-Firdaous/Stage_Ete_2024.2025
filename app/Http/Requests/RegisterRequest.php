<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;


class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
'name' => 'required|max:20|alpha',
           'prenom' => 'required|max:20|alpha',
'email' => [
            'required',
            'string',
            'unique:users,email',
            'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(gmail|hotmail|yahoo\.tn|com)$/'
        ],
           'password' => [
                'required',
                Password::min(8)
                ->letters()
            ],
            'role' => 'required|string|in:CITOYEN,ADMINISTRATEUR,AGENT',
            'telephone' => 'required|nullable|string|max:20|min:8',
            'age' => 'required|nullable|integer',
            'genre' => 'required|nullable|string|in:FEMME,HOMME',
            'photo' => 'required|nullable', // 10MB max size for photo
        ];
    }
    // In your request class
public function messages()
{
    return [
        'name.required' => 'Le nom est obligatoire.',
        'name.alpha' => 'Le nom doit contenir que des lettre.',
        'name.max' => 'Le nom ne doit pas dépasser 20 caractères.',
        'prenom.required' => 'Le prénom est obligatoire.',
        'prenom.string' => 'Le prénom doit être une chaîne.',
        'prenom.max' => 'Le prénom ne doit pas dépasser 2 caractères.',
        'email.required' => 'L\'email est obligatoire.',
        'email.string' => 'L\'email doit être une chaîne.',
        'email.unique' => 'L\'email est déjà utilisé.',
        'password.required' => 'Le mot de passe est obligatoire.',
        'password.string' => 'Le mot de passe doit être une chaîne.',
        'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
        'password.letters' => 'Le mot de passe doit contenir au moins 1 lettre',
        'role.required' => 'Le role est obligatoire.',
        'role.string' => 'Le role doit être une chaîne.',
        'telephone.string' => 'Le téléphone doit être une chaîne.',
        'telephone.min' => 'Le téléphone doit contenir au moin 20 chiffre.',
        'telephone.max' => 'Le téléphone ne doit pas depasser 20 chiffre.',
        'telephone.required' => 'le telephone est obligatoire',

        'age.integer' => 'L\'age doit être un nombre entier.',
        'age.required' => 'l\'age est obliguatoire.',
        'genre.required' => 'Le genre est obligatoire.',

        'genre.string' => 'Le genre doit être une chaîne.',
        'genre.in' => 'Le genre doit être Femme ou Homme.',
        'photo.required' => 'La photo est obligatoire.',
        'email.regex' => 'L\'adresse e-mail doit être valide et contenir un @ symbol.',

    
        // Define custom error messages for each field
    ];
}
}

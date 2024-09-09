<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use App\Http\Rules\MatchPassword;



class LoginRequest extends FormRequest
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
            'email' => [
            'required',
            'exists:users,email',
            'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(gmail|hotmail|yahoo\.tn|com)$/'
        ],
        'password' => [
             'required',
             new MatchPassword($this->input('email')),
             Password::min(8)
             ->letters()
         ]
        ];
    }
    public function messages()
    {
        return [
            'email.required' => 'L\'email est obligatoire.',
            'email.exists' => 'Cette adresse e-mail n\'est pas enregistrée dans notre système.',
            'email.regex' => 'L\'adresse e-mail doit être un compte Gmail, Hotmail, Yahoo ou .tn ou .com.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.letters' => 'Le mot de passe doit contenir au moins une lettre.',
            'password.invalid' => 'Le mot de passe ne correspond pas à l\'adresse e-mail.',
        ];
    }
}

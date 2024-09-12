<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RecController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login',[AuthController::class,'login']);
Route::post('/register',[AuthController::class,'register']);
Route::post('/api/logout', 'AuthController@logout');
Route::post('/forgotPassword',[AuthController::class,'forgotPassword']);
Route::get('/users', [UserController::class, 'index']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::put('/usersupdate/{id}', [UserController::class, 'updateUser']);

Route::middleware('auth:sanctum')->group(function() {


Route::get('/reclamations', [RecController::class, 'index']);
Route::post('/addReclamation', [RecController::class, 'store']);
Route::delete('/reclamations/{id}', [RecController::class, 'destroy']);
Route::put('/reclamations/{id}', [RecController::class, 'update']);
Route::put('/reclamations/{idRec}/assign', [RecController::class, 'assignAgent']);
Route::put('/reclamations/{idRec}/status', [RecController::class, 'UpdateStatus']);
Route::get('/profile', [UserController::class, 'showProfile']);
Route::post('/reclamations/{id}/replies', [RecommendationController::class, 'addReply']);
Route::get('/recommendations', [RecommendationController::class, 'index']);
Route::put('/recommendations/{id}', [RecommendationController::class, 'updateRecommendation']);
Route::delete('/recommendations/{id}', [RecommendationController::class, 'destroy']);


// Assurez-vous que cette route est correctement définie
Route::get('/recommendationsByReclamation/{idRec}', [RecommendationController::class, 'getRecommendationsByReclamation']);








});

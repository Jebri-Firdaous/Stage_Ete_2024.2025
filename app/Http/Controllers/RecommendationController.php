<?php

namespace App\Http\Controllers;

use App\Models\Reclamation;
use App\Models\Recommendation;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function addReply(Request $request, $id)
    {
        $request->validate([
            'text' => 'required|string|max:1000',
            'date_recommendation' => 'required|date',
            'author_id' => 'required|integer|exists:users,id'
        ]);

        $reclamation = Reclamation::find($id);

        if (!$reclamation) {
            return response()->json(['message' => 'Réclamation non trouvée.'], 404);
        }

        $reply = new Recommendation();
        $reply->idRec = $id;
        $reply->text = $request->input('text');
        $reply->dateRecommandation = $request->input('date_recommendation');
        $reply->idAuteur = $request->input('author_id');

        $reply->save();

        return response()->json(['message' => 'Réponse ajoutée avec succès.', 'reply' => $reply], 201);
    }

    public function index()
    {
        $recommendations = Recommendation::all();
        return response()->json($recommendations);
    }

    public function updateRecommendation(Request $request, $id)
    {
        $request->validate([
            'text' => 'required|string|max:1000',
        ]);

        $recommendation = Recommendation::find($id);

        if (!$recommendation) {
            return response()->json(['message' => 'Recommandation non trouvée.'], 404);
        }

        $recommendation->text = $request->input('text');
        $recommendation->save();

        return response()->json(['message' => 'Recommandation mise à jour avec succès.', 'recommendation' => $recommendation]);
    }

    public function destroy($id)
    {
        $recommendation = Recommendation::find($id);
    
        if (!$recommendation) {
            return response()->json(['message' => 'Recommandation introuvable'], 404);
        }
    
        // Check if the logged-in user is the owner of the recommendation
        if (auth()->user()->id !== $recommendation->idAuteur) {
            return response()->json([
                'message' => 'Non autorisé à supprimer cette recommandation',
                'currentUserId' => auth()->user()->id,
                'recommendationOwnerId' => $recommendation->idAuteur
            ], 403);
        }
    
        $recommendation->delete();
    
        return response()->json(['message' => 'Recommandation supprimée avec succès'], 204);
    }
    
    


    public function getRecommendationsByReclamation($idRec)
    {
        $recommendations = Recommendation::where('idRec', $idRec)->get();
        return response()->json($recommendations);
    }
    
}

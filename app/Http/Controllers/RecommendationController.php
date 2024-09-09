<?php

namespace App\Http\Controllers;

use App\Models\Reclamation;
use App\Models\Recommendation;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function addReply(Request $request, $id)
    {
        // Validation des données
        $request->validate([
            'text' => 'required|string|max:1000',
            'date_recommendation' => 'required|date',
            'author_id' => 'required|integer'
        ]);

        // Trouver la réclamation
        $reclamation = Reclamation::find($id);

        if (!$reclamation) {
            return response()->json(['message' => 'Réclamation non trouvée.'], 404);
        }

        // Créer la réponse
        $reply = new Recommendation();
        $reply->idRec = $id;
        $reply->text = $request->input('text');
        $reply->dateRecommandation = $request->input('date_recommendation'); // Correspond au champ envoyé
        $reply->idAuteur = $request->input('author_id'); // Correspond au champ envoyé

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
        // Validation des données
        $request->validate([
            'text' => 'required|string|max:1000',
        ]);

        // Trouver la recommandation
        $recommendation = Recommendation::find($id);

        if (!$recommendation) {
            return response()->json(['message' => 'Recommandation non trouvée.'], 404);
        }

        // Mettre à jour les champs
        $recommendation->text = $request->input('text');
        $recommendation->save();

        return response()->json(['message' => 'Recommandation mise à jour avec succès.', 'recommendation' => $recommendation]);
    }
}

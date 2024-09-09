<?php

namespace App\Http\Controllers;

use App\Models\Reclamation;
use Illuminate\Http\Request;

class RecController extends Controller
{
    //
    public function store(Request $request)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Utilisateur non authentifié'], 401);
        }
    
        $reclamation = new Reclamation();
        $reclamation->description = $request->input('description');
        $reclamation->idCitoyen = auth()->user()->id; // Récupère l'ID de l'utilisateur connecté
        $reclamation->dateSoumission = now(); // Récupère la date et l'heure actuelle
        $reclamation->status = 0; // Statut par défaut à 0
        $reclamation->idAgent = null; // Définir idAgent à null par défaut

        $reclamation->save();
    
        return response()->json(['message' => 'Réclamation créée avec succès'], 201);
    }
    public function UpdateStatus(Request $request, $idRec)
    {
        // Valider la requête
        $request->validate([
            'status' => 'required|integer|in:0,1,2',
        ]);

        // Trouver la réclamation par ID
        $reclamation = Reclamation::find($idRec);

        if (!$reclamation) {
            return response()->json(['message' => 'Réclamation non trouvée'], 404);
        }

        // Mettre à jour le status
        $reclamation->status = $request->input('status');
        $reclamation->save();

        return response()->json(['message' => 'Status mis à jour avec succès', 'reclamation' => $reclamation]);
    }
    public function assignAgent(Request $request, $idRec)
{
    $request->validate([
        'agentId' => 'required|exists:users,id',
    ]);

    $reclamation = Reclamation::findOrFail($idRec);
    $reclamation->idAgent = $request->input('agentId');
    $reclamation->save();

    return response()->json([
        'message' => 'Agent assigned successfully',
        'reclamation' => $reclamation,
    ], 200);
}
    public function index()
    {
        try {
            $reclamations = Reclamation::all();
            return response()->json($reclamations, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server Error'], 500);
        }
    }
    public function destroy($id)
{
    // Récupérer la réclamation par son ID
    $reclamation = Reclamation::find($id);

    // Vérifier si la réclamation existe
    if (!$reclamation) {
        return response()->json(['message' => 'Réclamation introuvable'], 404);
    }

    // Vérifier si l'utilisateur connecté est autorisé à supprimer cette réclamation
    if (auth()->user()->id !== $reclamation->idCitoyen) {
        return response()->json(['message' => 'Non autorisé à supprimer cette réclamation'], 403);
    }

    // Supprimer la réclamation
    $reclamation->delete();

    return response()->json(['message' => 'Réclamation supprimée avec succès'], 200);
}
public function update(Request $request, $id)
{
    // Mettre à jour la réclamation
    $reclamation = Reclamation::find($id);
    $reclamation->description = $request->input('description');
    $reclamation->save();

    return response()->json(['message' => 'Réclamation mise à jour avec succès']);
}
    
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reclamation extends Model
{
    use HasFactory;

    protected $table = 'reclamation';
    protected $primaryKey = 'idRec';
    protected $fillable = [
        // Liste des colonnes de votre table reclamations
        'idRec',
        'description',
        'dateSoumission',
        'status',
        'idCitoyen',
        'idAgent',
        'created_at',
        'updated_at',
    ];

    /**
     * Relation avec la table users (anciennement citoyens)
     *
     * @return BelongsTo
     */
    public function citoyen(): BelongsTo
    {
        return $this->belongsTo(User::class, 'idCitoyen', 'id');
    }
    public function recommendations()
    {
        return $this->hasMany(Recommendation::class, 'idRec', 'idRec');
    }
}

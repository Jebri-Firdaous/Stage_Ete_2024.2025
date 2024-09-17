<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Recommendation extends Model
{
    use HasFactory;

    protected $table = 'recommendation';

    protected $primaryKey = 'idComment';

    protected $fillable = [
        'idComment',
        'text',
        'dateRecommandation',
        'idRec',
        'idAuteur',
        'created_at',
        'updated_at',
    ];
    /**
     * Relation avec la table reclamation 
     *
     * @return BelongsTo
     */

    public function rec() : BelongsTo
    {
        return $this->belongsTo(Reclamation::class, 'idRec', 'idRec');    }
}

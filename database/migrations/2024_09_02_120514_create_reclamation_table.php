<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reclamation', function (Blueprint $table) {
            $table->id('idRec');
            $table->string('description');
            $table->dateTime('dateSoumission')->useCurrent();
            $table->integer('status')->default(0);
            $table->bigInteger('idCitoyen')->constrained('users', 'id')->onDelete('cascade');
            $table->timestamps();
            $table->unsignedBigInteger('idAgent')->nullable()->after('idCitoyen');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reclamation');
    }
};
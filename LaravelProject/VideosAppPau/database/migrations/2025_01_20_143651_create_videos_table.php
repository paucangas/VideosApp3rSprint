<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVideosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id(); // ID autoincremental
            $table->string('title'); // Títol del vídeo
            $table->text('description')->nullable(); // Descripció del vídeo
            $table->string('url'); // URL del vídeo
            $table->timestamp('published_at')->nullable(); // Data de publicació
            $table->unsignedBigInteger('previous')->nullable(); // Vídeo anterior (opcional)
            $table->unsignedBigInteger('next')->nullable(); // Vídeo següent (opcional)
            $table->unsignedBigInteger('series_id')->nullable(); // ID de la serie (opcional)
            $table->foreign('previous')->references('id')->on('videos')->nullOnDelete(); // Relació amb altre vídeo
            $table->foreign('next')->references('id')->on('videos')->nullOnDelete(); // Relació amb altre vídeo
            $table->timestamps(); // Campos created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('videos');
    }
}

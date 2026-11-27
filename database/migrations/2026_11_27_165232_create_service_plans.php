<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * The services of /servicios became plans (see PlanType). This creates their options with the prices the page showed
 * until now (its VITE_PRICE_* variables, or their defaults), skipping a slug that already exists. They are edited
 * from the panel from now on.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // The tests create the plans they need
        if (app()->runningUnitTests()) {
            return;
        }

        $price = fn (string $variable, int $default): float => is_numeric(env($variable)) && (float) env($variable) > 0 ? (float) env($variable) : $default;
        $included = (int) $price('VITE_PASSES_INCLUDED', 50);
        $extraPasses = '+$'.number_format($price('VITE_PRICE_EXTRA_PASSES', 99)).' por cada '.$included.' pases adicionales';
        $passesNote = "Incluye hasta {$included} pases";
        $card = $price('VITE_PRICE_CARD', 299);
        $passes = $price('VITE_PRICE_PASSES', 249);
        $cardAndPasses = $price('VITE_PRICE_CARD_AND_PASSES', 469);
        $saving = $card + $passes - $cardAndPasses;

        $plans = [
            ['video-invitacion', 'video_invitation', 'Invitación en video', $price('VITE_PRICE_VIDEO_INVITATION', 499), null, [
                'Sus fotos, su canción y los datos del evento',
                'Lista para enviar por WhatsApp o redes',
            ], false, 10],
            ['semblanza-esencial', 'tribute_video', 'Esencial', $price('VITE_PRICE_TRIBUTE_VIDEO', 599), null, [
                'Duración de hasta 3 minutos',
                'Sus fotos con transiciones y su canción de fondo',
            ], false, 20],
            ['semblanza-premium', 'tribute_video', 'Premium', $price('VITE_PRICE_TRIBUTE_VIDEO_PREMIUM', 999), null, [
                'Duración de 3 a 5 minutos',
                'Fotos sincronizadas con el ritmo de la música',
            ], true, 21],
            ['imprimible-tarjeta', 'printables', 'Tarjeta', $card, null, [
                'Diseño personalizado de la tarjeta',
                'En PDF, lista para imprimir',
            ], false, 30],
            ['imprimible-pases', 'printables', 'Pases', $passes, $passesNote, [
                'Un pase por invitado, con su nombre y sus lugares',
                'En PDF, listos para imprimir',
                $extraPasses,
            ], false, 31],
            ['imprimible-tarjeta-pases', 'printables', 'Tarjeta + pases', $cardAndPasses, $passesNote, [
                'La tarjeta y los pases con el mismo diseño',
                'Un pase por invitado, con su nombre y sus lugares',
                $extraPasses,
                ...($saving > 0 ? ['Ahorran $'.number_format($saving)] : []),
            ], true, 32],
        ];

        foreach ($plans as [$slug, $type, $name, $amount, $note, $details, $featured, $sortOrder]) {
            if (DB::table('plans')->where('slug', $slug)->exists()) {
                continue;
            }

            DB::table('plans')->insert([
                'slug' => $slug,
                'type' => $type,
                'name' => $name,
                'price' => $amount,
                'price_note' => $note,
                'details' => json_encode($details, JSON_UNESCAPED_UNICODE),
                'features' => json_encode([]),
                'is_active' => true,
                'is_featured' => $featured,
                'sort_order' => $sortOrder,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations. Plans already sold stay.
     */
    public function down(): void
    {
        DB::table('plans')
            ->whereIn('slug', ['video-invitacion', 'semblanza-esencial', 'semblanza-premium', 'imprimible-tarjeta', 'imprimible-pases', 'imprimible-tarjeta-pases'])
            ->whereNotExists(fn ($query) => $query->select(DB::raw(1))->from('orders')->whereColumn('orders.plan_id', 'plans.id'))
            ->delete();
    }
};

<?php

use App\Models\Invitation;
use Illuminate\Support\Facades\DB;

it('points existing invitations at the renamed template folders', function () {
    $migration = require database_path('migrations/2026_11_11_192505_rename_invitation_templates.php');
    $invitation = Invitation::factory()->create();
    // Saved as before the rename, with a path of a demo whose old name prefixes another one
    DB::table('invitations')->where('id', $invitation->id)->update([
        'template' => 'demo-xv',
        'og_image' => '/invitations/demo-xv/og-image.jpg',
        'content' => json_encode([
            'music' => '/invitations/demo/music.mp3',
            'gallery' => [['image' => '/invitations/demo-xv/images/01.svg']],
            'cover' => "invitations/{$invitation->id}/portada.jpg",
        ]),
    ]);

    $migration->up();
    $invitation->refresh();

    expect($invitation->template)->toBe('xv-jardin')
        ->and($invitation->og_image)->toBe('/invitations/xv-jardin/og-image.jpg')
        ->and($invitation->content['music'])->toBe('/invitations/boda-clasica/music.mp3')
        ->and($invitation->content['gallery'][0]['image'])->toBe('/invitations/xv-jardin/images/01.svg')
        ->and($invitation->content['cover'])->toBe("invitations/{$invitation->id}/portada.jpg");

    $migration->down();

    expect($invitation->refresh()->template)->toBe('demo-xv')
        ->and($invitation->content['music'])->toBe('/invitations/demo/music.mp3');
});

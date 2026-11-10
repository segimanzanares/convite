<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Feature tests render the Blade root view, which would otherwise
        // need a running Vite dev server or a production build manifest.
        $this->withoutVite();
    }
}

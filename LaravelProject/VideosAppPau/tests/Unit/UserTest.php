<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function test_is_super_admin_function()
    {
        // Crear un usuari superadministrador
        $superAdmin = create_superadmin_user();

        // Comprovar que el mètode isSuperAdmin retorna true per al superadmin
        $this->assertTrue($superAdmin->isSuperAdmin());

        // Crear un usuari regular
        $regularUser = create_regular_user();

        // Comprovar que el mètode isSuperAdmin retorna false per a un usuari regular
        $this->assertFalse($regularUser->isSuperAdmin());
    }
}

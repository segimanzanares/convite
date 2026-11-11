<?php

namespace App\Console\Commands;

use App\Actions\Fortify\CreateNewUser;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Validation\ValidationException;

use function Laravel\Prompts\password;
use function Laravel\Prompts\text;

/**
 * Public registration is disabled (see config/fortify.php), so admin panel
 * accounts are created from the command line.
 */
#[Signature('admin:create {--name= : Nombre del administrador} {--email= : Correo electrónico} {--password= : Contraseña (si se omite, se pide de forma oculta)}')]
#[Description('Crea una cuenta de administrador para el panel')]
class CreateAdmin extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(CreateNewUser $createNewUser): int
    {
        $name = $this->option('name') ?? text('Nombre', required: true);
        $email = $this->option('email') ?? text('Correo electrónico', required: true);
        $password = $this->option('password') ?? password('Contraseña', required: true);

        try {
            $user = $createNewUser->create([
                'name' => $name,
                'email' => $email,
                'password' => $password,
                'password_confirmation' => $password,
            ]);
        } catch (ValidationException $exception) {
            foreach ($exception->validator->errors()->all() as $error) {
                $this->components->error($error);
            }

            return self::FAILURE;
        }

        // The account is created by someone with server access, so its email
        // address does not need to go through the verification link flow.
        $user->markEmailAsVerified();

        $this->components->info("Administrador {$user->email} creado");
        $this->components->twoColumnDetail('Inicio de sesión', route('login'));

        return self::SUCCESS;
    }
}

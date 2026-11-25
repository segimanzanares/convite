import { Link, usePage } from '@inertiajs/react';
import { SearchIcon, TriangleAlertIcon } from 'lucide-react';
import { CheckInCard } from './components/check-in-card';
import { DoorLayout } from './components/door-layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { CheckInPageProps } from '@/types/check-in';

/**
  * What a scanned pass opens on the phone of the staff at the door. Everyone else gets the guest's invitation from the
  * same link.
  */
export function CheckInPage() {
    const { door, guest } = usePage<CheckInPageProps>().props;

    return (
        <DoorLayout door={door}>
            {guest ? (
                // Keyed so the number of people resets when the next pass is scanned
                <CheckInCard key={guest.id} guest={guest} />
            ) : (
                <Alert variant="destructive" className="border-destructive/30 bg-card">
                    <TriangleAlertIcon />
                    <AlertTitle>Pase no encontrado</AlertTitle>
                    <AlertDescription>
                        Este código no es un pase de este evento, o el invitado ya no está en la lista. Búsquenlo por nombre.
                    </AlertDescription>
                </Alert>
            )}

            <Button asChild variant="outline" className="mt-6 h-11 w-full">
                <Link href={door.url}>
                    <SearchIcon />
                    Buscar invitado por nombre
                </Link>
            </Button>
        </DoorLayout>
    );
}

export default CheckInPage;

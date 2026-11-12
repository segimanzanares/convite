import { Link, usePage } from '@inertiajs/react';
import { CheckInCard } from './components/check-in-card';
import { DoorLayout } from './components/door-layout';
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
                <p role="alert" className="bg-red-100 text-red-900 p-5">
                    Este código no es un pase de este evento, o el invitado ya no está en la lista. Búsquenlo por nombre.
                </p>
            )}

            <Link href={door.url} className="mt-6 block text-center text-sm text-primary underline">
                Buscar invitado por nombre
            </Link>
        </DoorLayout>
    );
}

export default CheckInPage;

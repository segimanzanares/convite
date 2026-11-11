import { Head } from '@inertiajs/react';
import { ExternalLinkIcon, MailOpenIcon } from 'lucide-react';
import { mine } from '@/actions/App/Http/Controllers/Admin/InvitationController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { formatDate } from '@/lib/format';
import { invitationStatusLabels } from '@/lib/labels';
import type { Invitation } from '@/types';

export default function InvitationsMine({
    invitations,
}: {
    invitations: Invitation[];
}) {
    return (
        <>
            <Head title="Mis invitaciones" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Mis invitaciones"
                    description="El enlace público de cada invitación y la fecha de tu evento"
                />

                {invitations.length === 0 ? (
                    <div className="text-muted-foreground mx-auto flex max-w-md flex-col items-center gap-3 py-10 text-center text-sm">
                        <MailOpenIcon className="size-8" />
                        Tu invitación aparecerá aquí en cuanto esté lista.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {invitations.map((invitation) => (
                            <Card key={invitation.id}>
                                <CardHeader>
                                    <CardTitle>{invitation.title}</CardTitle>
                                    <CardDescription>
                                        Evento: {formatDate(invitation.event_date)}
                                        {invitation.rsvp_deadline &&
                                            ` · Confirmar antes del ${formatDate(invitation.rsvp_deadline)}`}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                                    <Badge variant="outline">
                                        {invitationStatusLabels[invitation.status]}
                                    </Badge>
                                    <Button variant="outline" size="sm" asChild>
                                        <a
                                            href={invitation.url}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <ExternalLinkIcon />
                                            Ver invitación
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

InvitationsMine.layout = {
    breadcrumbs: [{ title: 'Mis invitaciones', href: mine() }],
};

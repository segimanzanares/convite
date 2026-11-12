import { Head } from '@inertiajs/react';
import { ExternalLinkIcon, MailOpenIcon } from 'lucide-react';
import BarChart from '@/components/bar-chart';
import Heading from '@/components/heading';
import InvitationSectionLinks from '@/components/invitation-sections';
import StatCard from '@/components/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    formatDate,
    formatDay,
    formatDaysAway,
    formatShortDate,
} from '@/lib/format';
import { dashboard } from '@/routes';
import type { DailyAnswers, InvitationProgress, Rsvp } from '@/types';

type Props = {
    invitations: InvitationProgress[];
    recentAnswers: Rsvp[];
    answersByDay: DailyAnswers[];
};

export default function ClientDashboard({
    invitations,
    recentAnswers,
    answersByDay,
}: Props) {
    const takesRsvps = invitations.some((progress) => progress.rsvps);

    return (
        <>
            <Head title="Panel" />

            <div className="space-y-10 p-4">
                <Heading
                    title="Panel"
                    description="Cómo van tus invitaciones y quién ha confirmado"
                />

                {invitations.length === 0 ? (
                    <div className="text-muted-foreground mx-auto flex max-w-md flex-col items-center gap-3 py-10 text-center text-sm">
                        <MailOpenIcon className="size-8" />
                        Tu invitación aparecerá aquí en cuanto esté lista.
                    </div>
                ) : (
                    invitations.map((progress) => (
                        <InvitationCard
                            key={progress.invitation.id}
                            progress={progress}
                        />
                    ))
                )}

                {takesRsvps && (
                    <div className="grid gap-6 lg:grid-cols-2">
                        <section className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <BarChart
                                title={`Respuestas de los últimos ${answersByDay.length} días`}
                                stacked
                                series={[
                                    {
                                        name: 'Asistirán',
                                        className: 'bg-chart-2',
                                    },
                                    {
                                        name: 'No asistirán',
                                        className: 'bg-chart-1',
                                    },
                                ]}
                                data={answersByDay.map((day, index) => ({
                                    // Every other label, so they fit
                                    label:
                                        index % 2 === answersByDay.length % 2
                                            ? ''
                                            : formatShortDate(day.day),
                                    values: [day.attending, day.declined],
                                }))}
                            />
                        </section>

                        <section className="space-y-4">
                            <Heading
                                variant="small"
                                title="Últimas respuestas"
                            />
                            {recentAnswers.length === 0 ? (
                                <p className="text-muted-foreground text-sm">
                                    Aún no hay respuestas.
                                </p>
                            ) : (
                                <ul className="divide-y text-sm">
                                    {recentAnswers.map((answer) => (
                                        <RecentAnswer
                                            key={answer.id}
                                            answer={answer}
                                            showInvitation={
                                                invitations.length > 1
                                            }
                                        />
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </>
    );
}

function InvitationCard({ progress }: { progress: InvitationProgress }) {
    const {
        invitation,
        guests,
        rsvps,
        days_until_event: daysUntilEvent,
    } = progress;
    const answeredGuests = rsvps ? rsvps.guests - rsvps.pending : 0;

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1.5">
                        <CardTitle>{invitation.title}</CardTitle>
                        <CardDescription>
                            Evento: {formatDate(invitation.event_date)}
                            {daysUntilEvent !== null &&
                                ` · ${formatDaysAway(daysUntilEvent)}`}
                            {invitation.rsvp_deadline &&
                                ` · Confirmar antes del ${formatDate(invitation.rsvp_deadline)}`}
                        </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <InvitationSectionLinks invitation={invitation} />
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
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {invitation.guests_purged_at && (
                    <Badge variant="secondary">
                        Los datos de invitados se eliminaron después del evento
                    </Badge>
                )}

                {rsvps && (
                    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Asistirán" value={rsvps.attending} />
                        <StatCard label="No asistirán" value={rsvps.declined} />
                        {guests && (
                            <StatCard
                                label="Pendientes"
                                value={rsvps.pending}
                            />
                        )}
                        <StatCard
                            label="Personas confirmadas"
                            value={rsvps.people}
                        />
                    </dl>
                )}

                {guests && (
                    <div className="grid gap-6 md:grid-cols-3">
                        <Progress
                            label="Invitados registrados"
                            value={guests.total}
                            total={guests.limit}
                            hint={
                                guests.limit === null
                                    ? 'Sin límite en tu plan'
                                    : `${guests.limit - guests.total} disponibles en tu plan`
                            }
                        />
                        <Progress
                            label="Invitaciones enviadas"
                            value={guests.sent}
                            total={guests.total}
                        />
                        <Progress
                            label="Invitaciones abiertas"
                            value={guests.opened}
                            total={guests.total}
                        />
                        {rsvps && (
                            <Progress
                                label="Invitados que respondieron"
                                value={answeredGuests}
                                total={guests.total}
                            />
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

/** A labelled bar of how much of a total was reached; without a total it only shows the count. */
function Progress({
    label,
    value,
    total,
    hint,
}: {
    label: string;
    value: number;
    total: number | null;
    hint?: string;
}) {
    const percent = total
        ? Math.min(100, Math.round((value / total) * 100))
        : 0;

    return (
        <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium tabular-nums">
                    {total === null ? value : `${value} de ${total}`}
                </span>
            </div>
            {total !== null && (
                <div
                    className="bg-muted h-2 overflow-hidden rounded-full"
                    role="progressbar"
                    aria-label={label}
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    <div
                        className="bg-chart-2 h-full rounded-full"
                        style={{ width: `${percent}%` }}
                    />
                </div>
            )}
            {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
        </div>
    );
}

function RecentAnswer({
    answer,
    showInvitation,
}: {
    answer: Rsvp;
    showInvitation: boolean;
}) {
    return (
        <li className="flex items-start justify-between gap-3 py-3">
            <div className="min-w-0">
                <p className="font-medium">{answer.name}</p>
                <p className="text-muted-foreground truncate text-xs">
                    {formatDay(answer.responded_at)}
                    {showInvitation &&
                        answer.invitation &&
                        ` · ${answer.invitation.title}`}
                    {answer.message && ` · “${answer.message}”`}
                </p>
            </div>
            {answer.attending ? (
                <Badge>
                    Asistirá
                    {answer.seats_confirmed > 1 &&
                        ` · ${answer.seats_confirmed}`}
                </Badge>
            ) : (
                <Badge variant="secondary">No asistirá</Badge>
            )}
        </li>
    );
}

ClientDashboard.layout = {
    breadcrumbs: [{ title: 'Panel', href: dashboard() }],
};

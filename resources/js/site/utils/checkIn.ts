/** "3 de mayo, 18:00", in the phone's time zone. */
export function formatDoorTime(iso: string) {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(
    new Date(iso),
  );
}

/** "18:42". */
export function formatArrivalTime(iso: string) {
  return new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}

/** "1 persona" / "4 personas". */
export function peopleLabel(count: number) {
  return `${count} ${count === 1 ? 'persona' : 'personas'}`;
}

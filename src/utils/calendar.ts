import type { CoupleInfo, Venue } from '../types/wedding';

interface CalendarEvent {
  title: string;
  location: string;
  start: Date;
  end: Date;
}

const LAST_EVENT_DURATION_MINUTES = 5 * 60;
const FALLBACK_HOUR = 12;

function pad(value: number) {
  return value.toString().padStart(2, '0');
}

// Floating local time (no timezone): the event happens at the venue's wall-clock time.
function formatLocal(date: Date) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
}

function formatUtc(date: Date) {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

function parseVenueTime(time: string): [number, number] {
  const match = time.match(/(\d{1,2}):(\d{2})/);
  return match ? [Number(match[1]), Number(match[2])] : [FALLBACK_HOUR, 0];
}

function buildEvents(couple: CoupleInfo, venues: Venue[]): CalendarEvent[] {
  const [year, month, day] = couple.weddingDateTime.slice(0, 10).split('-').map(Number);
  const [first, second] = couple.names;

  const starts = venues.map((venue) => {
    const [hours, minutes] = parseVenueTime(venue.time);
    return new Date(year, month - 1, day, hours, minutes);
  });

  return venues.map((venue, index) => {
    const start = starts[index];
    const end = starts[index + 1] ?? new Date(start.getTime() + LAST_EVENT_DURATION_MINUTES * 60_000);
    return {
      title: `${venue.tag} — Boda ${first} & ${second}`,
      location: [venue.name, ...venue.addressLines].join(', '),
      start,
      end,
    };
  });
}

function escapeText(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

function foldLine(line: string) {
  const chunks: string[] = [];
  for (let i = 0; i < line.length; i += 70) {
    chunks.push(line.slice(i, i + 70));
  }
  return chunks.join('\r\n ');
}

function buildIcs(events: CalendarEvent[]) {
  const stamp = formatUtc(new Date());
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Convite//Invitation//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events.flatMap((event, index) => [
      'BEGIN:VEVENT',
      `UID:${formatLocal(event.start)}-${index}@convite`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${formatLocal(event.start)}`,
      `DTEND:${formatLocal(event.end)}`,
      `SUMMARY:${escapeText(event.title)}`,
      `LOCATION:${escapeText(event.location)}`,
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ];
  return lines.map(foldLine).join('\r\n') + '\r\n';
}

export function downloadWeddingCalendar(couple: CoupleInfo, venues: Venue[]) {
  const ics = buildIcs(buildEvents(couple, venues));
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'boda.ics';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

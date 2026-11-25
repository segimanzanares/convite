import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { BabyShowerContent, BaptismContent, BirthdayContent, GenderRevealContent, WeddingContent, XvContent } from '../types/invitation';
import type { CelebrantInfo } from '../types/birthday';
import type { CoupleInfo } from '../types/wedding';

/** Formats a date in Spanish, or returns an empty label when there is no date yet. */
export function formatDate(date: Date | null, pattern: string): string {
  return date ? format(date, pattern, { locale: es }) : '';
}

/** The event and RSVP deadline dates of the content. The deadline falls back to the event day. */
export function eventDates(content: { eventAt: string | null; rsvpDeadline: string | null }) {
  const eventDate = content.eventAt ? parseISO(content.eventAt) : null;
  const deadline = content.rsvpDeadline ? parseISO(content.rsvpDeadline) : eventDate;

  return { eventDate, deadline };
}

/** Initials of the given names, e.g. "Mariana" + "Alejandro" → "MA". */
export function initials(...names: string[]): string {
  return names
    .map((name) => name.trim().charAt(0))
    .join('')
    .toUpperCase();
}

/** The labels shared by every template; each one may still format the date its own way. */
function labels(content: WeddingContent | BirthdayContent | XvContent | BaptismContent | GenderRevealContent | BabyShowerContent) {
  const { eventDate, deadline } = eventDates(content);

  return {
    dateLabel: formatDate(eventDate, "EEEE '·' dd 'de' MMMM '·' yyyy"),
    rsvpDeadlineLabel: formatDate(deadline, "dd 'de' MMMM 'de' yyyy"),
    footerDateLabel: formatDate(eventDate, "dd '·' MM '·' yyyy"),
  };
}

export function toCouple(content: WeddingContent): CoupleInfo {
  const { eventDate } = eventDates(content);

  return {
    names: content.names,
    weddingDateTime: content.eventAt ?? '',
    year: eventDate ? eventDate.getFullYear().toString() : '',
    families: content.families,
    rsvpWhatsappNumber: content.rsvpWhatsappNumber,
    musicFile: content.musicFile ?? undefined,
    ...labels(content),
  };
}

export function toCelebrant(content: BirthdayContent | XvContent | BaptismContent): CelebrantInfo {
  return {
    name: content.name,
    firstName: content.firstName,
    age: content.age ?? 0,
    eventDateTime: content.eventAt ?? '',
    hosts: content.hosts,
    rsvpWhatsappNumber: content.rsvpWhatsappNumber,
    musicFile: content.musicFile ?? undefined,
    ...labels(content),
  };
}

/** "Ana & Luis", or the one name of a single parent-to-be. */
export function joinNames(names: string[]): string {
  return names.filter(Boolean).join(' & ');
}

/** The parents-to-be of a gender reveal or a baby shower and the labels their templates share. */
export function toParentsToBe(content: GenderRevealContent | BabyShowerContent) {
  const { eventDate } = eventDates(content);

  return {
    names: content.names,
    namesLabel: joinNames(content.names),
    monogram: initials(...content.names),
    eventDateTime: content.eventAt ?? '',
    eventDate,
    families: content.families,
    rsvpWhatsappNumber: content.rsvpWhatsappNumber,
    musicFile: content.musicFile ?? undefined,
    ...labels(content),
  };
}

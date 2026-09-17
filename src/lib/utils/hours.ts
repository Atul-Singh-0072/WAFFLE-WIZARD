import { formatTime } from "@/lib/utils/format";
import type { OpeningHours, StoreOpenState } from "@/types";

const MINUTES_PER_DAY = 24 * 60;

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function toMinutes(time24: string): number {
  const [h, m] = time24.split(":").map(Number);
  return h * 60 + m;
}

/**
 * A day's trading window in minutes from that day's midnight.
 * Outlets closing at 01:00 push `close` past 1440 rather than wrapping, so a
 * single numeric comparison answers "are we inside the window".
 */
function windowFor(hours: OpeningHours, dayIndex: number) {
  const day = hours[dayIndex];
  if (!day) return null;
  const open = toMinutes(day.open);
  let close = toMinutes(day.close);
  if (close <= open) close += MINUTES_PER_DAY;
  return { open, close, raw: day };
}

/**
 * Whether a store is trading right now, accounting for past-midnight closing.
 * `now` is injectable so this stays deterministic under test.
 */
export function getStoreOpenState(hours: OpeningHours, now: Date = new Date()): StoreOpenState {
  const today = now.getDay();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // A window opened yesterday can still be running (e.g. 10:00 -> 01:00).
  const yesterday = windowFor(hours, (today + 6) % 7);
  if (yesterday && nowMinutes + MINUTES_PER_DAY < yesterday.close) {
    return {
      isOpen: true,
      label: "Open now",
      nextChange: `Closes ${formatTime(yesterday.raw.close)}`,
    };
  }

  const current = windowFor(hours, today);
  if (current && nowMinutes >= current.open && nowMinutes < current.close) {
    const minutesLeft = current.close - nowMinutes;
    return {
      isOpen: true,
      label: minutesLeft <= 45 ? "Closing soon" : "Open now",
      nextChange: `Closes ${formatTime(current.raw.close)}`,
    };
  }

  // Closed: report the next opening within the coming week.
  for (let offset = 0; offset < 8; offset++) {
    const dayIndex = (today + offset) % 7;
    const candidate = windowFor(hours, dayIndex);
    if (!candidate) continue;
    if (offset === 0 && nowMinutes >= candidate.open) continue;

    const when =
      offset === 0
        ? `Opens ${formatTime(candidate.raw.open)}`
        : offset === 1
          ? `Opens tomorrow ${formatTime(candidate.raw.open)}`
          : `Opens ${DAY_NAMES_SHORT[dayIndex]} ${formatTime(candidate.raw.open)}`;

    return { isOpen: false, label: "Closed", nextChange: when };
  }

  return { isOpen: false, label: "Closed", nextChange: undefined };
}

/** "10:00 AM - 1:00 AM" or "Closed" for one day. */
export function formatDayHours(hours: OpeningHours, dayIndex: number): string {
  const day = hours[dayIndex];
  if (!day) return "Closed";
  return `${formatTime(day.open)} - ${formatTime(day.close)}`;
}

/** Rows for the weekly hours table on a store page. */
export function getWeeklyHours(hours: OpeningHours, now: Date = new Date()) {
  return DAY_NAMES.map((name, index) => ({
    day: name,
    short: DAY_NAMES_SHORT[index],
    hours: formatDayHours(hours, index),
    isToday: index === now.getDay(),
  }));
}

/**
 * Collapses identical daily windows into "Mon - Sat" style ranges for compact
 * summaries. Falls back to a per-day list when the schedule is irregular.
 */
export function summarizeHours(hours: OpeningHours): string[] {
  const groups: { start: number; end: number; label: string }[] = [];

  for (let i = 0; i < 7; i++) {
    const label = formatDayHours(hours, i);
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.end = i;
    } else {
      groups.push({ start: i, end: i, label });
    }
  }

  return groups.map((group) =>
    group.start === group.end
      ? `${DAY_NAMES_SHORT[group.start]}: ${group.label}`
      : `${DAY_NAMES_SHORT[group.start]} - ${DAY_NAMES_SHORT[group.end]}: ${group.label}`,
  );
}

/** Builds a uniform week, the common case for a QSR chain. */
export function uniformHours(open: string, close: string): OpeningHours {
  return Array.from({ length: 7 }, () => ({ open, close }));
}

"use client";

import { useNow } from "@/hooks/use-now";
import { cn } from "@/lib/utils/cn";
import { getWeeklyHours } from "@/lib/utils/hours";
import type { OpeningHours } from "@/types";

/** "Today" depends on the viewer's clock, so it is read from the client clock. */
export function WeeklyHours({ hours }: { hours: OpeningHours }) {
  const now = useNow();
  const today = now ? new Date(now).getDay() : null;
  const rows = getWeeklyHours(hours);

  return (
    <table className="mt-4 w-full text-sm">
      <tbody>
        {rows.map((row, index) => {
          const isToday = today === index;
          return (
            <tr key={row.day} className={cn("border-t border-border", isToday && "bg-primary-50/60")}>
              <th scope="row" className={cn("py-2.5 pl-3 text-left font-semibold", isToday ? "text-primary-900" : "text-text-soft")}>
                {row.day}
                {isToday && <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Today</span>}
              </th>
              <td className={cn("py-2.5 pr-3 text-right tabular", row.hours === "Closed" ? "text-danger" : "text-text")}>{row.hours}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";

/** Props accepted by DatePicker */
interface DatePickerProps {
  value: string;                    // ISO date string "YYYY-MM-DD" or empty string
  onChange: (value: string) => void; // Called when the user picks or clears a date
}

/** Short day-of-week labels for the calendar header row */
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/** Full month names indexed 0–11, matching JavaScript's Date.getMonth() */
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Converts a Date object to a "YYYY-MM-DD" string using LOCAL time.
 *
 * We intentionally avoid `toISOString()` here because that converts to UTC,
 * which can shift the date by one day for users in negative UTC offsets.
 */
function toLocalDateString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * DatePicker — a custom calendar pop-up for selecting a due date.
 *
 * Features:
 *  - Dropdown calendar that opens below the trigger button
 *  - Month navigation (prev / next arrows)
 *  - Highlights today and the currently selected date
 *  - "Clear" button to remove the date, "Today" shortcut to jump to now
 *  - Closes when clicking outside (via a mousedown listener)
 */
export default function DatePicker({ value, onChange }: DatePickerProps) {
  const today = new Date();

  // Parse the value prop as a local date. Appending "T00:00:00" prevents
  // the browser from interpreting the date as UTC midnight (which would
  // display as the previous day in some timezones).
  const selected = value ? new Date(value + "T00:00:00") : null;

  // Whether the calendar popover is currently open
  const [open, setOpen] = useState(false);

  // The month/year currently displayed in the calendar (independent of the selected date)
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  // Ref on the wrapper div so we can detect outside clicks
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Close the calendar if the user clicks anywhere outside the component.
   * We use `mousedown` (not `click`) so it fires before focus changes.
   */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup the listener when the component unmounts to prevent memory leaks
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** Returns the total number of days in the given month/year. */
  function getDaysInMonth(year: number, month: number) {
    // Day 0 of month+1 = last day of the current month
    return new Date(year, month + 1, 0).getDate();
  }

  /** Returns the weekday index (0=Sun … 6=Sat) of the first day of the given month. */
  function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
  }

  /** Navigate the calendar view to the previous month, rolling back the year if needed. */
  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  /** Navigate the calendar view to the next month, rolling forward the year if needed. */
  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  /** Called when the user clicks a numbered day cell. */
  function selectDay(day: number) {
    const date = new Date(viewYear, viewMonth, day);
    onChange(toLocalDateString(date));
    setOpen(false);
  }

  /** Clears the selected date and closes the calendar. */
  function clearDate() {
    onChange("");
    setOpen(false);
  }

  /** Selects today's date, scrolls the view to today's month, and closes the calendar. */
  function goToToday() {
    const t = new Date();
    setViewYear(t.getFullYear());
    setViewMonth(t.getMonth());
    onChange(toLocalDateString(t));
    setOpen(false);
  }

  // Pre-compute layout values for the current calendar view
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth); // Number of blank cells before day 1

  // Human-readable display label for the trigger button
  const displayValue = selected
    ? selected.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <div ref={ref} className="relative w-full">

      {/* Trigger button — shows the selected date or a placeholder */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3.5 text-left transition-all hover:bg-white/10 focus:border-violet-500/50 focus:outline-none"
      >
        <span className={displayValue ? "text-white" : "text-white/20"}>
          {displayValue || "Pick a date"}
        </span>
        {/* Calendar icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/30"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      </button>

      {/* Calendar popover — only rendered when open */}
      {open && (
        <div className="absolute bottom-full left-0 z-50 mb-2 w-72 rounded-2xl border border-white/10 bg-zinc-900 p-4 shadow-2xl shadow-black/60">

          {/* Month/year header with prev/next navigation */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-bold text-white">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition"
              >
                {/* Left chevron SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition"
              >
                {/* Right chevron SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          {/* Day-of-week header row (Su Mo Tu … Sa) */}
          <div className="mb-2 grid grid-cols-7 text-center">
            {DAYS.map((d) => (
              <span key={d} className="py-1 text-[10px] font-bold uppercase tracking-wider text-white/30">
                {d}
              </span>
            ))}
          </div>

          {/* Day number grid */}
          <div className="grid grid-cols-7 text-center">
            {/* Blank cells to offset the first day to the correct weekday column */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <span key={`empty-${i}`} />
            ))}

            {/* One button per day in the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;

              // Check if this cell represents today
              const isToday =
                day === today.getDate() &&
                viewMonth === today.getMonth() &&
                viewYear === today.getFullYear();

              // Check if this cell is the currently selected date
              const isSelected =
                selected &&
                day === selected.getDate() &&
                viewMonth === selected.getMonth() &&
                viewYear === selected.getFullYear();

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={`
                    mx-auto my-0.5 flex h-8 w-8 items-center justify-center rounded-xl text-sm font-medium transition
                    ${isSelected
                      ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-700/30"
                      : isToday
                      ? "border border-violet-500/50 text-violet-300 hover:bg-white/10"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer actions: Clear and Today shortcuts */}
          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
            <button
              type="button"
              onClick={clearDate}
              className="text-xs font-semibold text-white/30 hover:text-white transition"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={goToToday}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

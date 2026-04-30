"use client";

import { useState, useRef, useEffect } from "react";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toLocalDateString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const today = new Date();

  const selected = value ? new Date(value + "T00:00:00") : null;

  const [open, setOpen] = useState(false);

  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function getDaysInMonth(year: number, month: number) {

    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function selectDay(day: number) {
    const date = new Date(viewYear, viewMonth, day);
    onChange(toLocalDateString(date));
    setOpen(false);
  }

  function clearDate() {
    onChange("");
    setOpen(false);
  }

  function goToToday() {
    const t = new Date();
    setViewYear(t.getFullYear());
    setViewMonth(t.getMonth());
    onChange(toLocalDateString(t));
    setOpen(false);
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const displayValue = selected
    ? selected.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <div ref={ref} className="relative w-full">

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3.5 text-left transition-all hover:bg-white/10 focus:border-violet-500/50 focus:outline-none"
      >
        <span className={displayValue ? "text-white" : "text-white/20"}>
          {displayValue || "Pick a date"}
        </span>

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

      {open && (
        <div className="absolute bottom-full left-0 z-50 mb-2 w-72 rounded-2xl border border-white/10 bg-zinc-900 p-4 shadow-2xl shadow-black/60">

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

                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition"
              >

                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-7 text-center">
            {DAYS.map((d) => (
              <span key={d} className="py-1 text-[10px] font-bold uppercase tracking-wider text-white/30">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 text-center">

            {Array.from({ length: firstDay }).map((_, i) => (
              <span key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;

              const isToday =
                day === today.getDate() &&
                viewMonth === today.getMonth() &&
                viewYear === today.getFullYear();

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

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { C } from "../data";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const formatLabel = (iso) => {
  if (!iso) return "Select a date";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const toISO = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export default function DatePicker({ value, onChange, minDate }) {
  const [open, setOpen] = useState(false);
  const initial = value ? new Date(value) : new Date();
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [viewYear, setViewYear] = useState(initial.getFullYear());

  const today = useMemo(() => new Date(), []);
  today.setHours(0, 0, 0, 0);
  const min = minDate ? new Date(minDate) : today;
  min.setHours(0, 0, 0, 0);

  const days = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d));
    return cells;
  }, [viewMonth, viewYear]);

  const selectedDate = value ? new Date(value) : null;
  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const pick = (d) => {
    onChange(toISO(d));
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", boxSizing: "border-box",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 14px", borderRadius: 12,
          background: "#FAFAFA",
          border: `1.5px solid ${value ? "#027A48" : C.div}`,
          cursor: "pointer", fontFamily: "inherit",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: value ? 600 : 500, color: value ? C.head : C.sub }}>
          {formatLabel(value)}
        </span>
        <CalendarIcon size={16} color={value ? C.p600 : C.sub} />
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50,
            background: C.white, borderRadius: 16, border: `1px solid ${C.div}`,
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            padding: 14,
          }}>
            {/* Month nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <button onClick={prevMonth} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <ChevronLeft size={16} color={C.head} />
              </button>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.head }}>{monthLabel}</span>
              <button onClick={nextMonth} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <ChevronRight size={16} color={C.head} />
              </button>
            </div>

            {/* Weekday header */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
              {WEEKDAYS.map((w, i) => (
                <div key={i} style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: C.sub, padding: "4px 0" }}>{w}</div>
              ))}
            </div>

            {/* Day grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
              {days.map((d, i) => {
                if (!d) return <div key={i} />;
                const disabled = d < min;
                const selected = selectedDate && sameDay(d, selectedDate);
                const isToday = sameDay(d, today);
                return (
                  <button
                    key={i}
                    onClick={() => !disabled && pick(d)}
                    disabled={disabled}
                    style={{
                      aspectRatio: "1 / 1",
                      border: "none",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: selected ? 700 : 500,
                      fontFamily: "inherit",
                      cursor: disabled ? "not-allowed" : "pointer",
                      color: selected ? "#fff" : disabled ? C.inact : (isToday ? C.p600 : C.head),
                      background: selected ? C.p600 : (isToday ? C.p100 : "transparent"),
                      boxShadow: selected ? "0 4px 10px rgba(227,27,83,0.35)" : "none",
                      opacity: disabled ? 0.4 : 1,
                      transition: "background 0.15s",
                    }}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

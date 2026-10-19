import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, AlertTriangle, Users, CalendarDays } from "lucide-react";
import { C } from "../../data";
import { monthRating } from "../../data/buildData";
import { monthWeather } from "../../data/weatherData";
import { SKY_STYLE, SKY_LABEL, SKY_CHIP } from "../skyStyle";
import { SEASON_LABEL, SEASON_COLOR, SEASON_TINT, SEASON_MEANING } from "../seasonStyle";

// ─── Picking the dates ───
//
// The months run down the page and you scroll through them, the way every
// booking app a couple already uses works. Nothing is chosen until they choose
// it, both ends of the trip can be dragged, and the footer always says what is
// currently picked while the calendar scrolls behind it.
//
// Two things this screen learned the hard way:
//
//   The footer boxes look like controls, so they are controls. They carry a
//   border, a label and a highlight; a couple who wants to change the start
//   taps the start box. It used to do nothing.
//
//   The footer floats over the calendar, so the calendar scrolls past it. The
//   bottom two rows used to be unreachable, which also meant the drag grips
//   down there could not be grabbed.
//
//   Only yesterday and earlier are closed. Lead times for visas and flights
//   are a conversation for the consultant, not a wall on the calendar.

const DAY_MS = 86400000;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_SHOWN = 10;
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

const midnight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const key = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const addDays = (d, n) => new Date(midnight(d).getTime() + n * DAY_MS);
const nightsBetween = (a, b) => Math.round((midnight(b) - midnight(a)) / DAY_MS);
const fmt = (d) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
const dowYear = (d) => `${d.toLocaleDateString("en-IN", { weekday: "short" })}, ${d.getFullYear()}`;

function SeasonChip({ r, small }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, padding: small ? "3px 8px" : "4px 9px",
      borderRadius: 999, background: SEASON_TINT[r], color: SEASON_COLOR[r],
      fontSize: small ? 10 : 10.5, fontWeight: 700, whiteSpace: "nowrap",
    }}>
      <Users size={small ? 10 : 11} />
      {SEASON_LABEL[r]}
      <span style={{ opacity: 0.45 }}>·</span>
      <span style={{ fontWeight: 500 }}>{SEASON_MEANING[r]}</span>
    </span>
  );
}

function WeatherChip({ w, small }) {
  if (!w) return null;
  const Sky = SKY_STYLE[w.sky] || SKY_STYLE.cloudy;
  const chip = SKY_CHIP[w.sky] || SKY_CHIP.cloudy;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, padding: small ? "3px 8px" : "4px 9px",
      borderRadius: 999, background: chip.bg, color: chip.fg,
      fontSize: small ? 10 : 10.5, fontWeight: 700, whiteSpace: "nowrap",
    }}>
      <Sky.Icon size={small ? 10 : 11} color={Sky.color} />
      {SKY_LABEL[w.sky] || "Mixed"}
      <span style={{ opacity: 0.45 }}>·</span>
      <span style={{ fontWeight: 500 }}>{w.low}° / {w.high}°</span>
    </span>
  );
}

// ─── One month ───
function Month({ m, y, idx, dest, today, start, end, ghostEnd, onPick, onGrab, pulse }) {
  const ndays = new Date(y, m + 1, 0).getDate();
  const firstDow = new Date(y, m, 1).getDay();
  const r = monthRating(dest, m);

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= ndays; d++) cells.push(d);

  return (
    <div data-month={idx} style={{ marginBottom: 18 }}>
      {/* Two chips, not one. How busy a month is and what the sky is doing are
          different questions, and one chip made them read as a single fact. */}
      <div style={{ padding: "0 2px 16px" }}>
        <p style={{ margin: "0 0 7px", fontSize: 15, fontWeight: 800, color: C.head, letterSpacing: "-0.2px" }}>
          {MONTH_NAMES[m]} {y}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <SeasonChip r={r} />
          <WeatherChip w={monthWeather(dest, m)} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} style={{ height: 42 }} />;
          const d = new Date(y, m, day);
          const past = d < today;
          const isStart = start && key(d) === key(start);
          const isEnd = end && key(d) === key(end);
          const inside = start && end && d > midnight(start) && d < midnight(end);
          const cap = isStart || isEnd;

          const band = inside || (isStart && end) || (isEnd && start);
          const bandRadius = isStart ? "10px 0 0 10px" : isEnd ? "0 10px 10px 0" : 0;

          // ─── The recommended stretch ───
          //
          // With a start down and no end yet, the nights we recommend are laid
          // out in a pale wash with a ringed day at the end of it. It answers
          // "how long should we go for" by pointing at the answer, and the
          // answer is a tap away rather than a number to work out.
          const ghostInside = ghostEnd && !end && d > midnight(start) && d < midnight(ghostEnd);
          const isGhostEnd = ghostEnd && !end && key(d) === key(ghostEnd);
          const gBand = ghostInside || isGhostEnd || (isStart && ghostEnd && !end);
          const gRadius = isStart ? "10px 0 0 10px" : isGhostEnd ? "0 10px 10px 0" : 0;

          return (
            <div key={day} data-date={`${y}-${m}-${day}`} style={{
              height: 42, position: "relative",
              background: band ? C.p100 : gBand ? "#FFF1F4" : "transparent",
              borderRadius: band && (isStart || isEnd) ? bandRadius
                : gBand && (isStart || isGhostEnd) ? gRadius : 0,
            }}>
              <button
                disabled={past}
                onClick={() => onPick(d)}
                style={{
                  position: "absolute", inset: cap ? "1px 2px" : 0,
                  cursor: past ? "default" : "pointer", fontFamily: "inherit",
                  borderRadius: 10,
                  background: cap ? C.p600 : "transparent",
                  border: isGhostEnd ? `1.5px dashed ${C.p600}` : "none",
                  color: cap ? "#fff" : past ? C.icon : isGhostEnd ? C.p600 : inside || ghostInside ? C.p900 : C.head,
                  fontSize: 13, fontWeight: cap || isGhostEnd ? 800 : inside || ghostInside ? 700 : 600,
                  opacity: past ? 0.4 : 1,
                  animation: (pulse === "start" && isStart) || (pulse === "end" && isEnd)
                    ? "datePulse 0.7s ease-out 2"
                    : isGhostEnd ? "ghostPulse 1.8s ease-in-out infinite" : undefined,
                }}
              >{day}</button>

              {cap && start && end && (
                <span
                  onPointerDown={(e) => onGrab(e, isStart ? "start" : "end")}
                  style={{
                    position: "absolute", top: 0, bottom: 0, width: 22,
                    [isStart ? "left" : "right"]: -6,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "grab", touchAction: "none",
                  }}
                >
                  <span style={{
                    width: 3, height: 15, borderRadius: 2,
                    background: "rgba(255,255,255,0.9)", boxShadow: "0 0 0 1px rgba(0,0,0,0.12)",
                  }} />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DateRange({ dest, minNights = 7, stickyTop = 0, startDate, setStartDate, nights, setNights }) {
  const today = useMemo(() => midnight(new Date()), []);
  const wrapRef = useRef(null);
  const footRef = useRef(null);
  const headRef = useRef(null);
  const [drag, setDrag] = useState(null);
  const [footH, setFootH] = useState(120);

  // A trip that already exists has to be on the page before it can be scrolled
  // to, and a saved plan can sit further out than the ten months the wizard
  // offers. So the list runs as far as the trip plus two months, which also
  // keeps the trip from being the last thing on the page with nothing under it.
  const bornWith = useRef(null);
  if (bornWith.current === null) bornWith.current = startDate || false;

  const months = useMemo(() => {
    const base = today.getFullYear() * 12 + today.getMonth();
    let count = MONTHS_SHOWN;
    if (bornWith.current) {
      const s = new Date(bornWith.current);
      const reach = s.getFullYear() * 12 + s.getMonth() - base + 3;
      if (reach > count) count = reach;
    }
    const out = [];
    for (let i = 0; i < count; i++) {
      const m = (today.getMonth() + i) % 12;
      const y = today.getFullYear() + Math.floor((today.getMonth() + i) / 12);
      out.push({ m, y });
    }
    return out;
  }, [today]);

  // Reserve the footer's real height at the end of the scroll, so no part of
  // the calendar can end up permanently underneath it.
  useLayoutEffect(() => {
    if (!footRef.current) return;
    const h = Math.round(footRef.current.getBoundingClientRect().height) + 12;
    // Only when it actually changes. An unguarded setState in a layout effect
    // with no deps re-renders on every render, which is what made the month
    // bar lag behind the scroll.
    setFootH((prev) => (prev === h ? prev : h));
  });

  const start = startDate ? new Date(startDate) : null;
  const end = start && nights ? addDays(start, nights) : null;
  const hasRange = !!start && !!end;

  // ─── One tap, one end ───
  //
  // Tapping a day used to lay a seven-night trip out behind it, which answered
  // the second question before it was asked and left a couple undoing a choice
  // they never made. A tap now sets the start and nothing else, and the marker
  // moves to the end so the screen says what it wants next.
  const [focus, setFocus] = useState("start");
  // Which end to flash in the calendar when its box is tapped.
  const [pulse, setPulse] = useState(null);
  const n = hasRange ? nights : 0;
  // Where the recommended trip would end, shown until a real end is picked.
  const ghostEnd = start && !end ? addDays(start, minNights) : null;

  const commit = (st, e) => {
    setStartDate(midnight(st).toISOString());
    setNights(Math.max(1, nightsBetween(st, e)));
  };

  // ─── A start answers the second question too ───
  //
  // Tapping a day used to leave a single marker and a dotted ring where the
  // trip might end, and wait. The length is a question we can already answer,
  // so it is answered: the whole stay is laid out at the length we recommend,
  // and moving the end is an edit rather than a step. A trip that already has a
  // length keeps it, because moving a holiday is not the same as resizing one.
  const beginAt = (d) => {
    commit(d, addDays(d, hasRange && nights ? nights : minNights));
    setFocus("end");
  };

  const onPick = (d) => {
    // The marker is on the end and this day can be one, so this tap moves it.
    if (start && focus === "end" && d > midnight(start)) {
      commit(start, d);
      setFocus("start");
      return;
    }
    // Otherwise the tap is a start, and brings its own end with it.
    beginAt(d);
  };

  // Tapping a date box takes the marker and flashes the day it refers to, so
  // the link between the box and the calendar is shown rather than assumed.
  const focusLeg = (which) => {
    setFocus(which);
    const d = which === "start" ? start : end;
    if (!d) return;
    setPulse(which);
    setTimeout(() => setPulse(null), 1400);
    const el = document.querySelector(`[data-date="${d.getFullYear()}-${d.getMonth()}-${d.getDate()}"]`);
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  // ─── Dragging an end ───
  const dateUnder = (x, y) => {
    const el = document.elementFromPoint(x, y)?.closest("[data-date]");
    if (!el) return null;
    const [yy, mm, dd] = el.dataset.date.split("-").map(Number);
    return new Date(yy, mm, dd);
  };

  const onGrab = (e, which) => {
    e.preventDefault();
    e.stopPropagation();
    // Capture on the calendar, not on the grip: the grip belongs to whichever
    // day is currently an end, so the first move unmounts it and would take
    // the capture with it.
    wrapRef.current?.setPointerCapture?.(e.pointerId);
    setDrag(which);
    setFocus("end");
  };

  const onMove = (e) => {
    if (!drag) return;
    e.preventDefault();
    const d = dateUnder(e.clientX, e.clientY);
    if (!d || d < today) return;
    if (drag === "start") {
      if (d < midnight(end)) commit(d, end);
    } else if (d > midnight(start)) {
      commit(start, d);
    }
  };

  const stopDrag = () => setDrag(null);
  const short = hasRange && n < minNights;

  // ─── Which month you land on ───
  //
  // The one after this one. Most of this month has already gone, and nobody
  // booking a holiday on the sixteenth is leaving on the eighteenth, so
  // opening on a grid that is half greyed out wastes the first screen.
  //
  // It opens with the last week of this month still showing above next
  // month's heading. That week is the whole trick: cut off cleanly at a
  // heading, a calendar looks like the top of the list, and a row of dates
  // above it says there is more up there without a chip or an arrow having to
  // say so.
  //
  // Not when dates are already picked: coming back to this step should show
  // the trip, not a month somebody has already scrolled past once.
  const scroller = useRef(null);

  // Measured off this month's last week rather than next month's heading. A
  // guessed margin above the heading puts that week behind the weekday row,
  // which is the same as not showing it: the row has to clear the pinned
  // headings to be the thing that says there is more above.
  const landingTop = () => {
    const sc = scroller.current;
    const wrap = wrapRef.current;
    const next = wrap?.querySelector('[data-month="1"]');
    if (!sc || !next) return null;
    const days = wrap.querySelectorAll('[data-month="0"] [data-date]');
    const anchor = days.length ? days[days.length - 1] : next;
    const pinned = stickyTop + (headRef.current?.getBoundingClientRect().height || 0);
    return sc.scrollTop + anchor.getBoundingClientRect().top - sc.getBoundingClientRect().top - pinned;
  };

  // ─── Landing on a trip that already exists ───
  //
  // Opening on this month and leaving a couple to scroll for their own dates
  // is the calendar asking them where their holiday is. So when a trip is
  // already booked into the screen, it opens on it: the month it starts in,
  // with the week before still showing above the heading, and if the trip
  // starts late enough in the month to fall off the bottom from there, far
  // enough down that the day it starts on is on screen. Up and down from there
  // is theirs.
  const tripTop = () => {
    const sc = scroller.current;
    const wrap = wrapRef.current;
    if (!sc || !wrap || !start) return null;
    const cell = wrap.querySelector(`[data-date="${start.getFullYear()}-${start.getMonth()}-${start.getDate()}"]`);
    const mEl = cell?.closest("[data-month]");
    if (!cell || !mEl) return null;

    const pinned = stickyTop + (headRef.current?.getBoundingClientRect().height || 0);
    const scTop = sc.getBoundingClientRect().top;
    const rel = (el) => sc.scrollTop + el.getBoundingClientRect().top - scTop - pinned;

    const idx = Number(mEl.dataset.month);
    let top = 0;
    if (idx > 0) {
      const days = wrap.querySelectorAll(`[data-month="${idx - 1}"] [data-date]`);
      top = rel(days.length ? days[days.length - 1] : mEl);
    }
    const room = sc.clientHeight - pinned - footH;
    const dayTop = rel(cell);
    if (dayTop - top > room - 60) top = dayTop - Math.max(0, room * 0.35);
    return Math.max(0, top);
  };

  const [ready, setReady] = useState(false);
  useLayoutEffect(() => {
    let sc = wrapRef.current?.parentElement;
    while (sc && sc !== document.body) {
      const oy = getComputedStyle(sc).overflowY;
      if (oy === "auto" || oy === "scroll") break;
      sc = sc.parentElement;
    }
    if (!sc || sc === document.body) return;
    scroller.current = sc;
    setReady(true);
  }, []);

  // Placed again when the pinned heading above reports its real height, which
  // is a render after this one: landing against the guess left the week above
  // tucked under the weekday row by the difference. Only for the first
  // moments of the step, so changing a date never drags anybody back up the
  // calendar.
  const bornAt = useRef(0);
  if (!bornAt.current) bornAt.current = performance.now();
  useLayoutEffect(() => {
    const sc = scroller.current;
    if (!ready || !sc) return;
    if (performance.now() - bornAt.current > 800) return;
    if (bornWith.current) {
      // Only while it is still the trip we opened on. Once a new day is
      // tapped, where the calendar sits is theirs and not ours.
      if (startDate !== bornWith.current) return;
      const t = tripTop();
      if (t != null) sc.scrollTop = t;
      return;
    }
    if (startDate) return;
    const t = landingTop();
    if (t != null) sc.scrollTop = Math.max(0, t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, stickyTop, startDate, footH]);

  return (
    <div>
      {/* The weekday row stays put, so you always know which column is Sunday. */}
      <div ref={headRef} style={{
        position: "sticky", top: stickyTop, zIndex: 5, background: C.white,
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
        padding: "6px 0 8px", borderBottom: `1px solid ${C.div}`, marginBottom: 14,
      }}>
        {WEEKDAYS.map((d, i) => (
          <span key={i} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: C.inact }}>{d}</span>
        ))}
      </div>

      <div
        ref={wrapRef}
        onPointerMove={onMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        style={{ touchAction: drag ? "none" : "auto" }}
      >
        {months.map(({ m, y }, i) => (
          <Month
            key={`${m}-${y}`} m={m} y={y} idx={i} dest={dest} today={today}
            start={start} end={end} ghostEnd={ghostEnd} onPick={onPick} onGrab={onGrab} pulse={pulse}
          />
        ))}
        {/* Room for the footer to sit over, so the last rows are never trapped
            underneath it and their grips stay grabbable. */}
        <div style={{ height: footH }} />
      </div>

      <div style={{ position: "sticky", bottom: 0, margin: "4px -16px 0", padding: "0 12px 2px", background: C.white }}>
        <div ref={footRef} style={{
          borderRadius: 14, overflow: "hidden", background: C.white,
          border: `1px solid ${C.div}`, boxShadow: "0 -4px 16px rgba(0,0,0,0.07)",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 9, padding: "9px 12px",
            background: !hasRange ? C.bg : short ? "#FFF7E8" : "#ECFDF3",
            borderBottom: `1px solid ${!hasRange ? C.div : short ? "#F2DDB4" : "#C0E5D5"}`,
          }}>
            {!hasRange ? <CalendarDays size={15} color={C.sub} style={{ flexShrink: 0 }} />
              : short ? <AlertTriangle size={15} color="#B54708" style={{ flexShrink: 0 }} />
                      : <CheckCircle2 size={15} color="#027A48" style={{ flexShrink: 0 }} />}
            <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: 700, lineHeight: "17px", color: !hasRange ? C.sub : short ? "#B54708" : "#027A48" }}>
              {!start ? "Tap the day you want to start"
                : !end ? `We recommend at least ${minNights} nights in ${dest}`
                : short ? `We recommend at least ${minNights} nights`
                        : `That is a perfect length for your ${dest} trip`}
            </span>
            {hasRange && short && (
              <button
                onClick={() => commit(start, addDays(start, minNights))}
                style={{
                  flexShrink: 0, border: "none", borderRadius: 999, cursor: "pointer", fontFamily: "inherit",
                  background: C.p600, color: "#fff", fontSize: 11.5, fontWeight: 700, padding: "7px 13px",
                }}
              >Make it {minNights}</button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", padding: 10 }}>
            <Leg label="Start date" date={start} active={focus === "start"} onClick={() => focusLeg("start")} />
            <span style={{
              flexShrink: 0, margin: "0 -10px", zIndex: 1,
              padding: "5px 10px", borderRadius: 999, border: `1px solid ${C.div}`,
              background: C.white, color: C.sub,
              fontSize: 9.5, fontWeight: 800, letterSpacing: "0.5px", whiteSpace: "nowrap",
            }}>{hasRange ? `${n} ${n === 1 ? "NIGHT" : "NIGHTS"}` : "NIGHTS"}</span>
            <Leg label="End date" date={end} active={focus === "end"} right
                 disabled={!start} onClick={() => focusLeg("end")} />
          </div>
        </div>
      </div>

    </div>
  );
}

// The box is a control, not a readout. It has a border, a label and a
// highlight, so it has to do something when it is tapped: it takes the marker,
// and the next day you tap sets that end.
function Leg({ label, date, active, right, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1, minWidth: 0, padding: right ? "8px 12px 8px 18px" : "8px 18px 8px 12px",
        border: `1px solid ${active ? C.p600 : C.div}`,
        background: active ? C.p100 : C.white,
        borderRadius: 10, cursor: disabled ? "default" : "pointer", fontFamily: "inherit",
        textAlign: right ? "right" : "left", opacity: disabled ? 0.55 : 1,
      }}
    >
      <p style={{ margin: 0, fontSize: 9, fontWeight: 800, letterSpacing: "0.6px", textTransform: "uppercase", color: active ? C.p600 : C.inact }}>
        {label}
      </p>
      <p style={{ margin: "2px 0 0", fontSize: 13.5, fontWeight: 800, letterSpacing: "-0.2px", whiteSpace: "nowrap", color: date ? C.head : active ? C.p600 : C.inact }}>
        {date
          ? <>{fmt(date)} <span style={{ fontSize: 10.5, fontWeight: 500, color: C.sub }}>{dowYear(date)}</span></>
          : active ? "Tap a day" : "Select"}
      </p>
    </button>
  );
}

import { useEffect, useState } from "react";
import { X as XIcon, Minus, Plus, Plane, Calendar, ChevronDown } from "lucide-react";
import { C } from "../data";

import { availabilityOnCopy } from "../data/copyTrip";
import DateRange from "./wizard/DateRange";
import { BuildingView } from "../pages/Generating";

// ─── Recreating somebody else's trip ───
//
// Two questions, on one sheet, and then it is made. When you want to go, and
// who is going. Everything else is already decided, which is the whole reason
// for taking somebody else's trip: the cities, the order, the nights in each,
// the day plans and the hotels all come across as they are.
//
// Deliberately not the wizard. The wizard asks five questions over five screens
// because it is building a trip from nothing. This is taking one that exists,
// so it is a date and a count.
//
// The start is picked on the wizard's own calendar, which opens first because
// it is the only thing anybody came here to answer. The length is not a
// question: it is the trip being copied, so the end date fills itself in and
// cannot be dragged.

const dayKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const fmtShort = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const fmtLong = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

// ─── Who we can plan for ───
//
// The wizard's rule, kept: couples, so an even number of adults and no children
// yet. One line rather than the wizard's apology, because this is a count being
// corrected mid-sheet, not a plan being turned away.
function partyNote(adults, kids) {
  if (kids > 0) return "We plan for couples only, so no children yet. Our sales team can help with a family trip.";
  if (adults === 1) return "We plan for couples only, so no solo trips yet. Our sales team can help.";
  if (adults % 2 !== 0) return "We plan for couples, so adults need to be an even number. Our sales team can help with other group sizes.";
  return null;
}

function Stepper({ label, sub, value, set, min, max }) {
  const btn = (on) => ({
    width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
    border: `1px solid ${on ? C.div : "transparent"}`,
    background: on ? C.white : C.bg,
    display: "grid", placeItems: "center",
    cursor: on ? "pointer" : "default",
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 2px" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.head }}>{label}</p>
        {sub && <p style={{ margin: "1px 0 0", fontSize: 11.5, color: C.sub }}>{sub}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <button aria-label={`One fewer ${label}`} disabled={value <= min} onClick={() => set(value - 1)} style={btn(value > min)}>
          <Minus size={14} color={value > min ? C.head : C.inact} strokeWidth={2.6} />
        </button>
        <span style={{ minWidth: 16, textAlign: "center", fontSize: 15, fontWeight: 800, color: C.head }}>{value}</span>
        <button aria-label={`One more ${label}`} disabled={value >= max} onClick={() => set(value + 1)} style={btn(value < max)}>
          <Plus size={14} color={value < max ? C.head : C.inact} strokeWidth={2.6} />
        </button>
      </div>
    </div>
  );
}

export default function CopyTripScreen({ it, owner, frame, onDone, onClose }) {
  // Opens on the calendar. The date is the only thing anybody has to answer,
  // so the sheet behind it would be one tap in the way.
  const [step, setStep] = useState("dates");   // dates | ask | building
  const [date, setDate] = useState("");
  // The trip's own length, start to finish. Copying somebody's holiday is
  // copying how long it was.
  const nights = it.nights || 7;
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);

  const startIso = date ? new Date(`${date}T00:00:00`).toISOString() : null;
  const endIso = startIso ? new Date(new Date(startIso).getTime() + nights * 86400000).toISOString() : null;
  const note = partyNote(adults, kids);
  const ready = !!date && !note;

  // Hotels are the only thing that can be unavailable: day plans always are and
  // the price is worked out rather than looked up. Whatever comes back, the
  // itinerary is made. A sold-out stay is something we replace and say so, not
  // a door that closes here.
  const finish = () => onDone({
    startIso, adults, kids, nights,
    swaps: availabilityOnCopy(it, startIso, nights).swaps,
  });

  const backdrop = { position: "absolute", inset: 0, background: "rgba(24,29,39,0.45)" };
  const sheet = {
    position: "absolute", left: 0, right: 0, bottom: 0,
    background: C.white, borderRadius: "20px 20px 0 0",
    padding: "10px 18px calc(18px + env(safe-area-inset-bottom))",
    boxShadow: "0 -8px 30px rgba(16,24,40,0.22)",
  };
  const grab = <div style={{ width: 40, height: 4, borderRadius: 99, background: C.div, margin: "0 auto 14px" }} />;

  // ─── The wait ───
  // The same screen the wizard shows while a trip is built, because this is
  // the same build: a route, stays, days and a price, worked out from scratch
  // for dates nobody has priced before.
  if (step === "building") {
    return (
      <div className="hide-scrollbar" data-testid="copy-building" style={{ ...frame, zIndex: 330, background: C.bg, overflowY: "auto" }}>
        <BuildingView dest={it.dest} cities={(it.days || []).map((d) => d.city)} />
        <Done onDone={finish} />
      </div>
    );
  }

  // ─── The dates ───
  // The wizard's calendar, over the sheet rather than in place of the flow, so
  // closing it comes back to the two questions with the dates filled in.
  if (step === "dates") {
    return (
      <DateStep
        dest={it.dest}
        owner={owner}
        value={startIso}
        nights={nights}
        frame={frame}
        // Closing without a date closes the whole thing: there is nothing
        // behind it to come back to until one is picked.
        onClose={() => (date ? setStep("ask") : onClose())}
        onPick={(picked) => {
          setDate(dayKey(picked));
          setStep("ask");
        }}
      />
    );
  }

  return (
    <div style={{ ...frame, zIndex: 330 }}>
      <div onClick={onClose} style={backdrop} />
      <div style={sheet}>
        {grab}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: C.head, letterSpacing: "-0.3px" }}>
              Recreate {owner ? `${owner}'s` : "this"} trip
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", flexShrink: 0, marginTop: 2 }}>
            <XIcon size={20} color={C.sub} />
          </button>
        </div>

        <p style={{ margin: "0 0 7px", fontSize: 12.5, fontWeight: 700, color: C.sub }}>When do you want to start?</p>
        {/* A field, not a native date box: it opens the calendar the wizard
            opens, where both ends of the trip can be moved. */}
        <button
          data-testid="copy-date"
          onClick={() => setStep("dates")}
          style={{
            width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 9,
            padding: "13px 13px", borderRadius: 13, cursor: "pointer", fontFamily: "inherit",
            border: `1px solid ${date ? C.p600 : C.div}`, background: C.white, textAlign: "left",
          }}
        >
          <Calendar size={16} color={date ? C.p600 : C.sub} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: date ? 700 : 500, color: date ? C.head : C.inact, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {date ? `${fmtShort(startIso)} to ${fmtShort(endIso)}` : "Select start date"}
          </span>
          <ChevronDown size={16} color={C.sub} style={{ flexShrink: 0 }} />
        </button>
        {date && (
          <p style={{ margin: "7px 2px 0", fontSize: 11.5, color: C.sub }}>
            {nights} night{nights === 1 ? "" : "s"}, leaving {fmtLong(startIso)}.
          </p>
        )}

        <div style={{ margin: "16px 0 0", border: `1px solid ${note ? "#FEA3B4" : C.div}`, borderRadius: 14, padding: "2px 13px" }}>
          <Stepper label="Adults" sub="12 and over" value={adults} set={setAdults} min={1} max={12} />
          <div style={{ height: 1, background: C.div }} />
          <Stepper label="Children" sub="Under 12" value={kids} set={setKids} min={0} max={4} />
        </div>

        {note && (
          // The brand's maroon reads as a heading at this size, not as
          // something gone wrong. A true error red says it at a glance, and
          // clears 6.5:1 on the sheet.
          <p data-testid="copy-party-note" style={{
            margin: "9px 2px 0", fontSize: 12.5, fontWeight: 600, color: "#B42318", lineHeight: "17px",
          }}>{note}</p>
        )}

        {/* ─── The one thing the itinerary will not carry ───
            Said here, before it is made, rather than left for somebody to
            notice that a section is missing from what they just created. */}
        <div style={{ display: "flex", gap: 9, margin: "14px 0 0", padding: "11px 13px", borderRadius: 12, background: C.bg }}>
          <Plane size={14} color={C.sub} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ margin: 0, fontSize: 12, lineHeight: "17px", color: C.sub }}>
            Flights are not part of this itinerary. Fares and availability move by the hour, so our team quotes them with you.
          </p>
        </div>

        <button
          data-testid="copy-confirm"
          disabled={!ready}
          onClick={() => setStep("building")}
          style={{
            width: "100%", marginTop: 16, padding: "15px 0", borderRadius: 14, border: "none",
            background: ready ? C.p600 : C.div, color: ready ? "#fff" : C.inact,
            fontSize: 15, fontWeight: 700, cursor: ready ? "pointer" : "not-allowed", fontFamily: "inherit",
          }}
        >
          Create my itinerary
        </button>
      </div>
    </div>
  );
}

// How long the wait screen holds before the itinerary opens. The real build
// takes about a minute; this is a preview of it, long enough to read.
const BUILD_WAIT = 6000;

function Done({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, BUILD_WAIT);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

// ─── The calendar ───
// The wizard's calendar, with one end of the trip to set instead of two. The
// end date fills itself in from the length being copied and is a readout, so
// the only thing on screen to answer is the day it starts.
function DateStep({ dest, owner, value, nights, frame, onPick, onClose }) {
  const [draft, setDraft] = useState(value || null);
  const ready = !!draft;

  return (
    <div style={{ ...frame, zIndex: 340, background: C.white, display: "flex", flexDirection: "column" }}>
      <div style={{
        flexShrink: 0, display: "flex", alignItems: "center", gap: 10,
        padding: "calc(12px + env(safe-area-inset-top)) 14px 10px",
        borderBottom: `1px solid ${C.div}`, background: C.white,
      }}>
        <button onClick={onClose} aria-label="Close" style={{
          width: 34, height: 34, borderRadius: "50%", border: `1px solid ${C.div}`, background: C.white,
          display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0,
        }}><XIcon size={17} color={C.head} /></button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: C.head, letterSpacing: "-0.5px" }}>
            Select start date
          </h1>
          <p style={{ margin: "2px 0 0", fontSize: 12.5, color: C.sub }}>
            {owner ? `${owner}'s trip is ` : "This trip is "}{nights} night{nights === 1 ? "" : "s"}, so we set the end date for you.
          </p>
        </div>
      </div>

      <div className="hide-scrollbar" style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <DateRange
          dest={dest}
          startOnly
          minNights={nights}
          startDate={draft}
          setStartDate={setDraft}
          nights={nights}
          setNights={() => {}}
        />
      </div>

      <div style={{
        flexShrink: 0, borderTop: `1px solid ${C.div}`, background: C.white,
        padding: "10px 16px calc(12px + env(safe-area-inset-bottom))",
      }}>
        <button data-testid="copy-date-save" onClick={() => onPick(new Date(draft))} disabled={!ready} style={{
          width: "100%", padding: "13px 0", borderRadius: 12, border: "none",
          background: ready ? C.p600 : C.div, color: ready ? "#fff" : C.inact,
          fontSize: 15, fontWeight: 700, cursor: ready ? "pointer" : "not-allowed", fontFamily: "inherit",
        }}>{ready ? "Continue" : "Pick a start date"}</button>
      </div>
    </div>
  );
}

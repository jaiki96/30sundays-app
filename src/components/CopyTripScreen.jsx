import { useEffect, useState } from "react";
import { X as XIcon, Minus, Plus, Plane, Check } from "lucide-react";
import { C } from "../data";
import { availabilityOnCopy } from "../data/copyTrip";

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
// The length is not a question either. Changing it adds or drops nights, which
// adds or drops hotels, and the trip somebody just chose would arrive as a
// different trip.

const fmtLong = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

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

// ─── The wait ───
//
// Three things actually happen, so the wait names all three and ticks them off.
// A spinner with one line under it makes two seconds feel like nothing is
// being done with them.
const STEPS = ["Checking hotels for your dates", "Pricing the days", "Creating your itinerary"];

function Building({ startIso }) {
  const [at, setAt] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setAt((n) => Math.min(n + 1, STEPS.length - 1)), 620);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ padding: "6px 0 10px" }}>
      <p style={{ margin: "0 0 3px", fontSize: 17, fontWeight: 800, color: C.head, letterSpacing: "-0.3px" }}>
        Building your itinerary
      </p>
      <p style={{ margin: "0 0 18px", fontSize: 12.5, color: C.sub }}>Leaving {fmtLong(startIso)}</p>
      {STEPS.map((s, i) => {
        const done = i < at;
        const live = i === at;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 0" }}>
            <span style={{
              width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "grid", placeItems: "center",
              boxSizing: "border-box",
              background: done ? "#ECFDF3" : C.white,
              border: live ? `2px solid ${C.p100}` : done ? "none" : `2px solid ${C.div}`,
              borderTopColor: live ? C.p600 : undefined,
              animation: live ? "spin 0.8s linear infinite" : undefined,
            }}>
              {done && <Check size={13} color="#027A48" strokeWidth={3.4} />}
            </span>
            <span style={{
              fontSize: 13.5, fontWeight: done || live ? 700 : 500,
              color: done || live ? C.head : C.inact,
            }}>{s}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function CopyTripScreen({ it, owner, frame, onDone, onClose }) {
  const [step, setStep] = useState("ask");   // ask | building
  const [date, setDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);

  const nights = it.nights || 7;
  const startIso = date ? new Date(`${date}T00:00:00`).toISOString() : null;
  const note = partyNote(adults, kids);
  const ready = !!date && !note;

  // Hotels are the only thing that can be unavailable: day plans always are and
  // the price is worked out rather than looked up. Whatever comes back, the
  // itinerary is made. A sold-out stay is something to fix on it, not a door
  // that closes here.
  useEffect(() => {
    if (step !== "building") return;
    const t = setTimeout(() => {
      onDone({ startIso, adults, kids, swaps: availabilityOnCopy(it, startIso).swaps });
    }, 2000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const backdrop = { position: "absolute", inset: 0, background: "rgba(24,29,39,0.45)" };
  const sheet = {
    position: "absolute", left: 0, right: 0, bottom: 0,
    background: C.white, borderRadius: "20px 20px 0 0",
    padding: "10px 18px calc(18px + env(safe-area-inset-bottom))",
    boxShadow: "0 -8px 30px rgba(16,24,40,0.22)",
  };
  const grab = <div style={{ width: 40, height: 4, borderRadius: 99, background: C.div, margin: "0 auto 14px" }} />;

  if (step === "building") {
    return (
      <div style={{ ...frame, zIndex: 330 }}>
        <div style={backdrop} />
        <div style={sheet}>
          {grab}
          <Building startIso={startIso} />
        </div>
      </div>
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

        <label htmlFor="copy-start" style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: C.sub, marginBottom: 7 }}>
          Select the travel start date
        </label>
        <input
          id="copy-start"
          data-testid="copy-date"
          type="date"
          min={todayStr()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box", padding: "13px 14px", borderRadius: 13,
            border: `1px solid ${date ? C.p600 : C.div}`, fontSize: 15, color: C.head,
            fontFamily: "inherit", outline: "none", background: C.white,
          }}
        />
        <p style={{ margin: "7px 2px 0", fontSize: 11.5, color: C.sub }}>
          {date ? `Back on ${fmtLong(new Date(new Date(`${date}T00:00:00`).getTime() + nights * 86400000).toISOString())}. ` : ""}
          The trip stays {nights} nights, so the hotels and days stay as they are.
        </p>

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

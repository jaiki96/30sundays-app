import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Check, Car, ChevronRight, X as XIcon, Info } from "lucide-react";
import { C } from "../data";
import { areaImg } from "../data/buildData";

// TransferLab - options for showing transfers without videos. Transfers are
// paid inclusions so they must stay visible, but every transfer video is the
// same clip and repeating it breaks the experience. Each option below is a
// tappable mock of how the trip page could handle them. Live at: /transfer-lab

// Sample Bali trip: arrival pickup, one region change, departure drop.
const TRANSFERS = [
  { day: 1, from: "Bali Airport", to: "Your hotel, Seminyak", sub: "Private car · Driver holds your name sign" },
  { day: 3, from: "Seminyak", to: "Ubud", sub: "Private car · Scenic 1.5 hr drive" },
  { day: 5, from: "Ubud", to: "Bali Airport", sub: "Private car · Timed to your flight" },
];
const DAY1_ACTS = [
  { name: "Beach club day", city: "Seminyak", i: 1 },
  { name: "Sunset at Tanah Lot", city: "Uluwatu", i: 2 },
  { name: "Seminyak food walk", city: "Canggu", i: 3 },
];

// Portrait video card, same look as the trip page day strip.
function VideoCard({ a, w = 128, h = 170 }) {
  return (
    <div style={{ width: w, minWidth: w, height: h, borderRadius: 14, overflow: "hidden", position: "relative", flexShrink: 0 }}>
      <img src={areaImg("Bali", a.city, a.i)} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 35%, rgba(0,0,0,0.8))" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-55%)", width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center" }}>
        <Play size={14} color="#fff" fill="#fff" />
      </div>
      <p style={{ position: "absolute", bottom: 9, left: 9, right: 9, fontSize: 11.5, fontWeight: 600, color: "#fff", margin: 0, lineHeight: 1.25 }}>{a.name}</p>
    </div>
  );
}

const IncludedTag = () => (
  <span style={{ fontSize: 10, fontWeight: 700, color: C.sText, background: C.sBg, border: `1px solid ${C.sBorder}`, borderRadius: 20, padding: "2px 8px", flexShrink: 0 }}>Included</span>
);

// Slim one-line transfer row (option A and E).
function TransferRow({ t, onOpen }) {
  return (
    <button onClick={onOpen} style={{
      display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
      padding: "10px 12px", borderRadius: 12, border: `1px solid ${C.div}`, background: C.white,
      cursor: "pointer", fontFamily: "inherit",
    }}>
      <span style={{ width: 32, height: 32, borderRadius: "50%", background: C.p100, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <Car size={15} color={C.p600} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.head }}>{t.from} → {t.to}</span>
        <span style={{ display: "block", fontSize: 11, color: C.sub, marginTop: 1 }}>{t.sub}</span>
      </span>
      <IncludedTag />
      <ChevronRight size={15} color={C.inact} style={{ flexShrink: 0 }} />
    </button>
  );
}

// Trip-level "Getting around" list (option B and E).
function GettingAround() {
  return (
    <div style={{ border: `1px solid ${C.div}`, borderRadius: 14, background: C.white, overflow: "hidden" }}>
      <p style={{ margin: 0, padding: "12px 14px 4px", fontSize: 14, fontWeight: 700, color: C.head }}>Getting around</p>
      <p style={{ margin: 0, padding: "0 14px 6px", fontSize: 11.5, color: C.sub }}>All transfers are private and part of your package.</p>
      {TRANSFERS.map((t, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderTop: `1px solid ${C.div}` }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: C.sub, background: C.bg, borderRadius: 6, padding: "3px 7px", flexShrink: 0 }}>Day {t.day}</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: C.head }}>{t.from} → {t.to}</span>
            <span style={{ display: "block", fontSize: 10.5, color: C.sub, marginTop: 1 }}>{t.sub}</span>
          </span>
          <IncludedTag />
        </div>
      ))}
    </div>
  );
}

// A mock of one day on the trip page: label + video strip (+ extras per option).
function DayMock({ children, note }) {
  return (
    <div style={{ border: `1px solid ${C.div}`, borderRadius: 14, background: C.white, padding: "12px 0" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, padding: "0 14px", marginBottom: 9 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.head }}>Day 1</span>
        <span style={{ fontSize: 11, color: C.sub }}>Seminyak</span>
        {note && <span style={{ fontSize: 10.5, color: C.inact, marginLeft: "auto" }}>{note}</span>}
      </div>
      {children}
    </div>
  );
}

const Strip = ({ children }) => (
  <div className="hs" style={{ gap: 8, paddingLeft: 14, paddingRight: 14 }}>{children}</div>
);

// Bottom sheet with transfer details as text (opened from a transfer row).
function TransferSheet({ t, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 390, height: 844, maxWidth: "100vw", maxHeight: "100vh", zIndex: 90, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", borderRadius: 44, overflow: "hidden" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: C.white, borderRadius: "20px 20px 0 0", padding: "18px 18px 26px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.head }}>{t.from} → {t.to}</p>
          <button onClick={onClose} aria-label="Close" style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: C.bg, display: "grid", placeItems: "center", cursor: "pointer" }}>
            <XIcon size={15} color={C.head} />
          </button>
        </div>
        <p style={{ margin: "0 0 14px", fontSize: 12, color: C.sub }}>Day {t.day} · part of your package</p>
        {[
          ["Vehicle", "Private air-conditioned car, just for you two"],
          ["Meeting point", t.day === 1 ? "Arrivals hall, driver holds a sign with your name" : "Your hotel lobby, luggage handled for you"],
          ["Timing", t.day === 5 ? "Pickup timed to your flight, with buffer" : "Flexible, your consultant confirms the time"],
          ["Cost", "Already included, nothing to pay on the day"],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", gap: 10, padding: "8px 0", borderTop: `1px solid ${C.div}` }}>
            <span style={{ width: 92, flexShrink: 0, fontSize: 12, fontWeight: 700, color: C.sub }}>{k}</span>
            <span style={{ fontSize: 12.5, color: C.head, lineHeight: 1.45 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Option mocks ───
function OptionA({ onOpen }) {
  return (
    <DayMock note="videos are activities only">
      <Strip>{DAY1_ACTS.map(a => <VideoCard key={a.name} a={a} />)}</Strip>
      <div style={{ padding: "10px 14px 0" }}>
        <TransferRow t={TRANSFERS[0]} onOpen={onOpen} />
      </div>
    </DayMock>
  );
}

function OptionC() {
  return (
    <div style={{ border: `1px solid ${C.div}`, borderRadius: 14, background: C.white, padding: "12px 14px" }}>
      <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700, color: C.head }}>What's included</p>
      {[
        "All private transfers (airport pickup, drop, and between regions)",
        "4-star stays with daily breakfast",
        "All activities in your day plan",
        "Local support on WhatsApp",
      ].map(x => (
        <div key={x} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "5px 0" }}>
          <Check size={14} color={C.sText} strokeWidth={3} style={{ marginTop: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 12.5, color: C.head, lineHeight: 1.45 }}>{x}</span>
        </div>
      ))}
    </div>
  );
}

function OptionD() {
  return (
    <DayMock note="card stays, clearly not a video">
      <Strip>
        <div style={{ width: 108, minWidth: 108, height: 170, borderRadius: 14, background: C.p100, flexShrink: 0, padding: 12, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <span style={{ width: 32, height: 32, borderRadius: "50%", background: C.white, display: "grid", placeItems: "center" }}>
            <Car size={16} color={C.p600} />
          </span>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: C.head, lineHeight: 1.3 }}>Airport pickup</p>
            <p style={{ margin: "3px 0 6px", fontSize: 10, color: C.sub, lineHeight: 1.35 }}>Driver with your name sign</p>
            <IncludedTag />
          </div>
        </div>
        {DAY1_ACTS.map(a => <VideoCard key={a.name} a={a} />)}
      </Strip>
    </DayMock>
  );
}

// ─── Page ───
const OPTIONS = [
  {
    id: "A", name: "Quiet row in the day",
    note: "Videos stay pure activities. The transfer sits under the strip as one calm line, tap for details as text. Keeps context, adds almost no height.",
    con: "Watch out: on days with two transfers the rows stack up.",
  },
  {
    id: "B", name: "One 'Getting around' section",
    note: "All transfers for the whole trip in one list, near flights and hotels. Easy to find everything, great for booked customers.",
    con: "Watch out: on Day 1 morning a user may not think to scroll there.",
  },
  {
    id: "C", name: "Inside 'What's included' only",
    note: "Transfers become a line in the inclusions list. Cleanest day view.",
    con: "Watch out: too hidden. A paid, reassuring service reduced to one bullet, and nothing tells you the pickup plan for a given day.",
  },
  {
    id: "D", name: "A card that is clearly not a video",
    note: "The strip keeps a transfer card, but tinted and icon-led with no play button. The day drawer already styles transfers like this.",
    con: "Watch out: it still competes with activity videos for space and attention, and repeats every travel day.",
  },
  {
    id: "E", name: "Row in the day + trip-level list", recommended: true,
    note: "Option A and B together. Each day answers 'how do I get there' in place, and one list shows every pickup for the trip. Nothing pretends to be a video.",
    con: "",
  },
];

export default function TransferLab() {
  const nav = useNavigate();
  const [sheet, setSheet] = useState(null);
  return (
    <div style={{ height: "100%", overflowY: "auto", background: C.bg }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 12px 4px" }}>
        <button onClick={() => nav(-1)} aria-label="Back" style={{ width: 36, height: 36, borderRadius: 12, border: "none", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }}>
          <ArrowLeft size={20} color={C.head} />
        </button>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.head, letterSpacing: "-0.4px" }}>Transfers, without videos</h1>
      </div>
      <p style={{ margin: "0 16px 6px 20px", fontSize: 13, color: C.sub, lineHeight: 1.55 }}>
        Videos are for things you choose and look forward to. Transfers are things you want confirmed and handled.
        Every transfer video is the same clip, and repeating the same content teaches people to skip the whole row.
        So transfers stop being videos. Five ways to still show them, since they are part of what customers pay for:
      </p>

      <div style={{ padding: "12px 16px 30px", display: "flex", flexDirection: "column", gap: 26 }}>
        {OPTIONS.map((o) => (
          <div key={o.id}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 6px 2px", flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", background: C.p600, borderRadius: 6, padding: "2px 7px" }}>Option {o.id}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.head }}>{o.name}</span>
              {o.recommended && (
                <span style={{ fontSize: 10.5, fontWeight: 800, color: C.sText, background: C.sBg, border: `1px solid ${C.sBorder}`, borderRadius: 20, padding: "2px 9px" }}>Recommended</span>
              )}
            </div>
            <p style={{ margin: "0 0 4px 2px", fontSize: 11.5, color: C.sub, lineHeight: 1.5 }}>{o.note}</p>
            {o.con && <p style={{ margin: "0 0 10px 2px", fontSize: 11.5, color: C.wText, lineHeight: 1.5 }}>{o.con}</p>}
            {!o.con && <div style={{ height: 6 }} />}

            {o.id === "A" && <OptionA onOpen={() => setSheet(TRANSFERS[0])} />}
            {o.id === "B" && <GettingAround />}
            {o.id === "C" && <OptionC />}
            {o.id === "D" && <OptionD />}
            {o.id === "E" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <OptionA onOpen={() => setSheet(TRANSFERS[0])} />
                <GettingAround />
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: C.wBg, border: "1px solid #FED7AA", borderRadius: 12, padding: "10px 12px" }}>
                  <Info size={14} color={C.wText} style={{ marginTop: 1, flexShrink: 0 }} />
                  <span style={{ fontSize: 11.5, color: C.wText, lineHeight: 1.5 }}>
                    Works for both stages. While planning, the rows say what is included. Once booked, the same rows
                    gain driver name and pickup time as soon as they are confirmed.
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {sheet && <TransferSheet t={sheet} onClose={() => setSheet(null)} />}
    </div>
  );
}

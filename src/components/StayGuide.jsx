import { useEffect, useState } from "react";
import { BedDouble, ChevronRight, Hotel, Lightbulb, X as XIcon } from "lucide-react";
import { C } from "../data";

// ─── What kind of hotel to book here ───
//
// The region page already says, per city, what kind of stay works and which
// room to ask for. Somebody choosing a hotel is the person who needs it most,
// so the hotel list carries an entrance to it, and the whole guide opens in a
// sheet over the list rather than taking them off it.
//
// `stay` is regionGuide(dest, city).stay: { headline, note, rooms }.
//
// Five ways in, switchable with ?guide=1..5 to compare. Every one says the
// advice itself, so it is useful without the tap:
//   1 postcard    the region page's postcard: cream paper, a handwritten title
//   2 consultant  the consultant's face and the tip in her words
//   3 strip       a slim strip under the header, part of the top of the screen
//   4 type        the advice set large, no box, like the opening of a section
//   5 stamp       a round "stay guide" stamp beside the advice
export const GUIDE_VARIANTS = ["1", "2", "3", "4", "5"];

const PAPER = "#FCF6E7";
const PAPER_EDGE = "#E6DCC4";

export function StayGuideEntry({ stay, city, consultant, variant = "1", onOpen }) {
  if (!stay) return null;

  if (variant === "2") {
    const first = consultant?.name?.split(" ")[0] || "Your consultant";
    return (
      <button data-testid="stay-guide" onClick={onOpen} style={{ ...reset, display: "flex", alignItems: "flex-end", gap: 8, width: "100%" }}>
        <Face consultant={consultant} />
        <span style={{
          flex: 1, minWidth: 0, background: C.white, border: `1px solid ${C.div}`,
          borderRadius: "16px 16px 16px 4px", padding: "9px 12px 10px",
          boxShadow: "0 1px 4px rgba(24,30,76,0.05)",
        }}>
          <span style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: C.sub }}>{first}'s tip for {city}</span>
          <span style={{ display: "block", marginTop: 2, fontSize: 14, fontWeight: 700, color: C.head, lineHeight: "19px" }}>{stay.headline}</span>
          <span style={{ display: "inline-flex", alignItems: "center", marginTop: 4, fontSize: 12, fontWeight: 700, color: C.p600 }}>
            Why <ChevronRight size={13} strokeWidth={2.6} />
          </span>
        </span>
      </button>
    );
  }

  if (variant === "3") {
    // Rendered by the list inside its header, flush to the header's edges.
    return (
      <button data-testid="stay-guide" onClick={onOpen} style={{
        ...reset, display: "flex", alignItems: "center", gap: 8, width: "100%",
        padding: "8px 14px", background: "#FFF5F7", borderTop: `1px solid #FFE0E7`,
      }}>
        <Lightbulb size={14} color={C.p600} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: C.head, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          <strong style={{ fontWeight: 700 }}>{city} tip:</strong> {lower(stay.headline)}
        </span>
        <ChevronRight size={15} color={C.p600} strokeWidth={2.6} style={{ flexShrink: 0 }} />
      </button>
    );
  }

  if (variant === "4") {
    return (
      <button data-testid="stay-guide" onClick={onOpen} style={{ ...reset, display: "block", width: "100%", padding: "2px 2px 4px" }}>
        <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.p600 }}>Booking in {city}</span>
        <span style={{ display: "block", marginTop: 3, fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 25, lineHeight: "29px", color: C.ink }}>
          {stay.headline}.
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", marginTop: 6, fontSize: 12.5, fontWeight: 700, color: C.head, borderBottom: `1.5px solid ${C.p600}`, paddingBottom: 1 }}>
          See why and which room to ask for
        </span>
      </button>
    );
  }

  if (variant === "5") {
    return (
      <button data-testid="stay-guide" onClick={onOpen} style={{ ...reset, ...card, display: "flex", alignItems: "center", gap: 12 }}>
        <Stamp city={city} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 14.5, fontWeight: 800, color: C.head, lineHeight: "19px" }}>{stay.headline}</span>
          <span style={{ display: "inline-flex", alignItems: "center", marginTop: 4, fontSize: 12, fontWeight: 700, color: C.p600 }}>
            Read the guide <ChevronRight size={13} strokeWidth={2.6} />
          </span>
        </span>
      </button>
    );
  }

  // 1: postcard
  return (
    <button data-testid="stay-guide" onClick={onOpen} style={{
      ...reset, display: "block", width: "100%", position: "relative",
      background: PAPER, border: `1px solid ${PAPER_EDGE}`, borderRadius: 5,
      boxShadow: "0 6px 14px rgba(24,29,39,0.09)", padding: "10px 14px 11px",
      transform: "rotate(-0.6deg)",
    }}>
      <span aria-hidden style={{
        position: "absolute", top: -7, left: "50%", width: 54, height: 14, marginLeft: -27,
        background: "rgba(253,1,79,0.16)", transform: "rotate(-3deg)",
      }} />
      <span style={{ display: "block", fontFamily: "Caveat, cursive", fontSize: 22, lineHeight: "24px", fontWeight: 700, color: "#181D27" }}>
        Where to stay in {city}
      </span>
      <span style={{ display: "block", marginTop: 3, fontSize: 14, fontWeight: 700, color: C.head, lineHeight: "19px" }}>{stay.headline}</span>
      <span style={{ display: "inline-flex", alignItems: "center", marginTop: 4, fontSize: 12, fontWeight: 700, color: C.p600 }}>
        Read more <ChevronRight size={13} strokeWidth={2.6} />
      </span>
    </button>
  );
}

function Face({ consultant }) {
  const initials = (consultant?.name || "30 S").split(" ").map((w) => w[0]).join("").slice(0, 2);
  return consultant?.avatar ? (
    <img src={consultant.avatar} alt="" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${C.white}`, boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
  ) : (
    <span style={{ width: 34, height: 34, borderRadius: "50%", background: C.p100, color: C.p600, fontSize: 12, fontWeight: 800, display: "grid", placeItems: "center", flexShrink: 0 }}>{initials}</span>
  );
}

// A round stamp, the words set around the edge.
function Stamp({ city }) {
  const id = `stamp-${city.replace(/\W/g, "")}`;
  return (
    <svg width="58" height="58" viewBox="0 0 58 58" aria-hidden style={{ flexShrink: 0, transform: "rotate(-8deg)" }}>
      <defs>
        <path id={id} d="M29,29 m-21,0 a21,21 0 1,1 42,0 a21,21 0 1,1 -42,0" />
      </defs>
      <circle cx="29" cy="29" r="27" fill="#FFF5F7" stroke={C.p600} strokeWidth="1.5" strokeDasharray="3 2.4" />
      <circle cx="29" cy="29" r="15" fill="none" stroke={C.p600} strokeWidth="1" />
      <text fontSize="7.2" fontWeight="800" fill={C.p600} letterSpacing="1.1">
        <textPath href={`#${id}`} textLength="128" lengthAdjust="spacing">{`${city} stay guide · ${city} stay guide · `.slice(0, 34)}</textPath>
      </text>
      <g transform="translate(21 21)">
        <path d="M2 14V7l6-5 6 5v7" fill="none" stroke={C.p600} strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M6 14v-4h4v4" fill="none" stroke={C.p600} strokeWidth="1.7" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

// ─── The guide itself, over the list ───
export function StayGuideSheet({ stay, city, onClose }) {
  const [up, setUp] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => setUp(true)); return () => cancelAnimationFrame(id); }, []);
  const close = () => { setUp(false); setTimeout(onClose, 220); };

  return (
    <div data-testid="stay-guide-sheet" style={{ position: "absolute", inset: 0, zIndex: 60, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={close} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", opacity: up ? 1 : 0, transition: "opacity .22s" }} />
      <div style={{
        position: "relative", background: C.white, borderRadius: "20px 20px 0 0", maxHeight: "82%", overflowY: "auto",
        padding: "10px 20px calc(24px + env(safe-area-inset-bottom))",
        transform: up ? "translateY(0)" : "translateY(100%)", transition: "transform .24s cubic-bezier(0.32,0.72,0,1)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "0 0 8px" }}>
          <span style={{ width: 38, height: 4, borderRadius: 99, background: "#D5D7DA" }} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: C.p600 }}>Where to stay in {city}</p>
            <h3 style={{ margin: "3px 0 0", fontSize: 19, fontWeight: 800, color: C.head, lineHeight: 1.25 }}>{stay.headline}</h3>
          </div>
          <button onClick={close} aria-label="Close" style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: C.bg, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
            <XIcon size={16} color={C.head} />
          </button>
        </div>

        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Hotel size={15} color={C.p600} strokeWidth={2.4} />
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.head }}>What kind of hotel</p>
        </div>
        <p style={{ margin: "6px 0 0", fontSize: 13.5, color: C.sub, lineHeight: "20px" }}>{stay.note}</p>

        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.div}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BedDouble size={15} color={C.p600} strokeWidth={2.4} />
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.head }}>Which room to look for</p>
          </div>
          <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none" }}>
            {stay.rooms.map((room) => (
              <li key={room} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 6 }}>
                <span aria-hidden style={{ width: 5, height: 5, borderRadius: "50%", background: C.head, flexShrink: 0, marginTop: 7 }} />
                <span style={{ fontSize: 13.5, color: C.head, lineHeight: 1.4 }}>{room}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const reset = { border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left", padding: 0 };
const card = {
  width: "100%", boxSizing: "border-box", padding: "11px 12px", borderRadius: 14,
  background: C.white, border: `1px solid ${C.div}`, boxShadow: "0 1px 4px rgba(24,30,76,0.05)",
};
// "A pool villa, not a hotel room" reads as a sentence after "Ubud tip:".
const lower = (s) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);

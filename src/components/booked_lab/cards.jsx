import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { C } from "../../data";

// ─── Five ways to show a booked trip ───
//
// Same six facts in all of them: who booked it and when, where it goes, how
// long, what kind of trip, how many went, and the price per person. What
// changes is how the person on the card is introduced, because that was the
// weakest part of the first attempt: a black bar across the top of every card
// is a lot of furniture for one name, and it made the rail look borrowed.
//
// None of them has a View button. The whole card is the link, so a second
// control saying so is a word taken away from the trip.

export const CARD_W = 232;

// Style tags: three colours that cannot be confused, none red, no two green.
export const TAG = {
  Relaxed: { bg: "#EAF2FE", fg: "#175CD3" },
  Explorer: { bg: "#FFF4E0", fg: "#B54708" },
  Offbeat: { bg: "#E5F6F5", fg: "#007E72" },
};
export const NEUTRAL = { bg: "#F2F0EE", fg: "#4A5565" };

export function Pill({ tone = NEUTRAL, children }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 8px", borderRadius: 6,
      background: tone.bg, color: tone.fg, fontSize: 10, fontWeight: 700,
      letterSpacing: "0.2px", whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

// The route, with a real break between the stops instead of a middle dot. The
// arrow is the one character that says these places happen in order.
export function Route({ legs, max = 3, size = 11, color }) {
  const shown = legs.slice(0, max);
  const rest = legs.length - shown.length;
  return (
    <span style={{ fontSize: size, color: color || C.sub, lineHeight: "15px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
      {shown.map((l, i) => (
        <span key={l.city}>
          {i > 0 && <span style={{ opacity: 0.45, margin: "0 4px" }}>→</span>}
          {l.city}
        </span>
      ))}
      {rest > 0 && <span style={{ opacity: 0.7 }}> +{rest}</span>}
    </span>
  );
}

const shell = {
  flexShrink: 0, width: CARD_W, textDecoration: "none", borderRadius: 14, overflow: "hidden",
  background: C.white, border: `1px solid ${C.div}`, boxShadow: "0 3px 14px rgba(0,0,0,0.06)",
  display: "flex", flexDirection: "column",
};

const Price = ({ t, size = 14, caption = "per person" }) => (
  <p style={{ margin: 0, fontSize: size, fontWeight: 800, color: C.head, letterSpacing: "-0.3px", whiteSpace: "nowrap" }}>
    ₹{t.price} <span style={{ fontSize: 9.5, fontWeight: 600, color: C.inact, letterSpacing: 0 }}>{caption}</span>
  </p>
);

const Party = ({ t, color }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0, fontSize: 10.5, fontWeight: 600, color: color || C.sub, whiteSpace: "nowrap" }}>
    <Users size={11} /> {t.party}
  </span>
);

// ════════ A. The caption ════════
// The booker sits under the photo as a line of small type, the way a picture
// credit does. No bar, no block of colour, and the photo starts at the top of
// the card where it does the most work.
export function CardA({ t }) {
  return (
    <Link to={t.target} style={shell}>
      <img src={t.img} alt={t.dest} style={{ width: "100%", height: 112, objectFit: "cover", display: "block" }} />
      <div style={{ padding: "9px 11px 10px", display: "flex", flexDirection: "column", flex: 1 }}>
        <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: C.p600, letterSpacing: "0.3px", textTransform: "uppercase" }}>
          {t.who} booked this {t.when}
        </p>
        <p style={{ margin: "5px 0 0", fontSize: 13.5, fontWeight: 700, color: C.head, letterSpacing: "-0.2px" }}>
          {t.nights} nights in {t.dest}
        </p>
        <Route legs={t.legs} />
        <div style={{ display: "flex", gap: 5, marginTop: 8 }}>
          <Pill tone={TAG[t.style]}>{t.style}</Pill>
          <Pill>{t.party}</Pill>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8, marginTop: "auto", paddingTop: 9, borderTop: `1px solid ${C.div}` }}>
          <Price t={t} />
          <Party t={t} />
        </div>
      </div>
    </Link>
  );
}

// ════════ B. The ticket, four ways to show the traveller ════════
//
// The shape is settled: photo down the left at full height, trip facts beside
// it, three lines under the name. What is still open is how the person who
// booked it is introduced, so here are four, one with the panel and three with
// no band of colour at all.

const ticket = { ...shell, width: 300, flexDirection: "row" };
const col = { flex: 1, minWidth: 0, display: "flex", flexDirection: "column" };

function Facts({ t, pad = "10px 11px 11px 12px" }) {
  return (
    <div style={{ padding: pad }}>
      <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: C.head, letterSpacing: "-0.2px" }}>
        {t.nights} nights in {t.dest}
      </p>
      <Route legs={t.legs} max={2} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 10 }}>
        <Price t={t} size={13.5} caption="/person" />
        <Pill tone={TAG[t.style]}>{t.style}</Pill>
      </div>
    </div>
  );
}

// ─── B1. The dark panel ───
// The photo runs the full height of the card and the band sits only over the
// trip facts, in the deepest colour the brand has. The name is white on it, so
// it is the first thing read without the band crossing the photo.
export function CardB1({ t }) {
  return (
    <Link to={t.target} style={ticket}>
      <img src={t.img} alt={t.dest} style={{ width: 98, flexShrink: 0, objectFit: "cover", display: "block", alignSelf: "stretch" }} />
      <div style={col}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
          padding: "6px 11px 6px 12px", background: "#1C3232",
        }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            <strong style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{t.who}</strong> booked {t.when}
          </span>
          <Party t={t} color="rgba(255,255,255,0.75)" />
        </div>
        <Facts t={t} />
      </div>
    </Link>
  );
}

// ─── B2. The pink lead line ───
// No band anywhere. The name simply goes first, in the brand pink at a weight
// nothing else on the card uses, which is enough to make it the entry point.
export function CardB2({ t }) {
  return (
    <Link to={t.target} style={ticket}>
      <img src={t.img} alt={t.dest} style={{ width: 98, flexShrink: 0, objectFit: "cover", display: "block", alignSelf: "stretch" }} />
      <div style={{ ...col, padding: "10px 11px 11px 12px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 10.5, color: C.inact, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            <strong style={{ fontSize: 13, fontWeight: 800, color: C.p600, letterSpacing: "-0.2px" }}>{t.who}</strong>
            {" "}· {t.when}
          </span>
          <Party t={t} />
        </div>
        <p style={{ margin: "6px 0 0", fontSize: 13.5, fontWeight: 700, color: C.head, letterSpacing: "-0.2px" }}>
          {t.nights} nights in {t.dest}
        </p>
        <Route legs={t.legs} max={2} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 10 }}>
          <Price t={t} size={13.5} caption="/person" />
          <Pill tone={TAG[t.style]}>{t.style}</Pill>
        </div>
      </div>
    </Link>
  );
}

// ─── B3. The name on the photo ───
// The traveller goes where a photo credit goes, over the bottom of the
// picture, so the facts column holds only facts and the card loses a line.
export function CardB3({ t }) {
  return (
    <Link to={t.target} style={ticket}>
      <div style={{ position: "relative", width: 104, flexShrink: 0, alignSelf: "stretch" }}>
        <img src={t.img} alt={t.dest} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 44%, rgba(0,0,0,0.78) 100%)" }} />
        <span style={{
          position: "absolute", left: 8, right: 8, bottom: 7,
          fontSize: 11.5, fontWeight: 800, color: "#fff", letterSpacing: "-0.1px",
          textShadow: "0 1px 6px rgba(0,0,0,0.6)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {t.who}
          <span style={{ display: "block", fontSize: 9.5, fontWeight: 500, color: "rgba(255,255,255,0.82)" }}>booked {t.when}</span>
        </span>
      </div>
      <div style={{ ...col, padding: "11px 11px 11px 12px" }}>
        <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: C.head, letterSpacing: "-0.2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {t.nights} nights in {t.dest}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <Route legs={t.legs} max={2} />
          <Party t={t} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 10 }}>
          <Price t={t} size={13.5} caption="/person" />
          <Pill tone={TAG[t.style]}>{t.style}</Pill>
        </div>
      </div>
    </Link>
  );
}

// ─── B4. The hairline ───
// The same top line as B2, but ruled off underneath instead of tinted. It
// separates the person from the trip the way a strip does, and costs one pixel
// instead of a block of colour.
export function CardB4({ t }) {
  return (
    <Link to={t.target} style={ticket}>
      <img src={t.img} alt={t.dest} style={{ width: 98, flexShrink: 0, objectFit: "cover", display: "block", alignSelf: "stretch" }} />
      <div style={col}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
          padding: "8px 11px 7px 12px", borderBottom: `1px solid ${C.div}`,
        }}>
          <span style={{ fontSize: 10.5, color: C.inact, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            <strong style={{ fontSize: 12.5, fontWeight: 800, color: C.p600 }}>{t.who}</strong> · {t.when}
          </span>
          <Party t={t} />
        </div>
        <Facts t={t} />
      </div>
    </Link>
  );
}

// ════════ C. The chip ════════
// The name goes on the photo as one small light chip, which is the lightest
// way to say "a real person picked this" without a bar across the card.
export function CardC({ t }) {
  return (
    <Link to={t.target} style={shell}>
      <div style={{ position: "relative" }}>
        <img src={t.img} alt={t.dest} style={{ width: "100%", height: 118, objectFit: "cover", display: "block" }} />
        <span style={{
          position: "absolute", top: 9, left: 9, display: "inline-flex", alignItems: "center", gap: 5,
          background: "rgba(255,255,255,0.94)", borderRadius: 999, padding: "4px 9px 4px 4px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
        }}>
          <span style={{
            width: 17, height: 17, borderRadius: "50%", background: C.p100, color: C.p600,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800,
          }}>{t.who[0]}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.head, whiteSpace: "nowrap" }}>{t.who} · {t.when}</span>
        </span>
      </div>
      <div style={{ padding: "10px 11px", display: "flex", flexDirection: "column", flex: 1 }}>
        <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: C.head, letterSpacing: "-0.2px" }}>
          {t.nights} nights in {t.dest}
        </p>
        <Route legs={t.legs} />
        <div style={{ display: "flex", gap: 5, marginTop: 8 }}>
          <Pill tone={TAG[t.style]}>{t.style}</Pill>
          <Pill>{t.party}</Pill>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8, marginTop: "auto", paddingTop: 9 }}>
          <Price t={t} />
          <Party t={t} />
        </div>
      </div>
    </Link>
  );
}

// ════════ D. The itinerary strip ════════
// The route is the card. Each stop gets its nights against it, down a hairline
// the way the day plan reads on the itinerary screen, so the card shows the
// shape of the trip rather than just its length.
export function CardD({ t }) {
  const legs = t.legs.slice(0, 3);
  const rest = t.legs.length - legs.length;
  return (
    <Link to={t.target} style={shell}>
      <img src={t.img} alt={t.dest} style={{ width: "100%", height: 94, objectFit: "cover", display: "block" }} />
      <div style={{ padding: "10px 11px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 6 }}>
          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: C.head, letterSpacing: "-0.2px" }}>{t.dest}</p>
          <span style={{ fontSize: 10.5, fontWeight: 600, color: C.sub }}>{t.nights} nights</span>
        </div>

        <div style={{ margin: "8px 0 0", paddingLeft: 2 }}>
          {legs.map((l, i) => (
            <div key={l.city} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: i === legs.length - 1 ? 0 : 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.p300, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: C.head, flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.city}</span>
              <span style={{ fontSize: 10.5, color: C.inact, flexShrink: 0 }}>{l.n}N</span>
            </div>
          ))}
          {rest > 0 && <p style={{ margin: "5px 0 0 12px", fontSize: 10.5, color: C.inact }}>+{rest} more</p>}
        </div>

        <div style={{ display: "flex", gap: 5, marginTop: 9 }}>
          <Pill tone={TAG[t.style]}>{t.style}</Pill>
          <Pill>{t.party}</Pill>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8, marginTop: "auto", paddingTop: 9, borderTop: `1px solid ${C.div}` }}>
          <Price t={t} />
          <Party t={t} />
        </div>
        <p style={{ margin: "6px 0 0", fontSize: 10, color: C.inact }}>{t.who} booked {t.when}</p>
      </div>
    </Link>
  );
}

// ════════ E. The postcard ════════
// Everything over the photo. The boldest of the five and the shortest, but the
// price has to sit on an image, so it carries a scrim to stay readable.
export function CardE({ t }) {
  return (
    <Link to={t.target} style={{ ...shell, border: "none", height: 212, position: "relative" }}>
      <img src={t.img} alt={t.dest} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 34%, rgba(0,0,0,0.3) 58%, rgba(0,0,0,0.84) 100%)" }} />

      <span style={{ position: "absolute", top: 10, left: 10, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.95)", textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
        {t.who} booked {t.when}
      </span>

      <div style={{ position: "absolute", left: 11, right: 11, bottom: 11 }}>
        <div style={{ display: "flex", gap: 5, marginBottom: 7 }}>
          <Pill tone={TAG[t.style]}>{t.style}</Pill>
          <Pill tone={{ bg: "rgba(255,255,255,0.92)", fg: C.head }}>{t.party}</Pill>
        </div>
        <p style={{ margin: 0, fontSize: 14.5, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px", textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
          {t.nights} nights in {t.dest}
        </p>
        <Route legs={t.legs} color="rgba(255,255,255,0.88)" />
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8, marginTop: 7 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px", textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
            ₹{t.price} <span style={{ fontSize: 9.5, fontWeight: 600, color: "rgba(255,255,255,0.8)", letterSpacing: 0 }}>per person</span>
          </p>
          <Party t={t} color="rgba(255,255,255,0.85)" />
        </div>
      </div>
    </Link>
  );
}

export const CARD_VERSIONS = [
  { key: "B1", title: "B1. The dark panel", note: "Photo at full height, the band only over the facts, in the brand's deepest green. The name is white on it.", Card: CardB1 },
  { key: "B2", title: "B2. The pink lead line · chosen", note: "No band anywhere. The name just goes first, in pink at a weight nothing else on the card uses.", Card: CardB2 },
  { key: "B3", title: "B3. The name on the photo", note: "The traveller sits over the bottom of the picture, so the facts column holds only facts.", Card: CardB3 },
  { key: "B4", title: "B4. The hairline", note: "The same top line as B2, ruled off underneath instead of tinted. One pixel instead of a block of colour.", Card: CardB4 },
];

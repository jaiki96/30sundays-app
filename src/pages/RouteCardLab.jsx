import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Check, Users } from "lucide-react";
import { C } from "../data";
import { areaImg } from "../data/buildData";

// RouteCardLab - 10 visual styles for the route card. Every card holds the
// same content only: option number, "chosen by X%" stat, one row per region
// (thumbnail with play icon, region name, nights), and a Select / Selected
// CTA. Tap a card to toggle its selected state. Live at: /route-lab

const OPTION_NO = 1;
const PCT = 59;
const STOPS = [
  { city: "Ubud", n: 2 },
  { city: "Seminyak", n: 2 },
  { city: "Sanur", n: 2 },
  { city: "Canggu", n: 1 },
];
const serif = "Georgia, 'Times New Roman', serif";
const nightsLabel = (n) => `${n} night${n > 1 ? "s" : ""}`;

// Region thumbnail with a play affordance. corner=true puts a small play
// badge on the corner, else a centered overlay.
function Thumb({ city, i, size = 44, radius = 12, corner = true, accent = C.p600, num }) {
  return (
    <span style={{ position: "relative", flexShrink: 0, width: size, height: size, display: "block" }}>
      <span style={{ position: "absolute", inset: 0, borderRadius: radius, overflow: "hidden", display: "block" }}>
        <img src={areaImg("Bali", city, i)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        {!corner && (
          <span style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)", display: "grid", placeItems: "center" }}>
            <span style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.35)", backdropFilter: "blur(2px)", display: "grid", placeItems: "center" }}>
              <Play size={9} color="#fff" fill="#fff" style={{ marginLeft: 1 }} />
            </span>
          </span>
        )}
      </span>
      {corner && (
        <span style={{ position: "absolute", right: -4, bottom: -4, width: 18, height: 18, borderRadius: "50%", background: accent, border: "2px solid #fff", display: "grid", placeItems: "center" }}>
          {num != null
            ? <span style={{ fontSize: 9, fontWeight: 800, color: "#fff" }}>{num}</span>
            : <Play size={7} color="#fff" fill="#fff" style={{ marginLeft: 0.5 }} />}
        </span>
      )}
    </span>
  );
}

// One region row: thumbnail + name + nights. Shared across styles.
function Row({ s, i, thumb = {}, divider, connector, accent, pad = 12, serifName }) {
  const last = i === STOPS.length - 1;
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 13, padding: `${pad}px 0`, borderBottom: divider && !last ? `1px solid ${C.div}` : "none" }}>
      {connector && !last && (
        <span style={{ position: "absolute", left: (thumb.size || 44) / 2, top: `calc(50% + ${(thumb.size || 44) / 2 + 4}px)`, height: pad * 2, width: 2, background: C.div, borderRadius: 2 }} />
      )}
      <Thumb city={s.city} i={i} accent={accent} num={thumb.numbered ? i + 1 : undefined} {...thumb} />
      <span style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 700, color: C.head, letterSpacing: "-0.2px", fontFamily: serifName ? serif : "inherit" }}>{s.city}</span>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: C.sub, flexShrink: 0 }}>{nightsLabel(s.n)}</span>
    </div>
  );
}

// The "chosen by X%" stat line.
function PctLine({ dark, accent }) {
  const col = dark ? "rgba(255,255,255,0.8)" : C.sub;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600, color: accent || col }}>
      <Users size={12} color={accent || (dark ? "rgba(255,255,255,0.8)" : C.inact)} strokeWidth={2.2} />
      Chosen by {PCT}% of Indian couples
    </span>
  );
}

// Bottom Select / Selected CTA.
function SelectCta({ sel, mode = "solid", accent = C.p600 }) {
  const base = { width: "100%", padding: mode === "slim" ? "10px 0" : "13px 0", borderRadius: 22, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 };
  if (sel) return (
    <button style={{ ...base, border: "none", background: C.sText, color: "#fff" }}>
      <Check size={15} strokeWidth={3} /> Selected
    </button>
  );
  const look = mode === "outline"
    ? { border: `1.5px solid ${accent}`, background: "transparent", color: accent }
    : mode === "ghost"
      ? { border: "none", background: `${accent}14`, color: accent }
      : { border: "none", background: accent, color: "#fff" };
  return <button style={{ ...base, ...look }}>Select</button>;
}

const cardBase = { padding: 16, borderRadius: 16, background: C.white, textAlign: "left", cursor: "pointer" };
const optTitle = { margin: 0, fontSize: 16, fontWeight: 700, color: C.head, letterSpacing: "-0.2px" };

// ─── The 10 styles. Each receives (sel) and renders the same content. ───
const S1 = ({ sel }) => (
  <div style={{ ...cardBase, border: `1.5px solid ${sel ? C.sText : C.p600}` }}>
    <p style={optTitle}>Option {OPTION_NO}</p>
    <p style={{ margin: "4px 0 4px" }}><PctLine /></p>
    <div style={{ margin: "4px 0 12px" }}>
      {STOPS.map((s, i) => <Row key={s.city} s={s} i={i} />)}
    </div>
    <SelectCta sel={sel} />
  </div>
);

const S2 = ({ sel }) => (
  <div style={{ ...cardBase, border: `1px solid ${sel ? C.sBorder : C.div}`, background: sel ? C.sBg : C.white }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
      <p style={optTitle}>Option {OPTION_NO}</p>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: C.p600, background: C.p100, borderRadius: 20, padding: "4px 10px", flexShrink: 0 }}>{PCT}% chose this</span>
    </div>
    <div style={{ margin: "8px 0 12px" }}>
      {STOPS.map((s, i) => <Row key={s.city} s={s} i={i} divider thumb={{ corner: false }} />)}
    </div>
    <SelectCta sel={sel} mode="ghost" />
  </div>
);

const S3 = ({ sel }) => (
  <div style={{ ...cardBase, border: `1.5px solid ${sel ? C.sBorder : C.div}`, background: sel ? C.sBg : C.white }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
      <p style={optTitle}>Option {OPTION_NO}</p>
      {sel && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 800, color: C.sText }}><Check size={13} strokeWidth={3} /> Selected</span>}
    </div>
    <div style={{ margin: "8px 0 10px" }}>
      {STOPS.map((s, i) => <Row key={s.city} s={s} i={i} accent={sel ? C.sText : C.p600} />)}
    </div>
    <div style={{ margin: "0 0 12px" }}><PctLine /></div>
    <SelectCta sel={sel} accent={C.sText} mode="outline" />
  </div>
);

const S4 = ({ sel }) => (
  <div style={{ ...cardBase, boxShadow: sel ? "0 6px 24px rgba(2,122,72,0.16)" : "0 6px 24px rgba(24,29,39,0.10)", border: sel ? `1.5px solid ${C.sBorder}` : "1.5px solid transparent" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
      <p style={optTitle}>Option {OPTION_NO}</p>
      <PctLine />
    </div>
    <div style={{ margin: "8px 0 12px" }}>
      {STOPS.map((s, i) => <Row key={s.city} s={s} i={i} thumb={{ radius: "50%" }} />)}
    </div>
    <SelectCta sel={sel} />
  </div>
);

const S5 = ({ sel }) => (
  <div style={{ ...cardBase, border: `1px solid ${sel ? C.sBorder : C.div}` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ width: 30, height: 30, borderRadius: "50%", background: sel ? C.sText : C.head, color: "#fff", fontSize: 13, fontWeight: 800, display: "grid", placeItems: "center", flexShrink: 0 }}>{OPTION_NO}</span>
      <span style={{ flex: 1 }}>
        <p style={{ ...optTitle, fontSize: 15 }}>Option {OPTION_NO}</p>
        <PctLine />
      </span>
    </div>
    <div style={{ height: 1, background: C.div, margin: "12px 0 2px" }} />
    <div style={{ margin: "0 0 12px" }}>
      {STOPS.map((s, i) => <Row key={s.city} s={s} i={i} />)}
    </div>
    <SelectCta sel={sel} />
  </div>
);

const S6 = ({ sel }) => (
  <div style={{ ...cardBase, border: `1px solid ${sel ? C.sBorder : C.div}`, background: sel ? C.sBg : C.white }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
      <p style={optTitle}>Option {OPTION_NO}</p>
      <PctLine />
    </div>
    <div style={{ margin: "8px 0 12px" }}>
      {STOPS.map((s, i) => <Row key={s.city} s={s} i={i} connector thumb={{ numbered: true }} accent={sel ? C.sText : C.p600} />)}
    </div>
    <SelectCta sel={sel} />
  </div>
);

const S7 = ({ sel }) => (
  <div style={{ ...cardBase, padding: 14, border: `1px solid ${sel ? C.sBorder : C.div}`, background: sel ? C.sBg : C.white }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
      <p style={{ ...optTitle, fontSize: 14.5 }}>Option {OPTION_NO}</p>
      <span style={{ fontSize: 11, fontWeight: 700, color: C.sub }}>{PCT}% chose this</span>
    </div>
    <div style={{ margin: "6px 0 10px" }}>
      {STOPS.map((s, i) => <Row key={s.city} s={s} i={i} pad={7} thumb={{ size: 34, radius: 9 }} />)}
    </div>
    <SelectCta sel={sel} mode="slim" />
  </div>
);

const S8 = ({ sel }) => (
  <div style={{ ...cardBase, border: `1px solid ${sel ? C.sBorder : C.div}` }}>
    <p style={{ margin: 0, fontSize: 19, fontWeight: 600, color: C.head, fontFamily: serif }}>Option {OPTION_NO}</p>
    <p style={{ margin: "4px 0 6px", fontSize: 12.5, color: C.sub, fontStyle: "italic", fontFamily: serif }}>Chosen by {PCT}% of Indian couples</p>
    <div style={{ height: 1, background: C.div, margin: "6px 0 2px" }} />
    <div style={{ margin: "0 0 12px" }}>
      {STOPS.map((s, i) => <Row key={s.city} s={s} i={i} divider serifName thumb={{ corner: false, radius: 6 }} />)}
    </div>
    <SelectCta sel={sel} mode="outline" />
  </div>
);

const S9 = ({ sel }) => (
  <div style={{ ...cardBase, padding: 0, overflow: "hidden", border: `1px solid ${sel ? C.sBorder : C.div}` }}>
    <div style={{ background: sel ? C.sText : C.head, padding: "12px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>Option {OPTION_NO}</p>
        <PctLine dark accent="rgba(255,255,255,0.85)" />
      </div>
    </div>
    <div style={{ padding: "4px 16px 16px" }}>
      <div style={{ margin: "0 0 12px" }}>
        {STOPS.map((s, i) => <Row key={s.city} s={s} i={i} />)}
      </div>
      <SelectCta sel={sel} />
    </div>
  </div>
);

const S10 = ({ sel }) => (
  <div style={{ ...cardBase, border: `1px solid ${sel ? C.sBorder : C.div}`, background: sel ? C.sBg : C.white }}>
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
      <span style={{ fontSize: 11.5, fontWeight: 800, color: "#fff", background: sel ? C.sText : C.head, borderRadius: 20, padding: "4px 11px" }}>Option {OPTION_NO}</span>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: C.p600, background: C.p100, borderRadius: 20, padding: "4px 10px" }}>{PCT}% chose this</span>
    </div>
    <div style={{ margin: "8px 0 12px" }}>
      {STOPS.map((s, i) => <Row key={s.city} s={s} i={i} />)}
    </div>
    <SelectCta sel={sel} />
  </div>
);

const STYLES = [
  { id: 1, name: "Wireframe, pink outline", note: "Pink border, corner play badges, stat under the title.", El: S1 },
  { id: 2, name: "Clean neutral", note: "Grey border, stat as a pink pill, row dividers, soft CTA.", El: S2 },
  { id: 3, name: "Green select", note: "Whole card turns green when selected, like the rest of the app.", El: S3 },
  { id: 4, name: "Floating card", note: "No border, soft shadow, round thumbnails.", El: S4 },
  { id: 5, name: "Number badge", note: "Option number in a filled circle next to the title.", El: S5 },
  { id: 6, name: "Numbered journey", note: "Stops numbered 1-2-3-4 and connected in order.", El: S6 },
  { id: 7, name: "Compact", note: "Tighter rows and smaller thumbnails.", El: S7 },
  { id: 8, name: "Editorial", note: "Serif type, thin rules, outline CTA.", El: S8 },
  { id: 9, name: "Dark header", note: "Option number and stat on a dark band, regions below.", El: S9 },
  { id: 10, name: "Chips", note: "Option number and stat as chips on top.", El: S10 },
];

// One style demo: tap anywhere on the card to flip Select / Selected.
function StyleDemo({ id, name, note, El }) {
  const [sel, setSel] = useState(false);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "0 0 8px 2px" }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", background: C.p600, borderRadius: 6, padding: "2px 7px" }}>Style {id}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.head }}>{name}</span>
      </div>
      <p style={{ margin: "0 0 10px 2px", fontSize: 11.5, color: C.sub }}>{note}</p>
      <div onClick={() => setSel(v => !v)}>
        <El sel={sel} />
      </div>
    </div>
  );
}

export default function RouteCardLab() {
  const nav = useNavigate();
  return (
    <div style={{ height: "100%", overflowY: "auto", background: C.bg }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 12px 4px" }}>
        <button onClick={() => nav(-1)} aria-label="Back" style={{ width: 36, height: 36, borderRadius: 12, border: "none", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }}>
          <ArrowLeft size={20} color={C.head} />
        </button>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.head, letterSpacing: "-0.4px" }}>Route card lab</h1>
      </div>
      <p style={{ margin: "0 16px 6px 20px", fontSize: 13, color: C.sub, lineHeight: 1.5 }}>
        Ten styles, same content. Tap a card to see its selected state. Pick a style number.
      </p>
      <div style={{ padding: "10px 16px 30px", display: "flex", flexDirection: "column", gap: 26 }}>
        {STYLES.map((s) => <StyleDemo key={s.id} {...s} />)}
      </div>
    </div>
  );
}

import { Sparkles, Heart, IndianRupee, ShieldCheck, Wand2 } from "lucide-react";
import { C, customerPhotos } from "../data";

// Review page only. Nothing is wired and the prototype is unchanged. Each
// variation is drawn at real size, in the slot it would occupy: directly under
// the three USPs, above the first content section.

const PAD = 18;

const BALI = customerPhotos.Bali || [];
const THAI = customerPhotos.Thailand || [];
const MALD = customerPhotos.Maldives || [];
const VIET = customerPhotos.Vietnam || [];

// Hand picked off a contact sheet of the whole library: both partners visible,
// clearly a couple, clearly somewhere.
const SHOTS = [
  { src: BALI[0], place: "Bali" },
  { src: MALD[6], place: "Maldives" },
  { src: THAI[0], place: "Thailand" },
  { src: VIET[7], place: "Vietnam" },
];

// A close, casual selfie, so it reads as something off their camera roll.
const OWN_PHOTO = BALI[11];
const PLAIN = { filter: "saturate(0.25) brightness(1.05)" };

// Same words everywhere, so the choice is about the design.
const T = {
  kicker: "NEW",
  title: "See yourselves there",
  sub: "One photo of you two. Five pictures of you both at the place you pick.",
  cta: "Add your photo",
  note: "*Images are AI generated",
};

// Deep berry: the brand pink pushed dark enough to carry white display type.
const DEEP = "linear-gradient(150deg, #2B0512 0%, #780C2F 48%, #C11049 100%)";
const GLOW = "radial-gradient(circle at 82% 8%, rgba(255,90,135,0.55) 0%, rgba(255,90,135,0) 58%)";
const BLUSH = `linear-gradient(155deg, #FFD9E1 0%, ${C.p100} 40%, #FFF6F8 100%)`;

// No black anywhere: brand pink at the top for white display type, running down
// to light pink where the solid coral button sits.
const PINK = "linear-gradient(158deg, #C11049 0%, #E31B53 20%, #FF6E96 48%, #FFC2D2 78%, #FFEEF2 100%)";
const PINK_GLOW = "radial-gradient(circle at 88% 4%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 52%)";

/* ── Shared ── */

function Usps() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, padding: `0 ${PAD}px`, marginBottom: 22 }}>
      {[{ I: Heart, t: "Couples only" }, { I: IndianRupee, t: "Transparent pricing" }, { I: ShieldCheck, t: "No tourist traps" }].map(({ I, t }) => (
        <div key={t} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <I size={14} color={C.p600} />
          <span style={{ fontSize: 11.5, fontWeight: 600, color: C.head, whiteSpace: "nowrap" }}>{t}</span>
        </div>
      ))}
    </div>
  );
}

function Chip({ dark }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 9.5, fontWeight: 800, letterSpacing: "1.1px",
      color: dark ? "#FFD9E1" : C.p600,
      background: dark ? "rgba(255,255,255,0.14)" : C.p100,
      border: dark ? "1px solid rgba(255,255,255,0.24)" : "none",
      borderRadius: 999, padding: "4px 9px",
    }}>
      <Sparkles size={10} color={dark ? "#FFD9E1" : C.p600} /> {T.kicker}
    </span>
  );
}

// One pill everywhere, so only the surround differs.
function Pill({ dark }) {
  return (
    <button style={{
      display: "flex", width: "100%", alignItems: "center", justifyContent: "center",
      gap: 8, minHeight: 48,
      background: dark ? "#fff" : C.p600, color: dark ? "#8A0E36" : "#fff",
      border: "none", borderRadius: 999, padding: "12px 24px",
      fontSize: 14.5, fontWeight: 800, fontFamily: "inherit", cursor: "pointer",
      boxShadow: dark ? "0 8px 24px rgba(0,0,0,0.3)" : "0 8px 22px rgba(227,27,83,0.32)",
    }}>
      <Wand2 size={16} color={dark ? "#8A0E36" : "#fff"} /> {T.cta}
    </button>
  );
}

function Note({ dark }) {
  return (
    <p style={{ fontSize: 10.5, fontStyle: "italic", color: dark ? "rgba(255,255,255,0.6)" : C.inact, margin: "10px 0 0", textAlign: "center" }}>
      {T.note}
    </p>
  );
}

// 9:16, the ratio the generated images come back in.
function Portrait({ src, place, w = 118, style, label = true }) {
  return (
    <div style={{ position: "relative", width: w, height: Math.round((w * 16) / 9), borderRadius: 14, overflow: "hidden", flexShrink: 0, background: "#2B0512", ...style }}>
      <img src={src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      {label && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 58%, rgba(0,0,0,0.7) 100%)" }} />
          <span style={{ position: "absolute", left: 9, bottom: 8, fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: ".2px", textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>{place}</span>
        </>
      )}
    </div>
  );
}

/* ── A. Spotlight ── */
function A() {
  return (
    <div style={{ padding: `0 ${PAD}px` }}>
      <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: DEEP, boxShadow: "0 16px 40px rgba(123,12,47,0.32)" }}>
        <div style={{ position: "absolute", inset: 0, background: GLOW }} />

        <div style={{ position: "relative", padding: "18px 18px 0" }}>
          <Chip dark />
          <h2 style={{ fontSize: 27, fontWeight: 900, color: "#fff", margin: "11px 0 0", letterSpacing: "-1px", lineHeight: "30px" }}>
            See yourselves<br />
            <span style={{ color: "#FFC2D2" }}>there</span> first
          </h2>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.78)", lineHeight: "18px", margin: "9px 0 0", maxWidth: 250 }}>
            {T.sub}
          </p>
        </div>

        {/* Prints spill past the panel's inner padding, so the block has depth. */}
        <div style={{ position: "relative", height: 218, marginTop: 12 }}>
          {[
            { s: SHOTS[2], rot: -9, left: 6, top: 12, z: 1 },
            { s: SHOTS[1], rot: 5, left: 112, top: 19, z: 2 },
            { s: SHOTS[0], rot: -2, left: 218, top: 0, z: 3 },
          ].map(({ s, rot, left, top, z }) => (
            <div key={s.place} style={{ position: "absolute", left, top, zIndex: z, transform: `rotate(${rot}deg)` }}>
              <Portrait {...s} w={112} style={{ border: "3px solid rgba(255,255,255,0.92)", boxShadow: "0 10px 26px rgba(0,0,0,0.45)" }} />
            </div>
          ))}
        </div>

        <div style={{ position: "relative", zIndex: 4, padding: "14px 18px 18px" }}>
          <Pill dark />
          <Note dark />
        </div>
      </div>
    </div>
  );
}

/* ── B. Poster band ── */
function B() {
  return (
    <div style={{ position: "relative", height: 310, overflow: "hidden" }}>
      {/* Four portraits, edge to edge, no gaps. The section is the image. */}
      {/* Three, not four: any narrower and the crop starts cutting faces. */}
      <div style={{ position: "absolute", inset: 0, display: "flex" }}>
        {SHOTS.slice(0, 3).map((s) => (
          <div key={s.place} style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <img src={s.src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(43,5,18,0.62) 0%, rgba(43,5,18,0.2) 22%, rgba(43,5,18,0.92) 62%, #2B0512 100%)" }} />

      <div style={{ position: "absolute", left: PAD, right: PAD, bottom: 18 }}>
        <Chip dark />
        <h2 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "10px 0 0", letterSpacing: "-0.9px", lineHeight: "29px", textShadow: "0 2px 18px rgba(0,0,0,0.5)" }}>
          {T.title}
        </h2>
        <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.85)", lineHeight: "18px", margin: "7px 0 13px" }}>{T.sub}</p>
        <Pill dark />
        <Note dark />
      </div>
    </div>
  );
}

/* ── C. Blush poster ── */
function CVar() {
  return (
    <div style={{ padding: `0 ${PAD}px` }}>
      <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: BLUSH, border: `1px solid ${C.p300}66`, boxShadow: "0 12px 32px rgba(227,27,83,0.14)" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 170, height: 170, borderRadius: "50%", background: "radial-gradient(circle, rgba(227,27,83,0.22) 0%, rgba(227,27,83,0) 70%)" }} />

        <div style={{ position: "relative", padding: "18px 18px 0", textAlign: "center" }}>
          <Chip />
          <h2 style={{ fontSize: 26, fontWeight: 900, color: C.head, margin: "11px 0 0", letterSpacing: "-0.9px", lineHeight: "29px" }}>
            See yourselves <span style={{ color: C.p600 }}>there</span>
          </h2>
          <p style={{ fontSize: 12.5, color: C.sub, lineHeight: "18px", margin: "8px auto 0", maxWidth: 262 }}>{T.sub}</p>
        </div>

        {/* Fanned deck, biggest in front. */}
        <div style={{ position: "relative", height: 240, marginTop: 12 }}>
          <div style={{ position: "absolute", left: "50%", top: 24, transform: "translateX(-50%) rotate(-11deg) translateX(-86px)" }}>
            <Portrait {...SHOTS[2]} w={104} label={false} style={{ border: "3px solid #fff", boxShadow: "0 8px 22px rgba(0,0,0,0.18)" }} />
          </div>
          <div style={{ position: "absolute", left: "50%", top: 24, transform: "translateX(-50%) rotate(11deg) translateX(86px)" }}>
            <Portrait {...SHOTS[1]} w={104} label={false} style={{ border: "3px solid #fff", boxShadow: "0 8px 22px rgba(0,0,0,0.18)" }} />
          </div>
          <div style={{ position: "absolute", left: "50%", top: 4, transform: "translateX(-50%)" }}>
            <Portrait {...SHOTS[0]} w={124} style={{ border: "3px solid #fff", boxShadow: "0 14px 34px rgba(0,0,0,0.26)" }} />
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 4, padding: "0 18px 18px" }}>
          <Pill />
          <Note />
        </div>
      </div>
    </div>
  );
}

/* ── D. Panel with a bleeding rail ── */
function D() {
  return (
    <div style={{ position: "relative", background: DEEP, padding: "18px 0", borderRadius: 24, margin: `0 ${PAD}px`, overflow: "hidden", boxShadow: "0 16px 40px rgba(123,12,47,0.3)" }}>
      <div style={{ position: "absolute", inset: 0, background: GLOW }} />

      <div style={{ position: "relative", padding: "0 16px" }}>
        <Chip dark />
        <h2 style={{ fontSize: 25, fontWeight: 900, color: "#fff", margin: "10px 0 0", letterSpacing: "-0.9px", lineHeight: "28px" }}>
          {T.title}
        </h2>
        <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.78)", lineHeight: "18px", margin: "7px 0 0" }}>{T.sub}</p>
      </div>

      {/* Runs off the right edge, so it reads as scrollable with no hint. */}
      <div className="hide-scrollbar" style={{ position: "relative", display: "flex", gap: 9, overflowX: "auto", padding: "14px 16px 0" }}>
        {SHOTS.map((s) => (
          <Portrait key={s.place} {...s} w={116} style={{ border: "2px solid rgba(255,255,255,0.28)" }} />
        ))}
      </div>

      <div style={{ position: "relative", padding: "14px 16px 0" }}>
        <Pill dark />
        <Note dark />
      </div>
    </div>
  );
}

/* ── E. Before and after showpiece ── */
function E() {
  return (
    <div style={{ padding: `0 ${PAD}px` }}>
      <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: DEEP, boxShadow: "0 16px 40px rgba(123,12,47,0.3)" }}>
        <div style={{ position: "absolute", inset: 0, background: GLOW }} />

        <div style={{ position: "relative", padding: "18px 18px 14px", textAlign: "center" }}>
          <Chip dark />
          <h2 style={{ fontSize: 27, fontWeight: 900, color: "#fff", margin: "11px 0 0", letterSpacing: "-1px", lineHeight: "30px" }}>
            Your photo,<br /><span style={{ color: "#FFC2D2" }}>five places</span>
          </h2>
        </div>

        {/* The change plays out, so the AI part needs no explaining. */}
        <div style={{ position: "relative", margin: "0 16px", height: 214, borderRadius: 16, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
          <img src={OWN_PHOTO} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...PLAIN }} />
          <img className="hero-wipe" src={SHOTS[0].src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div className="hero-wipe-line" style={{ position: "absolute", top: 0, bottom: 0, width: 2, marginLeft: -1, background: "rgba(255,255,255,0.95)", boxShadow: "0 0 18px rgba(255,255,255,0.7)" }} />
        </div>

        <div style={{ position: "relative", padding: "14px 16px 18px" }}>
          <Pill dark />
          <Note dark />
        </div>
      </div>
    </div>
  );
}

/* ── F. Pink gradient ── */
function F() {
  return (
    <div style={{ position: "relative", background: PINK, padding: "18px 0", borderRadius: 24, margin: `0 ${PAD}px`, overflow: "hidden", boxShadow: "0 16px 40px rgba(227,27,83,0.28)" }}>
      <div style={{ position: "absolute", inset: 0, background: PINK_GLOW }} />

      <div style={{ position: "relative", padding: "0 16px" }}>
        <Chip dark />
        <h2 style={{ fontSize: 25, fontWeight: 900, color: "#fff", margin: "10px 0 0", letterSpacing: "-0.9px", lineHeight: "28px", textShadow: "0 1px 12px rgba(140,10,50,0.22)" }}>
          {T.title}
        </h2>
        <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.9)", lineHeight: "18px", margin: "7px 0 0" }}>{T.sub}</p>
      </div>

      {/* Runs off the right edge, so it reads as scrollable with no hint. */}
      <div className="hide-scrollbar" style={{ position: "relative", display: "flex", gap: 9, overflowX: "auto", padding: "14px 16px 0" }}>
        {SHOTS.map((s) => (
          <Portrait key={s.place} {...s} w={116} style={{ border: "2.5px solid rgba(255,255,255,0.85)", boxShadow: "0 6px 18px rgba(140,10,50,0.22)" }} />
        ))}
      </div>

      {/* The panel is pale down here, so the button goes solid coral. */}
      <div style={{ position: "relative", padding: "14px 16px 0" }}>
        <Pill />
        <p style={{ fontSize: 10.5, fontStyle: "italic", color: "#8A0E36", opacity: 0.66, textAlign: "center", margin: "10px 0 0" }}>
          {T.note}
        </p>
      </div>
    </div>
  );
}

/* ── Page ── */

const VARIATIONS = [
  ["A", "Spotlight", "Deep berry panel, display type, three prints tilted across the middle. The most designed of the five and the closest to the references you sent. Tallest too.", A],
  ["B", "Poster band", "Four portraits edge to edge become the section itself, text sitting on a deep fade. No card, no margins, so it interrupts the scroll hardest.", B],
  ["C", "Blush poster", "The same energy in the light direction: warm blush, a fanned deck, coral pill. Keeps the home screen bright, which the rest of the app is.", CVar],
  ["D", "Panel with a bleeding rail", "District's shape. Title and copy in the panel, a rail of 9:16 cards running off the right edge so it reads as scrollable with no hint needed. Most compact of the dark ones.", D],
  ["E", "Your photo, five places", "Leads with the transformation instead of the results. The sweep is the hook and the headline carries the bargain. Shows one place, not four.", E],
  ["F", "Pink gradient", "D's shape with no black in it: brand pink at the top for the white headline, running down to light pink where a solid coral button sits. Same layout as D on purpose, so the colour is the only thing you are judging.", F],
];

function Frame({ code, title, blurb, children }) {
  return (
    <div style={{ marginBottom: 34 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, padding: `0 ${PAD}px` }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".5px", color: C.p600, background: C.p100, borderRadius: 6, padding: "3px 7px" }}>{code}</span>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.head, margin: 0 }}>{title}</h3>
      </div>
      <p style={{ fontSize: 12.5, color: C.sub, lineHeight: "18px", margin: `6px ${PAD}px 12px` }}>{blurb}</p>

      {/* Drawn in place: USPs above, the next section's heading below. */}
      <div style={{ background: C.white, borderTop: `1px solid ${C.div}`, borderBottom: `1px solid ${C.div}`, padding: "18px 0 0" }}>
        <Usps />
        {children}
        <div style={{ padding: `26px ${PAD}px 20px` }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.inact, margin: 0 }}>Sep to Nov</h2>
          <p style={{ fontSize: 13, color: C.inact, margin: "4px 0 0" }}>Best of your six for these months.</p>
        </div>
      </div>
    </div>
  );
}

export default function AISectionOptions() {
  return (
    <div className="hide-scrollbar" style={{ height: "100%", overflowY: "auto", background: C.white }}>
      <div style={{ padding: `18px ${PAD}px 18px` }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.head, margin: 0, letterSpacing: "-0.5px" }}>
          The AI photos section
        </h1>
        <p style={{ fontSize: 13, color: C.sub, lineHeight: "19px", margin: "8px 0 12px" }}>
          Six designs, each shown where it would sit: under the three USPs,
          above "Sep to Nov". Same words in all six so the choice is about the
          design. The hero is already back to marketing only.
        </p>
        <div style={{ background: C.wBg || "#FFFAEB", border: "1px solid #FEDF89", borderRadius: 12, padding: "11px 13px" }}>
          <p style={{ fontSize: 12, color: C.sub, lineHeight: "17px", margin: 0 }}>
            <b style={{ color: C.wText || "#B54708" }}>Worth knowing.</b> The
            build brief for this feature says never put a block on a dark
            background. A, B, D and E break that on purpose, because the
            references you sent all earn their attention with a rich panel. C
            and F hold the rule: F has the same loudness with no black in it.
          </p>
        </div>
      </div>

      {VARIATIONS.map(([code, title, blurb, Body]) => (
        <Frame key={code} code={code} title={title} blurb={blurb}>
          <Body />
        </Frame>
      ))}

      <div style={{ padding: `0 ${PAD}px` }}>
        <div style={{ background: C.p100, borderRadius: 14, padding: "14px 15px" }}>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: C.head, margin: 0 }}>What I would pick</p>
          <p style={{ fontSize: 12.5, color: C.sub, lineHeight: "18px", margin: "5px 0 0" }}>
            F, now that it exists. It is D's shape, so it keeps the display type
            and the rail of four real results in their true 9:16 shape, but it
            is warm brand pink the whole way down instead of near black. That
            suits a couples product better than a dark panel does, and it is the
            only loud one that does not break the no-dark-blocks rule. Take D if
            you want the section to feel like a separate, premium thing rather
            than part of the app. A is the prettiest if the extra height is fine.
          </p>
        </div>
      </div>

      <div style={{ height: 60 }} />
    </div>
  );
}

import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { C } from "../data";
import { destMeta } from "../data/buildData";
import { routeOptions } from "../data/routeOptions";

// ─── Five ways to show a route: the lab ───
//
// Same four routes, same data, five card designs, so the choice is about the
// design and not about which one got the nicer example.
//
// What every one of them has to answer:
//
//   which one am I on now      without a red tab, which read as a warning
//                              rather than a statement
//   which one have I picked    different question, different answer, and
//                              the two have to be tellable apart
//   what is this route good at  labels, in colours that are not the brand's
//                              pink, because pink on a card means "act on
//                              this" everywhere else in the app
//   where does it go           arrows dark enough to be seen, which the
//                              old ones were not
//
// ?dest=Bali and ?nights=9 to try other destinations and lengths.
// Live at: /route-style-lab

// ─── The label palette, with the pink taken out ───
// Pink is the app's "press me". On a label it says a route is urgent, which
// no route is. These are the four quiet tones plus slate for the ones that
// are statements of fact rather than recommendations.
const TONE = {
  green: { bg: "#ECFDF3", fg: "#027A48", br: "#A6F4C5", dot: "#17B26A" },
  blue: { bg: "#EFF4FF", fg: "#1849A9", br: "#B2CCFF", dot: "#2E90FA" },
  amber: { bg: "#FFFAEB", fg: "#B54708", br: "#FEDF89", dot: "#F79009" },
  purple: { bg: "#F4F3FF", fg: "#5925DC", br: "#D9D6FE", dot: "#7A5AF8" },
  slate: { bg: "#F2F4F7", fg: "#475467", br: "#D0D5DD", dot: "#98A2B3" },
};

// Which label gets which tone. The three that used to be pink are moved out:
// the recommendation goes purple, the booking counts go slate, because they
// are facts about other people rather than advice about this trip.
const KEY_TONE = {
  pick: "purple", value: "green", relaxed: "blue", offbeat: "purple",
  wide: "amber", sold: "slate", trending: "amber", popular: "blue",
  classic: "amber", easy: "green",
};
const toneOf = (tag) => TONE[KEY_TONE[tag.key]] || TONE.slate;

// Dark enough to see. The old one was #D5D7DA, which on a white card is a
// suggestion of an arrow rather than an arrow.
const Arrow = () => (
  <ArrowRight
    size={11}
    color="#667085"
    strokeWidth={2.5}
    // inline-block on purpose: the app sets svg { display: block } globally,
    // which turns every arrow into its own line.
    style={{ display: "inline-block", margin: "0 5px", verticalAlign: "middle" }}
  />
);

function Route({ opt, size = 12.5 }) {
  return (
    <p style={{
      flex: 1, minWidth: 0, margin: 0,
      fontSize: size, fontWeight: 600, color: C.head, lineHeight: "17px", letterSpacing: "-0.1px",
      overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
    }}>
      {opt.route.map((r, i) => (
        <span key={r.city} style={{ whiteSpace: "nowrap" }}>
          {i > 0 && <Arrow />}
          {r.city}
          <span style={{ color: C.sub, fontWeight: 500 }}> {r.n}N</span>
        </span>
      ))}
    </p>
  );
}

function Tick({ on }) {
  return (
    <span aria-hidden style={{
      width: 18, height: 18, borderRadius: "50%", flexShrink: 0, marginTop: 1,
      display: "grid", placeItems: "center", boxSizing: "border-box",
      background: on ? C.p600 : C.white,
      border: on ? "none" : `1.5px solid ${C.icon}`,
      transition: "background .15s, border-color .15s",
    }}>
      {on && <Check size={11} strokeWidth={3.6} color="#fff" />}
    </span>
  );
}

// The shell every card shares: white, one pixel of edge, and the picked one
// ringed in pink from the inside so choosing it does not make it taller.
const shell = (on) => ({
  display: "block", width: "100%", textAlign: "left", cursor: "pointer",
  borderRadius: 14, fontFamily: "inherit", background: C.white,
  border: `1px solid ${on ? C.p600 : C.div}`,
  boxShadow: on ? `inset 0 0 0 1px ${C.p600}` : "none",
  transition: "border-color .15s, box-shadow .15s",
});

// ─── 1. Rail ───
// A bar down the left edge for the route you are on. It marks the card
// without taking a line, and it is the one mark that cannot be confused
// with a label, because nothing else on the card is a shape like it.
function CardRail({ opt, on, current, pick }) {
  return (
    <button type="button" onClick={pick} aria-pressed={on}
      style={{ ...shell(on), padding: 0, overflow: "hidden", display: "flex" }}>
      <span style={{ width: 3, flexShrink: 0, background: current ? TONE.slate.fg : "transparent" }} />
      <span style={{ flex: 1, minWidth: 0, display: "block", padding: "9px 11px 9px 10px" }}>
        <span style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <Route opt={opt} />
          <Tick on={on} />
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 7, flexWrap: "wrap" }}>
          {current && (
            <span style={{ fontSize: 10, fontWeight: 800, color: C.sub, letterSpacing: "0.5px", textTransform: "uppercase" }}>
              On this now
            </span>
          )}
          {opt.tags.slice(0, 2).map((t) => {
            const k = toneOf(t);
            return (
              <span key={t.key} style={{
                padding: "2px 8px", borderRadius: 999, border: `1px solid ${k.br}`,
                color: k.fg, fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap",
              }}>{t.text}</span>
            );
          })}
        </span>
      </span>
    </button>
  );
}

// ─── 2. Kicker ───
// A line of small caps over the route, the way a section heading sits over
// a section. Costs eleven pixels on one card in the list and nothing on the
// rest, and it says the thing in words instead of asking anyone to learn
// what a colour means.
function CardKicker({ opt, on, current, pick }) {
  return (
    <button type="button" onClick={pick} aria-pressed={on}
      style={{ ...shell(on), padding: "9px 11px" }}>
      {current && (
        <span style={{
          display: "block", fontSize: 9.5, fontWeight: 800, color: C.sub,
          letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 3,
        }}>Your current route</span>
      )}
      <span style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <Route opt={opt} />
        <Tick on={on} />
      </span>
      {/* Labels as text with a coloured dot, not as pills. A pill is a
          container and these are adjectives: the dot carries the colour and
          the row costs half the height. */}
      <span style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
        {opt.tags.slice(0, 2).map((t) => {
          const k = toneOf(t);
          return (
            <span key={t.key} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: k.fg }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: k.dot }} />
              {t.text}
            </span>
          );
        })}
      </span>
    </button>
  );
}

// ─── 3. One line ───
// The route and its first label on the same row. The shortest card of the
// five by a long way, which means more routes on screen at once, and the
// list becomes something you scan rather than scroll.
function CardOneLine({ opt, on, current, pick }) {
  const t = opt.tags[0];
  const k = t ? toneOf(t) : null;
  return (
    <button type="button" onClick={pick} aria-pressed={on}
      style={{ ...shell(on), padding: "10px 11px", display: "flex", alignItems: "center", gap: 9 }}>
      <Tick on={on} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <Route opt={opt} size={12} />
        {current && (
          <span style={{ display: "block", fontSize: 10.5, fontWeight: 700, color: C.sub, marginTop: 2 }}>
            Your current route
          </span>
        )}
      </span>
      {t && (
        <span style={{
          flexShrink: 0, padding: "3px 9px", borderRadius: 6, background: k.bg,
          color: k.fg, fontSize: 10.5, fontWeight: 800, whiteSpace: "nowrap",
        }}>{t.text}</span>
      )}
    </button>
  );
}

// ─── 4. Tinted ───
// The current route sits on a grey ground with no badge at all. Nothing is
// added to the card: it is the one that looks different, and the words
// under it say why. Quietest of the five.
function CardTint({ opt, on, current, pick }) {
  return (
    <button type="button" onClick={pick} aria-pressed={on}
      style={{
        ...shell(on), padding: "9px 11px",
        background: current ? "#F8F9FB" : C.white,
        border: `1px solid ${current && !on ? "#D0D5DD" : on ? C.p600 : C.div}`,
      }}>
      <span style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <Route opt={opt} />
        <Tick on={on} />
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 7, flexWrap: "wrap" }}>
        {current && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 999,
            background: C.white, border: `1px solid ${TONE.slate.br}`, color: TONE.slate.fg,
            fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap",
          }}>
            <Check size={10} strokeWidth={3} color={TONE.slate.fg} /> Current route
          </span>
        )}
        {opt.tags.slice(0, current ? 1 : 2).map((t) => {
          const k = toneOf(t);
          return (
            <span key={t.key} style={{
              padding: "2px 8px", borderRadius: 999, background: k.bg,
              color: k.fg, fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap",
            }}>{t.text}</span>
          );
        })}
      </span>
    </button>
  );
}

// ─── 5. Lead chip ───
// "Current" sits at the front of the route line, in the reading order, so
// it is read as part of the sentence rather than found afterwards in a row
// of labels. The labels then only ever carry recommendations.
function CardLead({ opt, on, current, pick }) {
  return (
    <button type="button" onClick={pick} aria-pressed={on}
      style={{ ...shell(on), padding: "9px 11px" }}>
      <span style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <span style={{ flex: 1, minWidth: 0 }}>
          {current && (
            <span style={{
              display: "inline-block", marginRight: 7, padding: "1px 7px", borderRadius: 5,
              background: TONE.slate.fg, color: "#fff", fontSize: 9.5, fontWeight: 800,
              letterSpacing: "0.4px", textTransform: "uppercase", verticalAlign: "2px",
            }}>Current</span>
          )}
          <span style={{ display: "inline" }}>
            {opt.route.map((r, i) => (
              <span key={r.city} style={{ whiteSpace: "nowrap", fontSize: 12.5, fontWeight: 600, color: C.head, lineHeight: "19px" }}>
                {i > 0 && <Arrow />}
                {r.city}
                <span style={{ color: C.sub, fontWeight: 500 }}> {r.n}N</span>
              </span>
            ))}
          </span>
        </span>
        <Tick on={on} />
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 7, flexWrap: "wrap" }}>
        {opt.tags.slice(0, 2).map((t) => {
          const k = toneOf(t);
          return (
            <span key={t.key} style={{
              padding: "2px 8px", borderRadius: 5, background: k.bg,
              color: k.fg, fontSize: 10.5, fontWeight: 800, whiteSpace: "nowrap",
            }}>{t.text}</span>
          );
        })}
      </span>
    </button>
  );
}

const VERSIONS = [
  { n: 1, name: "Rail", note: "A bar down the left edge marks the route you are on. Outline labels.", Card: CardRail },
  { n: 2, name: "Kicker", note: "Small caps over the route. Labels as coloured dots, not pills.", Card: CardKicker },
  { n: 3, name: "One line", note: "Route and label on the same row. The most routes on screen.", Card: CardOneLine },
  { n: 4, name: "Tinted", note: "The current route sits on a grey ground, with a quiet outlined chip.", Card: CardTint },
  { n: 5, name: "Lead chip", note: "Current reads at the front of the route, in the sentence.", Card: CardLead },
];

export default function RouteStyleLab() {
  const [params] = useSearchParams();
  const dest = params.get("dest") || "Vietnam";
  const nights = Number(params.get("nights")) || destMeta[dest]?.defaultNights || 7;
  const options = useMemo(() => routeOptions(dest, nights).slice(0, 4), [dest, nights]);
  const currentId = options[0]?.id;
  const [picked, setPicked] = useState({});

  return (
    <div style={{ height: "100%", overflowY: "auto", background: C.white }}>
      <div style={{ padding: "16px 16px 10px" }}>
        <h1 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: C.head, letterSpacing: "-0.3px" }}>
          Five ways to show a route
        </h1>
        <p style={{ margin: "5px 0 0", fontSize: 12.5, color: C.sub, lineHeight: "18px" }}>
          {dest}, {nights} nights. The same four routes in each. Tap to pick one and see how
          the chosen card and the current card tell themselves apart.
        </p>
      </div>

      {VERSIONS.map(({ n, name, note, Card }) => (
        <section key={n} style={{ padding: "14px 16px 18px", borderTop: `1px solid ${C.div}` }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: C.p600, letterSpacing: "0.6px", textTransform: "uppercase" }}>
            Version {n}
          </p>
          <p style={{ margin: "3px 0 2px", fontSize: 15, fontWeight: 700, color: C.head }}>{name}</p>
          <p style={{ margin: "0 0 11px", fontSize: 12, color: C.sub, lineHeight: "17px" }}>{note}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {options.map((opt) => (
              <Card
                key={opt.id}
                opt={opt}
                current={opt.id === currentId}
                on={(picked[n] || currentId) === opt.id}
                pick={() => setPicked((p) => ({ ...p, [n]: opt.id }))}
              />
            ))}
          </div>
        </section>
      ))}

      <div style={{ height: 40 }} />
    </div>
  );
}

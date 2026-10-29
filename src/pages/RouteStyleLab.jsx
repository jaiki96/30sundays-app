import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { C } from "../data";
import { destMeta } from "../data/buildData";
import { routeOptions } from "../data/routeOptions";

// ─── Marking the route you are on: the lab ───
//
// The card is settled: route, tick, chips. What is not settled is how the
// one you are already travelling says so. It has been a filled pink tab
// (read as a warning), grey small caps (easy to miss on a list of nine) and
// a filled slate chip. Five formats here, same three routes under each, so
// the comparison is about the mark and not about the route it landed on.
//
// The question each one answers: you have opened a list of nine routes to
// find a better one. Which of these tells you fastest which one you are
// comparing against, and which of them costs the least room to do it?
//
// ?dest=Bali and ?nights=9 to try other destinations and lengths.
// Live at: /route-style-lab

const TONE = {
  green: { bg: "#ECFDF3", fg: "#027A48" },
  blue: { bg: "#EFF4FF", fg: "#1849A9" },
  amber: { bg: "#FFFAEB", fg: "#B54708" },
  purple: { bg: "#F4F3FF", fg: "#5925DC" },
  slate: { bg: "#F2F4F7", fg: "#475467" },
};
const KEY_TONE = {
  pick: "purple", value: "green", relaxed: "blue", offbeat: "purple",
  wide: "amber", sold: "slate", trending: "amber", popular: "blue",
  classic: "amber", easy: "green",
};

const SLATE = "#344054";

function Tag({ tag }) {
  const t = TONE[KEY_TONE[tag.key]] || TONE.slate;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: 6,
      background: t.bg, color: t.fg, fontSize: 10.5, fontWeight: 800,
      letterSpacing: "0.2px", whiteSpace: "nowrap",
    }}>{tag.text}</span>
  );
}

const Arrow = () => (
  <ArrowRight size={11} color="#667085" strokeWidth={2.5}
    style={{ display: "inline-block", margin: "0 5px", verticalAlign: "middle" }} />
);

function Route({ opt, lead }) {
  return (
    <p style={{
      flex: 1, minWidth: 0, margin: 0,
      fontSize: 12.5, fontWeight: 600, color: C.head, lineHeight: "17px", letterSpacing: "-0.1px",
      maxHeight: 34, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
    }}>
      {lead}
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
    }}>
      {on && <Check size={11} strokeWidth={3.6} color="#fff" />}
    </span>
  );
}

const shell = (on) => ({
  display: "block", width: "100%", textAlign: "left", cursor: "pointer",
  borderRadius: 14, fontFamily: "inherit", padding: "9px 11px",
  background: on ? "#FFF6F8" : C.white,
  border: `1px solid ${on ? C.p600 : C.div}`,
  boxShadow: on ? `inset 0 0 0 1px ${C.p600}` : "0 1px 3px rgba(24,29,39,0.05)",
});

const tags = (opt) => (
  <span style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
    {opt.tags.slice(0, 2).map((t) => <Tag key={t.key} tag={t} />)}
  </span>
);

// ─── A. Chip above ───
// What is live now. The mark gets a line of its own above the route, which
// is the clearest place to put it and the most expensive.
function ChipAbove({ opt, on, current, pick }) {
  return (
    <button type="button" onClick={pick} aria-pressed={on} style={shell(on)}>
      {current && (
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 5,
          padding: "2px 8px 2px 6px", borderRadius: 5, background: SLATE, color: "#fff",
          fontSize: 9.5, fontWeight: 800, letterSpacing: "0.6px", textTransform: "uppercase",
        }}>
          <Check size={10} strokeWidth={3.4} color="#fff" /> Your current route
        </span>
      )}
      <span style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <Route opt={opt} />
        <Tick on={on} />
      </span>
      {tags(opt)}
    </button>
  );
}

// ─── B. Beside the tick ───
// The mark moves to the top right, stacked over the tick, where there is
// already room. Costs no line at all, and sits where the eye ends up after
// reading the route.
function BesideTick({ opt, on, current, pick }) {
  return (
    <button type="button" onClick={pick} aria-pressed={on} style={shell(on)}>
      <span style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <Route opt={opt} />
        <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
          <Tick on={on} />
          {current && (
            <span style={{
              fontSize: 9, fontWeight: 800, color: SLATE,
              letterSpacing: "0.5px", textTransform: "uppercase", whiteSpace: "nowrap",
            }}>On this now</span>
          )}
        </span>
      </span>
      {tags(opt)}
    </button>
  );
}

// ─── C. Its own section ───
// The current route is lifted out of the list and given a heading, and the
// alternatives get a heading of their own. Nothing is marked, because
// nothing needs to be: where a card sits says what it is. Answers "always
// at the top" by making it structurally impossible for it not to be.
function Sectioned({ opt, on, current, pick }) {
  return (
    <button type="button" onClick={pick} aria-pressed={on} style={shell(on)}>
      <span style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <Route opt={opt} />
        <Tick on={on} />
      </span>
      {(current || !!opt.tags.length) && tags(opt)}
    </button>
  );
}

// ─── D. In the sentence ───
// "Current" reads at the front of the route itself, so it is part of what
// the line says rather than a thing found afterwards. Costs nothing but the
// width of the word.
function InSentence({ opt, on, current, pick }) {
  return (
    <button type="button" onClick={pick} aria-pressed={on} style={shell(on)}>
      <span style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <Route
          opt={opt}
          lead={current && (
            <span style={{
              display: "inline-block", marginRight: 7, padding: "1px 6px", borderRadius: 4,
              background: SLATE, color: "#fff", fontSize: 9, fontWeight: 800,
              letterSpacing: "0.4px", textTransform: "uppercase", verticalAlign: "2px",
            }}>Current</span>
          )}
        />
        <Tick on={on} />
      </span>
      {tags(opt)}
    </button>
  );
}

// ─── E. A chip among chips ───
// The mark joins the label row as the first chip in it, in slate so it is
// plainly a different kind of thing from the recommendations beside it. No
// new line, and the card has exactly one row of chips however it is marked.
function AmongChips({ opt, on, current, pick }) {
  return (
    <button type="button" onClick={pick} aria-pressed={on} style={shell(on)}>
      <span style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <Route opt={opt} />
        <Tick on={on} />
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
        {current && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px 3px 7px",
            borderRadius: 6, background: SLATE, color: "#fff", fontSize: 10.5, fontWeight: 800,
            letterSpacing: "0.2px", whiteSpace: "nowrap",
          }}>
            <Check size={10} strokeWidth={3.4} color="#fff" /> Current
          </span>
        )}
        {opt.tags.slice(0, current ? 1 : 2).map((t) => <Tag key={t.key} tag={t} />)}
      </span>
    </button>
  );
}

const VERSIONS = [
  { n: "A", name: "Chip above", note: "What is live now. Clearest, and costs a line of its own.", Card: ChipAbove },
  { n: "B", name: "Beside the tick", note: "Top right, under the tick. Costs no line.", Card: BesideTick },
  { n: "C", name: "Its own section", note: "Lifted out under a heading, with the rest under theirs. Nothing to mark.", Card: Sectioned, sectioned: true },
  { n: "D", name: "In the sentence", note: "Reads at the front of the route, as part of the line.", Card: InSentence },
  { n: "E", name: "A chip among chips", note: "First chip in the label row, slate so it is a different kind of thing.", Card: AmongChips },
];

const Heading = ({ children }) => (
  <p style={{
    margin: "0 0 7px 2px", fontSize: 10.5, fontWeight: 800, color: C.sub,
    letterSpacing: "0.6px", textTransform: "uppercase",
  }}>{children}</p>
);

export default function RouteStyleLab() {
  const [params] = useSearchParams();
  const dest = params.get("dest") || "Vietnam";
  const nights = Number(params.get("nights")) || destMeta[dest]?.defaultNights || 7;
  const options = useMemo(() => routeOptions(dest, nights).slice(0, 3), [dest, nights]);
  const currentId = options[0]?.id;
  const [picked, setPicked] = useState({});

  return (
    <div style={{ height: "100%", overflowY: "auto", background: C.white }}>
      <div style={{ padding: "16px 16px 10px" }}>
        <h1 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: C.head, letterSpacing: "-0.3px" }}>
          Marking the route you are on
        </h1>
        <p style={{ margin: "5px 0 0", fontSize: 12.5, color: C.sub, lineHeight: "18px" }}>
          {dest}, {nights} nights. Same three routes under each, the first one being the
          one you are travelling. Tap to pick a different one and watch the two marks,
          current and picked, stay apart.
        </p>
      </div>

      {VERSIONS.map(({ n, name, note, Card, sectioned }) => {
        const cards = options.map((opt) => (
          <Card
            key={opt.id}
            opt={opt}
            current={opt.id === currentId}
            on={(picked[n] || currentId) === opt.id}
            pick={() => setPicked((p) => ({ ...p, [n]: opt.id }))}
          />
        ));
        return (
          <section key={n} style={{ padding: "14px 16px 18px", borderTop: `1px solid ${C.div}` }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: C.p600, letterSpacing: "0.6px", textTransform: "uppercase" }}>
              Option {n}
            </p>
            <p style={{ margin: "3px 0 2px", fontSize: 15, fontWeight: 700, color: C.head }}>{name}</p>
            <p style={{ margin: "0 0 11px", fontSize: 12, color: C.sub, lineHeight: "17px" }}>{note}</p>
            {sectioned ? (
              <>
                <Heading>The route you have now</Heading>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>{cards[0]}</div>
                <div style={{ height: 1, background: C.div, margin: "14px 0 12px" }} />
                <Heading>{options.length - 1} other routes</Heading>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>{cards.slice(1)}</div>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>{cards}</div>
            )}
          </section>
        );
      })}

      <div style={{ height: 40 }} />
    </div>
  );
}

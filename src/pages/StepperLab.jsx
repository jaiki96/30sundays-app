import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { C } from "../data";

// ─── Ways to show where you are in the wizard ───
//
// The header has one job: say what you have answered so far, let you go back
// to any of it, and take as little of the screen as it can while doing both.
// Several readings of that, on the same trip, so they can be compared rather
// than described. A to D are four different shapes; A1 to A3 are the shape we
// picked, A, with its rule replaced by a tick three different ways.
//
// Nothing here is wired to the wizard. It is a showroom: the point is the
// shape, not the behaviour.

const STEPS = [
  { label: "Destination", value: "Vietnam" },
  { label: "Travelers", value: "2 adults" },
  { label: "Travel dates", value: "10 Nov - 17 Nov" },
  { label: "Cities", value: "3 cities" },
  { label: "Activities", value: null },
];

const AT = 4; // the stage you are on

function Back({ size = 20 }) {
  return (
    <span style={{
      width: 34, height: 34, borderRadius: "50%", border: `1px solid ${C.div}`,
      background: C.white, display: "grid", placeItems: "center", flexShrink: 0,
    }}>
      <ArrowLeft size={size - 2} color={C.head} />
    </span>
  );
}

// ─── A · the one in the app now ───
// Back on the left, the stages in a row beside it, each a rule and a line of
// text. The row scrolls sideways when the answers get long.
function VariantA() {
  return (
    <div style={{ padding: "12px 14px 10px", borderBottom: `1px solid ${C.div}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Back />
        <div className="hide-scrollbar" style={{ flex: 1, display: "flex", gap: 10, minWidth: 0, overflowX: "auto" }}>
          {STEPS.map((s, i) => (
            <div key={s.label} style={{ flexShrink: 0 }}>
              <div style={{ height: 4, borderRadius: 4, background: i <= AT ? C.p600 : C.div }} />
              <p style={{
                margin: "6px 0 0", fontSize: 11.5, whiteSpace: "nowrap",
                fontWeight: s.value ? 700 : 500,
                color: i === AT ? C.p600 : s.value ? C.head : C.inact,
              }}>{s.value || s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── B · back on its own line, the trip under it ───
// The back arrow and the stage you are on share the top line, and the answers
// run underneath as one sentence you can tap a piece of. Two lines, but the
// second one reads like a sentence rather than a row of columns.
function VariantB() {
  const done = STEPS.filter((s) => s.value);
  return (
    <div style={{ padding: "10px 14px 11px", borderBottom: `1px solid ${C.div}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Back />
        <p style={{ flex: 1, minWidth: 0, margin: 0, fontSize: 14.5, fontWeight: 700, color: C.head }}>
          {STEPS[AT].label}
        </p>
        <span style={{ flexShrink: 0, fontSize: 11.5, fontWeight: 700, color: C.sub }}>
          Step {AT + 1} of {STEPS.length}
        </span>
      </div>
      <div className="hide-scrollbar" style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 9, overflowX: "auto" }}>
        {done.map((s, i) => (
          <span key={s.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            {i > 0 && <span aria-hidden style={{ color: C.inact, fontSize: 11 }}>·</span>}
            <span style={{ fontSize: 12, fontWeight: 600, color: C.head, whiteSpace: "nowrap" }}>{s.value}</span>
          </span>
        ))}
        <span style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 2, marginLeft: 4, fontSize: 12, fontWeight: 700, color: C.p600, whiteSpace: "nowrap" }}>
          Edit <ChevronRight size={13} />
        </span>
      </div>
    </div>
  );
}

// ─── C · a rail of dots, answers only on the stage you are on ───
// The smallest of the four. One rule across the top broken into five, a tick
// on everything finished, and only the current stage names itself. Everything
// you answered is a tap away on the rail rather than written out.
function VariantC() {
  return (
    <div style={{ padding: "11px 14px 10px", borderBottom: `1px solid ${C.div}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Back />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {STEPS.map((s, i) => (
              <span key={s.label} style={{ flex: 1, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{
                  flexShrink: 0, width: 16, height: 16, borderRadius: "50%",
                  display: "grid", placeItems: "center",
                  background: i < AT ? C.p600 : i === AT ? C.white : C.bg,
                  border: i === AT ? `2px solid ${C.p600}` : "none",
                }}>
                  {i < AT && <Check size={10} color="#fff" strokeWidth={3} />}
                </span>
                {i < STEPS.length - 1 && (
                  <span style={{ flex: 1, height: 2, borderRadius: 2, background: i < AT ? C.p600 : C.div }} />
                )}
              </span>
            ))}
          </div>
          <p style={{ margin: "7px 0 0", fontSize: 12.5, fontWeight: 700, color: C.head, whiteSpace: "nowrap" }}>
            {STEPS[AT].label}
            <span style={{ fontWeight: 500, color: C.sub }}> · Vietnam, 7 nights</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── D · the answers as chips, the stage as the heading ───
// The answers become things rather than text: a chip each, the one you are on
// outlined and empty. The heaviest of the four and the easiest to aim at, and
// the only one where an unanswered stage is visibly a gap to fill.
function VariantD() {
  return (
    <div style={{ padding: "10px 0 11px", borderBottom: `1px solid ${C.div}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 14px" }}>
        <Back />
        <p style={{ flex: 1, minWidth: 0, margin: 0, fontSize: 15, fontWeight: 800, color: C.head, letterSpacing: "-0.2px" }}>
          {STEPS[AT].label}
        </p>
      </div>
      <div className="hide-scrollbar" style={{ display: "flex", gap: 6, marginTop: 10, padding: "0 14px", overflowX: "auto" }}>
        {STEPS.map((s, i) => (
          <span key={s.label} style={{
            flexShrink: 0, padding: "5px 11px", borderRadius: 999, whiteSpace: "nowrap",
            fontSize: 11.5, fontWeight: 700,
            border: i === AT ? `1.5px dashed ${C.p600}` : `1px solid ${C.div}`,
            background: i === AT ? C.white : s.value ? C.bg : C.white,
            color: i === AT ? C.p600 : s.value ? C.head : C.inact,
          }}>{s.value || s.label}</span>
        ))}
      </div>
    </div>
  );
}


// ─── The tick ───
// Done is a filled tick, the stage you are on is an empty ring in the same
// pink, and anything ahead is a hollow grey one. Three states, no text needed
// to tell them apart.
function Tick({ state, size = 16 }) {
  const done = state === "done";
  const now = state === "now";
  return (
    <span style={{
      flexShrink: 0, width: size, height: size, borderRadius: "50%",
      display: "grid", placeItems: "center",
      background: done ? C.p600 : C.white,
      border: done ? "none" : `${now ? 2 : 1.5}px solid ${now ? C.p600 : C.icon}`,
    }}>
      {done && <Check size={Math.round(size * 0.62)} color="#fff" strokeWidth={3.2} />}
    </span>
  );
}

const stateOf = (i) => (i < AT ? "done" : i === AT ? "now" : "next");

// ─── A1 · the tick where the rule was ───
// A exactly as it is, with the 4px rule swapped for a tick. Same row, same
// answers, same scroll; the only change is what sits above each one.
function VariantA1() {
  return (
    <div style={{ padding: "12px 14px 10px", borderBottom: `1px solid ${C.div}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Back />
        <div className="hide-scrollbar" style={{ flex: 1, display: "flex", gap: 14, minWidth: 0, overflowX: "auto" }}>
          {STEPS.map((s, i) => (
            <div key={s.label} style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Tick state={stateOf(i)} />
              <p style={{
                margin: "6px 0 0", fontSize: 11.5, whiteSpace: "nowrap",
                fontWeight: s.value ? 700 : 500,
                color: i === AT ? C.p600 : s.value ? C.head : C.inact,
              }}>{s.value || s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── A2 · the tick beside the answer ───
// The shortest of the three: tick and answer on one line, so the whole header
// is a single row of text. The row gets wider, which it can afford, and
// nothing is stacked.
function VariantA2() {
  return (
    <div style={{ padding: "13px 14px 13px", borderBottom: `1px solid ${C.div}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Back />
        <div className="hide-scrollbar" style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, minWidth: 0, overflowX: "auto" }}>
          {STEPS.map((s, i) => (
            <span key={s.label} style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Tick state={stateOf(i)} size={14} />
              <span style={{
                fontSize: 11.5, whiteSpace: "nowrap",
                fontWeight: s.value ? 700 : 500,
                color: i === AT ? C.p600 : s.value ? C.head : C.inact,
              }}>{s.value || s.label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── A3 · ticks joined up ───
// The ticks carry a line between them, so the row reads as one journey rather
// than five separate marks. The line is the part that says these are in order
// and you are partway along.
function VariantA3() {
  return (
    <div style={{ padding: "12px 14px 10px", borderBottom: `1px solid ${C.div}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Back />
        <div className="hide-scrollbar" style={{ flex: 1, display: "flex", minWidth: 0, overflowX: "auto" }}>
          {STEPS.map((s, i) => (
            <div key={s.label} style={{ flexShrink: 0, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Tick state={stateOf(i)} />
                {i < STEPS.length - 1 && (
                  <span style={{ width: 22, height: 2, borderRadius: 2, background: i < AT ? C.p600 : C.div }} />
                )}
              </div>
              <p style={{
                margin: "6px 22px 0 0", fontSize: 11.5, whiteSpace: "nowrap",
                fontWeight: s.value ? 700 : 500,
                color: i === AT ? C.p600 : s.value ? C.head : C.inact,
              }}>{s.value || s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const VARIANTS = [
  { key: "A", name: "Rules and answers", note: "What the app does now. One line per stage, the answer in it, a rule above.", El: VariantA },
  { key: "B", name: "Stage above, trip below", note: "The stage you are on gets a proper heading. Everything answered reads as one sentence under it.", El: VariantB },
  { key: "C", name: "Ticks and a rail", note: "The smallest. Ticks for what is done, and only the stage you are on says anything.", El: VariantC },
  { key: "D", name: "Answers as chips", note: "Each answer is a chip you can aim at, and the stage you are on is an outlined gap.", El: VariantD },
  { key: "A1", name: "A, with a tick for the rule", note: "A unchanged, except the rule above each answer is now a tick. Filled for done, an empty ring for where you are.", El: VariantA1 },
  { key: "A2", name: "A, tick beside the answer", note: "Tick and answer on one line, so the whole header is a single row of text. The shortest of the three.", El: VariantA2 },
  { key: "A3", name: "A, ticks joined up", note: "The ticks carry a line between them, so the row reads as one journey rather than five separate marks.", El: VariantA3 },
];

export default function StepperLab() {
  const navigate = useNavigate();
  const [only, setOnly] = useState(null);
  const shown = only ? VARIANTS.filter((v) => v.key === only) : VARIANTS;

  return (
    <div style={{ height: "100%", overflowY: "auto", background: C.bg }}>
      <div style={{ background: C.white, padding: "14px 16px 12px", borderBottom: `1px solid ${C.div}` }}>
        <button onClick={() => navigate(-1)} aria-label="Back" style={{
          width: 34, height: 34, borderRadius: "50%", border: `1px solid ${C.div}`, background: C.white,
          display: "grid", placeItems: "center", cursor: "pointer", padding: 0,
        }}>
          <ArrowLeft size={18} color={C.head} />
        </button>
        <h1 style={{ margin: "10px 0 0", fontSize: 21, fontWeight: 800, color: C.head, letterSpacing: "-0.4px" }}>
          Ways to show the wizard header
        </h1>
        <p style={{ margin: "5px 0 0", fontSize: 13, color: C.sub, lineHeight: "19px" }}>
          The same trip in each: Vietnam, two adults, 10 to 17 November, three cities, on the activities stage.
        </p>
        <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
          <button onClick={() => setOnly(null)} style={pill(!only)}>All</button>
          {VARIANTS.map((v) => (
            <button key={v.key} onClick={() => setOnly(v.key)} style={pill(only === v.key)}>{v.key}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 0 40px" }}>
        {shown.map(({ key, name, note, El }) => (
          <div key={key} style={{ marginBottom: 22 }}>
            <div style={{ padding: "0 16px 9px" }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: C.head }}>{key} · {name}</p>
              <p style={{ margin: "3px 0 0", fontSize: 12.5, color: C.sub, lineHeight: "18px" }}>{note}</p>
            </div>
            <div style={{ background: C.white, borderTop: `1px solid ${C.div}` }}>
              <El />
              {/* A little of the screen underneath, so the header can be read
                  against something rather than floating on its own. */}
              <div style={{ padding: "16px 16px 20px" }}>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.head, letterSpacing: "-0.4px" }}>
                  What do you want to do?
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 11 }}>
                  <span style={{ flex: 1, height: 58, borderRadius: 12, background: C.bg }} />
                  <span style={{ flex: 1, height: 58, borderRadius: 12, background: C.bg }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const pill = (on) => ({
  padding: "6px 13px", borderRadius: 999, cursor: "pointer", fontFamily: "inherit",
  fontSize: 12.5, fontWeight: 700,
  border: `1px solid ${on ? C.p600 : C.div}`,
  background: on ? C.p100 : C.white,
  color: on ? C.p600 : C.sub,
});

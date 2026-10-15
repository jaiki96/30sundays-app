import { Star } from "lucide-react";
import { C } from "../data";
import { HOTEL, SOURCES } from "../data/hotelDetailData";
import { ScoreStrip } from "../components/hotel_v3/HotelV3";
import { ScoreCard } from "../components/hotel_v3/Ratings";
import { T, A } from "../components/hotel_refined/tokens";

// ─── Every combination the row will ever have to hold ───
//
// Fifteen, because four sources make fifteen non-empty sets and a real
// catalogue will hand us most of them. The same component draws all of them:
// what changes is how much of the width is left over, and what it spends it on.
//
//   four opinions  → numbers only, our chip says "94%"
//   three          → same, one fewer
//   two            → both sites named in full, ours says "94% enjoyed it"
//   one            → the fullest form: "94% of travellers enjoyed it"
//
// Nothing here wraps at 375px, which is the only hard rule.

const B = "booking";
const G = "google";
const TA = "tripadvisor";

const CASES = [
  { ours: false, sources: [B] },
  { ours: false, sources: [G] },
  { ours: false, sources: [TA] },
  { ours: false, sources: [B, G] },
  { ours: false, sources: [B, TA] },
  { ours: false, sources: [G, TA] },
  { ours: false, sources: [B, G, TA] },
  { ours: true, sources: [] },
  { ours: true, sources: [B] },
  { ours: true, sources: [G] },
  { ours: true, sources: [TA] },
  { ours: true, sources: [B, G] },
  { ours: true, sources: [B, TA] },
  { ours: true, sources: [G, TA] },
  { ours: true, sources: [B, G, TA] },
];

const label = ({ ours, sources }) =>
  [ours ? "30 Sundays" : null, ...sources.map((k) => SOURCES[k].name)]
    .filter(Boolean)
    .join(" · ");

export default function ScoreStripLab() {
  return (
    <div className="hide-scrollbar" style={{ height: "100%", overflowY: "auto", background: C.white }}>
      <div style={{ padding: "20px 16px 34px" }}>
        <h1 style={{ ...T.h1, margin: 0 }}>{HOTEL.name}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 0" }}>
          <span style={{ display: "inline-flex", gap: 1.5 }}>
            {Array.from({ length: HOTEL.stars }).map((_, i) => (
              <Star key={i} size={13} color={A.star} fill={A.star} strokeWidth={0} />
            ))}
          </span>
          <span style={{ ...T.meta, fontSize: 12.5 }}>
            {HOTEL.stars} star {HOTEL.type.toLowerCase()} · {HOTEL.neighbourhood}
          </span>
        </div>

        <p style={{ ...T.body, margin: "16px 0 0", fontSize: 12.5 }}>
          Fifteen combinations, one component. The fewer opinions there are, the
          more of the row goes to words: at four it is numbers only, at two both
          sites are named, at one it reads as a full sentence.
        </p>

        <p style={{ ...T.h2, margin: "26px 0 0", fontSize: 16 }}>At the top of the page</p>

        {CASES.map((c, i) => {
          const n = (c.ours ? 1 : 0) + c.sources.length;
          const first = i === 0 || n !== ((CASES[i - 1].ours ? 1 : 0) + CASES[i - 1].sources.length);
          return (
            <div key={i} style={{ marginTop: first ? 26 : 18 }}>
              {first && (
                <p style={{ ...T.h3, margin: "0 0 10px", fontSize: 13.5 }}>
                  {n} {n === 1 ? "source" : "sources"}
                </p>
              )}
              <p style={{ ...T.micro, margin: 0, fontSize: 10.5 }}>{label(c)}</p>
              <ScoreStrip hotel={HOTEL} sources={c.sources} ours={c.ours} max={3} onOpen={() => {}} />
            </div>
          );
        })}

        {/* ── The same fifteen, in the section itself ── */}
        <div style={{ height: 1, background: C.div, margin: "30px 0 0" }} />
        <p style={{ ...T.h2, margin: "26px 0 0", fontSize: 16 }}>In Ratings and reviews</p>
        <p style={{ ...T.body, margin: "6px 0 0", fontSize: 12.5 }}>
          Ours is always a full-width row: it is the only one in our own words.
          Two or three others go in equal cells, which says they are the same
          kind of fact from different places. One other cannot be a row of
          cells, so it becomes a full-width row too, named in full.
        </p>

        {CASES.map((c, i) => {
          const n = (c.ours ? 1 : 0) + c.sources.length;
          const first = i === 0 || n !== ((CASES[i - 1].ours ? 1 : 0) + CASES[i - 1].sources.length);
          return (
            <div key={`card-${i}`} style={{ marginTop: first ? 24 : 14 }}>
              {first && (
                <p style={{ ...T.h3, margin: "0 0 10px", fontSize: 13.5 }}>
                  {n} {n === 1 ? "source" : "sources"}
                </p>
              )}
              <p style={{ ...T.micro, margin: "0 0 6px", fontSize: 10.5 }}>{label(c)}</p>
              <ScoreCard hotel={HOTEL} sources={c.sources} ours={c.ours} onOpen={() => {}} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

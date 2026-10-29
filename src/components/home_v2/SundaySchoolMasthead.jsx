import { GraduationCap } from "lucide-react";
import { C } from "../../data";

// Sunday School masthead - matches S1 (single) + M1 (multi) designs.
// Wrap the accent word in [brackets] in `valueTitle`: it renders in the brand
// pink with a thin wavy underline below.
//   "Where to stay in [Bali]"        →   Where to stay in *Bali*~~
//   "Bali [activities], compared"    →   Bali *activities*~~, compared
//   "Pick the right [week]"          →   Pick the right *week*~~
//
// Props:
//   valueTitle - the dominant headline, with [accent] markers
//   tagline    - the brand byline ("Learn first, Book second"); pass "" to suppress
function renderTitle(valueTitle) {
  if (!valueTitle) return null;
  // Split on [accent] markers, keeping the bracketed parts
  const parts = valueTitle.split(/(\[[^\]]+\])/g);
  return parts.map((p, i) => {
    if (p.startsWith("[") && p.endsWith("]")) {
      const word = p.slice(1, -1);
      return (
        <span key={i} style={{ position: "relative", display: "inline-block" }}>
          {/* The accent word keeps the pink and the wavy line, and loses the
              serif italic: at the page's heading weight a synthetic italic is
              a slant, not a typeface. */}
          <span style={{ color: C.p600 }}>{word}</span>
          <svg
            viewBox="0 0 200 14"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              left: 2, right: 2, bottom: -3,
              width: "calc(100% - 4px)",
              height: 7,
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            <path
              d="M2 8 Q 22 2 44 8 T 88 8 T 132 8 T 198 8"
              stroke={C.p600}
              strokeWidth="2.6"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </span>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

export default function SundaySchoolMasthead({
  valueTitle,
  tagline = "Learn first, Book second",
}) {
  return (
    <div style={{ padding: "0 2px 2px", marginBottom: 16 }}>
      {/* Brand chip + tagline byline */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, flex: "0 0 auto" }}>
          <GraduationCap size={17} color="#7A6420" strokeWidth={2.2} />
          <span style={{
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: "-0.1px",
            color: "#7A6420",
            fontFamily: "Figtree, system-ui, sans-serif",
            whiteSpace: "nowrap",
          }}>
            Sunday School
          </span>
        </div>
        {tagline && (
          <>
            <span style={{
              width: 3, height: 3, borderRadius: 999,
              background: "rgba(122,100,32,0.55)", flex: "0 0 auto",
            }} />
            <span style={{
              fontSize: 14,
              color: "#7A6420",
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontStyle: "italic",
              letterSpacing: "0.1px",
              whiteSpace: "nowrap",
            }}>
              {tagline}
            </span>
          </>
        )}
      </div>

      {/* The value title, in the page's own section heading. It was DM Serif
          Display at 30px in its own near-black, which made this the only
          section on the home screen whose heading was a different typeface,
          size, weight and colour from the other five. */}
      {valueTitle && (
        <h2 style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: "-0.4px",
          color: C.ink,
          maxWidth: 340,
        }}>
          {renderTitle(valueTitle)}
        </h2>
      )}
    </div>
  );
}

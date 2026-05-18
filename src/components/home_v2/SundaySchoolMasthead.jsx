import { GraduationCap } from "lucide-react";
import { C } from "../../data";

// Editorial Sunday School masthead — matches S1 (single) + M1 (multi) designs.
// Wrap the accent word in [brackets] in `valueTitle`: it renders coral italic
// in DM Serif Display with a thin wavy underline below.
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
          <em style={{ fontStyle: "italic", color: "#ED1B5B", fontWeight: 400 }}>{word}</em>
          {/* Wavy coral underline */}
          <svg
            viewBox="0 0 200 14"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              left: 2, right: 2, bottom: -4,
              width: "calc(100% - 4px)",
              height: 8,
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            <path
              d="M2 8 Q 22 2 44 8 T 88 8 T 132 8 T 198 8"
              stroke="#ED1B5B"
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

      {/* Big serif value title with accent */}
      {valueTitle && (
        <h2 style={{
          margin: 0,
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontWeight: 400,
          fontSize: 30,
          lineHeight: 1.1,
          letterSpacing: "-0.6px",
          color: "#1A1612",
          maxWidth: 340,
        }}>
          {renderTitle(valueTitle)}
        </h2>
      )}
    </div>
  );
}

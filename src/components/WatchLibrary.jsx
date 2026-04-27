import { useEffect, useMemo, useState } from "react";
import { X as XIcon } from "lucide-react";
import { C } from "../data";
import { WATCH_CATEGORIES } from "../data/watchData";
import WatchCard from "./WatchCard";
import WatchPlayer from "./WatchPlayer";

// Fullscreen library modal. Sticky chip filter + 2-col grid.
// Opens from a teaser's "See all" or chip tap.
export default function WatchLibrary({ title, subtitle, videos, initialCategory = "all", onClose }) {
  const [activeCat, setActiveCat] = useState(initialCategory);
  const [openId, setOpenId] = useState(null);

  // Lock body scroll while open.
  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = orig; };
  }, []);

  const cats = useMemo(() => {
    return WATCH_CATEGORIES.filter(c =>
      c.id === "all" ? videos.length > 0 : videos.some(v => v.category === c.id)
    );
  }, [videos]);

  const visible = activeCat === "all" ? videos : videos.filter(v => v.category === activeCat);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 250, background: C.white,
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, background: C.white, zIndex: 2,
        padding: "12px 14px 8px", borderBottom: `1px solid ${C.div}`,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: C.head, margin: 0 }}>{title}</p>
            {subtitle && (
              <p style={{ fontSize: 11, color: C.sub, margin: "2px 0 0", lineHeight: 1.4 }}>{subtitle}</p>
            )}
            <p style={{ fontSize: 10, color: C.inact, margin: "3px 0 0", fontWeight: 500 }}>{videos.length} videos</p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            width: 34, height: 34, borderRadius: "50%", background: C.p100, border: "none",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <XIcon size={18} color={C.head} />
          </button>
        </div>

        {/* Chip filter */}
        <div className="hs" style={{ gap: 8 }}>
          {cats.map(c => {
            const on = c.id === activeCat;
            const count = c.id === "all" ? videos.length : videos.filter(v => v.category === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                style={{
                  flexShrink: 0, padding: "7px 14px", borderRadius: 999,
                  border: `1px solid ${on ? C.p600 : C.div}`,
                  background: on ? C.p600 : C.white, color: on ? "#fff" : C.head,
                  fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                }}
              >
                {c.label} <span style={{ opacity: 0.7, marginLeft: 2 }}>· {count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Masonry — CSS columns + cycling portrait aspects so the grid breaks
          out of the uniform 2-col rhythm and clearly reads as portrait video. */}
      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "14px 14px 28px" }}>
        <div style={{ columnCount: 2, columnGap: 10 }}>
          {visible.map((v, i) => {
            // Cycle through three portrait aspects to create the masonry feel.
            // All are taller-than-wide so the "vertical video" cue stays intact.
            const aspect = ["9/16", "3/4", "9/16", "4/5"][i % 4];
            return (
              <div key={v.id} style={{ breakInside: "avoid", WebkitColumnBreakInside: "avoid", marginBottom: 10 }}>
                <WatchCard
                  video={v}
                  live={i === 0}
                  aspect={aspect}
                  onOpen={() => setOpenId(v.id)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Player */}
      {openId && (
        <WatchPlayer
          videos={visible}
          startId={openId}
          activeCategory={activeCat}
          showCategorySwitcher
          onCategoryChange={(id) => {
            setActiveCat(id);
            const next = id === "all" ? videos : videos.filter(v => v.category === id);
            if (next.length) setOpenId(next[0].id);
          }}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}

import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { C } from "../data";
import WatchCard from "./WatchCard";
import WatchLibrary from "./WatchLibrary";
import WatchPlayer from "./WatchPlayer";

// Compact preview that lives on Home, Destination, and Itinerary pages.
// Header → 1 row of split-layout cards → "See all N". No chip rail —
// taxonomy lives inside the library modal, not the teaser.
export default function WatchTeaser({
  title, subtitle, videos, previewIds, libraryTitle, librarySubtitle, emoji = "📺",
}) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [openId, setOpenId] = useState(null);

  const previewCards = useMemo(() => {
    if (previewIds?.length) {
      return previewIds.map(id => videos.find(v => v.id === id)).filter(Boolean);
    }
    return videos.slice(0, 4);
  }, [previewIds, videos]);

  if (!videos.length) return null;

  return (
    <div style={{ marginTop: 26 }}>
      {/* Header */}
      <div style={{ padding: "0 16px", marginBottom: 12, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <span style={{ fontSize: 16 }}>{emoji}</span>
            <span style={{ fontSize: 17, fontWeight: 700, color: C.head }}>{title}</span>
          </div>
          {subtitle && <p style={{ fontSize: 12, color: C.sub, margin: 0 }}>{subtitle}</p>}
        </div>
        <button
          onClick={() => setLibraryOpen(true)}
          style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 2, background: "none", border: "none", color: C.p600, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          See all {videos.length} <ChevronRight size={14} />
        </button>
      </div>

      {/* Card row — compact portrait cards. Wider 3/4 aspect so they read
          as portrait video without dominating the page height. */}
      <div className="hs" style={{ gap: 10, paddingLeft: 16, paddingRight: 16 }}>
        {previewCards.map((v, i) => (
          <WatchCard
            key={v.id}
            video={v}
            live={i === 0}
            width={150}
            aspect="3/4"
            onOpen={() => setOpenId(v.id)}
          />
        ))}
      </div>

      {/* Library modal — opens from "See all" */}
      {libraryOpen && (
        <WatchLibrary
          title={libraryTitle || title}
          subtitle={librarySubtitle}
          videos={videos}
          initialCategory="all"
          onClose={() => setLibraryOpen(false)}
        />
      )}

      {/* Player — opens from a card tap (skips library entirely) */}
      {openId && (
        <WatchPlayer
          videos={previewCards}
          startId={openId}
          activeCategory="all"
          showCategorySwitcher={false}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}

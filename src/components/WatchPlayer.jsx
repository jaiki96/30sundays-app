import { useEffect, useMemo, useRef, useState } from "react";
import { X as XIcon, Heart, Share2, ChevronUp } from "lucide-react";
import { C } from "../data";
import { WATCH_CATEGORIES } from "../data/watchData";
import { useSavedVideos } from "../hooks/useSavedVideos";

// Fullscreen reels-style player.
// Props:
//   videos      — the visible deck (already filtered by caller)
//   startId     — id of video to open at
//   onClose     — close callback
//   onCategoryChange(id) — caller updates `videos` and `startId` to first of new category
//   activeCategory — id of currently selected category
//   showCategorySwitcher — true on Destination + Home (full library); false on itinerary "Before you go"
export default function WatchPlayer({
  videos, startId, onClose,
  onCategoryChange, activeCategory = "all", showCategorySwitcher = true,
}) {
  const startIdx = Math.max(0, videos.findIndex(v => v.id === startId));
  const [idx, setIdx] = useState(startIdx);
  const [showFilter, setShowFilter] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const touchY = useRef(null);
  const { isSaved, toggle } = useSavedVideos();

  // Re-sync when the parent supplies a new deck (e.g. category change).
  useEffect(() => {
    const i = videos.findIndex(v => v.id === startId);
    if (i >= 0) setIdx(i);
  }, [startId, videos]);

  const current = videos[idx];
  const total = videos.length;

  // Sync URL for shareability without remounting the player.
  useEffect(() => {
    if (!current) return;
    const url = `/watch/${current.id}`;
    if (window.location.pathname !== url) {
      window.history.replaceState({}, "", url);
    }
  }, [current?.id]);

  // Close on Escape (desktop preview).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") goNext();
      else if (e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const goNext = () => setIdx(i => (i + 1) % total);
  const goPrev = () => setIdx(i => (i - 1 + total) % total);

  const handleTouchStart = (e) => { touchY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e) => {
    if (touchY.current == null) return;
    const dy = touchY.current - e.changedTouches[0].clientY;
    if (dy > 60) goNext();
    else if (dy < -60) goPrev();
    touchY.current = null;
  };

  // Wheel for desktop swipe simulation.
  const wheelLock = useRef(0);
  const handleWheel = (e) => {
    const now = Date.now();
    if (now - wheelLock.current < 350) return;
    if (Math.abs(e.deltaY) < 30) return;
    wheelLock.current = now;
    e.deltaY > 0 ? goNext() : goPrev();
  };

  const handleShare = async () => {
    const url = window.location.origin + `/watch/${current.id}`;
    try { await navigator.clipboard.writeText(url); } catch {}
    setShareToast(true);
    setTimeout(() => setShareToast(false), 1500);
  };

  if (!current) return null;
  const cat = WATCH_CATEGORIES.find(c => c.id === activeCategory) || WATCH_CATEGORIES[0];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "#000", display: "flex", justifyContent: "center" }}>
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        style={{ position: "relative", width: "100%", maxWidth: 480, height: "100%", overflow: "hidden", background: "#000" }}
      >
        {/* Poster (acts as the "video" frame) */}
        <img
          key={current.id}
          src={current.poster}
          alt={current.title}
          className="ken-burns"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 18%, transparent 55%, rgba(0,0,0,0.85) 100%)" }} />

        {/* Top bar — close + category chip + filter trigger */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "14px 14px 0", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 5 }}>
          <button onClick={onClose} aria-label="Close" style={{
            width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)",
            border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <XIcon size={18} color="#fff" />
          </button>

          {showCategorySwitcher && (
            <button onClick={() => setShowFilter(s => !s)} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 999,
              background: "rgba(255,255,255,0.18)", backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.18)", color: "#fff",
              fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.2px",
            }}>
              {cat.label}
              <ChevronUp size={13} style={{ transform: showFilter ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.2s" }} />
            </button>
          )}

          {/* Spacer to balance */}
          <div style={{ width: 36 }} />
        </div>

        {/* Side actions — save, share */}
        <div style={{ position: "absolute", right: 12, bottom: 130, zIndex: 5, display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
          <ActionButton
            icon={Heart}
            active={isSaved(current.id)}
            label={isSaved(current.id) ? "Saved" : "Save"}
            onClick={() => toggle(current.id)}
          />
          <ActionButton icon={Share2} label="Share" onClick={handleShare} />
        </div>

        {/* Progress dots — vertical reel position */}
        <div style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", zIndex: 5, display: "flex", flexDirection: "column", gap: 4 }}>
          {videos.slice(0, Math.min(total, 8)).map((_, i) => (
            <div key={i} style={{
              width: 3, height: i === idx % 8 ? 22 : 10, borderRadius: 2,
              background: i === idx % 8 ? "#fff" : "rgba(255,255,255,0.4)", transition: "all 0.2s",
            }} />
          ))}
        </div>

        {/* Bottom — title + meta */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 64, padding: "0 16px 30px", zIndex: 5 }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.6px", fontWeight: 700 }}>
            {cat.label}{current.dest ? ` · ${current.dest}` : current.crossDest ? ` · ${current.crossDest.join(" · ")}` : ""}
          </p>
          <p style={{ fontSize: 19, fontWeight: 700, color: "#fff", margin: "0 0 6px", lineHeight: 1.2 }}>
            {current.title}
          </p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", margin: 0 }}>
            {idx + 1} / {total} · swipe up for next
          </p>
        </div>

        {/* Filter sheet — slides down from top chip */}
        {showCategorySwitcher && showFilter && (
          <>
            <div onClick={() => setShowFilter(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 6 }} />
            <div style={{
              position: "absolute", top: 60, left: 14, right: 14, zIndex: 7,
              background: "rgba(20,20,22,0.96)", backdropFilter: "blur(20px)",
              borderRadius: 16, padding: "8px", border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            }}>
              {WATCH_CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => { onCategoryChange?.(c.id); setShowFilter(false); }}
                  style={{
                    width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 10,
                    background: c.id === activeCategory ? C.p600 : "transparent",
                    border: "none", color: "#fff", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{c.label}</span>
                  {c.desc && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{c.desc}</span>}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Share toast */}
        {shareToast && (
          <div style={{
            position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)", zIndex: 8,
            padding: "10px 18px", borderRadius: 999,
            background: "rgba(20,20,22,0.95)", color: "#fff",
            fontSize: 12, fontWeight: 600, letterSpacing: "0.2px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
          }}>
            Link copied
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, active = false, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
      background: "none", border: "none", cursor: "pointer", padding: 0,
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: "50%",
        background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: active ? `1.5px solid ${C.p600}` : "1px solid rgba(255,255,255,0.18)",
      }}>
        <Icon size={18} color={active ? C.p600 : "#fff"} fill={active ? C.p600 : "transparent"} />
      </div>
      <span style={{ fontSize: 10, fontWeight: 600, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>{label}</span>
    </button>
  );
}

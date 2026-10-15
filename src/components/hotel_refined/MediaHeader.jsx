import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Share2, Images, Volume2, VolumeX } from "lucide-react";
import { C } from "../../data";
import { R, SHADOW, T, A, PAD } from "./tokens";

// ─── The top of the page ───
//
// Same idea as before, tidied. Three things changed. The strip now starts at
// the page gutter instead of 12px, so the photos line up with every heading
// below them. The tiles use the hero radius rather than a radius of their own.
// And the controls sit on a single baseline with matching hit areas, because
// previously the back button and the gallery pill were different sizes at
// different insets and the header read as slightly crooked.

function VideoTile({ video, muted, setMuted, height }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = muted;
    if (!failed) el.play().catch(() => {});
  }, [muted, failed]);

  return (
    <div style={{
      position: "relative", width: 172, height, flexShrink: 0,
      borderRadius: R.hero, overflow: "hidden", background: "#111",
    }}>
      {failed ? (
        <img src={video.poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        <video
          ref={ref}
          src={video.src}
          poster={video.poster}
          muted={muted}
          loop
          autoPlay
          playsInline
          onError={() => setFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      )}

      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(180deg, rgba(0,0,0,0.26) 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.66) 100%)",
      }} />

      <button
        onClick={(e) => { e.stopPropagation(); setMuted((m) => !m); }}
        aria-label={muted ? "Unmute" : "Mute"}
        style={{
          position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: "50%",
          border: "none", background: "rgba(0,0,0,0.42)", backdropFilter: "blur(8px)",
          display: "grid", placeItems: "center", cursor: "pointer",
        }}
      >
        {muted ? <VolumeX size={14} color="#fff" /> : <Volume2 size={14} color="#fff" />}
      </button>

      <div style={{ position: "absolute", left: 12, right: 12, bottom: 11, pointerEvents: "none" }}>
        <p style={{
          ...T.eyebrow, margin: 0, color: "rgba(255,255,255,0.72)",
        }}>{video.duration}</p>
        <p style={{
          margin: "3px 0 0", fontSize: 12.5, fontWeight: 700, color: "#fff", lineHeight: 1.25,
        }}>{video.label}</p>
      </div>
    </div>
  );
}

export default function MediaHeader({ hotel, onBack, onGallery, onShare }) {
  const [muted, setMuted] = useState(true);
  const H = 288;
  const cellH = (H - 7) / 2;

  const stills = hotel.photos.slice(1);
  const pairs = [];
  for (let i = 0; i < stills.length && pairs.length < 6; i += 2) {
    pairs.push(stills.slice(i, i + 2));
  }

  const round = {
    width: 36, height: 36, borderRadius: "50%", border: "none",
    background: "rgba(255,255,255,0.96)", boxShadow: SHADOW.float,
    display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0,
    backdropFilter: "blur(8px)",
  };

  return (
    <div style={{ position: "relative", background: C.white, paddingTop: 10 }}>
      <div
        className="hide-scrollbar"
        style={{
          display: "flex", gap: 7, height: H, overflowX: "auto",
          padding: `0 ${PAD}px`, WebkitOverflowScrolling: "touch",
        }}
      >
        <VideoTile video={hotel.video} muted={muted} setMuted={setMuted} height={H} />

        {pairs.map((pair, pi) => (
          <div key={pi} style={{ display: "flex", flexDirection: "column", gap: 7, flexShrink: 0 }}>
            {pair.map((p, i) => (
              <button
                key={i}
                onClick={() => onGallery(p.category)}
                style={{
                  width: 150, height: cellH, border: "none", padding: 0, cursor: "pointer",
                  borderRadius: R.card, overflow: "hidden", background: A.photoBg, display: "block",
                }}
              >
                <img src={p.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </button>
            ))}
          </div>
        ))}

        <div style={{ width: 2, flexShrink: 0 }} />
      </div>

      {/* One baseline, matching hit areas */}
      <button onClick={onBack} aria-label="Back" style={{ ...round, position: "absolute", top: 20, left: PAD + 10 }}>
        <ArrowLeft size={18} color={C.head} />
      </button>

      <button onClick={onShare} aria-label="Share" style={{ ...round, position: "absolute", top: 20, right: PAD + 10 }}>
        <Share2 size={16} color={C.head} />
      </button>

      <button
        onClick={() => onGallery("All")}
        style={{
          position: "absolute", right: PAD + 10, bottom: 12,
          display: "inline-flex", alignItems: "center", gap: 7,
          border: "none", borderRadius: R.pill, padding: "9px 15px", cursor: "pointer",
          fontFamily: "inherit", fontSize: 12.5, fontWeight: 700, color: "#fff",
          background: "rgba(17,17,17,0.78)", backdropFilter: "blur(10px)",
          boxShadow: SHADOW.float,
        }}
      >
        <Images size={14} color="#fff" />
        View gallery
        <span style={{ opacity: 0.65, fontWeight: 600 }}>
          {hotel.photos.length + hotel.reels.length}
        </span>
      </button>
    </div>
  );
}

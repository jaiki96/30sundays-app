import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Share2, Images, Volume2, VolumeX } from "lucide-react";
import { C } from "../../data";

// ─── The top of the page ───
//
// A hotel is a place, and a place is easier to judge in motion than in a
// single hero crop. So the first tile is a clip that starts playing on its
// own, and the stills sit beside it in a strip you push sideways. Nothing is
// hidden behind a swipe you have to guess at: the second column is visibly
// cut off at the right edge, which is what tells you the strip moves.
//
// One button leads out of here, "View gallery", and it goes to the grouped
// gallery rather than a flat lightbox.

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
      position: "relative", width: 168, height, flexShrink: 0,
      borderRadius: 14, overflow: "hidden", background: "#111",
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
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.62) 100%)",
        pointerEvents: "none",
      }} />

      <button
        onClick={(e) => { e.stopPropagation(); setMuted((m) => !m); }}
        aria-label={muted ? "Unmute" : "Mute"}
        style={{
          position: "absolute", top: 9, right: 9, width: 28, height: 28, borderRadius: "50%",
          border: "none", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)",
          display: "grid", placeItems: "center", cursor: "pointer",
        }}
      >
        {muted ? <VolumeX size={14} color="#fff" /> : <Volume2 size={14} color="#fff" />}
      </button>

      <div style={{ position: "absolute", left: 11, right: 11, bottom: 10, pointerEvents: "none" }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: 1.25 }}>
          {video.label}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 10.5, color: "rgba(255,255,255,0.8)" }}>
          {video.duration}
        </p>
      </div>
    </div>
  );
}

export default function MediaHeader({ hotel, onBack, onGallery, onShare }) {
  const [muted, setMuted] = useState(true);
  const H = 282;
  const cellH = (H - 6) / 2;

  // The clip, then the stills in pairs. Photo 0 is skipped in the pairs
  // because it is the one the clip's poster already shows.
  const stills = hotel.photos.slice(1);
  const pairs = [];
  for (let i = 0; i < stills.length && pairs.length < 6; i += 2) {
    pairs.push(stills.slice(i, i + 2));
  }

  const round = {
    width: 34, height: 34, borderRadius: "50%", border: "none",
    background: "rgba(255,255,255,0.94)", boxShadow: "0 2px 10px rgba(16,24,40,0.22)",
    display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0,
  };

  return (
    <div style={{ position: "relative", background: C.white }}>
      <div
        className="hide-scrollbar"
        style={{
          display: "flex", gap: 6, height: H, overflowX: "auto",
          padding: "0 12px", scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <VideoTile video={hotel.video} muted={muted} setMuted={setMuted} height={H} />

        {pairs.map((pair, pi) => (
          <div key={pi} style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
            {pair.map((p, i) => (
              <button
                key={i}
                onClick={() => onGallery(p.category)}
                style={{
                  width: 148, height: cellH, border: "none", padding: 0, cursor: "pointer",
                  borderRadius: 12, overflow: "hidden", background: C.bg, display: "block",
                }}
              >
                <img src={p.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </button>
            ))}
          </div>
        ))}

        {/* A tail so the last photo can scroll clear of the gallery button */}
        <div style={{ width: 4, flexShrink: 0 }} />
      </div>

      {/* Controls sit over the strip rather than inside it, so they stay put */}
      <button onClick={onBack} aria-label="Back" style={{ ...round, position: "absolute", top: 12, left: 20 }}>
        <ArrowLeft size={18} color={C.head} />
      </button>

      {/* Share only. Saving a hotel belongs on a list you are browsing, not on
          the one already sitting in your itinerary. */}
      <button
        onClick={onShare}
        aria-label="Share"
        style={{ ...round, position: "absolute", top: 12, right: 20 }}
      >
        <Share2 size={16} color={C.head} />
      </button>

      <button
        onClick={() => onGallery("All")}
        style={{
          position: "absolute", right: 20, bottom: 12,
          display: "inline-flex", alignItems: "center", gap: 6,
          border: "none", borderRadius: 999, padding: "8px 14px", cursor: "pointer",
          fontFamily: "inherit", fontSize: 12.5, fontWeight: 700, color: "#fff",
          background: "rgba(17,17,17,0.82)", backdropFilter: "blur(8px)",
          boxShadow: "0 3px 14px rgba(0,0,0,0.3)",
        }}
      >
        <Images size={14} color="#fff" />
        View gallery
        <span style={{ opacity: 0.7, fontWeight: 600 }}>
          {hotel.photos.length + hotel.reels.length}
        </span>
      </button>
    </div>
  );
}

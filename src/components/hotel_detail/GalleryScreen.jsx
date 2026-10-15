import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Play, Volume2, VolumeX, Share2 } from "lucide-react";
import { galleryCategories } from "../../data/hotelDetailData";

// ─── The gallery ───
//
// Photos grouped by what they show, because "45 photos" is not browsable and
// "12 photos of the room" is. The chips are the groups. The last chip is the
// reels: the same hotel in motion, shot by us and by couples who stayed, and
// it plays rather than sitting behind a play button, because a still of a
// video is just another photo.

function Reel({ reel, muted, setMuted, active }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || failed) return;
    el.muted = muted;
    if (active) el.play().catch(() => {});
    else el.pause();
  }, [muted, active, failed]);

  return (
    <div style={{ position: "relative", width: "100%", background: "#000" }}>
      {failed ? (
        <img src={reel.poster} alt="" style={{ width: "100%", display: "block", aspectRatio: "9 / 12", objectFit: "cover" }} />
      ) : (
        <video
          ref={ref}
          src={reel.src}
          poster={reel.poster}
          loop
          playsInline
          muted={muted}
          onError={() => setFailed(true)}
          style={{ width: "100%", display: "block", aspectRatio: "9 / 12", objectFit: "cover" }}
        />
      )}

      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.7) 100%)",
      }} />

      <div style={{ position: "absolute", left: 14, right: 66, bottom: 14 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{reel.title}</p>
        <p style={{ margin: "3px 0 0", fontSize: 11.5, color: "rgba(255,255,255,0.78)" }}>{reel.author}</p>
      </div>

      <div style={{ position: "absolute", right: 12, bottom: 14, display: "flex", flexDirection: "column", gap: 9 }}>
        <button
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute" : "Mute"}
          style={{
            width: 36, height: 36, borderRadius: "50%", border: "none",
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
            display: "grid", placeItems: "center", cursor: "pointer",
          }}
        >
          {muted ? <VolumeX size={16} color="#fff" /> : <Volume2 size={16} color="#fff" />}
        </button>
        <button
          aria-label="Share"
          style={{
            width: 36, height: 36, borderRadius: "50%", border: "none",
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
            display: "grid", placeItems: "center", cursor: "pointer",
          }}
        >
          <Share2 size={15} color="#fff" />
        </button>
      </div>
    </div>
  );
}

export default function GalleryScreen({ hotel, startCategory = "All", onClose }) {
  const [cat, setCat] = useState(startCategory);
  const [lightbox, setLightbox] = useState(null); // index into the filtered list
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(0);

  const cats = useMemo(() => galleryCategories(hotel), [hotel]);
  const shown = cat === "All" ? hotel.photos : hotel.photos.filter((p) => p.category === cat);
  const isReels = cat === "Reels";

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (lightbox != null) setLightbox(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, onClose]);

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 1000, background: "#0B0B0C",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: "12px 12px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={onClose}
            aria-label="Back"
            style={{
              width: 32, height: 32, borderRadius: "50%", border: "none",
              background: "rgba(255,255,255,0.12)", display: "grid", placeItems: "center",
              cursor: "pointer", flexShrink: 0,
            }}
          >
            <ArrowLeft size={17} color="#fff" />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              margin: 0, fontSize: 14, fontWeight: 700, color: "#fff",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{hotel.name}</p>
            <p style={{ margin: "1px 0 0", fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
              {hotel.photos.length} photos · {hotel.reels.length} videos
            </p>
          </div>
        </div>

        {/* Groups. Reels sits last and keeps its own colour, because it is a
            different kind of thing, not another folder of stills. */}
        <div className="hide-scrollbar" style={{ display: "flex", gap: 7, overflowX: "auto", padding: "13px 0 12px" }}>
          {cats.map((c) => (
            <button
              key={c.key}
              onClick={() => { setCat(c.key); setLightbox(null); }}
              style={{
                flexShrink: 0, border: "none", borderRadius: 999, padding: "7px 14px", cursor: "pointer",
                fontFamily: "inherit", fontSize: 12.5, fontWeight: cat === c.key ? 700 : 600,
                background: cat === c.key ? "#fff" : "rgba(255,255,255,0.12)",
                color: cat === c.key ? "#111" : "rgba(255,255,255,0.82)",
                whiteSpace: "nowrap",
              }}
            >
              {c.label}
              <span style={{ marginLeft: 5, opacity: 0.55, fontWeight: 600 }}>{c.count}</span>
            </button>
          ))}
          <button
            onClick={() => { setCat("Reels"); setLightbox(null); }}
            style={{
              flexShrink: 0, border: "none", borderRadius: 999, padding: "7px 14px", cursor: "pointer",
              fontFamily: "inherit", fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap",
              display: "inline-flex", alignItems: "center", gap: 5,
              background: isReels ? "#FD014F" : "rgba(253,1,79,0.22)",
              color: "#fff",
            }}
          >
            <Play size={11} color="#fff" fill="#fff" />
            Reels
            <span style={{ opacity: 0.7, fontWeight: 600 }}>{hotel.reels.length}</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {isReels ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingBottom: 20 }}>
            {hotel.reels.map((r, i) => (
              <div key={r.id} onMouseEnter={() => setPlaying(i)} onTouchStart={() => setPlaying(i)}>
                <Reel reel={r} muted={muted} setMuted={setMuted} active={i === playing} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3,
            padding: "0 3px 20px",
          }}>
            {shown.map((p, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                style={{
                  border: "none", padding: 0, cursor: "pointer", background: "#1A1A1C",
                  aspectRatio: "1 / 1", overflow: "hidden", display: "block",
                }}
              >
                <img src={p.url} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* One photo, full size */}
      {lightbox != null && shown[lightbox] && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10, background: "#000",
          display: "flex", flexDirection: "column", animation: "fadeInBg 0.18s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", padding: "12px 14px", flexShrink: 0 }}>
            <span style={{ flex: 1, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
              {lightbox + 1} of {shown.length}
            </span>
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close"
              style={{
                width: 32, height: 32, borderRadius: "50%", border: "none",
                background: "rgba(255,255,255,0.14)", display: "grid", placeItems: "center", cursor: "pointer",
              }}
            >
              <X size={17} color="#fff" />
            </button>
          </div>

          <div style={{ flex: 1, position: "relative", display: "grid", placeItems: "center", minHeight: 0, padding: "0 8px" }}>
            <img src={shown[lightbox].url} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            {lightbox > 0 && (
              <button
                onClick={() => setLightbox(lightbox - 1)}
                aria-label="Previous"
                style={{
                  position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)",
                  width: 36, height: 36, borderRadius: "50%", border: "none",
                  background: "rgba(255,255,255,0.16)", display: "grid", placeItems: "center", cursor: "pointer",
                }}
              >
                <ChevronLeft size={19} color="#fff" />
              </button>
            )}
            {lightbox < shown.length - 1 && (
              <button
                onClick={() => setLightbox(lightbox + 1)}
                aria-label="Next"
                style={{
                  position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
                  width: 36, height: 36, borderRadius: "50%", border: "none",
                  background: "rgba(255,255,255,0.16)", display: "grid", placeItems: "center", cursor: "pointer",
                }}
              >
                <ChevronRight size={19} color="#fff" />
              </button>
            )}
          </div>

          <div style={{ flexShrink: 0, padding: "14px 16px 20px" }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#fff" }}>
              {shown[lightbox].caption}
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 11.5, color: "rgba(255,255,255,0.55)" }}>
              {shown[lightbox].category}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { C } from "../../data";
import { galleryCategories } from "../../data/hotelDetailData";
import { R, SHADOW, T, A, PAD } from "../hotel_refined/tokens";

// ─── The gallery ───
//
// Light, like every other surface in this app. The dark theme was borrowed from
// photo viewers, where black is there to get out of the way of one image at a
// time. This is a browsing screen, and a black browsing screen in a white app
// reads as a different product.
//
// Videos lead. They were the last chip, behind seven folders of stills, which
// is the wrong end of the list for the only thing on this screen that moves.
// The chip only appears when there are videos, so a hotel with none never shows
// an empty tab.

function Reel({ reel, active }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || failed) return;
    el.muted = true;
    if (active) el.play().catch(() => {});
    else el.pause();
  }, [active, failed]);

  return (
    <div style={{
      position: "relative", borderRadius: R.card, overflow: "hidden",
      background: "#000", boxShadow: SHADOW.card,
    }}>
      {failed ? (
        <img src={reel.poster} alt="" style={{ width: "100%", display: "block", aspectRatio: "9 / 12", objectFit: "cover" }} />
      ) : (
        <video
          ref={ref}
          src={reel.src}
          poster={reel.poster}
          loop
          playsInline
          muted
          onError={() => setFailed(true)}
          style={{ width: "100%", display: "block", aspectRatio: "9 / 12", objectFit: "cover" }}
        />
      )}

      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(180deg, rgba(0,0,0,0) 58%, rgba(0,0,0,0.72) 100%)",
      }} />

      <div style={{ position: "absolute", left: 14, right: 14, bottom: 14 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{reel.title}</p>
        <p style={{ margin: "3px 0 0", fontSize: 11.5, color: "rgba(255,255,255,0.78)" }}>{reel.author}</p>
      </div>
    </div>
  );
}

export default function GalleryScreen({ hotel, startCategory = "All", onClose }) {
  const hasVideos = hotel.reels?.length > 0;
  const [cat, setCat] = useState(startCategory);
  const [lightbox, setLightbox] = useState(null);
  const [playing, setPlaying] = useState(0);

  const cats = useMemo(() => galleryCategories(hotel), [hotel]);
  const shown = cat === "All" ? hotel.photos : hotel.photos.filter((p) => p.category === cat);
  const isVideos = cat === "Videos";

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (lightbox != null) setLightbox(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, onClose]);

  const chip = (on) => ({
    flexShrink: 0, borderRadius: R.pill, padding: "8px 14px", cursor: "pointer",
    fontFamily: "inherit", fontSize: 12.5, fontWeight: on ? 700 : 600, whiteSpace: "nowrap",
    border: `1px solid ${on ? A.pink : C.div}`,
    background: on ? A.pinkSoft : C.white,
    color: on ? "#C00840" : C.sub,
    display: "inline-flex", alignItems: "center", gap: 6,
  });

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 1000, background: C.white,
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{ flexShrink: 0, borderBottom: `1px solid ${C.div}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: `12px ${PAD}px 0` }}>
          <button
            onClick={onClose}
            aria-label="Back"
            style={{
              width: 34, height: 34, borderRadius: "50%", border: `1px solid ${C.div}`,
              background: C.white, display: "grid", placeItems: "center",
              cursor: "pointer", flexShrink: 0,
            }}
          >
            <ArrowLeft size={17} color={C.head} />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              ...T.h3, margin: 0, fontSize: 14.5,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{hotel.name}</p>
            <p style={{ ...T.micro, margin: "2px 0 0" }}>
              {hotel.photos.length} photos{hasVideos ? ` · ${hotel.reels.length} videos` : ""}
            </p>
          </div>
        </div>

        {/* Videos is pinned and the folders scroll past it. It is the only
            chip that is a different kind of thing, and a chip you have to go
            looking for is a chip nobody finds. */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: `13px 0 13px ${PAD}px` }}>
          {hasVideos && (
            <button onClick={() => { setCat("Videos"); setLightbox(null); }} style={{ ...chip(isVideos), flexShrink: 0 }}>
              <Play size={11} color={isVideos ? "#C00840" : C.sub} fill={isVideos ? "#C00840" : C.sub} />
              Videos
              <span style={{ opacity: 0.6, fontWeight: 600 }}>{hotel.reels.length}</span>
            </button>
          )}

          {hasVideos && <div style={{ width: 1, height: 22, background: C.div, flexShrink: 0 }} />}

          <div className="hide-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", paddingRight: PAD, minWidth: 0 }}>
            {cats.map((c) => (
              <button
                key={c.key}
                onClick={() => { setCat(c.key); setLightbox(null); }}
                style={chip(cat === c.key)}
              >
                {c.label}
                <span style={{ opacity: 0.6, fontWeight: 600 }}>{c.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", minHeight: 0, background: "#FAFAFB" }}>
        {isVideos ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: `14px ${PAD}px 24px` }}>
            {hotel.reels.map((r, i) => (
              <div key={r.id} onMouseEnter={() => setPlaying(i)} onTouchStart={() => setPlaying(i)}>
                <Reel reel={r} active={i === playing} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4,
            padding: `14px ${PAD}px 24px`,
          }}>
            {shown.map((p, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                style={{
                  border: "none", padding: 0, cursor: "pointer", background: A.photoBg,
                  aspectRatio: "1 / 1", overflow: "hidden", display: "block", borderRadius: R.well,
                }}
              >
                <img src={p.url} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* One photo, full size. Dark here and only here: a single image is the
          one case where black genuinely gets out of the way. */}
      {lightbox != null && shown[lightbox] && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10, background: "#0B0B0C",
          display: "flex", flexDirection: "column", animation: "fadeInBg 0.18s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", padding: `12px ${PAD}px`, flexShrink: 0 }}>
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

          <div style={{ flexShrink: 0, padding: `14px ${PAD}px 20px` }}>
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

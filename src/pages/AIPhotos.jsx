import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ImagePlus, Check, X as XIcon, Shuffle, AlertCircle,
  RefreshCw, MapPin, Trash2, Wand2, Sparkles, CloudOff,
} from "lucide-react";
import { C } from "../data";
import { useAIPhotos, useReducedMotion } from "../state/useAIPhotos";
import {
  COPY, AI_DESTINATIONS, GUIDELINES, GOOD_EXAMPLE, BAD_EXAMPLES,
  getDestination, getGeneratedBatch, IMAGES_PER_BATCH, track,
} from "../data/aiPhotosData";
import PhotoViewer from "../components/AIPhotos/PhotoViewer";
import LoginLayer from "../components/AIPhotos/LoginLayer";
import AIPhotosDevPanel, { DevPanelButton } from "../components/AIPhotos/AIPhotosDevPanel";

const PAD = 18;
// Every tile is 9:16, the shape every generated image comes back in.

/* ── Chrome ── */

function TopBar({ title, onBack, right }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: `10px ${PAD}px`,
      borderBottom: `1px solid ${C.div}`, background: C.white, flexShrink: 0,
    }}>
      <button onClick={onBack} aria-label="Back" style={{ width: 40, height: 40, marginLeft: -8, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}>
        <ArrowLeft size={21} color={C.head} />
      </button>
      <h1 style={{ flex: 1, fontSize: 16.5, fontWeight: 700, color: C.head, margin: 0, letterSpacing: "-0.3px" }}>{title}</h1>
      {right}
    </div>
  );
}

function Footer({ children }) {
  return (
    <div style={{ flexShrink: 0, padding: `12px ${PAD}px calc(14px + env(safe-area-inset-bottom))`, borderTop: `1px solid ${C.div}`, background: C.white }}>
      {children}
    </div>
  );
}

function Primary({ disabled, onClick, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex", width: "100%", alignItems: "center", justifyContent: "center", gap: 8,
        minHeight: 50, borderRadius: 999, border: "none",
        background: disabled ? C.div : C.p600, color: disabled ? C.inact : "#fff",
        fontSize: 15, fontWeight: 800, fontFamily: "inherit",
        cursor: disabled ? "default" : "pointer",
        boxShadow: disabled ? "none" : "0 8px 22px rgba(227,27,83,0.3)",
      }}
    >
      {children}
    </button>
  );
}

function AiNote({ center = true }) {
  return (
    <p style={{ fontSize: 10.5, fontStyle: "italic", color: C.inact, textAlign: center ? "center" : "left", margin: "9px 0 0" }}>
      {COPY.aiNote}
    </p>
  );
}

/* ── 1. Upload ── */

function ExampleCard({ src, caption, good }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "9 / 16", borderRadius: 12, overflow: "hidden", background: C.div }}>
        <img src={src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: good ? "none" : "grayscale(0.65) brightness(0.9)" }} />
        <span style={{
          position: "absolute", top: 6, left: 6, width: 22, height: 22, borderRadius: "50%",
          background: good ? (C.sText || "#027A48") : "#D92D20",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
        }}>
          {good ? <Check size={13} color="#fff" strokeWidth={3.2} /> : <XIcon size={13} color="#fff" strokeWidth={3.2} />}
        </span>
      </div>
      <p style={{ fontSize: 10.5, color: C.sub, lineHeight: "14px", margin: "6px 0 0" }}>{caption}</p>
    </div>
  );
}

function UploadStep() {
  const { photoName, photoPreview, rejection, onPhotoSelected, onUploadSubmitted, setStep, status } = useAIPhotos();
  const inputRef = useRef(null);
  const objectUrl = useRef(null);

  useEffect(() => () => { if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); }, []);
  useEffect(() => {
    if (rejection) track("ai_photos_upload_rejected", { rejection_reason: rejection });
  }, [rejection]);

  const pick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = URL.createObjectURL(file);
    onPhotoSelected(file, objectUrl.current);
  };

  const rejected = rejection ? COPY.rejections[rejection] : null;
  const hasPhoto = Boolean(photoName);
  const canContinue = hasPhoto && !rejected;

  return (
    <>
      <TopBar title={COPY.uploadTitle} onBack={() => setStep(status === "generated" ? "gallery" : null)} />

      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: `16px ${PAD}px 20px` }}>
        <p style={{ fontSize: 13.5, color: C.sub, lineHeight: "19px", margin: "0 0 16px" }}>{COPY.uploadSub}</p>

        <input ref={inputRef} type="file" accept="image/*" onChange={pick} style={{ display: "none" }} />

        {/* Picker. Shows their own photo once chosen. */}
        <button
          onClick={() => inputRef.current?.click()}
          style={{
            display: "flex", alignItems: "center", gap: 14, width: "100%", minHeight: 96,
            background: hasPhoto ? C.white : C.bg,
            border: `1.5px ${hasPhoto ? "solid" : "dashed"} ${rejected ? "#FDA29B" : hasPhoto ? C.div : C.inact}`,
            borderRadius: 16, padding: 14, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
          }}
        >
          <div style={{ width: 62, height: 78, borderRadius: 10, overflow: "hidden", background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {photoPreview
              ? <img src={photoPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <ImagePlus size={24} color={C.p600} />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14.5, fontWeight: 700, color: C.head, margin: 0 }}>
              {hasPhoto ? COPY.uploadChangeCta : COPY.uploadPickCta}
            </p>
            <p style={{ fontSize: 12, color: C.sub, margin: "3px 0 0", lineHeight: "16px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {hasPhoto ? photoName : COPY.uploadEmpty}
            </p>
          </div>
        </button>

        {/* Rejection. No panel of its own: a box here competes with the photo
            card right above it. Forced from the dev panel, never detection. */}
        {rejected && (
          <div style={{ marginTop: 12 }}>
            <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 700, color: "#B42318", margin: 0 }}>
              <AlertCircle size={15} color="#D92D20" style={{ flexShrink: 0 }} />
              {rejected.title}
            </p>
            <p style={{ fontSize: 12.5, color: C.sub, margin: "4px 0 10px", lineHeight: "17px" }}>{rejected.body}</p>
            <button
              onClick={() => inputRef.current?.click()}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, minHeight: 40, padding: "0 15px", borderRadius: 999, background: C.white, border: `1.5px solid ${C.p600}`, color: C.p600, fontSize: 13, fontWeight: 700, fontFamily: "inherit", cursor: "pointer" }}
            >
              <RefreshCw size={14} /> Choose another photo
            </button>
          </div>
        )}

        {/* Guidance, as pictures. */}
        <div style={{ marginTop: 22 }}>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: C.head, margin: "0 0 9px" }}>{COPY.goodTitle}</p>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 96, flexShrink: 0 }}><ExampleCard {...GOOD_EXAMPLE} good /></div>
            <ul style={{ flex: 1, margin: 0, padding: 0, listStyle: "none" }}>
              {GUIDELINES.map((g) => (
                <li key={g} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 9 }}>
                  <Check size={15} color={C.sText || "#027A48"} strokeWidth={3} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12.5, color: C.sub, lineHeight: "17px" }}>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: C.head, margin: "0 0 9px" }}>{COPY.badTitle}</p>
          <div style={{ display: "flex", gap: 9 }}>
            {BAD_EXAMPLES.map((b) => <ExampleCard key={b.caption} {...b} />)}
          </div>
        </div>

      </div>

      <Footer>
        {/* Consent rides on the button, so there is nothing to tick first. */}
        <p style={{ fontSize: 11, color: C.inact, lineHeight: "15px", textAlign: "center", margin: "0 0 10px" }}>
          {COPY.consentInline}
        </p>
        <Primary disabled={!canContinue} onClick={onUploadSubmitted}>{COPY.uploadSubmitCta}</Primary>
      </Footer>
    </>
  );
}

/* ── 2. Destination ── */

function DestinationStep() {
  const { destination, onDestinationSelected, onSurpriseMe, setStep, status } = useAIPhotos();

  return (
    <>
      <TopBar title={COPY.destTitle} onBack={() => setStep(status === "generated" ? "gallery" : "upload")} />

      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: `16px ${PAD}px 20px` }}>
        <p style={{ fontSize: 13.5, color: C.sub, lineHeight: "19px", margin: "0 0 16px" }}>{COPY.destSub}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {AI_DESTINATIONS.map((d) => {
            const active = destination === d.slug;
            return (
              <button
                key={d.slug}
                onClick={() => onDestinationSelected(d.slug)}
                style={{
                  display: "flex", alignItems: "center", gap: 13, minHeight: 48, padding: 10,
                  background: active ? C.p100 : C.white,
                  border: `1.5px solid ${active ? C.p300 : C.div}`,
                  borderRadius: 16, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                }}
              >
                <img src={d.hero} alt="" style={{ width: 58, height: 58, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: C.head, margin: 0 }}>{d.name}</p>
                  <p style={{ fontSize: 12, color: C.sub, margin: "2px 0 0", lineHeight: "16px" }}>{d.blurb}</p>
                </div>
                {active && (
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: C.p600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Check size={13} color="#fff" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={onSurpriseMe}
            style={{
              display: "flex", alignItems: "center", gap: 13, minHeight: 48, padding: 10,
              background: `linear-gradient(135deg, ${C.p100} 0%, ${C.white} 100%)`,
              border: `1.5px dashed ${C.p300}`, borderRadius: 16,
              cursor: "pointer", fontFamily: "inherit", textAlign: "left",
            }}
          >
            <span style={{ width: 58, height: 58, borderRadius: 12, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 1px 6px rgba(137,18,62,0.12)" }}>
              <Shuffle size={22} color={C.p600} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.head, margin: 0 }}>{COPY.surpriseTitle}</p>
              <p style={{ fontSize: 12, color: C.sub, margin: "2px 0 0", lineHeight: "16px" }}>{COPY.surpriseSub}</p>
            </div>
          </button>
        </div>

        <AiNote center={false} />
      </div>
    </>
  );
}

/* ── 3. Generating ── */

function GeneratingStep() {
  const { destination, status, onGenerationRetried, setStep } = useAIPhotos();
  const reduced = useReducedMotion();
  const dest = getDestination(destination);
  const count = getGeneratedBatch(destination).length || IMAGES_PER_BATCH;
  const [filled, setFilled] = useState(0);

  // Tiles land one by one, so the wait has a shape instead of a spinner.
  useEffect(() => {
    if (status !== "generating") return;
    setFilled(0);
    const t = setInterval(() => setFilled((n) => Math.min(n + 1, count)), 1100);
    return () => clearInterval(t);
  }, [status, count]);

  if (status === "failed") {
    return (
      <>
        <TopBar title="Something went wrong" onBack={() => setStep("destination")} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: `0 ${PAD}px`, textAlign: "center" }}>
          <div style={{ width: 62, height: 62, borderRadius: "50%", background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <AlertCircle size={28} color={C.p600} />
          </div>
          <h2 style={{ fontSize: 19, fontWeight: 800, color: C.head, margin: "0 0 6px" }}>{COPY.failedTitle}</h2>
          <p style={{ fontSize: 13.5, color: C.sub, lineHeight: "19px", margin: "0 0 22px" }}>{COPY.failedSub}</p>
          <div style={{ width: "100%", maxWidth: 280 }}>
            <Primary onClick={onGenerationRetried}><RefreshCw size={16} /> {COPY.failedCta}</Primary>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Making your pictures" onBack={() => setStep("destination")} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: `22px ${PAD}px` }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.head, margin: 0, letterSpacing: "-0.4px" }}>
          {COPY.generatingTitle(dest?.name || "your place")}
        </h2>
        <p style={{ fontSize: 13.5, color: C.sub, lineHeight: "19px", margin: "6px 0 20px" }}>{COPY.generatingSub}</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{
              position: "relative", width: "100%", aspectRatio: "9 / 16",
              borderRadius: 14, overflow: "hidden",
              background: i < filled ? `linear-gradient(150deg, ${C.p300} 0%, ${C.p600} 100%)` : C.bg,
              border: `1px solid ${C.div}`,
              transition: reduced ? "none" : "background 0.5s ease",
            }}>
              <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i < filled
                  ? <Check size={22} color="#fff" strokeWidth={3} />
                  : <Sparkles size={18} color={C.inact} style={{ animation: reduced ? "none" : `pulse 1.4s ease-in-out ${i * 0.18}s infinite` }} />}
              </span>
            </div>
          ))}
        </div>

        <AiNote />
      </div>
    </>
  );
}

/* ── 4. Gallery ── */

function GalleryStep() {
  const {
    destination, images, offline, seen, onGallerySeen,
    onChangePhoto, onChangePlace, openViewer, setSheet, setStep,
  } = useAIPhotos();
  const navigate = useNavigate();
  const dest = getDestination(destination);

  useEffect(() => { if (!seen) onGallerySeen(); }, [seen, onGallerySeen]);

  return (
    <>
      <TopBar
        title={COPY.galleryTitle}
        onBack={() => { setStep(null); navigate(-1); }}
        right={
          <button
            onClick={() => setSheet("removeConfirm")}
            aria-label={COPY.removeAll}
            style={{ width: 40, height: 40, marginRight: -8, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}
          >
            <Trash2 size={18} color={C.inact} />
          </button>
        }
      />

      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto" }}>
        {/* The two things they can change, kept small and out of the way. */}
        <div className="hide-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", padding: `12px ${PAD}px 4px` }}>
          {[
            { icon: RefreshCw, label: COPY.changePhoto, onClick: onChangePhoto },
            { icon: MapPin, label: `${COPY.changePlace}: ${dest?.name || ""}`, onClick: onChangePlace },
          ].map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6, minHeight: 38, flexShrink: 0,
                padding: "0 13px", borderRadius: 999, background: C.white,
                border: `1px solid ${C.div}`, color: C.head,
                fontSize: 12.5, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              <Icon size={14} color={C.p600} /> {label}
            </button>
          ))}
        </div>

        {offline && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: `10px ${PAD}px 0`, background: C.bg, borderRadius: 10, padding: "9px 11px" }}>
            <CloudOff size={14} color={C.sub} />
            <span style={{ fontSize: 12, color: C.sub }}>Offline. Showing the ones you already have.</span>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: `12px ${PAD}px 0` }}>
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => openViewer(i)}
              style={{ position: "relative", width: "100%", aspectRatio: "9 / 16", padding: 0, borderRadius: 14, overflow: "hidden", border: "none", background: C.div, cursor: "pointer" }}
            >
              <img src={img.src} alt={`You both at ${img.location}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 58%, rgba(0,0,0,0.72) 100%)" }} />
              <span style={{ position: "absolute", left: 9, right: 9, bottom: 7, textAlign: "left", textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
                <span style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#fff", lineHeight: "15px" }}>{img.location}</span>
                <span style={{ display: "block", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.82)", lineHeight: "13px" }}>{img.destination}</span>
              </span>
            </button>
          ))}
        </div>

        <div style={{ padding: `16px ${PAD}px 0` }}>
          <Primary onClick={() => { track("ai_photos_plan_trip_tapped", { destination }); navigate(`/destination/${dest?.name}`); }}>
            <Wand2 size={16} /> {COPY.planTripCta(dest?.name || "")}
          </Primary>
          <AiNote />
        </div>

        <div style={{ height: 28 }} />
      </div>
    </>
  );
}

/* ── Remove confirm ── */

function RemoveConfirm() {
  const { sheet, onRemoved, onRemoveCancelled } = useAIPhotos();
  if (sheet !== "removeConfirm") return null;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 260, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={onRemoveCancelled} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", animation: "fadeInBg 0.2s ease forwards" }} />
      <div style={{ position: "relative", width: "100%", background: C.white, borderRadius: 20, padding: "22px 20px", boxShadow: "0 16px 48px rgba(0,0,0,0.25)", textAlign: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#FEF3F2", border: "1px solid #FDA29B", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <Trash2 size={24} color="#D92D20" />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: "0 0 6px" }}>{COPY.removeTitle}</h3>
        <p style={{ fontSize: 13, color: C.sub, lineHeight: "19px", margin: "0 0 20px" }}>{COPY.removeSub}</p>
        <button onClick={onRemoved} style={{ width: "100%", minHeight: 48, borderRadius: 999, border: "none", background: "#D92D20", color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", marginBottom: 8 }}>
          {COPY.removeConfirm}
        </button>
        <button onClick={onRemoveCancelled} style={{ width: "100%", minHeight: 48, borderRadius: 999, border: `1px solid ${C.div}`, background: C.white, color: C.head, fontSize: 15, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>
          {COPY.removeCancel}
        </button>
      </div>
    </div>
  );
}

/* ── Page ── */

export default function AIPhotos() {
  const navigate = useNavigate();
  const { step, setStep, status, loggedIn, setSheet } = useAIPhotos();

  // Landing here directly picks up wherever the couple left off.
  useEffect(() => {
    if (step) return;
    if (!loggedIn) { setSheet("login"); return; }
    setStep(status === "generated" ? "gallery" : "upload");
  }, [step, status, loggedIn, setStep, setSheet]);

  // Leaving the last screen leaves the module.
  useEffect(() => {
    if (step === null && loggedIn) return;
  }, [step, loggedIn]);

  return (
    // Fills the frame's scroll area rather than the frame itself, so the
    // status bar and notch stay clear. The viewer portals over the top.
    <div style={{ height: "100%", background: C.white, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {step === "upload" && <UploadStep />}
      {step === "destination" && <DestinationStep />}
      {step === "generating" && <GeneratingStep />}
      {step === "gallery" && <GalleryStep />}
      {!step && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: C.p600, fontSize: 14, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>
            Back to home
          </button>
        </div>
      )}

      <PhotoViewer />
      <RemoveConfirm />
      <LoginLayer />
      <DevPanelButton onClick={() => setSheet("dev")} />
      <AIPhotosDevPanel />
    </div>
  );
}

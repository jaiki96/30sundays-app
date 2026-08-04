import { useRef, useState, useEffect } from "react";
import { ImagePlus, Check, AlertCircle } from "lucide-react";
import { C } from "../../data";
import Sheet, { PrimaryButton } from "./Sheet";
import { useAIPhotos } from "../../state/useAIPhotos";
import { COPY, track } from "../../data/aiPhotosData";

// Half-modal upload. Any file is accepted: no person-count validation, no real
// face detection. Rejection copy below is wired but only reachable from the dev
// panel so the wording can be reviewed.
export default function UploadSheet() {
  const { sheet, setSheet, photoName, rejection, onPhotoSelected, onConsentChecked, onUploadSubmitted, onUploadAbandoned } = useAIPhotos();
  const open = sheet === "upload";
  const inputRef = useRef(null);
  const [consent, setConsent] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => { if (open) { setConsent(false); setPreview(null); } }, [open]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  useEffect(() => {
    if (open && rejection) track("ai_photos_upload_rejected", { rejection_reason: rejection });
  }, [open, rejection]);

  const pickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file); });
    onPhotoSelected(file);
  };

  const toggleConsent = () => {
    setConsent((c) => {
      if (!c) onConsentChecked();
      return !c;
    });
  };

  const rejected = rejection ? COPY.rejections[rejection] : null;
  const hardBlocked = rejection === "minor_detected";
  const hasPhoto = Boolean(photoName);
  const canContinue = hasPhoto && consent && !hardBlocked;

  const lastStep = !hasPhoto ? "photo_pick" : !consent ? "consent" : "destination";

  return (
    <Sheet
      open={open}
      onClose={() => onUploadAbandoned(lastStep)}
      title={COPY.uploadTitle}
      sub={COPY.uploadSub}
      footer={
        <PrimaryButton disabled={!canContinue} onClick={onUploadSubmitted}>
          {COPY.uploadSubmitCta}
        </PrimaryButton>
      }
    >
      <input ref={inputRef} type="file" accept="image/*" onChange={pickFile} style={{ display: "none" }} />

      {/* Photo picker */}
      <button
        onClick={() => inputRef.current?.click()}
        style={{
          width: "100%", minHeight: 96, display: "flex", alignItems: "center", gap: 14,
          background: hasPhoto ? C.white : C.bg, border: `1.5px ${hasPhoto ? "solid" : "dashed"} ${hasPhoto ? C.div : C.inact}`,
          borderRadius: 16, padding: 14, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
        }}
      >
        <div style={{ width: 64, height: 64, borderRadius: 12, overflow: "hidden", background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {preview
            ? <img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <ImagePlus size={24} color={C.p600} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.head, margin: 0 }}>
            {hasPhoto ? COPY.uploadChangeCta : COPY.uploadPickCta}
          </p>
          <p style={{ fontSize: 12, color: C.sub, margin: "3px 0 0", lineHeight: "16px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {hasPhoto ? photoName : "One photo with both your faces in it"}
          </p>
        </div>
      </button>

      <p style={{ fontSize: 11.5, color: C.inact, margin: "10px 2px 0", lineHeight: "16px" }}>{COPY.uploadHint}</p>

      {/* Rejection copy. Forced from the dev panel, never from real detection. */}
      {rejected && (
        <div style={{ display: "flex", gap: 10, marginTop: 14, background: C.wBg || "#FFFAEB", border: `1px solid ${C.wBg ? "#FEDF89" : "#FEDF89"}`, borderRadius: 12, padding: "12px 13px" }}>
          <AlertCircle size={17} color={C.wText || "#B54708"} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.wText || "#B54708", margin: 0 }}>{rejected.title}</p>
            <p style={{ fontSize: 12, color: C.sub, margin: "3px 0 0", lineHeight: "17px" }}>{rejected.body}</p>
          </div>
        </div>
      )}

      {/* Consent gate. The CTA stays disabled until this is ticked. */}
      <div
        onClick={toggleConsent}
        role="checkbox"
        aria-checked={consent}
        style={{ display: "flex", alignItems: "flex-start", gap: 11, marginTop: 16, cursor: "pointer", minHeight: 48, padding: "2px 0" }}
      >
        <span style={{
          width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
          border: `1.5px solid ${consent ? C.p600 : C.inact}`, background: consent ? C.p600 : C.white,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {consent && <Check size={14} color="#fff" strokeWidth={3} />}
        </span>
        <span style={{ fontSize: 12.5, color: C.sub, lineHeight: "18px" }}>{COPY.consent}</span>
      </div>
    </Sheet>
  );
}

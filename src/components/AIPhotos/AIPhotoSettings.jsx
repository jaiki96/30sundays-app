import { useRef } from "react";
import { MapPin, RefreshCw, EyeOff, Eye, Trash2, ChevronRight } from "lucide-react";
import { C } from "../../data";
import Sheet, { PrimaryButton } from "./Sheet";
import { useAIPhotos } from "../../state/useAIPhotos";
import { COPY, getDestination, track } from "../../data/aiPhotosData";

function Row({ icon: Icon, label, sub, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 13, width: "100%", minHeight: 48,
        padding: "13px 4px", background: "none", border: "none",
        borderBottom: `1px solid ${C.div}`, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
      }}
    >
      <Icon size={18} color={danger ? C.p600 : C.sub} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: danger ? C.p600 : C.head, margin: 0 }}>{label}</p>
        {sub && <p style={{ fontSize: 12, color: C.sub, margin: "2px 0 0", lineHeight: "16px" }}>{sub}</p>}
      </div>
      <ChevronRight size={17} color={C.inact} style={{ flexShrink: 0 }} />
    </button>
  );
}

export default function AIPhotoSettings() {
  const {
    sheet, setSheet, destination, hidden,
    onPhotoSelected, onPhotoReplaced, onHidden, onUnhidden, onRemoved, onRemoveCancelled,
  } = useAIPhotos();
  const fileRef = useRef(null);
  const dest = getDestination(destination);

  const replace = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onPhotoSelected(file);
    onPhotoReplaced();
  };

  return (
    <>
      <Sheet
        open={sheet === "settings"}
        onClose={() => setSheet(null)}
        title={COPY.settingsTitle}
        sub={dest ? `You're seeing ${dest.name} right now.` : undefined}
      >
        <input ref={fileRef} type="file" accept="image/*" onChange={replace} style={{ display: "none" }} />

        <Row
          icon={MapPin}
          label="Change destination"
          sub="Starts you again at the first spot"
          onClick={() => { track("ai_photos_destination_picker_viewed", {}); setSheet("destination"); }}
        />
        <Row
          icon={RefreshCw}
          label="Replace photo"
          sub="Makes today's image again with a new photo"
          onClick={() => fileRef.current?.click()}
        />
        {hidden ? (
          <Row icon={Eye} label="Show in hero again" sub="Your images are still here" onClick={onUnhidden} />
        ) : (
          <Row icon={EyeOff} label="Hide from hero" sub="Keeps everything, just stops showing it" onClick={onHidden} />
        )}
        <Row
          icon={Trash2}
          label="Remove photo"
          sub="Deletes your photo and every image"
          danger
          onClick={() => setSheet("removeConfirm")}
        />
      </Sheet>

      {/* Remove is the only action that asks twice. */}
      <Sheet
        open={sheet === "removeConfirm"}
        onClose={onRemoveCancelled}
        title={COPY.removeTitle}
        sub={COPY.removeSub}
        footer={
          <>
            <PrimaryButton onClick={onRemoved}>{COPY.removeConfirm}</PrimaryButton>
            <button
              onClick={onRemoveCancelled}
              style={{ width: "100%", minHeight: 48, marginTop: 8, borderRadius: 12, border: `1px solid ${C.div}`, background: C.white, color: C.head, fontSize: 15, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}
            >
              {COPY.removeCancel}
            </button>
          </>
        }
      />
    </>
  );
}

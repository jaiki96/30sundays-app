import { useEffect, useRef } from "react";
import { Sparkles, X as XIcon, ChevronRight } from "lucide-react";
import { C } from "../../data";
import { useAIPhotos } from "../../state/useAIPhotos";
import { COPY, track } from "../../data/aiPhotosData";

// Sits below the hero, not inside it. Visible to everyone: the login gate is
// on the action, not on the nudge.
export default function NudgeStrip() {
  const { showNudge, loggedIn, onNudgeTapped, onNudgeDismissed } = useAIPhotos();
  const fired = useRef(false);

  useEffect(() => {
    if (!showNudge || fired.current) return;
    const t = setTimeout(() => {
      fired.current = true;
      track("ai_photos_nudge_viewed", { login_state: loggedIn ? "logged_in" : "logged_out", entry_source: "home_hero" });
    }, 1000);
    return () => clearTimeout(t);
  }, [showNudge, loggedIn]);

  if (!showNudge) return null;

  return (
    <div style={{ padding: "14px 18px 0" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        background: `linear-gradient(135deg, ${C.p100} 0%, #fff 100%)`,
        border: `1px solid ${C.p100}`, borderRadius: 16, padding: "12px 12px 12px 14px",
        boxShadow: "0 4px 18px rgba(137,18,62,0.08)",
        animation: "nudgeIn 0.4s ease-out both",
      }}>
        <div
          onClick={onNudgeTapped}
          role="button"
          style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0, cursor: "pointer", minHeight: 48 }}
        >
          <div style={{ width: 38, height: 38, borderRadius: 12, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 1px 6px rgba(137,18,62,0.12)" }}>
            <Sparkles size={18} color={C.p600} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Chevron sits on the title line, not floating in the middle. */}
            <p style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 14, fontWeight: 700, color: C.head, margin: 0, letterSpacing: "-0.2px" }}>
              {COPY.nudgeTitle}
              <ChevronRight size={16} color={C.p600} style={{ flexShrink: 0 }} />
            </p>
            <p style={{ fontSize: 12, color: C.sub, margin: "2px 0 0", lineHeight: "16px" }}>{COPY.nudgeSub}</p>
          </div>
        </div>

        {/* Instant dismiss, no confirmation. */}
        <button
          onClick={onNudgeDismissed}
          aria-label="Dismiss"
          style={{ width: 48, height: 48, margin: "-6px -8px -6px 0", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}
        >
          <XIcon size={16} color={C.inact} />
        </button>
      </div>
    </div>
  );
}

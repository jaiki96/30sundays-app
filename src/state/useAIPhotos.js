import { createContext, useContext, useState, useRef, useCallback, useEffect, useMemo, createElement } from "react";
import { getGeneratedImage, track, LOCATIONS_PER_DESTINATION, AI_DESTINATIONS } from "../data/aiPhotosData";

// Mocked real-time generation. The PRD expects 5 to 15 seconds in production.
const GENERATION_MS = 6000;

// Mock persistence layer. Module scope on purpose: it survives component
// remounts and route changes, and resets on reload. Browser storage is ruled
// out for this prototype, so nothing here touches localStorage.
const INITIAL = {
  loggedIn: true,
  hasPhoto: false,
  photoName: null,
  destination: null,      // destination slug
  status: "none",         // none | generating | generated | failed
  locationIndex: 0,       // 0-based position in the 7 location cycle
  seen: false,            // reveal has played
  hidden: false,
  nudgeDismissed: false,
  nudgeSuppressed: false, // set by hide and remove, nudge never returns
  dismissalCount: 0,
  offline: false,
  rejection: null,        // no_face | moderation | minor_detected
};

let mockStore = { ...INITIAL };

const AIPhotosContext = createContext(null);

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

export function AIPhotosProvider({ children }) {
  const [state, setState] = useState(mockStore);
  const [sheet, setSheet] = useState(null);       // login | upload | destination | settings | removeConfirm | dev
  const [fullScreen, setFullScreen] = useState(false);
  const timerRef = useRef(null);

  // Mirror every change into the mock store so state survives a remount.
  useEffect(() => { mockStore = state; }, [state]);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const patch = useCallback((p) => setState((s) => ({ ...s, ...(typeof p === "function" ? p(s) : p) })), []);

  // ─── Generation ───
  const runGeneration = useCallback((slug, triggerType, { resetCycle = false } = {}) => {
    clearTimeout(timerRef.current);
    const startedAt = Date.now();
    track("ai_photos_generation_requested", { trigger_type: triggerType, destination: slug });
    setState((s) => ({
      ...s,
      destination: slug,
      status: "generating",
      hidden: false,
      seen: false,
      locationIndex: resetCycle ? 0 : s.locationIndex,
    }));
    timerRef.current = setTimeout(() => {
      track("ai_photos_generation_succeeded", { duration_ms: Date.now() - startedAt, trigger_type: triggerType });
      setState((s) => (s.status === "generating" ? { ...s, status: "generated", seen: false } : s));
    }, GENERATION_MS);
  }, []);

  // ─── Entry ───
  // Nudge is visible to everyone. The gate is here, at the action.
  const onNudgeTapped = useCallback(() => {
    track("ai_photos_nudge_tapped", { login_state: state.loggedIn ? "logged_in" : "logged_out", entry_source: "home_hero" });
    if (!state.loggedIn) {
      track("ai_photos_login_prompted", {});
      setSheet("login");
      return;
    }
    track("ai_photos_upload_sheet_viewed", {});
    setSheet("upload");
  }, [state.loggedIn]);

  const onNudgeDismissed = useCallback(() => {
    setState((s) => {
      track("ai_photos_nudge_dismissed", { dismissal_count: s.dismissalCount + 1 });
      return { ...s, nudgeDismissed: true, dismissalCount: s.dismissalCount + 1 };
    });
  }, []);

  // Intent is preserved through login, so the couple lands on upload, not home.
  const onLoginCompleted = useCallback(() => {
    track("ai_photos_login_completed", { intent_preserved: true });
    setState((s) => ({ ...s, loggedIn: true }));
    track("ai_photos_upload_sheet_viewed", {});
    setSheet("upload");
  }, []);

  // ─── Upload ───
  const onPhotoSelected = useCallback((file) => {
    track("ai_photos_photo_selected", {
      file_size_kb: file?.size ? Math.round(file.size / 1024) : null,
      file_type: file?.type || null,
    });
    setState((s) => ({ ...s, photoName: file?.name || "your photo", rejection: null }));
  }, []);

  const onConsentChecked = useCallback(() => track("ai_photos_consent_checked", {}), []);

  const onUploadSubmitted = useCallback(() => {
    track("ai_photos_upload_submitted", {});
    setState((s) => ({ ...s, hasPhoto: true }));
    track("ai_photos_destination_picker_viewed", {});
    setSheet("destination");
  }, []);

  const onUploadAbandoned = useCallback((lastStep) => {
    track("ai_photos_upload_abandoned", { last_step: lastStep });
    setSheet(null);
  }, []);

  // ─── Destination ───
  const onDestinationSelected = useCallback((slug) => {
    setSheet(null);
    setState((s) => {
      const isChange = Boolean(s.destination) && s.destination !== slug;
      track("ai_photos_destination_selected", { destination: slug, is_change: isChange, previous_destination: s.destination });
      return s;
    });
    // Changing destination restarts the cycle at location 1.
    runGeneration(slug, state.destination ? "destination_change" : "first_upload", { resetCycle: true });
  }, [runGeneration, state.destination]);

  // Couples who have not picked a place yet get one chosen for them. Never
  // repeats the destination they are already on.
  const onSurpriseMe = useCallback(() => {
    const pool = AI_DESTINATIONS.filter((d) => d.slug !== state.destination);
    const pick = pool[Math.floor(Math.random() * pool.length)] || AI_DESTINATIONS[0];
    track("ai_photos_surprise_me_tapped", { destination: pick.slug });
    onDestinationSelected(pick.slug);
  }, [onDestinationSelected, state.destination]);

  // ─── Slide interactions ───
  const onRevealPlayed = useCallback(() => {
    track("ai_photos_reveal_played", {});
    setState((s) => (s.seen ? s : { ...s, seen: true }));
  }, []);

  const onHeroTapped = useCallback(() => {
    track("ai_photos_hero_tapped", {});
    track("ai_photos_fullscreen_viewed", {});
    setFullScreen(true);
  }, []);

  const onGenerationRetried = useCallback(() => {
    track("ai_photos_generation_retried", {});
    if (state.destination) runGeneration(state.destination, "first_upload");
  }, [runGeneration, state.destination]);

  // Both signals carry the same properties, so quality can be read per location.
  const rate = useCallback((event) => {
    const img = state.status === "generated" ? getGeneratedImage(state.destination, state.locationIndex) : null;
    track(event, { destination: state.destination, location_index: img?.locationIndex ?? null });
  }, [state.destination, state.locationIndex, state.status]);

  const onThumbsUp = useCallback(() => rate("ai_photos_thumbs_up"), [rate]);
  const onThumbsDown = useCallback(() => rate("ai_photos_thumbs_down"), [rate]);

  // ─── Settings ───
  const onPhotoReplaced = useCallback(() => {
    track("ai_photos_photo_replaced", {});
    setSheet(null);
    if (state.destination) runGeneration(state.destination, "photo_replace");
  }, [runGeneration, state.destination]);

  const onHidden = useCallback(() => {
    track("ai_photos_hidden", {});
    setFullScreen(false);
    setSheet(null);
    patch({ hidden: true, nudgeSuppressed: true });
  }, [patch]);

  const onUnhidden = useCallback(() => {
    track("ai_photos_unhidden", {});
    patch({ hidden: false });
  }, [patch]);

  const onRemoved = useCallback(() => {
    track("ai_photos_removed", {});
    clearTimeout(timerRef.current);
    setSheet(null);
    setFullScreen(false);
    patch({
      hasPhoto: false, photoName: null, destination: null, status: "none",
      locationIndex: 0, seen: false, hidden: false, nudgeSuppressed: true,
    });
  }, [patch]);

  const onRemoveCancelled = useCallback(() => {
    track("ai_photos_remove_cancelled", {});
    setSheet("settings");
  }, []);

  // ─── Dev panel ───
  // Reviewers need to land on any state without waiting out the 6s delay.
  const forceState = useCallback((name) => {
    clearTimeout(timerRef.current);
    setFullScreen(false);
    setSheet(null);
    const base = { rejection: null };
    const presets = {
      loggedOut:       { ...INITIAL, loggedIn: false },
      noPhoto:         { ...INITIAL },
      generating:      { ...INITIAL, hasPhoto: true, destination: "bali", status: "generating" },
      generatedUnseen: { ...INITIAL, hasPhoto: true, destination: "bali", status: "generated", seen: false },
      generatedSeen:   { ...INITIAL, hasPhoto: true, destination: "bali", status: "generated", seen: true },
      failed:          { ...INITIAL, hasPhoto: true, destination: "bali", status: "failed" },
      hidden:          { ...INITIAL, hasPhoto: true, destination: "bali", status: "generated", seen: true, hidden: true, nudgeSuppressed: true },
      removed:         { ...INITIAL, nudgeSuppressed: true },
      offline:         { ...INITIAL, hasPhoto: true, destination: "bali", status: "generated", seen: true, offline: true },
    };
    if (presets[name]) setState({ ...presets[name], ...base });
  }, []);

  const image = useMemo(
    () => (state.status === "generated" && state.destination ? getGeneratedImage(state.destination, state.locationIndex) : null),
    [state.status, state.destination, state.locationIndex]
  );

  // Generating, generated and failed all occupy carousel slot 0. Hiding pulls
  // it out of the carousel without deleting anything.
  const showPersonalized = state.status !== "none" && !state.hidden;
  const showNudge = state.status === "none" && !state.nudgeDismissed && !state.nudgeSuppressed;

  const value = {
    ...state,
    image,
    showPersonalized,
    showNudge,
    locationCount: LOCATIONS_PER_DESTINATION,
    sheet, setSheet,
    fullScreen, setFullScreen,
    patch, forceState,
    onNudgeTapped, onNudgeDismissed, onLoginCompleted,
    onPhotoSelected, onConsentChecked, onUploadSubmitted, onUploadAbandoned,
    onDestinationSelected, onSurpriseMe,
    onRevealPlayed, onHeroTapped, onGenerationRetried, onThumbsUp, onThumbsDown,
    onPhotoReplaced, onHidden, onUnhidden, onRemoved, onRemoveCancelled,
  };

  return createElement(AIPhotosContext.Provider, { value }, children);
}

export function useAIPhotos() {
  const ctx = useContext(AIPhotosContext);
  if (!ctx) throw new Error("useAIPhotos must be used inside AIPhotosProvider");
  return ctx;
}

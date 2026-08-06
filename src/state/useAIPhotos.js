import { createContext, useContext, useState, useRef, useCallback, useEffect, useMemo, createElement } from "react";
import { getGeneratedBatch, track, AI_DESTINATIONS, IMAGES_PER_BATCH } from "../data/aiPhotosData";

// Mocked generation. The PRD expects 5 to 15 seconds in production.
const GENERATION_MS = 6000;

// Mock persistence layer. Module scope on purpose: it survives component
// remounts and route changes, and resets on reload. Browser storage is ruled
// out for this prototype, so nothing here touches localStorage.
const INITIAL = {
  loggedIn: true,
  hasPhoto: false,
  photoName: null,
  photoPreview: null,
  destination: null,      // destination slug
  status: "none",         // none | generating | generated | failed
  seen: false,            // gallery has been opened once
  offline: false,
  rejection: null,        // no_face | group_photo | too_far | moderation | minor_detected
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
  // Which screen of the module is showing. Full screen now, not sheets.
  const [step, setStep] = useState(null);   // upload | destination | generating | gallery
  const [sheet, setSheet] = useState(null); // login | removeConfirm | dev
  const [viewerIndex, setViewerIndex] = useState(null);
  const timerRef = useRef(null);

  // Mirror every change into the mock store so state survives a remount.
  useEffect(() => { mockStore = state; }, [state]);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const patch = useCallback((p) => setState((s) => ({ ...s, ...(typeof p === "function" ? p(s) : p) })), []);

  // ─── Generation ───
  const runGeneration = useCallback((slug, triggerType) => {
    clearTimeout(timerRef.current);
    const startedAt = Date.now();
    track("ai_photos_generation_requested", { trigger_type: triggerType, destination: slug, image_count: IMAGES_PER_BATCH });
    setState((s) => ({ ...s, destination: slug, status: "generating", seen: false }));
    setStep("generating");
    timerRef.current = setTimeout(() => {
      track("ai_photos_generation_succeeded", { duration_ms: Date.now() - startedAt, trigger_type: triggerType });
      setState((s) => (s.status === "generating" ? { ...s, status: "generated" } : s));
      setStep("gallery");
    }, GENERATION_MS);
  }, []);

  // ─── Entry ───
  // The section on the home screen is visible to everyone. The login gate is
  // here, at the action, so nobody is asked to sign in before they see why.
  const onStart = useCallback(() => {
    track("ai_photos_entry_tapped", { login_state: state.loggedIn ? "logged_in" : "logged_out", entry_source: "home_section" });
    if (!state.loggedIn) {
      track("ai_photos_login_prompted", {});
      setSheet("login");
      return;
    }
    track("ai_photos_upload_viewed", {});
    setStep(state.status === "generated" ? "gallery" : "upload");
  }, [state.loggedIn, state.status]);

  // Intent is preserved through login, so the couple lands on upload, not home.
  const onLoginCompleted = useCallback(() => {
    track("ai_photos_login_completed", { intent_preserved: true });
    setState((s) => ({ ...s, loggedIn: true }));
    setSheet(null);
    setStep("upload");
  }, []);

  // ─── Upload ───
  const onPhotoSelected = useCallback((file, previewUrl) => {
    track("ai_photos_photo_selected", {
      file_size_kb: file?.size ? Math.round(file.size / 1024) : null,
      file_type: file?.type || null,
    });
    setState((s) => ({ ...s, photoName: file?.name || "your photo", photoPreview: previewUrl || null, rejection: null }));
  }, []);

  const onConsentChecked = useCallback(() => track("ai_photos_consent_checked", {}), []);

  const onUploadSubmitted = useCallback(() => {
    track("ai_photos_upload_submitted", {});
    setState((s) => ({ ...s, hasPhoto: true }));
    track("ai_photos_destination_viewed", {});
    setStep("destination");
  }, []);

  // ─── Destination ───
  const onDestinationSelected = useCallback((slug) => {
    setState((s) => {
      const isChange = Boolean(s.destination) && s.destination !== slug;
      track("ai_photos_destination_selected", { destination: slug, is_change: isChange, previous_destination: s.destination });
      return s;
    });
    runGeneration(slug, state.destination ? "destination_change" : "first_upload");
  }, [runGeneration, state.destination]);

  // For couples who have not settled on a place. Never repeats the one they
  // are already on.
  const onSurpriseMe = useCallback(() => {
    const pool = AI_DESTINATIONS.filter((d) => d.slug !== state.destination);
    const pick = pool[Math.floor(Math.random() * pool.length)] || AI_DESTINATIONS[0];
    track("ai_photos_surprise_me_tapped", { destination: pick.slug });
    onDestinationSelected(pick.slug);
  }, [onDestinationSelected, state.destination]);

  const onGenerationRetried = useCallback(() => {
    track("ai_photos_generation_retried", {});
    if (state.destination) runGeneration(state.destination, "retry");
  }, [runGeneration, state.destination]);

  // ─── Gallery ───
  const onGallerySeen = useCallback(() => {
    setState((s) => (s.seen ? s : { ...s, seen: true }));
  }, []);

  const onChangePhoto = useCallback(() => {
    track("ai_photos_change_photo_tapped", {});
    setStep("upload");
  }, []);

  const onChangePlace = useCallback(() => {
    track("ai_photos_change_place_tapped", {});
    setStep("destination");
  }, []);

  const onRemoved = useCallback(() => {
    track("ai_photos_removed", {});
    clearTimeout(timerRef.current);
    setSheet(null);
    setViewerIndex(null);
    setStep(null);
    setState({ ...INITIAL, loggedIn: true });
  }, []);

  const onRemoveCancelled = useCallback(() => {
    track("ai_photos_remove_cancelled", {});
    setSheet(null);
  }, []);

  // ─── Viewer ───
  const images = useMemo(
    () => (state.status === "generated" && state.destination ? getGeneratedBatch(state.destination) : []),
    [state.status, state.destination]
  );

  const openViewer = useCallback((i) => {
    track("ai_photos_fullscreen_opened", { image_index: i });
    setViewerIndex(i);
  }, []);

  const rate = useCallback((event, i) => {
    track(event, { destination: state.destination, image_index: i });
  }, [state.destination]);

  // ─── Dev panel ───
  // Reviewers need to land on any state without waiting out the delay.
  const forceState = useCallback((name) => {
    clearTimeout(timerRef.current);
    setViewerIndex(null);
    setSheet(null);
    const withPhoto = { ...INITIAL, loggedIn: true, hasPhoto: true, photoName: "our-photo.jpg", destination: "bali" };
    const presets = {
      loggedOut:  [{ ...INITIAL, loggedIn: false }, null],
      noPhoto:    [{ ...INITIAL }, "upload"],
      generating: [{ ...withPhoto, status: "generating" }, "generating"],
      generated:  [{ ...withPhoto, status: "generated", seen: false }, "gallery"],
      failed:     [{ ...withPhoto, status: "failed" }, "generating"],
      removed:    [{ ...INITIAL }, null],
      offline:    [{ ...withPhoto, status: "generated", seen: true, offline: true }, "gallery"],
    };
    const preset = presets[name];
    if (!preset) return;
    setState(preset[0]);
    setStep(preset[1]);
  }, []);

  const value = {
    ...state,
    images,
    imageCount: IMAGES_PER_BATCH,
    step, setStep,
    sheet, setSheet,
    viewerIndex, setViewerIndex, openViewer,
    patch, forceState, rate,
    onStart, onLoginCompleted,
    onPhotoSelected, onConsentChecked, onUploadSubmitted,
    onDestinationSelected, onSurpriseMe, onGenerationRetried,
    onGallerySeen, onChangePhoto, onChangePlace, onRemoved, onRemoveCancelled,
  };

  return createElement(AIPhotosContext.Provider, { value }, children);
}

export function useAIPhotos() {
  const ctx = useContext(AIPhotosContext);
  if (!ctx) throw new Error("useAIPhotos must be used inside AIPhotosProvider");
  return ctx;
}

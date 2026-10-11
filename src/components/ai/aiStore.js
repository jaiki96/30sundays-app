import { useSyncExternalStore } from "react";

// Tiny shared store so the assistant survives navigation (Home → itinerary → back)
// and so screens that know the demo state / draft trip can hand them to the dock.
// Every write replaces the snapshot object: useSyncExternalStore re-renders on
// identity change, so mutating in place would never update subscribers.
let state = { open: false, mode: "", userState: "new", trip: null, started: false };
const subs = new Set();
const emit = () => subs.forEach((f) => f());
export const aiStore = {
  get: () => state,
  set: (patch) => { state = { ...state, ...patch }; emit(); },
  open: (mode = "") => { state = { ...state, open: true, mode, started: true }; emit(); },
  close: () => { state = { ...state, open: false }; emit(); },
  subscribe: (f) => { subs.add(f); return () => subs.delete(f); },
};
export function useAiStore() { return useSyncExternalStore(aiStore.subscribe, aiStore.get, aiStore.get); }

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, createElement } from "react";

// ─── One wishlist ───
//
// The app used to keep three lists that never met: the plan versions a couple
// hearted in My Plans, the regions and activities they hearted while browsing a
// destination, and a demo catalogue of hotels and restaurants nothing could add
// to. One store now. Every save is filed under the destination it was tapped in,
// because the screen that owns the heart always knows where it is, and the
// Saved screen reads them back as destination folders.
//
// An item is { kind, dest, id, name, img, sub, city, savedAt }. The kind says
// what it is, the id is whatever the live data calls it (a city name for a
// region, `city::name` for an activity, a version id for a trip, a hotel's name
// for a hotel), and name/img/sub are a snapshot so the list can draw a row
// without knowing where the thing came from.

export const KINDS = ["trip", "region", "activity", "hotel", "restaurant", "shop"];
export const KIND_LABEL = {
  trip: "Trips", region: "Regions", activity: "Things to do",
  hotel: "Stays", restaurant: "Food", shop: "Shops",
};
// What one of them is called, in a row's small print.
export const KIND_NOUN = {
  trip: "Trip", region: "Region", activity: "Thing to do",
  hotel: "Stay", restaurant: "Restaurant", shop: "Shop",
};
// The tabs on the Saved screen. Regions are a filter there, not a tab.
export const TAB_KINDS = ["trip", "hotel", "activity", "restaurant", "shop"];

export const wishKey = (kind, dest, id) => `${kind}|${dest}|${id}`;

const KEY = "30s_wishlist_v2";
const SEED_KEY = "30s_wishlist_seeded_v3";
const OLD_SAVES_KEY = "30s_saves_v1";
const TOAST_MS = 3200;

// A little demo content so the screen opens with something to show. The same
// Bali bases the discover flow used to seed, so the routes it generates still
// have something to work from.
function seed() {
  const now = Date.now();
  const out = {};
  ["Ubud", "Seminyak", "Canggu", "Sanur", "Nusa Penida"].forEach((city, i) => {
    const k = wishKey("region", "Bali", city);
    out[k] = { key: k, kind: "region", dest: "Bali", id: city, name: city, savedAt: now - (5 - i) * 60000 };
  });
  return out;
}

// The old discover saves ({ dest: { regions: [], activities: [] } }) come
// across as region and activity items, so nobody loses a heart to the merge.
function migrateOldSaves() {
  let old = null;
  try { old = JSON.parse(localStorage.getItem(OLD_SAVES_KEY)); } catch { old = null; }
  if (!old || typeof old !== "object") return null;
  const now = Date.now();
  const out = {};
  Object.entries(old).forEach(([dest, s]) => {
    (s?.regions || []).forEach((city) => {
      const k = wishKey("region", dest, city);
      out[k] = { key: k, kind: "region", dest, id: city, name: city, savedAt: now };
    });
    (s?.activities || []).forEach((id) => {
      const k = wishKey("activity", dest, id);
      const [city, name] = String(id).includes("::") ? String(id).split("::") : [null, String(id)];
      out[k] = { key: k, kind: "activity", dest, id, name, city, savedAt: now };
    });
  });
  try { localStorage.removeItem(OLD_SAVES_KEY); } catch { /* ignore */ }
  return out;
}

function load() {
  let data = null;
  try { data = JSON.parse(localStorage.getItem(KEY)); } catch { data = null; }
  try {
    if (!localStorage.getItem(SEED_KEY)) {
      const migrated = migrateOldSaves();
      data = { ...(data || {}), ...(migrated || seed()) };
      localStorage.setItem(SEED_KEY, "1");
      localStorage.setItem(KEY, JSON.stringify(data));
    }
  } catch { /* ignore */ }
  return data && typeof data === "object" ? data : {};
}
function persist(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [map, setMap] = useState(load);
  useEffect(() => { persist(map); }, [map]);

  // The "saved to your wishlist" toast. One for the whole app, raised here when
  // a heart turns on, so every screen says it the same way.
  const [toast, setToast] = useState(null); // { name, dest, at }
  const toastTimer = useRef(null);
  const dismissToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(null);
  }, []);
  const raiseToast = useCallback((name, dest) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ name, dest, at: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), TOAST_MS);
  }, []);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const isSaved = useCallback((kind, dest, id) => !!map[wishKey(kind, dest, id)], [map]);
  const get = useCallback((kind, dest, id) => map[wishKey(kind, dest, id)] || null, [map]);

  // meta is { name, img, sub, city, ...anything else worth keeping }.
  const save = useCallback((kind, dest, id, meta = {}, { silent = false } = {}) => {
    const k = wishKey(kind, dest, id);
    setMap((m) => m[k] ? m : { ...m, [k]: { ...meta, key: k, kind, dest, id, name: meta.name || String(id), savedAt: Date.now() } });
    if (!silent) raiseToast(meta.name || String(id), dest);
  }, [raiseToast]);

  const remove = useCallback((kind, dest, id) => {
    const k = wishKey(kind, dest, id);
    setMap((m) => { if (!m[k]) return m; const n = { ...m }; delete n[k]; return n; });
  }, []);

  // Returns true when the heart just turned on, so a caller can react to that.
  const toggle = useCallback((kind, dest, id, meta = {}, opts = {}) => {
    const on = !map[wishKey(kind, dest, id)];
    if (on) save(kind, dest, id, meta, opts); else remove(kind, dest, id);
    return on;
  }, [map, save, remove]);

  const items = useMemo(() => Object.values(map).sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0)), [map]);

  // Destinations, most recently saved-into first. This is the folder order on
  // the Saved screen, and the first one is where it opens.
  const destinations = useMemo(() => {
    const seen = new Set();
    const out = [];
    items.forEach((it) => { if (!seen.has(it.dest)) { seen.add(it.dest); out.push(it.dest); } });
    return out;
  }, [items]);

  const counts = useMemo(() => {
    const byDest = {};
    const byKind = {};
    items.forEach((it) => {
      byKind[it.kind] = (byKind[it.kind] || 0) + 1;
      const d = byDest[it.dest] || (byDest[it.dest] = { total: 0 });
      d.total += 1;
      d[it.kind] = (d[it.kind] || 0) + 1;
    });
    return { total: items.length, byKind, byDest };
  }, [items]);

  const forDest = useCallback((dest) => items.filter((it) => it.dest === dest), [items]);
  const ofKind = useCallback((kind, dest) => items.filter((it) => it.kind === kind && (!dest || it.dest === dest)), [items]);

  const value = useMemo(() => ({
    items, destinations, counts,
    isSaved, get, save, remove, toggle, forDest, ofKind,
    toast, dismissToast,
  }), [items, destinations, counts, isSaved, get, save, remove, toggle, forDest, ofKind, toast, dismissToast]);

  return createElement(WishlistContext.Provider, { value }, children);
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

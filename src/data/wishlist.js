import { createContext, useContext, useState, useEffect, useCallback, useMemo, createElement } from "react";
import { WISHLIST_CATALOG, POI_CATEGORIES } from "./wishlistData";

// Saved & Wishlist store for the four "things" categories (hotels, activities,
// restaurants, shopping). Saved ITINERARIES live in the deals store (the plan
// versions a user hearts in My Plans), so they are not tracked here.
// Shape: { [category]: { [itemId]: true } }

const KEY = "30s_wishlist_v1";
const SEED_KEY = "30s_wishlist_seeded_v2";

const emptyState = () => POI_CATEGORIES.reduce((m, c) => ({ ...m, [c]: {} }), {});

// A little demo content so the screen opens with something to show.
function seed() {
  return {
    hotels: { h_seminyak_grand: true },
    activities: { a_swing: true, a_atv: true },
    restaurants: { r_locavore: true },
    shopping: { s_ubudart: true },
  };
}

function load() {
  let data = null;
  try { data = JSON.parse(localStorage.getItem(KEY)); } catch { data = null; }
  try {
    if (!localStorage.getItem(SEED_KEY)) {
      data = seed();
      localStorage.setItem(SEED_KEY, "1");
      localStorage.setItem(KEY, JSON.stringify(data));
    }
  } catch { /* ignore */ }
  return { ...emptyState(), ...(data || {}) };
}
function persist(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [saved, setSaved] = useState(load);
  useEffect(() => { persist(saved); }, [saved]);

  const toggle = useCallback((cat, id) => {
    setSaved((s) => ({ ...s, [cat]: { ...(s[cat] || {}), [id]: !s[cat]?.[id] } }));
  }, []);
  const isSaved = useCallback((cat, id) => !!saved[cat]?.[id], [saved]);
  const savedItems = useCallback(
    (cat) => (WISHLIST_CATALOG[cat] || []).filter((x) => saved[cat]?.[x.id]),
    [saved]
  );
  const counts = useMemo(() => {
    const c = {};
    POI_CATEGORIES.forEach((cat) => { c[cat] = Object.values(saved[cat] || {}).filter(Boolean).length; });
    c.poiTotal = POI_CATEGORIES.reduce((s, cat) => s + c[cat], 0);
    return c;
  }, [saved]);

  const value = useMemo(() => ({ saved, toggle, isSaved, savedItems, counts }),
    [saved, toggle, isSaved, savedItems, counts]);
  return createElement(WishlistContext.Provider, { value }, children);
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

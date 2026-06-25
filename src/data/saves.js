import { createContext, useContext, useState, useEffect, useCallback, useMemo, createElement } from "react";

// ─── Saves store (single-user wishlist) ───
// The discover flow lets a couple save what they love — regions (a base they
// sleep in, or a day-trip spot) and activities — and those saves drive the
// routes we generate. Single-user for now; a partner is an invite stub.
// Shape: { [dest]: { regions: string[], activities: string[] } }

const KEY = "30s_saves_v1";
const SEED_KEY = "30s_saves_seeded_v1";

// A demo Bali wishlist so the routes screen opens with something to show.
// Regions reference real cities in destAreas (so route-gen + activities work).
function seed() {
  return {
    Bali: {
      regions: ["Ubud", "Seminyak", "Canggu", "Sanur", "Nusa Penida"],
      activities: [],
    },
  };
}

function load() {
  let data;
  try { data = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { data = {}; }
  try {
    if (!localStorage.getItem(SEED_KEY)) {
      data = seed();
      localStorage.setItem(SEED_KEY, "1");
      localStorage.setItem(KEY, JSON.stringify(data));
    }
  } catch { /* ignore */ }
  return data;
}
function persist(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

const SavesContext = createContext(null);

export function SavesProvider({ children }) {
  const [saves, setSaves] = useState(load);
  useEffect(() => { persist(saves); }, [saves]);

  const forDest = useCallback((dest) => saves[dest] || { regions: [], activities: [] }, [saves]);

  const toggle = useCallback((dest, kind, key) => {
    setSaves(prev => {
      const cur = prev[dest] || { regions: [], activities: [] };
      const list = cur[kind] || [];
      const next = list.includes(key) ? list.filter(x => x !== key) : [...list, key];
      return { ...prev, [dest]: { ...cur, [kind]: next } };
    });
  }, []);

  const toggleRegion = useCallback((dest, city) => toggle(dest, "regions", city), [toggle]);
  const toggleActivity = useCallback((dest, id) => toggle(dest, "activities", id), [toggle]);

  const remove = useCallback((dest, kind, key) => {
    setSaves(prev => {
      const cur = prev[dest] || { regions: [], activities: [] };
      return { ...prev, [dest]: { ...cur, [kind]: (cur[kind] || []).filter(x => x !== key) } };
    });
  }, []);

  const clearDest = useCallback((dest) => {
    setSaves(prev => ({ ...prev, [dest]: { regions: [], activities: [] } }));
  }, []);

  const value = useMemo(() => ({ saves, forDest, toggleRegion, toggleActivity, remove, clearDest }),
    [saves, forDest, toggleRegion, toggleActivity, remove, clearDest]);

  return createElement(SavesContext.Provider, { value }, children);
}

export function useSaves() {
  const ctx = useContext(SavesContext);
  if (!ctx) throw new Error("useSaves must be used within SavesProvider");
  return ctx;
}

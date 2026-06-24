import { createContext, useContext, useState, useEffect, useCallback, createElement } from "react";
import { allItineraries } from "../data";

// ─── Versioned deals store ───
// Mirrors the back-office model: a deal holds versions. A version is an
// editable Draft until the customer requests live pricing, which locks it into
// a Quote (priced + PDF). Editing a locked Quote forks a new Draft. Quotes go
// stale after QUOTE_VALID_DAYS and surface as Expired.

const KEY = "30s_deals_v1";
const SEED_KEY = "30s_deals_seeded_v6";
export const QUOTE_VALID_DAYS = 7;

const DAY = 86400000;
const num = (p) => Number(String(p ?? 0).replace(/,/g, "")) || 0;

// Demo deals modelling the real concepts for the Plan page:
//  - A deal (vacation) is `active` or `lost`; lost deals just sink lower.
//  - A version owns ONE immutable itinerary + destination. `status:"draft"` is
//    an OPEN/editable version; `status:"quote"` is a FINALISED PDF (locked).
//  - Versions of one deal may span DIFFERENT destinations.
//  - Maldives versions carry MULTIPLE property quotes (one per resort) via
//    `quotes`, each independently open or finalised.
// Version-level `destination`/`itineraryId`/`title` let a single deal hold
// versions for different trips; the card falls back to deal-level for older
// (real) deals that predate this shape.
function demoDeals() {
  const now = Date.now();
  const byId = (id) => allItineraries.find(i => i.id === id);
  const routeTitle = (id) => { const it = byId(id); return (it?.route || []).map(r => r.city).join(" · ") || it?.name || "Trip"; };
  const td = (startInDays, nights, travelers = 2) => ({
    fromDate: new Date(now + startInDays * DAY).toISOString(), nights, travelers,
  });
  // A single version anchored to a real itinerary id.
  const ver = (id, itinId, { num: n, status, ageDays, priceAdj = 0, pdfAgo, quotes }) => {
    const it = byId(itinId);
    const pp = num(it?.price) + priceAdj;
    return {
      id, num: n, status, parentId: null, createdBy: "customer",
      destination: it?.dest, itineraryId: itinId, title: routeTitle(itinId),
      customizations: { travelDates: td(45, it?.nights || 7), selectedDayOptions: {}, selectedHotels: {} },
      indicativePrice: pp, livePrice: status === "quote" ? pp : null,
      pricedAt: status === "quote" ? now - (pdfAgo ?? 1) * DAY : null,
      createdAt: now - ageDays * DAY,
      ...(quotes ? { quotes } : {}),
    };
  };

  // 1. Active Bali deal — an OPEN v4 sitting on top of a finalised PDF v3.
  const baliImg = byId(1)?.img;
  const dealBali = {
    id: "demo_bali", status: "active", itineraryId: 1, dest: "Bali", title: routeTitle(1), img: baliImg,
    customItinerary: null, createdAt: now - 6 * DAY,
    versions: [
      ver("demo_bali_v1", 1, { num: 1, status: "quote", ageDays: 6, pdfAgo: 5 }),
      ver("demo_bali_v2", 100, { num: 2, status: "quote", ageDays: 4, priceAdj: 4000, pdfAgo: 3 }),
      ver("demo_bali_v3", 3, { num: 3, status: "quote", ageDays: 2, priceAdj: 8000, pdfAgo: 1 }),
      ver("demo_bali_v4", 1, { num: 4, status: "draft", ageDays: 0.4, priceAdj: 12000 }),
    ],
  };

  // 2. Active deal whose versions SPAN destinations (Bali -> Thailand).
  const dealSpan = {
    id: "demo_span", status: "active", itineraryId: 13, dest: "Thailand", title: routeTitle(13), img: byId(13)?.img,
    customItinerary: null, createdAt: now - 9 * DAY,
    versions: [
      ver("demo_span_v1", 4, { num: 1, status: "quote", ageDays: 9, pdfAgo: 8 }),   // Bali
      ver("demo_span_v2", 13, { num: 2, status: "quote", ageDays: 1, priceAdj: 3000, pdfAgo: 0 }), // Thailand (newest, finalised PDF)
    ],
  };

  // 3. Maldives — a version carries MULTIPLE property quotes.
  const malImg = byId(16)?.img;
  // Maldives works per-PROPERTY: each resort is its own card. Different quotes
  // for the SAME property are that property's versions (V1, V2 …).
  const dealMal = {
    id: "demo_maldives", status: "active", dest: "Maldives", title: "Maldives escape", img: malImg,
    customItinerary: null, createdAt: now - 3 * DAY,
    properties: [
      // Only ONE open (un-finalized) version may exist across all trips at a time
      // — the single draft is demo_bali_v4. Everything else is a finalized Quote.
      { property: "Adaaran Select", itineraryId: 16, versions: [
        ver("demo_mal_ada_v1", 16, { num: 1, status: "quote", ageDays: 7, pdfAgo: 6 }),
        ver("demo_mal_ada_v2", 16, { num: 2, status: "quote", ageDays: 0.6, priceAdj: 5000, pdfAgo: 0 }),
      ] },
      { property: "Sun Siyam Olhuveli", itineraryId: 17, versions: [
        ver("demo_mal_sun_v1", 17, { num: 1, status: "quote", ageDays: 1, pdfAgo: 0 }),
      ] },
    ],
  };

  // 4. Lost vacation — sinks to the bottom, muted. (Customer would start a new one.)
  const dealLost = {
    id: "demo_lost", status: "lost", itineraryId: 10, dest: "Vietnam", title: routeTitle(10), img: byId(10)?.img,
    customItinerary: null, createdAt: now - 30 * DAY,
    versions: [ver("demo_lost_v1", 10, { num: 1, status: "quote", ageDays: 30, pdfAgo: 24 })],
  };

  return [dealBali, dealSpan, dealMal, dealLost];
}

function load() {
  let deals;
  try { deals = JSON.parse(localStorage.getItem(KEY)) || []; } catch { deals = []; }
  // One-time demo seed (flag-guarded). This bump RESETS the list to a clean set
  // of ~4 representative vacations (the accumulated prototype test deals are
  // cleared) so the Plan screen stays legible.
  try {
    if (!localStorage.getItem(SEED_KEY)) {
      deals = demoDeals();
      localStorage.setItem(SEED_KEY, "1");
      localStorage.setItem(KEY, JSON.stringify(deals));
    }
  } catch { /* ignore */ }
  return deals;
}
function persist(deals) {
  try { localStorage.setItem(KEY, JSON.stringify(deals)); } catch { /* ignore */ }
}

let seq = 0;
const newId = (prefix) => `${prefix}_${Date.now().toString(36)}_${(seq++).toString(36)}`;

// A Quote older than the validity window is treated as Expired.
export function isExpired(version) {
  return version?.status === "quote" && !!version.pricedAt &&
    Date.now() - version.pricedAt > QUOTE_VALID_DAYS * 86400000;
}
// Customer-facing status, folding expiry into the raw status.
export function effectiveStatus(version) {
  if (!version) return null;
  return isExpired(version) ? "expired" : version.status;
}
export const STATUS_LABEL = {
  draft: "Draft",
  quote: "Quote",
  expired: "Expired",
};

const DealsContext = createContext(null);

export function DealsProvider({ children }) {
  const [deals, setDeals] = useState(load);
  useEffect(() => { persist(deals); }, [deals]);

  // Create a brand-new deal with an editable Draft (Version 1).
  const createDeal = useCallback((init) => {
    const versionId = newId("ver");
    const dealId = newId("deal");
    const version = {
      id: versionId,
      num: 1,
      status: "draft",
      parentId: null,
      createdBy: init.createdBy || "customer",
      customizations: init.customizations || {},
      indicativePrice: init.indicativePrice ?? null,
      livePrice: null,
      pricedAt: null,
      createdAt: Date.now(),
    };
    const deal = {
      id: dealId,
      itineraryId: init.itineraryId,
      dest: init.dest,
      title: init.title,
      img: init.img,
      // For trips built from scratch, the full synthesized itinerary lives here
      // so the itinerary screen (and hotel/flight subpages) can resolve a trip
      // that isn't in the static seed data.
      customItinerary: init.customItinerary || null,
      versions: [version],
      createdAt: Date.now(),
    };
    setDeals(prev => [deal, ...prev]);
    return { dealId, versionId };
  }, []);

  // Patch a copy's customizations / indicative price in place. Works on any
  // copy (draft or quote) - changes are allowed from anywhere; we reconcile a
  // quote's price/PDF on the next "Update quote".
  const updateDraft = useCallback((dealId, versionId, patch) => {
    setDeals(prev => prev.map(d => d.id !== dealId ? d : {
      ...d,
      versions: d.versions.map(v => {
        if (v.id !== versionId) return v;
        return {
          ...v,
          customizations: patch.customizations ?? v.customizations,
          indicativePrice: patch.indicativePrice ?? v.indicativePrice,
        };
      }),
    }));
  }, []);

  // Price the copy into a Quote and snapshot the committed customizations, so
  // later edits surface as "changes since your last version".
  const requestPricing = useCallback((dealId, versionId, livePrice) => {
    setDeals(prev => prev.map(d => d.id !== dealId ? d : {
      ...d,
      versions: d.versions.map(v => v.id !== versionId ? v : {
        ...v,
        status: "quote",
        livePrice,
        pricedAt: Date.now(),
        committed: JSON.parse(JSON.stringify(v.customizations || {})),
      }),
    }));
  }, []);

  // Fork a new editable Draft from an existing version. Returns the new id.
  const forkVersion = useCallback((dealId, versionId) => {
    const newVerId = newId("ver");
    setDeals(prev => prev.map(d => {
      if (d.id !== dealId) return d;
      const parent = d.versions.find(v => v.id === versionId);
      if (!parent) return d;
      const maxNum = Math.max(...d.versions.map(v => v.num));
      const draft = {
        id: newVerId,
        num: maxNum + 1,
        status: "draft",
        parentId: versionId,
        createdBy: "customer",
        customizations: JSON.parse(JSON.stringify(parent.customizations || {})),
        indicativePrice: parent.livePrice ?? parent.indicativePrice ?? null,
        livePrice: null,
        pricedAt: null,
        createdAt: Date.now(),
      };
      return { ...d, versions: [...d.versions, draft] };
    }));
    return { dealId, versionId: newVerId };
  }, []);

  const deleteDeal = useCallback((dealId) => {
    setDeals(prev => prev.filter(d => d.id !== dealId));
  }, []);

  // Drop a single version; remove the whole deal if it was the last one.
  const discardVersion = useCallback((dealId, versionId) => {
    setDeals(prev => prev.flatMap(d => {
      if (d.id !== dealId) return [d];
      const remaining = d.versions.filter(v => v.id !== versionId);
      return remaining.length ? [{ ...d, versions: remaining }] : [];
    }));
  }, []);

  const getDeal = useCallback((dealId) => deals.find(d => d.id === dealId) || null, [deals]);
  const getVersion = useCallback((dealId, versionId) => {
    const d = deals.find(x => x.id === dealId);
    if (!d) return null;
    const inVersions = (d.versions || []).find(v => v.id === versionId);
    if (inVersions) return inVersions;
    // Maldives deals keep versions per property.
    for (const p of (d.properties || [])) {
      const pv = (p.versions || []).find(v => v.id === versionId);
      if (pv) return pv;
    }
    return null;
  }, [deals]);

  // Resolve a from-scratch itinerary by its (high, synthetic) id, so pages that
  // look up `allItineraries.find(...)` can fall back to a built trip. A specific
  // version's route (after a route-change fork) wins over the deal's base.
  const findCustomItinerary = useCallback((itineraryId, versionId) => {
    // 1. Resolve by the built itinerary's own id — works even when a curated
    //    deal forks into a synthesized trip whose id differs from d.itineraryId.
    for (const d of deals) {
      for (const v of (d.versions || [])) {
        const bi = v.customizations?.builtItinerary;
        if (bi && bi.id === itineraryId && (!versionId || v.id === versionId)) return bi;
      }
      if (d.customItinerary && d.customItinerary.id === itineraryId) return d.customItinerary;
    }
    // 2. Legacy fallback: deal keyed by itineraryId (built-from-scratch deals).
    for (const d of deals) {
      if (d.itineraryId !== itineraryId) continue;
      if (versionId) {
        const v = d.versions.find(x => x.id === versionId);
        if (v?.customizations?.builtItinerary) return v.customizations.builtItinerary;
      }
      return d.customItinerary || d.versions[0]?.customizations?.builtItinerary || null;
    }
    return null;
  }, [deals]);

  // Replace a deal's base built itinerary (used when the route is reworked).
  const setCustomItinerary = useCallback((dealId, customItinerary) => {
    setDeals(prev => prev.map(d => d.id !== dealId ? d : { ...d, customItinerary }));
  }, []);

  const value = {
    deals, createDeal, updateDraft, requestPricing, forkVersion,
    deleteDeal, discardVersion, getDeal, getVersion,
    findCustomItinerary, setCustomItinerary,
  };
  return createElement(DealsContext.Provider, { value }, children);
}

export function useDeals() {
  const ctx = useContext(DealsContext);
  if (!ctx) throw new Error("useDeals must be used within DealsProvider");
  return ctx;
}

// ─── Pricing helper ───
// Per-person total = base itinerary price + day-plan deltas + hotel deltas.
export function computePrice(basePriceStr, selectedDayOptions, selectedHotels) {
  const base = Number(String(basePriceStr ?? 0).replace(/,/g, "")) || 0;
  const dayDeltas = Object.values(selectedDayOptions || {})
    .reduce((sum, opt) => sum + (opt?.priceDelta || 0), 0);
  const hotelDeltas = Object.values(selectedHotels || {})
    .reduce((sum, h) => sum + (h?.priceDelta || 0), 0);
  return base + dayDeltas + hotelDeltas;
}

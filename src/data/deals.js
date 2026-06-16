import { createContext, useContext, useState, useEffect, useCallback, createElement } from "react";

// ─── Versioned deals store ───
// Mirrors the back-office model: a deal holds versions. A version is an
// editable Draft until the customer requests live pricing, which locks it into
// a Quote (priced + PDF). Editing a locked Quote forks a new Draft. Quotes go
// stale after QUOTE_VALID_DAYS and surface as Expired.

const KEY = "30s_deals_v1";
export const QUOTE_VALID_DAYS = 7;

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
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
      versions: [version],
      createdAt: Date.now(),
    };
    setDeals(prev => [deal, ...prev]);
    return { dealId, versionId };
  }, []);

  // Patch a copy's customizations / indicative price in place. Works on any
  // copy (draft or quote) — changes are allowed from anywhere; we reconcile a
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

  // Lock a Draft into a priced Quote (instant pricing for the prototype).
  const requestPricing = useCallback((dealId, versionId, livePrice) => {
    setDeals(prev => prev.map(d => d.id !== dealId ? d : {
      ...d,
      versions: d.versions.map(v => v.id !== versionId ? v : {
        ...v,
        status: "quote",
        livePrice,
        pricedAt: Date.now(),
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
    return d ? d.versions.find(v => v.id === versionId) || null : null;
  }, [deals]);

  const value = {
    deals, createDeal, updateDraft, requestPricing, forkVersion,
    deleteDeal, discardVersion, getDeal, getVersion,
  };
  return createElement(DealsContext.Provider, { value }, children);
}

export function useDeals() {
  const ctx = useContext(DealsContext);
  if (!ctx) throw new Error("useDeals must be used within DealsProvider");
  return ctx;
}

// ─── Pricing helper ───
// Per-person total = base itinerary price + sum of selected day-plan deltas.
export function computePrice(basePriceStr, selectedDayOptions) {
  const base = Number(String(basePriceStr ?? 0).replace(/,/g, "")) || 0;
  const deltas = Object.values(selectedDayOptions || {})
    .reduce((sum, opt) => sum + (opt?.priceDelta || 0), 0);
  return base + deltas;
}

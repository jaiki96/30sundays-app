// Couples layer for the discover flow. The app is single-user, so a partner
// (Aanya) is a demo stub: a static wishlist we merge with "your" live saves to
// show who saved what, "you both love", and to balance routes across both.

import { regionByCity, activityById } from "./discoverData";

export const YOU = { key: "you", name: "You", initial: "Y", color: "#E31B53" };
export const PARTNER = { key: "aanya", name: "Aanya", initial: "A", color: "#9CA3AF" };

// Aanya's static picks per destination (overlaps "your" seed to create "both love").
const PARTNER_SAVES = {
  Bali: { regions: ["Ubud", "Nusa Penida"], activities: [] },
};
export function partnerSaves(dest) {
  return PARTNER_SAVES[dest] || { regions: [], activities: [] };
}

// Merge your live saves with the partner's into one list, tagged by who saved each.
export function mergedSaves(dest, you = { regions: [], activities: [] }) {
  const p = partnerSaves(dest);
  const reg = new Map();
  const addR = (city, who) => {
    if (!regionByCity(dest, city)) return;
    const e = reg.get(city) || { city, by: new Set() };
    e.by.add(who); reg.set(city, e);
  };
  (you.regions || []).forEach(c => addR(c, "you"));
  (p.regions || []).forEach(c => addR(c, "aanya"));

  const acts = new Map();
  const addA = (id, who) => {
    if (!activityById(dest, id)) return;
    const e = acts.get(id) || { id, by: new Set() };
    e.by.add(who); acts.set(id, e);
  };
  (you.activities || []).forEach(id => addA(id, "you"));
  (p.activities || []).forEach(id => addA(id, "aanya"));

  const regions = [...reg.values()].map(e => ({ ...regionByCity(dest, e.city), by: [...e.by] }));
  const activities = [...acts.values()].map(e => ({ ...activityById(dest, e.id), by: [...e.by] }));
  return { regions, activities };
}

// Counts for the All / You / Aanya / Both filter chips.
export function saveCounts(merged) {
  const items = [...merged.regions, ...merged.activities];
  return {
    all: items.length,
    you: items.filter(i => i.by.includes("you")).length,
    aanya: items.filter(i => i.by.includes("aanya")).length,
    both: items.filter(i => i.by.length > 1).length,
  };
}

// All saved region cities across both people (for route generation).
export function unionRegions(merged) {
  return merged.regions.map(r => r.city);
}
export function unionActivityIds(merged) {
  return merged.activities.map(a => a.id);
}

// A one-line rationale for a route, naming what it balances across the two of you.
export function coupleRationale(route, merged) {
  const inCities = new Set([...route.segs.map(s => s.city), ...route.dayTrips]);
  const yoursIn = merged.regions.filter(r => r.by.includes("you") && !r.by.includes("aanya") && inCities.has(r.city)).map(r => r.city);
  const hersIn = merged.regions.filter(r => r.by.includes("aanya") && !r.by.includes("you") && inCities.has(r.city)).map(r => r.city);
  const bothIn = merged.regions.filter(r => r.by.length > 1 && inCities.has(r.city)).map(r => r.city);
  if (yoursIn.length && hersIn.length) return `Balances your ${yoursIn[0]} and Aanya's ${hersIn[0]}.`;
  if (bothIn.length) return `Built around ${bothIn[0]}, which you both love.`;
  if (yoursIn.length && !hersIn.length) return `Leans to your saves. Skips Aanya's picks this time.`;
  if (hersIn.length && !yoursIn.length) return `Leans to Aanya's saves this time.`;
  return `Shaped around what you both saved.`;
}

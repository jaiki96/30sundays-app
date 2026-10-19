import { useMemo } from "react";
import { allItineraries } from "../data";
import { KIND_NOUN } from "./wishlist";
import { regionByCity, activityById } from "./discoverData";
import { cityCoords } from "./buildData";
import { sightCoords } from "./sightCoords";
import { regionFood } from "./regionFood";

// ─── What a saved item looks like as a row ───
// Looked up from the live data where we can, so a region's photo or an
// activity's town never goes stale; the snapshot taken at save time otherwise.
export function useRows(items, deals) {
  return useMemo(() => items.map((it) => {
    if (it.kind === "trip" && String(it.id).startsWith("it_")) {
      // A ready-made itinerary hearted from its card, not a plan version.
      const itin = allItineraries.find((i) => String(i.id) === String(it.id).slice(3));
      return {
        ...it,
        name: itin ? `${itin.dest} trip · ${itin.nights}N` : it.name,
        img: it.img || itin?.img || null,
        sub: it.sub || (itin?.route || []).map((r) => `${r.n}N ${r.city}`).join(" · ") || "",
        meta: itin?.price ? `Ready-made · From ₹${itin.price}/pp` : "Ready-made",
        open: itin ? `/itinerary/${itin.id}` : null,
        pin: null,
      };
    }
    if (it.kind === "trip") {
      let hit = null;
      deals.forEach((d) => {
        (d.versions || []).forEach((v) => { if (v.id === it.id) hit = { deal: d, v }; });
        (d.properties || []).forEach((p) => (p.versions || []).forEach((v) => { if (v.id === it.id) hit = { deal: d, v, property: p.property }; }));
      });
      const itin = hit ? allItineraries.find((i) => i.id === (hit.v.itineraryId ?? hit.deal.itineraryId)) : null;
      const nights = hit?.v.customizations?.travelDates?.nights ?? itin?.nights;
      const route = (itin?.route || []).map((r) => `${r.n}N ${r.city}`).join(" · ");
      return {
        ...it,
        name: `${it.dest} trip${nights ? ` · ${nights}N` : ""}`,
        img: it.img || hit?.deal.img || itin?.img || null,
        sub: hit?.property || route || it.sub || itin?.name || "",
        meta: hit ? `V${hit.v.num}${itin?.price ? ` · From ₹${itin.price}/pp` : ""}` : "Plan",
        open: itin ? `/itinerary/${itin.id}${hit ? `?dealId=${hit.deal.id}&versionId=${hit.v.id}` : ""}` : null,
        pin: null,
      };
    }
    if (it.kind === "region") {
      const r = regionByCity(it.dest, it.id);
      const c = cityCoords[it.id];
      return {
        ...it,
        name: it.id, img: r?.img || it.img || null, sub: r?.blurb || it.sub || "",
        meta: r ? (r.dayTrip ? "Day trip" : `${r.n || 2} to ${(r.n || 2) + 1} nights`) : "Region",
        emoji: r?.emoji,
        open: `/destination/${encodeURIComponent(it.dest)}/region/${encodeURIComponent(it.id)}`,
        pin: c ? { lat: c.lat, lng: c.lng } : null,
      };
    }
    if (it.kind === "activity") {
      const a = activityById(it.dest, it.id);
      const name = a?.name || it.name;
      const c = sightCoords(name);
      return {
        ...it,
        name, img: a?.img || it.img || null, city: a?.city || it.city || null,
        sub: a?.city || it.city || "", meta: a?.vibe ? `${KIND_NOUN.activity} · ${a.vibe}` : KIND_NOUN.activity,
        open: `/saved/activity/${encodeURIComponent(it.dest)}/${encodeURIComponent(it.id)}`,
        pin: c ? { lat: c.lat, lng: c.lng } : null,
      };
    }
    // Hotels, food and shops open the region page they were saved on.
    const region = it.city ? `/destination/${encodeURIComponent(it.dest)}/region/${encodeURIComponent(it.city)}` : null;
    // A place to eat saved without its photo (an older save, or one made
    // somewhere that had none) takes it from the region's food list.
    const img = it.img || (it.kind === "restaurant" && it.city ? regionFood(it.dest, it.city)?.find((f) => f.name === it.name)?.img : null) || null;
    return { ...it, img, sub: it.sub || it.city || "", meta: `${KIND_NOUN[it.kind] || ""}${it.city ? ` · ${it.city}` : ""}`, open: region, pin: null };
  }), [items, deals]);
}


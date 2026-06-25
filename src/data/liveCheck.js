// Real-time availability + price check (prototype).
// Fires on "Get final price": the indicative price becomes a live one, and we
// re-confirm rooms are still available. No backend — seeded deterministically:
//   • hotel 1 → price nudged up (soft, total reflects it)
//   • hotel 2 → sold out (blocks the lock until the user picks another)
//   • the rest → clear
// Tours stay available, but one may have nudged up in price (shown near the bar).
//
// Blocking model: a sold-out stay must be resolved before the price locks;
// price increases are soft.

const PRICE_UP_BASE = 3200; // per person, the price-up hotel
const TOUR_DELTA = 900;     // per person, the one tour that nudged up

// A stay is resolved once the user has explicitly picked a hotel/room for it
// (selectedHotelOptions[i] set). Built itineraries start empty, so any pick = resolved.
export function runLiveCheck(it, hotels, resolved = new Set()) {
  const stays = hotels.map((h, i) => {
    let status = i === 0 ? "price_up" : i === 1 ? "sold_out" : "clear";
    if (status === "sold_out" && resolved.has(i)) status = "clear";
    const delta = status === "price_up" ? PRICE_UP_BASE : 0;
    return { i, city: h.city, name: h.name, status, delta };
  });

  const tourName = (it.days?.[0]?.sub || "").split(" · ")[0] || "a tour";
  const tour = { name: tourName, status: "price_up", delta: TOUR_DELTA };

  const soldOut = stays.filter(s => s.status === "sold_out");
  const priceUps = stays.filter(s => s.status === "price_up");
  const hotelDelta = priceUps.reduce((a, s) => a + s.delta, 0); // hotels only
  const totalDelta = hotelDelta + tour.delta;                   // applied to the total

  return { stays, tour, soldOut, priceUps, hotelDelta, totalDelta, blocking: soldOut.length > 0 };
}

export function stayState(liveResult, i) {
  return liveResult ? liveResult.stays.find(s => s.i === i) : null;
}

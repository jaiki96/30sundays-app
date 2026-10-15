// ─── The questions a couple asks before they pick a region ───
//
// Every answer here is read off the region the page is already showing, not
// written out a second time. That is the whole point: an FAQ that is typed
// separately is an FAQ that goes stale the first time a night count or a
// transfer time changes, and a wrong answer in a block headed "common
// questions" is worse than no block at all.
//
// A question whose answer we do not hold is left out rather than filled with
// something vague. Six real answers beat nine, three of which say "it depends".

const list = (xs, joiner = "and") => {
  if (xs.length === 1) return xs[0];
  return `${xs.slice(0, -1).join(", ")} ${joiner} ${xs[xs.length - 1]}`;
};

// Pull hours and minutes back out of "About 10h with the change", the same way
// the How to reach strip does, so the travel-time answer and the strip above it
// can never disagree.
function totalMinutes(legs = []) {
  const mins = legs.map((l) => {
    const h = (l.time || "").match(/(\d+)\s*h/i);
    const m = (l.time || "").match(/(\d+)\s*m(?!i)/i);
    if (!h && !m) return null;
    return (h ? +h[1] * 60 : 0) + (m ? +m[1] : 0);
  });
  if (!mins.length || mins.some((x) => x == null)) return null;
  return mins.reduce((a, b) => a + b, 0);
}

const asHours = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (!h) return `${m} minutes`;
  return m ? `${h}h ${m}m` : `${h} hours`;
};

export function regionFaq(r) {
  if (!r) return [];
  const g = r.guide || {};
  const out = [];

  // How long to stay. The nights are the ones the builder itself suggests.
  if (r.dayTrip) {
    out.push({
      q: `Do we need to stay a night in ${r.city}?`,
      a: `No. We build ${r.city} as a day trip from wherever you are based, so it costs you a day rather than a hotel change.`,
    });
  } else if (r.nights) {
    out.push({
      q: `How many nights should we spend in ${r.city}?`,
      a: `${r.nights} ${r.nights === 1 ? "night" : "nights"} is what we plan for, which is enough for the things on this page without a rushed morning. Couples who want a slow week add one more.`,
    });
  }

  // When to come. Same peak/shoulder call the month strip above uses.
  if (r.bestMonths) {
    out.push({
      q: `When is the best time to visit?`,
      a: r.bestMonths === "All year"
        ? `${r.dest} is good the whole year round. Pick your month on price and crowds rather than on weather.`
        : `${r.bestMonths} is the stretch we would pick. Outside it you get fewer people and lower prices, and the month strip above shows what you are trading for them.`,
    });
  }

  // Getting there, totalled off the same legs the section above draws.
  const mins = totalMinutes(g.reach);
  if (mins != null) {
    out.push({
      q: `How long does it take to reach ${r.city}?`,
      a: `About ${asHours(mins)} of travel in ${g.reach.length === 1 ? "one leg" : `${g.reach.length} legs`}, not counting time spent in airports. The breakdown is in How to reach above.`,
    });
  }

  // The question Indian couples ask first, answered off the restaurant list
  // rather than reassuringly.
  if (r.food?.length) {
    const indian = r.food.filter((f) => (f.tags || []).includes("Indian food")).length;
    const veg = r.food.filter((f) => (f.tags || []).includes("Veg only")).length;
    if (indian || veg) {
      const parts = [];
      if (indian) parts.push(`${indian} proper Indian ${indian === 1 ? "kitchen" : "kitchens"}`);
      if (veg) parts.push(`${veg} fully vegetarian ${veg === 1 ? "place" : "places"}`);
      out.push({
        q: `Can we get Indian or vegetarian food here?`,
        a: `Yes. We list ${list(parts)} in ${r.city}, and they are in the Where to eat section above. Tell your consultant and they will plan dinners around them.`,
      });
    }
  }

  // Moving around, from the same four lines the transport card shows.
  if (g.transport?.length) {
    out.push({
      q: `How do we get around once we are there?`,
      a: `${list(g.transport.map((t) => t.label.toLowerCase()))}. Your package covers the airport transfer; the rest is how you spend your days, and your consultant can add private cars for any of it.`,
    });
  }

  // What to book, straight off the stay note. The question used to be where in
  // town, which is the one thing that advice no longer gives.
  if (g.stay?.headline) {
    out.push({
      q: `What kind of hotel should we book?`,
      a: `${g.stay.headline}. ${g.stay.note || ""}`.trim(),
    });
  }

  // The catch. The honest bit is already on the page, so the FAQ does not
  // pretend there isn't one.
  if (r.cons?.length) {
    out.push({
      q: `What do people not like about ${r.city}?`,
      a: `${r.cons[0]} ${r.cons.length > 1 ? "The rest of the honest list is on the postcard above." : ""}`.trim(),
    });
  }

  return out;
}

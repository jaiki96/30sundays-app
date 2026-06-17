/**
 * Hotel upgrade data keyed by itinerary ID.
 * Each entry contains an array of hotel upgrade options
 * that map to the hotels in the itinerary (by city order).
 */
const CDN = "https://cdn.30sundays.club/app_content";

const upgradeData = {
  // Bali 7N Relaxed (id: 1), Ubud, Seminyak, Sanur
  1: [
    {
      cityIndex: 0, // Ubud, 4★ → 5★
      current: {
        name: "Padma Resort Ubud",
        stars: 4,
        type: "Deluxe Room · Breakfast included",
        rating: 8.4,
        img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80&auto=format&fit=crop",
      },
      upgrade: {
        name: "Viceroy Bali",
        stars: 5,
        type: "Pool Villa · All meals included",
        rating: 9.2,
        img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80&auto=format&fit=crop",
        delta: 4200, // per night additional
        perks: [
          "Private infinity pool",
          "Complimentary spa session",
          "Butler service",
          "Airport transfer included",
        ],
      },
    },
    // Seminyak is already 5★ (The Mulia), no upgrade
    {
      cityIndex: 2, // Sanur, 4★ → 5★
      current: {
        name: "COMO Uma Sanur",
        stars: 4,
        type: "Garden Room · Breakfast included",
        rating: 8.1,
        img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80&auto=format&fit=crop",
      },
      upgrade: {
        name: "Four Seasons Sayan",
        stars: 5,
        type: "Riverfront Villa · Half board",
        rating: 9.4,
        img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80&auto=format&fit=crop",
        delta: 3800,
        perks: [
          "Valley-view private terrace",
          "Daily yoga sessions",
          "Gourmet dining credit",
          "Sunset cocktails included",
        ],
      },
    },
  ],

  // Bali 5N Relaxed (id: 2), Seminyak, Nusa Dua
  2: [
    {
      cityIndex: 1, // Nusa Dua, 4★ → 5★
      current: {
        name: "Hilton Bali Resort",
        stars: 4,
        type: "Deluxe Room · Breakfast included",
        rating: 8.3,
        img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80&auto=format&fit=crop",
      },
      upgrade: {
        name: "The Ritz-Carlton Bali",
        stars: 5,
        type: "Cliff Villa · All meals included",
        rating: 9.3,
        img: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=600&q=80&auto=format&fit=crop",
        delta: 4200,
        perks: [
          "Private beach access",
          "Couples spa treatment",
          "Club lounge access",
          "Sunset dining experience",
        ],
      },
    },
  ],

  // Bali 7N Explorer (id: 4), Ubud, Kintamani, Canggu
  4: [
    {
      cityIndex: 2, // Canggu, 4★ → 5★
      current: {
        name: "Canggu Beach Resort",
        stars: 4,
        type: "Garden Suite · Breakfast included",
        rating: 8.0,
        img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80&auto=format&fit=crop",
      },
      upgrade: {
        name: "Como Uma Canggu",
        stars: 5,
        type: "Penthouse Suite · All meals included",
        rating: 9.1,
        img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80&auto=format&fit=crop",
        delta: 3600,
        perks: [
          "Rooftop infinity pool",
          "Surf lesson included",
          "Spa credit ₹5,000/day",
          "Sunset yoga sessions",
        ],
      },
    },
  ],
};

// Generic 5★ upgrade templates for trips built from scratch (no curated map).
// Rotated across the 4★ stays; the itinerary screen overrides `current` with the
// actual shown hotel, so only the `upgrade` side here needs to be plausible.
const SYNTH_UPGRADES = [
  {
    suffix: "The Reserve", type: "Pool Villa · All meals included", rating: 9.3, delta: 4200,
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80&auto=format&fit=crop",
    perks: ["Private infinity pool", "Complimentary spa session", "Butler service", "Airport transfer included"],
  },
  {
    suffix: "Sanctuary Collection", type: "Riverfront Villa · Half board", rating: 9.4, delta: 3800,
    img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80&auto=format&fit=crop",
    perks: ["Private terrace with a view", "Daily yoga sessions", "Gourmet dining credit", "Sunset cocktails included"],
  },
  {
    suffix: "Grand Luxe", type: "Penthouse Suite · All meals included", rating: 9.1, delta: 3600,
    img: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=600&q=80&auto=format&fit=crop",
    perks: ["Rooftop infinity pool", "Curated local experience", "Spa credit ₹5,000/day", "Private sunset dining"],
  },
];

// Built trips use a [4,5,4,5] star pattern (see getHotels in ItineraryDetail),
// so the 4★ stays that warrant an upgrade sit where i % 4 is 0 or 2.
function synthUpgrades(days) {
  const out = [];
  (days || []).forEach((day, i) => {
    if ([4, 5, 4, 5][i % 4] !== 4) return;
    const lux = SYNTH_UPGRADES[out.length % SYNTH_UPGRADES.length];
    out.push({
      cityIndex: i,
      current: {
        name: `${day.city} Grand Resort`, stars: 4, type: "Deluxe Room · Breakfast included",
        rating: [8.4, 8.9, 8.1, 8.7][i % 4],
        img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80&auto=format&fit=crop",
      },
      upgrade: { name: `${day.city} ${lux.suffix}`, stars: 5, type: lux.type, rating: lux.rating, img: lux.img, delta: lux.delta, perks: lux.perks },
    });
  });
  return out;
}

/**
 * Get upgrade info for an itinerary.
 * Returns { upgrades: [...], upgradeCount, totalAdditional }
 * Custom (built-from-scratch) trips have no curated map, so we synthesize one.
 */
export function getUpgradeInfo(itineraryId, days, isCustom = false) {
  const raw = upgradeData[itineraryId] || (isCustom ? synthUpgrades(days) : null);
  if (!raw || raw.length === 0)
    return { upgrades: [], upgradeCount: 0, totalAdditional: 0 };

  const upgrades = raw.map((u) => {
    const day = days?.[u.cityIndex];
    const nights = day?.n || 2;
    return {
      ...u,
      nights,
      dayRange: day
        ? `Day ${days.slice(0, u.cityIndex).reduce((a, d) => a + d.n, 0) + 1}–${days.slice(0, u.cityIndex + 1).reduce((a, d) => a + d.n, 0)}`
        : "",
      totalDelta: u.upgrade.delta * nights,
    };
  });

  return {
    upgrades,
    upgradeCount: upgrades.length,
    totalAdditional: upgrades.reduce((s, u) => s + u.totalDelta, 0),
  };
}

export default upgradeData;

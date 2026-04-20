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
        img: "https://picsum.photos/seed/padma/400/240",
      },
      upgrade: {
        name: "Viceroy Bali",
        stars: 5,
        type: "Pool Villa · All meals included",
        rating: 9.2,
        img: "https://picsum.photos/seed/viceroy/400/240",
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
        img: "https://picsum.photos/seed/como/400/240",
      },
      upgrade: {
        name: "Four Seasons Sayan",
        stars: 5,
        type: "Riverfront Villa · Half board",
        rating: 9.4,
        img: "https://picsum.photos/seed/fssayan/400/240",
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
        img: "https://picsum.photos/seed/hilton/400/240",
      },
      upgrade: {
        name: "The Ritz-Carlton Bali",
        stars: 5,
        type: "Cliff Villa · All meals included",
        rating: 9.3,
        img: "https://picsum.photos/seed/ritz/400/240",
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
        img: "https://picsum.photos/seed/canggu/400/240",
      },
      upgrade: {
        name: "Como Uma Canggu",
        stars: 5,
        type: "Penthouse Suite · All meals included",
        rating: 9.1,
        img: "https://picsum.photos/seed/comocanggu/400/240",
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

/**
 * Get upgrade info for an itinerary.
 * Returns { upgrades: [...], upgradeCount, totalAdditional }
 */
export function getUpgradeInfo(itineraryId, days) {
  const raw = upgradeData[itineraryId];
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

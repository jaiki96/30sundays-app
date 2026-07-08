// Mock catalogue for the Saved & Wishlist module (prototype only).
// Itineraries are not listed here - those come from the plans a user hearts in
// My Plans (the shared version wishlist in deals.js). These four categories are
// the "things to do / stay / eat / shop" a traveller can save while browsing.

const IMG = {
  h1: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80&auto=format&fit=crop",
  h2: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80&auto=format&fit=crop",
  h3: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80&auto=format&fit=crop",
  a1: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80&auto=format&fit=crop",
  a2: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80&auto=format&fit=crop",
  a3: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80&auto=format&fit=crop",
  a4: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80&auto=format&fit=crop",
  a5: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80&auto=format&fit=crop",
  r1: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80&auto=format&fit=crop",
  r2: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop",
  r3: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80&auto=format&fit=crop",
  s1: "https://images.unsplash.com/photo-1513125370-3460ebe3401b?w=800&q=80&auto=format&fit=crop",
  s2: "https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=800&q=80&auto=format&fit=crop",
};

export const WISHLIST_CATALOG = {
  hotels: [
    { id: "h_royal_ubud", name: "Royal Ubud Bay Hotel", img: IMG.h1, sub: "Ubud, Bali", meta: "4-star · from ₹9,000/night", dest: "Bali" },
    { id: "h_seminyak_grand", name: "Amara Seminyak Grand", img: IMG.h2, sub: "Seminyak, Bali", meta: "5-star · from ₹18,000/night", dest: "Bali" },
    { id: "h_adaaran", name: "Adaaran Select Hudhuranfushi", img: IMG.h3, sub: "North Malé Atoll, Maldives", meta: "5-star · from ₹32,000/night", dest: "Maldives" },
  ],
  activities: [
    { id: "a_swing", name: "Bali Jungle Swing", img: IMG.a1, sub: "Ubud, Bali", city: "Ubud", meta: "1 hour · from ₹2,500", dest: "Bali" },
    { id: "a_atv", name: "Tandem ATV Adventure", img: IMG.a2, sub: "Ubud, Bali", city: "Ubud", meta: "2 hours · from ₹3,800", dest: "Bali" },
    { id: "a_uluwatu", name: "Uluwatu Kecak Fire Dance", img: IMG.a3, sub: "Uluwatu, Bali", city: "Uluwatu", meta: "Evening · from ₹1,800", dest: "Bali" },
    { id: "a_waterfall", name: "Tegenungan Waterfall Visit", img: IMG.a4, sub: "Ubud, Bali", city: "Ubud", meta: "Half day · from ₹1,500", dest: "Bali" },
    { id: "a_penida", name: "Nusa Penida Snorkelling", img: IMG.a5, sub: "Nusa Penida, Bali", city: "Nusa Penida", meta: "Full day · from ₹4,200", dest: "Bali" },
  ],
  restaurants: [
    { id: "r_locavore", name: "Locavore", img: IMG.r1, sub: "Fine dining · Ubud", meta: "₹₹₹ · ★ 4.8", dest: "Bali" },
    { id: "r_vegan", name: "Pure Vegan Heaven", img: IMG.r2, sub: "Vegan · Seminyak", meta: "₹₹ · ★ 4.6", dest: "Bali" },
    { id: "r_labaraka", name: "La Baraka", img: IMG.r3, sub: "Mediterranean · Sanur", meta: "₹₹ · ★ 4.5", dest: "Bali" },
  ],
  shopping: [
    { id: "s_ubudart", name: "Ubud Art Market", img: IMG.s1, sub: "Ubud, Bali", meta: "Handicrafts · Souvenirs", dest: "Bali" },
    { id: "s_seminyak", name: "Seminyak Village", img: IMG.s2, sub: "Seminyak, Bali", meta: "Boutiques · Fashion", dest: "Bali" },
  ],
};

// ── read-only hotel detail data (shape matches the shared HotelDetailScreen) ──
const HOTEL_GALLERY = [
  { url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&q=80&auto=format&fit=crop", category: "Exterior" },
  { url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80&auto=format&fit=crop", category: "Room" },
  { url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=900&q=80&auto=format&fit=crop", category: "Room" },
  { url: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900&q=80&auto=format&fit=crop", category: "Pool" },
  { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80&auto=format&fit=crop", category: "View" },
];
// Amenity labels chosen to match the icons in HotelDetailScreen.
const ALL_AMENITIES = ["Breakfast", "Free WiFi", "Swimming pool", "Spa", "Airport Transfer", "Gym", "Restaurant", "Room Service", "Parking", "Concierge"];
const ROOM_TYPES = [
  { id: "deluxe", name: "Deluxe Room", mealPlan: "Breakfast included", bedType: "1 King bed", size: 32, amenities: ["Balcony", "Rain shower"], imgs: [1, 2] },
  { id: "poolvilla", name: "Pool Villa Suite", mealPlan: "Breakfast included", bedType: "1 King bed", size: 58, amenities: ["Private pool", "Living area"], imgs: [3, 4] },
  { id: "family", name: "Family Suite", mealPlan: "Only Room", bedType: "2 Queen beds", size: 64, amenities: ["Sea View", "Kitchenette"], imgs: [4, 0] },
];

export function getWishlistHotel(id) {
  const h = WISHLIST_CATALOG.hotels.find((x) => x.id === id);
  if (!h) return null;
  const stars = parseInt(h.meta, 10) || 4;
  const score = Number((8.6 + (stars === 5 ? 0.6 : 0.2)).toFixed(1));
  const rooms = (stars === 5 ? ROOM_TYPES : ROOM_TYPES.slice(0, 2)).map((r) => ({
    ...r, images: r.imgs.map((i) => HOTEL_GALLERY[i].url),
  }));
  return {
    ...h, stars,
    bookingScore: score,
    reviewCount: 300 + (h.name.length * 17) % 900,
    neighbourhood: h.sub,
    address: `${h.name}, ${h.sub}`,
    description: `${h.name} sits in ${h.sub}, an easy base for exploring the area. Expect ${stars === 5 ? "spacious suites, multiple pools and full-service dining" : "comfortable rooms, a pool and warm local hospitality"}, with thoughtful touches throughout your stay.`,
    checkInTime: "3 PM", checkOutTime: "12 PM",
    images: HOTEL_GALLERY,
    amenities: ALL_AMENITIES.slice(0, stars === 5 ? 10 : 7),
    rooms,
    reviews: { cleanliness: (score + 0.3).toFixed(1), comfort: score.toFixed(1), facilities: (score - 0.4).toFixed(1) },
  };
}

export function getWishlistActivity(id) {
  return WISHLIST_CATALOG.activities.find((x) => x.id === id) || null;
}

// Tab order for the Saved & Wishlist screen (itineraries first).
export const POI_CATEGORIES = ["hotels", "activities", "restaurants", "shopping"];
export const CATEGORY_LABELS = {
  itineraries: "Itineraries", hotels: "Hotels", activities: "Activities",
  restaurants: "Restaurants", shopping: "Shopping",
};

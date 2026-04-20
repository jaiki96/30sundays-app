// ─── Colors ───
export const C = {
  p900: "#89123E", p600: "#E31B53", p300: "#FEA3B4", p100: "#FFE4E8",
  b600: "#1570EF", b100: "#D1E9FF",
  purple: "#6938EF", pur100: "#EBE9FE",
  sText: "#027A48", sBg: "#ECFDF3", sBorder: "#C0E5D5",
  dText: "#B42318", dBg: "#FEF3F2",
  wText: "#B54708", wBg: "#FFFAEB",
  head: "#181D27", sub: "#535862", inact: "#A4A7AE", icon: "#D5D7DA",
  div: "#E9EAEB", bg: "#F5F5F5", white: "#FFFFFF",
};

// ─── Vibe chip styles ───
export const VS = {
  Relaxed: { bg: "#FFF5F0", text: "#D85A30", border: "#F0997B" },
  Explorer: { bg: "#E1F5EE", text: "#0F6E56", border: "#5DCAA5" },
  Offbeat: { bg: "#EBE9FE", text: "#534AB7", border: "#BDB4FE" },
};

// ─── CDN image pools ───
const CDN = "https://cdn.30sundays.club/app_content";

const baliImgs = [
  `${CDN}/bali/bali_swing_experience_1.jpg`,
  `${CDN}/bali/tree_house_nusa_penida_3.jpg`,
  `${CDN}/bali/tegallalang_rice_fields_4.jpg`,
  `${CDN}/bali/banyumala_waterfall_56.jpg`,
  `${CDN}/bali/handara_gate_63.jpg`,
  `${CDN}/bali/kelingking_beach_65.jpg`,
];

const thailandImgs = [
  `${CDN}/thailand/pileh_lagoon_439.jpg`,
  `${CDN}/thailand/big_buddha_temple_koh_samui_459.jpg`,
  `${CDN}/thailand/long_beach_koh_phi_phi_468.jpg`,
  `${CDN}/thailand/angel_waterfall_park_493.jpg`,
  `${CDN}/thailand/dolphin_show_phuket_494.jpg`,
  `${CDN}/Thailand/Activities/Safari%20World.jpeg`,
];

const vietnamImgs = [
  `${CDN}/vietnam/kissing_bridge_495.jpg`,
  `${CDN}/vietnam/xuong_island_496.jpg`,
  `${CDN}/vietnam/fingernail_island_497.jpg`,
  `${CDN}/vietnam/nem_cuon_cooking_class_ha_long_bay_498.jpg`,
  `${CDN}/vietnam/sunrise_tai_chi_ha_long_bay_499.jpg`,
  `${CDN}/vietnam/kayaking_halong_bay_500.jpg`,
  `${CDN}/vietnam/sapa_valley_501.jpg`,
  `${CDN}/vietnam/hoi_an_memories_show_502.jpg`,
];

const nzImgs = [
  `${CDN}/new_zealand/moke_lake_NZA00054.jpg`,
  `${CDN}/new_zealand/lake_taupo_NZA00055.jpg`,
  `${CDN}/new_zealand/huka_falls_NZA00056.jpg`,
  `${CDN}/new_zealand/aratiatia_rapids_NZA00057.jpg`,
  `${CDN}/new_zealand/te_anau_NZA00060.jpg`,
  `${CDN}/new_zealand/hole_in_the_rock_NZA00061.jpg`,
  `${CDN}/new_zealand/roberton_island_NZA00062.jpg`,
  `${CDN}/new_zealand/waitangi_treaty_grounds_NZA00063.jpg`,
  `${CDN}/new_zealand/lake_matheson_NZA00064.jpg`,
  `${CDN}/new_zealand/haast_pass_NZA00065.jpg`,
  `${CDN}/new_zealand/lake_hawea_NZA00066.jpg`,
];

const slImgs = [
  `${CDN}/srilanka/taprobane_island_viewpoint_SLA00057.jpg`,
  `${CDN}/srilanka/hummanaya_blowhole_SLA00058.jpg`,
  `${CDN}/srilanka/snorkelling_south_coast_SLA00059.jpg`,
  `${CDN}/srilanka/scuba_diving_south_coast_SLA00060.jpg`,
  `${CDN}/srilanka/surfing_lessons_south_coast_SLA00061.jpg`,
  `${CDN}/srilanka/hot_air_balloon_flight_sigiriya_SLA00062.jpg`,
  `${CDN}/srilanka/cinnamon_island_bentota_SLA00063.jpg`,
  `${CDN}/srilanka/national_maritime_museum_galle_SLA00064.jpg`,
  `${CDN}/srilanka/dutch_reformed_church_galle_SLA00065.jpg`,
  `${CDN}/srilanka/galle_lighthouse_SLA00066.jpg`,
  `${CDN}/srilanka/yatala_vehera_tissamaharama_SLA00067.jpg`,
  `${CDN}/srilanka/tissa_lake_SLA00068.jpg`,
  `${CDN}/srilanka/katharagama_temple_SLA00069.jpg`,
  `${CDN}/srilanka/elephant_transit_home_udawalawe_SLA00070.jpg`,
  `${CDN}/srilanka/koneswaram_temple_trincomalee_SLA00071.jpg`,
  `${CDN}/srilanka/bhadrakali_amman_temple_trincomalee_SLA00072.jpg`,
  `${CDN}/srilanka/shankari_devi_temple_SLA00073.jpg`,
  `${CDN}/srilanka/victoria_lake_kandy_SLA00074.jpg`,
];

export const maldivesImgs = [
  `${CDN}/hotels/maldives/hero-images/11_hero.webp`,
  `${CDN}/hotels/maldives/hero-images/12_hero.webp`,
  `${CDN}/hotels/maldives/hero-images/13_hero.webp`,
  `${CDN}/hotels/maldives/hero-images/15_hero.webp`,
  `${CDN}/hotels/maldives/hero-images/16_hero.webp`,
  `${CDN}/hotels/maldives/hero-images/18_hero.webp`,
  `${CDN}/hotels/maldives/hero-images/224_hero.webp`,
  `${CDN}/hotels/maldives/hero-images/267_hero.webp`,
  `${CDN}/hotels/maldives/hero-images/3_hero.webp`,
  `${CDN}/hotels/maldives/hero-images/343_hero.webp`,
  `${CDN}/hotels/maldives/hero-images/37_hero.webp`,
  `${CDN}/hotels/maldives/hero-images/47_hero.webp`,
  `${CDN}/hotels/maldives/hero-images/48_hero.webp`,
  `${CDN}/hotels/maldives/hero-images/126_hero.webp`,
  `${CDN}/hotels/maldives/hero-images/134_hero.webp`,
];

// Pick from a pool — deterministic by index
const pick = (arr, i) => arr[i % arr.length];

// ─── Destination Data ───
export const destData = {
  Bali: {
    name: "Bali", flag: "🇮🇩", startPrice: "48,998",
    circle: baliImgs[2], card: baliImgs[0], hero: baliImgs[2],
    visa: "Visa on Arrival (30 days free). Passport must be valid 6+ months.",
    flights: "3 direct flights/week from Delhi (IndiGo, Batik Air). 2/week from Mumbai.",
    idealNights: "7–10 nights to cover Ubud, Seminyak & Nusa Penida",
    activities: ["Tegallalang Rice Terrace", "Mount Batur Sunrise", "Uluwatu Temple", "Tirta Empul", "Nusa Penida Beach", "Monkey Forest"],
    actImgs: baliImgs,
    offbeat: ["Hidden Waterfall Trek", "Village Cooking Class", "Sunrise Fishing", "Secret Beach Snorkel", "Rice Field Cycling", "Night Market Walk"],
    offbeatImgs: [baliImgs[3], baliImgs[4], baliImgs[5], baliImgs[0], baliImgs[1], baliImgs[2]],
    stayAreas: [
      { name: "Ubud", emoji: "🌿", img: "https://cdn.30sundays.club/app_content/bali/tegallalang_rice_fields_4.jpg", desc: "Jungle retreats, rice terraces & art villages", pros: ["Lush rice terraces", "Yoga & wellness retreats", "Art & craft workshops"], cons: ["No beach", "Busy during peak"] },
      { name: "Seminyak", emoji: "🌞", img: "https://cdn.30sundays.club/app_content/bali/bali_swing_experience_1.jpg", desc: "Upscale beach clubs, dining & nightlife", pros: ["Best sunset bars", "Boutique shopping", "Great restaurants"], cons: ["Crowded beaches", "Pricier"] },
      { name: "Nusa Penida", emoji: "🌊", img: "https://cdn.30sundays.club/app_content/bali/kelingking_beach_65.jpg", desc: "Dramatic cliffs, crystal-clear snorkeling", pros: ["Kelingking Beach", "Manta ray diving", "Less touristy"], cons: ["Rough roads", "Limited dining"] },
      { name: "Canggu", emoji: "🏄", img: "https://cdn.30sundays.club/app_content/bali/tree_house_nusa_penida_3.jpg", desc: "Surf town with hip cafés & beach vibes", pros: ["Best surf breaks", "Digital nomad hub", "Echo Beach sunsets"], cons: ["Getting crowded", "Traffic"] },
      { name: "Sanur", emoji: "☀️", img: "https://cdn.30sundays.club/app_content/bali/handara_gate_63.jpg", desc: "Quiet, family-friendly with calm waters", pros: ["Calm morning beach", "Authentic Balinese", "Boat to Nusa"], cons: ["Quiet nightlife", "Smaller beach"] },
    ],
  },
  Vietnam: {
    name: "Vietnam", flag: "🇻🇳", startPrice: "65,098",
    circle: vietnamImgs[5], card: vietnamImgs[0], hero: vietnamImgs[6],
    visa: "E-Visa required (valid 90 days)",
    flights: "Direct flights from Delhi & Mumbai (VietJet, IndiGo)",
    idealNights: "7–10 nights for Hanoi, Ha Long Bay & Ho Chi Minh",
    activities: ["Ha Long Bay Cruise", "Street Food Tour", "Cu Chi Tunnels", "Hoi An Lantern Walk", "Mekong Delta Boat", "Water Puppet Show"],
    actImgs: vietnamImgs.slice(0, 6),
  },
  Thailand: {
    name: "Thailand", flag: "🇹🇭", startPrice: "55,998",
    circle: thailandImgs[0], card: thailandImgs[2], hero: thailandImgs[0],
    visa: "Visa-free for Indians (60 days)",
    flights: "10+ direct flights/week from Delhi, Mumbai, Kolkata",
    idealNights: "7 nights for Bangkok, Phuket & Chiang Mai",
    activities: ["Grand Palace Tour", "Island Hopping", "Night Market Walk", "Thai Cooking Class", "Elephant Sanctuary", "Floating Market"],
    actImgs: thailandImgs,
  },
  Maldives: {
    name: "Maldives", flag: "🇲🇻", startPrice: "89,998",
    circle: maldivesImgs[0], card: maldivesImgs[1], hero: maldivesImgs[2],
    visa: "Visa-free on arrival (30 days)",
    flights: "Direct flights from Delhi, Mumbai, Bengaluru (IndiGo, Air India)",
    idealNights: "4–5 nights for the perfect island escape",
    activities: ["Dolphin Cruise", "Snorkeling Safari", "Underwater Dining", "Sandbank Picnic", "Sunset Fishing", "Spa Overwater"],
    actImgs: maldivesImgs.slice(3, 9),
  },
  "Sri Lanka": {
    name: "Sri Lanka", flag: "🇱🇰", startPrice: "54,998",
    circle: slImgs[0], card: slImgs[5], hero: slImgs[17],
    visa: "E-Visa required (ETA online)",
    flights: "Direct flights from Chennai, Delhi, Mumbai (SriLankan Airlines)",
    idealNights: "7 nights for Kandy, Ella & south coast beaches",
    activities: ["Sigiriya Rock Climb", "Train to Ella", "Whale Watching", "Tea Plantation Tour", "Safari at Yala", "Galle Fort Walk"],
    actImgs: slImgs.slice(0, 6),
  },
  "New Zealand": {
    name: "New Zealand", flag: "🇳🇿", startPrice: "1,65,098",
    circle: nzImgs[0], card: nzImgs[8], hero: nzImgs[10],
    visa: "NZeTA required (apply online)",
    flights: "No direct flights — connect via Singapore, KL or Sydney",
    idealNights: "10–14 nights to cover both North & South Islands",
    activities: ["Milford Sound Cruise", "Bungee at Queenstown", "Hobbiton Tour", "Glacier Walk", "Rotorua Geothermals", "Stargazing at Tekapo"],
    actImgs: nzImgs.slice(0, 6),
  },
};

export const destinations = Object.keys(destData).map(name => ({
  name,
  img: destData[name].circle,
  flag: destData[name].flag,
  startPrice: destData[name].startPrice,
}));

// ─── 21 Itineraries (no Dubai) ───
export const allItineraries = [
  // Bali (9)
  { id: 1, dest: "Bali", vibe: "Relaxed", name: "Swing & Sanur", nights: 7, price: "62,498", route: [{ city: "Ubud", n: 2 }, { city: "Seminyak", n: 2 }, { city: "Sanur", n: 3 }], veg: true, img: baliImgs[0],
    days: [{ city: "Ubud", n: 2, sub: "Temples · Rice terraces · Yoga" }, { city: "Seminyak", n: 2, sub: "Beach clubs · Shopping · Dining" }, { city: "Sanur", n: 3, sub: "Sunrise beach · Snorkeling · Markets" }],
    pace: "Unhurried", crowds: "Low", vegFood: "High" },
  { id: 2, dest: "Bali", vibe: "Relaxed", name: "Beach Club Bliss", nights: 5, price: "78,998", route: [{ city: "Seminyak", n: 2 }, { city: "Nusa Dua", n: 3 }], veg: false, img: baliImgs[1],
    days: [{ city: "Seminyak", n: 2, sub: "Spa · Sunset bars · Beach" }, { city: "Nusa Dua", n: 3, sub: "Luxury resort · Water sports" }],
    pace: "Unhurried", crowds: "Low", vegFood: "Medium" },
  { id: 3, dest: "Bali", vibe: "Relaxed", name: "Temples & Terraces", nights: 7, price: "72,498", route: [{ city: "Ubud", n: 3 }, { city: "Kintamani", n: 2 }, { city: "Sanur", n: 2 }], veg: true, img: baliImgs[2],
    days: [{ city: "Ubud", n: 3, sub: "Art villages · Hot springs · Rice paddies" }, { city: "Kintamani", n: 2, sub: "Volcano views · Lake · Coffee" }, { city: "Sanur", n: 2, sub: "Quiet beach · Cycling · Markets" }],
    pace: "Unhurried", crowds: "Low", vegFood: "High" },
  { id: 4, dest: "Bali", vibe: "Explorer", name: "Surf & Summit", nights: 7, price: "58,498", route: [{ city: "Ubud", n: 2 }, { city: "Kintamani", n: 2 }, { city: "Canggu", n: 3 }], veg: false, img: baliImgs[3],
    days: [{ city: "Ubud", n: 2, sub: "Monkey Forest · Temples · Markets" }, { city: "Kintamani", n: 2, sub: "Mt Batur trek · Hot springs" }, { city: "Canggu", n: 3, sub: "Surf · Beach clubs · Tanah Lot" }],
    pace: "Balanced", crowds: "Mixed", vegFood: "Medium" },
  { id: 5, dest: "Bali", vibe: "Explorer", name: "Island Odyssey", nights: 10, price: "82,998", route: [{ city: "Ubud", n: 3 }, { city: "Amed", n: 3 }, { city: "Nusa Penida", n: 2 }, { city: "Seminyak", n: 2 }], veg: true, img: baliImgs[4],
    days: [{ city: "Ubud", n: 3, sub: "Culture · Waterfalls · Rice fields" }, { city: "Amed", n: 3, sub: "Diving · Snorkeling · Sunrise" }, { city: "Nusa Penida", n: 2, sub: "Kelingking · Broken Beach" }, { city: "Seminyak", n: 2, sub: "Shopping · Dining · Nightlife" }],
    pace: "Balanced", crowds: "Mixed", vegFood: "High" },
  { id: 6, dest: "Bali", vibe: "Explorer", name: "Cliffs & Coast", nights: 5, price: "48,998", route: [{ city: "Seminyak", n: 2 }, { city: "Uluwatu", n: 1 }, { city: "Nusa Penida", n: 2 }], veg: false, img: baliImgs[5],
    days: [{ city: "Seminyak", n: 2, sub: "Beach · Markets · Sunset" }, { city: "Uluwatu", n: 1, sub: "Temple · Kecak dance · Cliffs" }, { city: "Nusa Penida", n: 2, sub: "Island explore · Snorkel" }],
    pace: "Balanced", crowds: "Mixed", vegFood: "Medium" },
  { id: 7, dest: "Bali", vibe: "Offbeat", name: "Valley Trails", nights: 7, price: "55,998", route: [{ city: "Sidemen", n: 3 }, { city: "Munduk", n: 2 }, { city: "Amed", n: 2 }], veg: false, img: baliImgs[3],
    days: [{ city: "Sidemen", n: 3, sub: "Valley · Crafts · Homestay" }, { city: "Munduk", n: 2, sub: "Waterfalls · Coffee · Twin lakes" }, { city: "Amed", n: 2, sub: "Shipwreck dive · Fishing village" }],
    pace: "Unhurried", crowds: "Low", vegFood: "Medium" },
  { id: 8, dest: "Bali", vibe: "Offbeat", name: "Slow Sidemen", nights: 5, price: "48,998", route: [{ city: "Sidemen", n: 2 }, { city: "Munduk", n: 3 }], veg: true, img: baliImgs[4],
    days: [{ city: "Sidemen", n: 2, sub: "Rice fields · Village walks" }, { city: "Munduk", n: 3, sub: "Waterfalls · Star gazing · Treks" }],
    pace: "Unhurried", crowds: "Low", vegFood: "High" },
  { id: 9, dest: "Bali", vibe: "Offbeat", name: "Dolphin Coast", nights: 7, price: "62,498", route: [{ city: "Munduk", n: 2 }, { city: "Pemuteran", n: 3 }, { city: "Lovina", n: 2 }], veg: false, img: baliImgs[5],
    days: [{ city: "Munduk", n: 2, sub: "Waterfalls · Coffee plantations" }, { city: "Pemuteran", n: 3, sub: "Coral garden · Diving · Temples" }, { city: "Lovina", n: 2, sub: "Dolphin watching · Black sand beach" }],
    pace: "Unhurried", crowds: "Low", vegFood: "Medium" },
  // Vietnam (3)
  { id: 10, dest: "Vietnam", vibe: "Explorer", name: "Bays & Boulevards", nights: 7, price: "65,098", route: [{ city: "Hanoi", n: 2 }, { city: "Ha Long", n: 2 }, { city: "HCMC", n: 3 }], veg: false, img: vietnamImgs[5],
    days: [{ city: "Hanoi", n: 2, sub: "Old Quarter · Street food · Temple" }, { city: "Ha Long", n: 2, sub: "Bay cruise · Kayaking · Caves" }, { city: "HCMC", n: 3, sub: "Cu Chi · Markets · Rooftop bars" }],
    pace: "Balanced", crowds: "Mixed", vegFood: "Medium" },
  { id: 11, dest: "Vietnam", vibe: "Relaxed", name: "Lanterns & Lagoons", nights: 7, price: "72,498", route: [{ city: "Da Nang", n: 3 }, { city: "Hoi An", n: 2 }, { city: "Phu Quoc", n: 2 }], veg: true, img: vietnamImgs[0],
    days: [{ city: "Da Nang", n: 3, sub: "Golden Bridge · Beach · Spa" }, { city: "Hoi An", n: 2, sub: "Lanterns · Tailoring · Cooking" }, { city: "Phu Quoc", n: 2, sub: "Island beach · Snorkeling" }],
    pace: "Unhurried", crowds: "Low", vegFood: "High" },
  { id: 12, dest: "Vietnam", vibe: "Offbeat", name: "Caves & Karsts", nights: 7, price: "68,498", route: [{ city: "Ninh Binh", n: 2 }, { city: "Phong Nha", n: 3 }, { city: "Hoi An", n: 2 }], veg: true, img: vietnamImgs[6],
    days: [{ city: "Ninh Binh", n: 2, sub: "Boat rides · Caves · Pagodas" }, { city: "Phong Nha", n: 3, sub: "Paradise Cave · Dark Cave · Jungle" }, { city: "Hoi An", n: 2, sub: "Ancient town · Lanterns · Beach" }],
    pace: "Balanced", crowds: "Low", vegFood: "High" },
  // Thailand (3)
  { id: 13, dest: "Thailand", vibe: "Explorer", name: "Palaces & Isles", nights: 7, price: "62,498", route: [{ city: "Bangkok", n: 3 }, { city: "Chiang Mai", n: 2 }, { city: "Krabi", n: 2 }], veg: false, img: thailandImgs[0],
    days: [{ city: "Bangkok", n: 3, sub: "Grand Palace · Markets · Street food" }, { city: "Chiang Mai", n: 2, sub: "Temples · Elephants · Night bazaar" }, { city: "Krabi", n: 2, sub: "Islands · Snorkeling · Kayak" }],
    pace: "Balanced", crowds: "Mixed", vegFood: "Medium" },
  { id: 14, dest: "Thailand", vibe: "Relaxed", name: "Spa & Sands", nights: 7, price: "68,998", route: [{ city: "Bangkok", n: 2 }, { city: "Phuket", n: 3 }, { city: "Koh Samui", n: 2 }], veg: false, img: thailandImgs[2],
    days: [{ city: "Bangkok", n: 2, sub: "Spa · Rooftop bars · Shopping" }, { city: "Phuket", n: 3, sub: "Beach clubs · Old Town · Sunsets" }, { city: "Koh Samui", n: 2, sub: "Island spa · Fisherman village" }],
    pace: "Unhurried", crowds: "Mixed", vegFood: "Medium" },
  { id: 15, dest: "Thailand", vibe: "Offbeat", name: "Northern Trails", nights: 7, price: "55,998", route: [{ city: "Chiang Mai", n: 3 }, { city: "Chiang Rai", n: 2 }, { city: "Pai", n: 2 }], veg: true, img: thailandImgs[3],
    days: [{ city: "Chiang Mai", n: 3, sub: "Doi Suthep · Cooking · Craft" }, { city: "Chiang Rai", n: 2, sub: "White Temple · Blue Temple · Night market" }, { city: "Pai", n: 2, sub: "Canyon · Hot springs · Bamboo bridge" }],
    pace: "Unhurried", crowds: "Low", vegFood: "High" },
  // Maldives (3)
  { id: 16, dest: "Maldives", vibe: "Relaxed", nights: 5, price: "89,998", route: [{ city: "Malé", n: 2 }, { city: "Addu", n: 3 }], villas: [{ type: "Beach Villa", n: 2 }, { type: "Water Villa", n: 3 }], veg: true, resort: "Anantara Veli", highlightResort: true, img: maldivesImgs[0],
    days: [{ city: "Malé", n: 2, sub: "City tour · Fish market · Transfer" }, { city: "Addu", n: 3, sub: "Overwater villa · Spa · Diving" }],
    pace: "Unhurried", crowds: "Low", vegFood: "High" },
  { id: 17, dest: "Maldives", vibe: "Relaxed", nights: 4, price: "1,12,998", route: [{ city: "Malé", n: 1 }, { city: "Baa Atoll", n: 3 }], villas: [{ type: "Beach Villa", n: 1 }, { type: "Water Villa", n: 3 }], veg: false, resort: "Soneva Fushi", highlightResort: true, img: maldivesImgs[3],
    days: [{ city: "Malé", n: 1, sub: "Airport transfer · Seaplane" }, { city: "Baa Atoll", n: 3, sub: "Manta snorkel · Overwater dining · Sandbank" }],
    pace: "Unhurried", crowds: "Low", vegFood: "Medium" },
  { id: 18, dest: "Maldives", vibe: "Explorer", nights: 7, price: "95,498", route: [{ city: "Malé", n: 2 }, { city: "S.Ari", n: 3 }, { city: "Fuvahmulah", n: 2 }], villas: [{ type: "Beach Villa", n: 3 }, { type: "Water Villa", n: 4 }], veg: false, resort: "Centara Grand", highlightResort: true, img: maldivesImgs[6],
    days: [{ city: "Malé", n: 2, sub: "Local island · Fish market · Mosque" }, { city: "S.Ari", n: 3, sub: "Whale shark · Diving · Resort" }, { city: "Fuvahmulah", n: 2, sub: "Tiger shark dive · Local life" }],
    pace: "Balanced", crowds: "Mixed", vegFood: "Medium" },
  // Sri Lanka (3)
  { id: 19, dest: "Sri Lanka", vibe: "Relaxed", name: "Tea & Tides", nights: 7, price: "54,998", route: [{ city: "Kandy", n: 2 }, { city: "Ella", n: 2 }, { city: "Mirissa", n: 3 }], veg: false, img: slImgs[17],
    days: [{ city: "Kandy", n: 2, sub: "Temple · Botanical gardens · Lake" }, { city: "Ella", n: 2, sub: "Train ride · Nine Arches · Tea" }, { city: "Mirissa", n: 3, sub: "Whale watching · Beach · Surf" }],
    pace: "Unhurried", crowds: "Low", vegFood: "Medium" },
  { id: 20, dest: "Sri Lanka", vibe: "Explorer", name: "Rocks & Ramparts", nights: 7, price: "58,498", route: [{ city: "Colombo", n: 2 }, { city: "Sigiriya", n: 2 }, { city: "Galle", n: 3 }], veg: false, img: slImgs[5],
    days: [{ city: "Colombo", n: 2, sub: "Gangaramaya · Pettah · Street food" }, { city: "Sigiriya", n: 2, sub: "Rock fortress · Caves · Safari" }, { city: "Galle", n: 3, sub: "Fort · Beaches · Boutique stays" }],
    pace: "Balanced", crowds: "Mixed", vegFood: "Medium" },
  { id: 21, dest: "Sri Lanka", vibe: "Offbeat", name: "Wild & Ancient", nights: 7, price: "54,998", route: [{ city: "Sigiriya", n: 2 }, { city: "Trincomalee", n: 3 }, { city: "Yala", n: 2 }], veg: false, img: slImgs[14],
    days: [{ city: "Sigiriya", n: 2, sub: "Ancient ruins · Village cycling" }, { city: "Trincomalee", n: 3, sub: "Pristine beaches · Pigeon Island" }, { city: "Yala", n: 2, sub: "Leopard safari · Beach camp" }],
    pace: "Balanced", crowds: "Low", vegFood: "Medium" },
  // New Zealand (3)
  { id: 22, dest: "New Zealand", vibe: "Explorer", name: "Peaks & Adrenaline", nights: 10, price: "1,85,098", route: [{ city: "Auckland", n: 2 }, { city: "Queenstown", n: 4 }, { city: "Rotorua", n: 4 }], veg: false, img: nzImgs[0],
    days: [{ city: "Auckland", n: 2, sub: "Sky Tower · Waiheke · Harbour" }, { city: "Queenstown", n: 4, sub: "Bungee · Milford · LOTR · Jet boat" }, { city: "Rotorua", n: 4, sub: "Geothermals · Hobbiton · Māori" }],
    pace: "Balanced", crowds: "Mixed", vegFood: "Medium" },
  { id: 23, dest: "New Zealand", vibe: "Relaxed", name: "Vines & Thermals", nights: 7, price: "1,65,098", route: [{ city: "Auckland", n: 2 }, { city: "Rotorua", n: 3 }, { city: "Waiheke", n: 2 }], veg: false, img: nzImgs[8],
    days: [{ city: "Auckland", n: 2, sub: "Harbour cruise · Art gallery · Dining" }, { city: "Rotorua", n: 3, sub: "Hot pools · Redwoods · Geothermals" }, { city: "Waiheke", n: 2, sub: "Vineyards · Beach · Olive groves" }],
    pace: "Unhurried", crowds: "Low", vegFood: "Medium" },
  { id: 24, dest: "New Zealand", vibe: "Offbeat", name: "Fiords & Alps", nights: 10, price: "1,95,098", route: [{ city: "Christchurch", n: 3 }, { city: "Milford", n: 4 }, { city: "Wanaka", n: 3 }], veg: false, img: nzImgs[4],
    days: [{ city: "Christchurch", n: 3, sub: "Cathedral · Markets · TranzAlpine" }, { city: "Milford", n: 4, sub: "Fiord cruise · Hikes · Glaciers" }, { city: "Wanaka", n: 3, sub: "Roys Peak · Puzzling World · Lake" }],
    pace: "Balanced", crowds: "Low", vegFood: "Medium" },
];

// Group itineraries by vibe for home carousels
export const itinerariesByVibe = {
  relaxed: allItineraries.filter(i => i.vibe === "Relaxed"),
  explorer: allItineraries.filter(i => i.vibe === "Explorer"),
  offbeat: allItineraries.filter(i => i.vibe === "Offbeat"),
};

export const getItinerariesForDest = (dest) => allItineraries.filter(i => i.dest === dest);

// ─── Reviews ───
export const reviews = [
  { name: "Nishant & Priya", text: "They don't suggest over touristy places. Their offbeat Bali itinerary was a revelation!", dest: "Bali" },
  { name: "Rohit & Sneha", text: "Price transparency was refreshing. Vietnam was perfectly paced for us.", dest: "Vietnam" },
  { name: "Aakash & Meera", text: "From booking to return, support was incredible. Maldives felt designed just for us.", dest: "Maldives" },
  { name: "Tanvi & Kunal", text: "The Bali swing, the rice terraces, the private dinners — every moment was thoughtfully planned.", dest: "Bali" },
  { name: "Shreya & Arjun", text: "We did Thailand with them and honestly the Phi Phi islands day was the highlight of our year.", dest: "Thailand" },
  { name: "Megha & Vishal", text: "Sri Lanka was a dream. The Ella train ride alone was worth the trip. Can't recommend enough!", dest: "Sri Lanka" },
  { name: "Pooja & Siddharth", text: "New Zealand felt like a movie. Milford Sound, the Hobbiton tour — absolutely unreal experience.", dest: "New Zealand" },
  { name: "Ananya & Ravi", text: "Ha Long Bay cruise was magical. They handled every detail so we could just enjoy being together.", dest: "Vietnam" },
  { name: "Diya & Karthik", text: "The Maldives overwater villa was a bucket list moment. 30 Sundays made it happen within our budget!", dest: "Maldives" },
  { name: "Ritika & Manish", text: "Loved how they mixed popular spots with hidden gems in Thailand. Pai was an unexpected favourite.", dest: "Thailand" },
];

// ─── USPs ───
export const usps = [
  { title: "Made for Couples", desc: "Trips designed exclusively for two", icon: "Heart", color: C.p600 },
  { title: "Price Transparency", desc: "Full split — no hidden markups", icon: "Eye", color: C.b600 },
  { title: "No Tourist Traps", desc: "Only 8+ rated, hand-picked gems", icon: "Shield", color: C.sText },
  { title: "24/7 Support", desc: "From booking through your return", icon: "Headphones", color: C.purple },
];

// ─── Traveller Moments ───
// ─── Customer / Traveller Photos ───
const CP = "https://cdn.30sundays.club/app_content/activity_images";

export const customerPhotos = {
  Bali: [
    `${CP}/bali/ayushi_and_kaustubh_bla00008_112gyJ4dMwJ7p2pnHg_z4m146Ej5DQGfZ.webp`,
    `${CP}/bali/ayushi_and_kaustubh_bla00005_17vP0FKRoq-XDnmM499-13kSTSPKcwdvK.webp`,
    `${CP}/bali/ayushi_and_kaustubh_bla00003_1NiLUImjFzLoxkLUq1LBpEEJ7y2ssvxnT.webp`,
    `${CP}/bali/ayushi_and_kaustubh_bla00006_1053Z1efACLlzXLongarLeax8MMA1QWN1.webp`,
    `${CP}/bali/ayushi_and_kaustubh_bla00008_1stKs4vMP7oMW3xCWXh9ET_c_FeeNn9LV.webp`,
    `${CP}/bali/ayushi_and_kaustubh_bla00110_1DqXtD_sm8VJYtjUX99-l3jbK_ts1m1fe.webp`,
    `${CP}/bali/ayushi_and_kaustubh_bla00068_1q-4Q_1fVBShY9-F7jSwXRbbQC7qPJdqP.webp`,
    `${CP}/bali/ayushi_and_kaustubh_bla00029_1RXFZr4Ms0fJTh8efj3alD7kdS1xwxZts.webp`,
    `${CP}/bali/ayushi_and_kaustubh_unknown_10rh_hbtp5qv5HLy-bk1ayRKKbJU3rq55.webp`,
    `${CP}/bali/ayushi_and_kaustubh_bla00008_1qkYEJ9hrvC1MKYYUtDyIIfGXrRAA9qo0.webp`,
    `${CP}/bali/utsav_and_prachi_unknown_1GvFtLi6wRiDYT204CdVFehuepS8CdqjH.webp`,
    `${CP}/bali/utsav_and_prachi_unknown_1LpKRxMQbxrsuf_zLvzhhlF3zeUD8Dm1C.webp`,
    `${CP}/bali/utsav_and_prachi_unknown_1enH7ALTzR9uxg8v1mjep3I3YB903bDQ8.webp`,
    `${CP}/bali/utsav_and_prachi_unknown_1cqBGacyAo9SbpJHN9CdKy1wc8kc6Svr7.webp`,
    `${CP}/bali/utsav_and_prachi_bla00052_1fCEV2OqI-f_ipp-Fn7Gqp1Gf2AFPFVkA.webp`,
  ],
  Maldives: [
    `${CP}/maldives/dinesh_and_harshitha_unknown_1dGKVjK7vJlGRAY5J3V6JuchByY_8u3X6.webp`,
    `${CP}/maldives/dinesh_and_harshitha_unknown_1ZOCkfXJAETEo6oMKdMnCM2k77SgefUgw.webp`,
    `${CP}/maldives/dinesh_and_harshitha_unknown_1QEPDUVP6AID78Q8c5GTqpTRx5pZSulb4.webp`,
    `${CP}/maldives/dinesh_and_harshitha_unknown_1SwNd5CgU56j-hXhFKLrEPLBB5aSEO2U1.webp`,
    `${CP}/maldives/dinesh_and_harshitha_unknown_1fkC3WZX9tGxJkvM6lYUOTwFtoDpFy5IS.webp`,
    `${CP}/maldives/dinesh_and_harshitha_unknown_10FvokEfM_7h78eFbVAFkuOhqpUCTUBOi.webp`,
    `${CP}/maldives/dinesh_and_harshitha_unknown_1JACyOogcO3czPBiihaxqluQ3D4XtJT2M.webp`,
    `${CP}/maldives/dinesh_and_harshitha_unknown_1pkxJCfvbQKYqW8jtMGUgV9Lmv_egs3_n.webp`,
    `${CP}/maldives/dinesh_and_harshitha_unknown_1NFflAimIsUbvJHmF7UBz8jl1ezv6rSIQ.webp`,
    `${CP}/maldives/dinesh_and_harshitha_unknown_184Dm4ByUBruK8ahYFVGVnA6ioqsmYfvT.webp`,
    `${CP}/maldives/dinesh_and_harshitha_unknown_150tpvXSGoB72FA19IPJ0Ys8k9kpVE369.webp`,
    `${CP}/maldives/dinesh_and_harshitha_unknown_1syo_Q_Iv_pm2zfliHBKVP68blkJiJjQ5.webp`,
    `${CP}/maldives/dinesh_and_harshitha_unknown_1wEMQBvBd0FdLizVnXOrxey7_Ujq6vJPs.webp`,
    `${CP}/maldives/dinesh_and_harshitha_unknown_1HZxp0puKscIrFiJj55KuFEYKT9Un-rmY.webp`,
    `${CP}/maldives/dinesh_and_harshitha_unknown_1E_KrN2xbEY8y6gmMxdNYtPPo3fU5e6WN.webp`,
  ],
  Vietnam: [
    `${CP}/vietnam/raaghav_and_ritika_vna00012_1yMDt_KcOO8JdJtFQkuShBqfanQW6JLXH.webp`,
    `${CP}/vietnam/raaghav_and_ritika_vna00059_1SQ_orYJCsgQFeCaNN7pcn4TNTU4LnQJB.webp`,
    `${CP}/vietnam/raaghav_and_ritika_vna00109_1gpmv6NG1ZBljbWJierrqSKGifz_Fc392.webp`,
    `${CP}/vietnam/raaghav_and_ritika_vna00103_1uBF12uKW7U78RHQA_6Jbl6YZllSNkgU1.webp`,
    `${CP}/vietnam/raaghav_and_ritika_vna00038_16C7mhvrCqoomc3UvIp_HHhsoxUqkhynI.webp`,
    `${CP}/vietnam/raaghav_and_ritika_vna00074_1-IARJoxvZtTZPj4pzK5bK9QxVIcf4M4x.webp`,
    `${CP}/vietnam/raaghav_and_ritika_unknown_11jEkJWvCR-9KcTFfQV_1Pxd4au9qSbs2.webp`,
    `${CP}/vietnam/raaghav_and_ritika_vna00015_1Kl63cMzltf6IJhnErBcFlC_EYYC_Ra2T.webp`,
    `${CP}/vietnam/raaghav_and_ritika_vna00082_1weNdejrC_kDu_J5cDtBklAcPGWuO3bFZ.webp`,
    `${CP}/vietnam/raaghav_and_ritika_unknown_1HoaMMJo7zkz1JxKeRxpiLAuw-q8r1aSs.webp`,
    `${CP}/vietnam/raaghav_and_ritika_unknown_1g4M1AC2fd1xzo3dNUEMV-i4oADkZYp1H.webp`,
    `${CP}/vietnam/raaghav_and_ritika_vna00074_14qltGheCy3_4v-KphQqC7EjtdK-e23M-.webp`,
    `${CP}/vietnam/raaghav_and_ritika_vna00031_1uT_X64n7JZO4m73bbcM0wpOiApwyWXsz.webp`,
    `${CP}/vietnam/raaghav_and_ritika_vna00015_1qAxvmNv3Fbm8XLJmQbVk61kyV5hyOa1q.webp`,
    `${CP}/vietnam/raaghav_and_ritika_vna00016_1gGyJyTsoZW7kAZbNgTxUAcLCCUHqabta.webp`,
  ],
  Thailand: [
    `${CP}/thailand/sharv_pranjali_tha00057_1Jg3iSsOIW145EDt1XGvr06A5d7wZIXie.webp`,
    `${CP}/thailand/sharv_pranjali_unknown_1n0SgyEKzB7o5HaR4lfjrS9tqHc8f5Vt0.webp`,
    `${CP}/thailand/sharv_pranjali_unknown_11S9lswLE7iMGHDNVrKqkz1R8fUawA_uB.webp`,
    `${CP}/thailand/sharv_pranjali_tha00163_12xg8Qsshj-ee9mOC4GHp6ARZkLuPK0RR.webp`,
    `${CP}/thailand/sharv_pranjali_tha00057_18lA4QA2sADmF-_J9FcEKfpg3BkKBVEZA.webp`,
    `${CP}/thailand/sharv_pranjali_tha00025_1URkZF2zIdXY5PJbg3SKNkByEJcfrawR6.webp`,
    `${CP}/thailand/sharv_pranjali_tha00054_1gEZri5ddSP2DKn5yGm1bZ6HdUJJdExxC.webp`,
    `${CP}/thailand/anupriya_and_sumit_tha00109_1RjpTZ47oufqltvwK7EGJGsgJauFk5SA1.webp`,
    `${CP}/thailand/anupriya_and_sumit_unknown_1VBGNFiTawKiUsEPn53Pd-S-UHWlVoc0t.webp`,
    `${CP}/thailand/anupriya_and_sumit_unknown_16UC4rn8BSaSZOuF23S8P__iG6_VCVFYS.webp`,
    `${CP}/thailand/anupriya_and_sumit_tha00014_15yzI5j7DAwYg4qwdi6EGHSelXp8GE-x3.webp`,
    `${CP}/thailand/anupriya_and_sumit_unknown_1LVKVp84ysWHRiapc0_4L8myuLPvQRBom.webp`,
    `${CP}/thailand/anupriya_and_sumit_tha00005_1V2IKA-Ab8rZ2kBVlne6FkfDipgsFKX9M.webp`,
    `${CP}/thailand/anupriya_and_sumit_tha00040_1G2hsd6DpkEMi7nueduDAFXMXZD84SFe1.webp`,
    `${CP}/thailand/anupriya_and_sumit_tha00057_1FbQ0L9Urc6iL6GI2-MWS4eFudJGDk54r.webp`,
  ],
};

// ─── Real Couple Stories (for "Real Couples, Real Itineraries" section) ───
export const coupleStories = [
  {
    couple: "Shraddha & Rohit",
    dest: "Bali",
    itineraryId: 5,
    route: "Ubud · Seminyak · Nusa Penida",
    heroImg: customerPhotos.Bali[0],
    gallery: customerPhotos.Bali.slice(0, 10),
  },
  {
    couple: "Ritu & Amit",
    dest: "Vietnam",
    itineraryId: 10,
    route: "Hanoi · Ha Long · HCMC",
    heroImg: customerPhotos.Vietnam[0],
    gallery: customerPhotos.Vietnam.slice(0, 10),
  },
  {
    couple: "Dinesh & Harshitha",
    dest: "Maldives",
    itineraryId: 16,
    route: "Malé · Addu Atoll",
    heroImg: customerPhotos.Maldives[0],
    gallery: customerPhotos.Maldives.slice(0, 10),
  },
  {
    couple: "Sharv & Pranjali",
    dest: "Thailand",
    itineraryId: 13,
    route: "Bangkok · Chiang Mai · Krabi",
    heroImg: customerPhotos.Thailand[0],
    gallery: customerPhotos.Thailand.slice(0, 10),
  },
];

// Couples count per destination (for social proof bar)
export const couplesCount = {
  Bali: 847,
  Vietnam: 523,
  Thailand: 691,
  Maldives: 412,
  "Sri Lanka": 318,
  "New Zealand": 156,
};

// Couple names mapped to photo indices per destination
export const couplePhotoNames = {
  Bali: ["Ayushi & Kaustubh", "Ayushi & Kaustubh", "Ayushi & Kaustubh", "Ayushi & Kaustubh", "Ayushi & Kaustubh", "Ayushi & Kaustubh", "Ayushi & Kaustubh", "Ayushi & Kaustubh", "Ayushi & Kaustubh", "Ayushi & Kaustubh", "Utsav & Prachi", "Utsav & Prachi", "Utsav & Prachi", "Utsav & Prachi", "Utsav & Prachi"],
  Maldives: Array(15).fill("Dinesh & Harshitha"),
  Vietnam: Array(15).fill("Raaghav & Ritika"),
  Thailand: ["Sharv & Pranjali", "Sharv & Pranjali", "Sharv & Pranjali", "Sharv & Pranjali", "Sharv & Pranjali", "Sharv & Pranjali", "Sharv & Pranjali", "Anupriya & Sumit", "Anupriya & Sumit", "Anupriya & Sumit", "Anupriya & Sumit", "Anupriya & Sumit", "Anupriya & Sumit", "Anupriya & Sumit", "Anupriya & Sumit"],
};

// Home page: random mix from all destinations
export const travellerMoments = [
  { img: customerPhotos.Bali[0], dest: "Bali" },
  { img: customerPhotos.Vietnam[1], dest: "Vietnam" },
  { img: customerPhotos.Maldives[2], dest: "Maldives" },
  { img: customerPhotos.Thailand[0], dest: "Thailand" },
  { img: customerPhotos.Bali[10], dest: "Bali" },
  { img: customerPhotos.Vietnam[4], dest: "Vietnam" },
  { img: customerPhotos.Maldives[7], dest: "Maldives" },
  { img: customerPhotos.Thailand[8], dest: "Thailand" },
];

// Photo tags per destination (mapped to photo indices)
const photoTags = {
  Bali: ["ATV Ride", "Rice Terrace", "Swing", "Temple Visit", "Beach Club", "Waterfall", "Monkey Forest", "Ubud Market", "Snorkeling", "Sunset", "Mt Batur", "Cooking Class", "Yoga", "Surfing", "Spa Day"],
  Maldives: ["Overwater Villa", "Snorkeling", "Sunset Cruise", "Beach Dinner", "Dolphin Watch", "Kayaking", "Sandbank", "Spa", "Diving", "Fishing", "Water Sports", "Island Hop", "Coral Reef", "Sunrise", "Yoga"],
  Vietnam: ["Ha Long Bay", "Old Quarter", "Hoi An", "Cooking Class", "Mekong Delta", "Lantern Night", "Street Food", "Sapa Trek", "Cyclo Ride", "Temple", "Beach", "Market", "Boat Ride", "Pagoda", "Coffee"],
  Thailand: ["Phi Phi Island", "Temple Tour", "Beach Day", "Elephant Sanctuary", "Street Food", "Night Market", "Muay Thai", "Floating Market", "Cooking Class", "Snorkeling", "Island Hop", "Tuk Tuk", "Sunset", "Spa", "Diving"],
};

// Destination page: contextual photos with tags
export const getCustomerPhotos = (dest) => {
  const pool = customerPhotos[dest];
  const tags = photoTags[dest];
  if (pool && tags) return pool.slice(0, 8).map((img, i) => ({ img, tag: tags[i] || dest }));
  return [
    { img: customerPhotos.Bali[2], tag: "Swing" },
    { img: customerPhotos.Vietnam[0], tag: "Ha Long Bay" },
    { img: customerPhotos.Maldives[0], tag: "Overwater Villa" },
    { img: customerPhotos.Thailand[3], tag: "Elephant Sanctuary" },
    { img: customerPhotos.Bali[7], tag: "Ubud Market" },
  ];
};

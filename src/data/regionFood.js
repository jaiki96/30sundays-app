// ─── Where to eat, per region ───
//
// The one question nobody in the app answers, and the one Indian couples ask
// first: is there anywhere we can actually eat. So every region carries a
// short list with the two tags that matter, Indian and Veg only, alongside the
// place worth going to for its own sake.
//
// Written by hand. Names, tags and notes are a starting list and need a pass
// from somebody who sells these trips before this goes in front of a customer:
// restaurants close, change hands and drop their Indian menu, and this file
// has no way of knowing. Nothing here carries a price or an opening time for
// the same reason.
//
// Tags, in the order they are worth reading:
//   Indian food  a proper Indian kitchen, not one curry on a Western menu
//   Veg only     the whole menu is vegetarian
//   Jain         Jain food on request, where we know it is offered
// then what kind of place it is: Local food, Street food, Seafood, Fine
// dining, Cafe, Rooftop, Beachfront.
//
// There is no "veg friendly" tag. Almost everywhere has a salad, so the words
// told a couple nothing and the ones who needed the answer still had to ask.

export const REGION_FOOD = {
  // ── Bali ──
  "Bali::Ubud": [
    { name: "Queen's Tandoor", area: "Jalan Raya Ubud", km: 0.6, tags: ["Indian food"], note: "North Indian, the one most couples end up at twice." },
    { name: "Sari Organik", area: "Subak Sok Wayah", km: 1.8, tags: ["Local food"], note: "A walk out through the rice fields to get to it." },
    { name: "Locavore NXT", area: "Nyuh Bulan", km: 2.4, tags: ["Fine dining"], note: "Tasting menu, booked weeks out. Worth one night." },
    { name: "Alchemy", area: "Penestanan", km: 1.6, tags: ["Veg only", "Cafe"], note: "Raw and vegan, and the salad bar is the best on the island." },
  ],
  "Bali::Seminyak": [
    { name: "Gateway of India", area: "Jalan Double Six", km: 1.2, tags: ["Indian food"], note: "Long menu, generous portions, close to the beach." },
    { name: "La Lucciola", area: "Petitenget beach", km: 2.1, tags: ["Seafood", "Beachfront"], note: "Sunset tables on the sand. Book days ahead." },
    { name: "Sate Bali", area: "Jalan Kayu Aya", km: 0.9, tags: ["Local food"], note: "A small Balinese rijsttafel, not a tourist buffet." },
    { name: "Earth Cafe & Market", area: "Jalan Kayu Aya", km: 1.0, tags: ["Veg only", "Cafe"], note: "Vegetarian all the way through, with a shop attached." },
  ],
  "Bali::Sanur": [
    { name: "Gopal Indian Restaurant", area: "Danau Tamblingan", km: 0.8, tags: ["Indian food"], note: "Simple, cheap, and open late." },
    { name: "Byrdhouse Beach Club", area: "North Sanur", km: 2.6, tags: ["Beachfront"], note: "Breakfast by the water at the quiet end." },
    { name: "Warung Mak Beng", area: "Jalan Hang Tuah", km: 1.4, tags: ["Seafood", "Local food"], note: "One dish only: fried fish, soup and rice." },
    { name: "Bali Buda", area: "Danau Tamblingan", km: 1.0, tags: ["Veg only", "Cafe"], note: "Vegetarian kitchen and bakery. Been on the island for years." },
  ],
  "Bali::Canggu": [
    { name: "Milk & Madu", area: "Berawa", km: 1.5, tags: ["Cafe"], note: "The breakfast Canggu is built on." },
    { name: "Mantra Indian Kitchen", area: "Padang Linjong", km: 2.2, tags: ["Indian food"], note: "Thalis and tandoor, a short ride inland." },
    { name: "The Lawn", area: "Batu Bolong beach", km: 1.1, tags: ["Beachfront"], note: "Drinks on the grass above Batu Bolong at sunset." },
    { name: "Peloton Supershop", area: "Batu Bolong", km: 0.9, tags: ["Veg only"], note: "Entirely plant-based, and busy enough that you should book." },
  ],
  "Bali::Uluwatu": [
    { name: "Single Fin", area: "Suluban beach", km: 2.3, tags: ["Beachfront"], note: "On the cliff above the surf break. Sunday evenings are busy." },
    { name: "Om Burger", area: "Jalan Labuansait", km: 1.0, tags: ["Local food"], note: "Rooftop, and the vegetarian burgers are the good ones." },
    { name: "Nalu Bowls", area: "Bingin", km: 1.7, tags: ["Veg only", "Cafe"], note: "Breakfast bowls, five minutes from most villas." },
  ],
  "Bali::Nusa Penida": [
    { name: "Penida Colada", area: "Ped, north coast", km: 3.1, tags: ["Beachfront"], note: "Swings, sand and a short menu. Sunset side." },
    { name: "Warung Bu Lina", area: "Toyapakeh harbour", km: 0.7, tags: ["Local food"], note: "Nasi campur near the harbour, at island prices." },
    { name: "Amok Sunset", area: "Crystal Bay road", km: 5.4, tags: ["Seafood"], note: "Cliff tables on the north coast." },
    { name: "Vegetarian nasi campur", area: "Any warung", tags: ["Veg only", "Local food"], note: "Ask for it without the fish. Every warung on the island will do one." },
  ],
  "Bali::Labuan Bajo": [
    { name: "Made in Italy", area: "Soekarno Hatta", km: 0.5, tags: ["Local food"], note: "Wood-fired pizza, which is what everyone wants after a boat day." },
    { name: "Treetop Restaurant", area: "Above the harbour", km: 1.3, tags: ["Seafood"], note: "Above the harbour, with the whole bay in front of it." },
    { name: "Bajo Taco", area: "Waterfront", km: 0.4, tags: ["Local food"], note: "Quick, cheap and open when the boats get back." },
    { name: "Vegetarian gado-gado", area: "Town warungs", tags: ["Veg only", "Local food"], note: "Peanut sauce, vegetables, rice cake. On every menu in town." },
  ],

  // ── Vietnam ──
  "Vietnam::Hanoi": [
    { name: "Namaste Hanoi", area: "Old Quarter", km: 0.6, tags: ["Indian food", "Jain"], note: "Jain food on request if you call ahead." },
    { name: "Bun Cha Huong Lien", area: "Le Van Huu", km: 1.5, tags: ["Local food", "Street food"], note: "Grilled pork and noodles, on plastic stools." },
    { name: "Minh Chay Vegan", area: "Ba Dinh", km: 2.2, tags: ["Veg only"], note: "Vietnamese food, all of it vegetarian." },
  ],
  "Vietnam::Ha Long": [
    { name: "On board your cruise", area: "Out on the bay", tags: ["Seafood"], note: "Most meals are cooked on the boat. Tell them about diets when booking." },
    { name: "Namaste Ha Long", area: "Bai Chay", km: 1.1, tags: ["Indian food"], note: "In Bai Chay, for the night either side of the cruise." },
    { name: "Cua Vang", area: "Ha Long front", km: 1.8, tags: ["Seafood", "Local food"], note: "Crab and squid on the waterfront." },
    { name: "Vegetarian set on board", area: "Out on the bay", tags: ["Veg only"], note: "Every cruise kitchen will cook one. Say so when you book, not on the boat." },
  ],
  "Vietnam::Hoi An": [
    { name: "Ganesh Indian Restaurant", area: "Tran Phu", km: 0.5, tags: ["Indian food"], note: "On the edge of the old town, open late." },
    { name: "Morning Glory", area: "Nguyen Thai Hoc", km: 0.3, tags: ["Local food"], note: "Central Vietnamese cooking, and it takes vegetarians seriously." },
    { name: "Banh Mi Phuong", area: "Phan Chu Trinh", km: 0.4, tags: ["Street food"], note: "A queue, a sandwich, and the reason for both." },
    { name: "Minh Hien Vegetarian", area: "Tran Cao Van", km: 0.8, tags: ["Veg only", "Local food"], note: "Central Vietnamese, entirely vegetarian, family run." },
  ],
  "Vietnam::Da Nang": [
    { name: "Taj Mahal Da Nang", area: "My Khe beach road", km: 2.4, tags: ["Indian food"], note: "Near My Khe, which is where most couples stay." },
    { name: "Madame Lan", area: "Bach Dang", km: 0.9, tags: ["Local food"], note: "A big colonial house and the whole central menu." },
    { name: "Be Man Seafood", area: "Vo Nguyen Giap", km: 3.1, tags: ["Seafood", "Local food"], note: "Picked from the tank, grilled, on the beach road." },
    { name: "An Nhien Vegetarian", area: "Hai Chau", km: 1.6, tags: ["Veg only", "Local food"], note: "Com chay, which is the Vietnamese vegetarian tradition. Cheap." },
  ],
  "Vietnam::HCMC": [
    { name: "Baba's Kitchen", area: "Bui Vien, D1", km: 1.0, tags: ["Indian food"], note: "The one every Indian traveller in District 1 knows." },
    { name: "Hum Vegetarian", area: "District 3", km: 2.0, tags: ["Veg only"], note: "Garden setting, Vietnamese, entirely vegetarian." },
    { name: "Secret Garden", area: "Pasteur rooftop", km: 0.6, tags: ["Local food", "Rooftop"], note: "Up several flights of stairs, onto a roof." },
  ],
  "Vietnam::Phu Quoc": [
    { name: "Spice House at Cassia Cottage", area: "Long Beach", km: 2.5, tags: ["Seafood", "Local food"], note: "On the sand at Long Beach." },
    { name: "Saigonese Eatery", area: "Duong Dong", km: 0.8, tags: ["Local food"], note: "Reliable, air-conditioned, and the vegetarian list is real." },
    { name: "Night market grills", area: "Night market", km: 0.7, tags: ["Seafood", "Street food"], note: "Duong Dong after dark. Agree the price before they cook." },
    { name: "Com chay at Duong Dong", area: "Duong Dong", km: 0.8, tags: ["Veg only", "Local food"], note: "Run out of the pagoda kitchens. Filling, and almost free." },
  ],

  // ── Thailand ──
  "Thailand::Bangkok": [
    { name: "Indian Hut", area: "Surawong", km: 1.2, tags: ["Indian food"], note: "Been there decades. Near Silom and the river." },
    { name: "Govinda", area: "Sukhumvit Soi 22", km: 3.4, tags: ["Veg only", "Indian food"], note: "Entirely vegetarian, Italian and Indian both." },
    { name: "Thipsamai", area: "Mahachai", km: 2.1, tags: ["Local food", "Street food"], note: "Pad thai, and a queue that moves." },
  ],
  "Thailand::Chiang Mai": [
    { name: "Mango Tree Cafe", area: "Ratchadamnoen", km: 0.5, tags: ["Indian food"], note: "Indian and Thai, in the old town." },
    { name: "Khao Soi Khun Yai", area: "Sri Poom", km: 1.3, tags: ["Local food"], note: "Lunch only, and it sells out." },
    { name: "Reform Kafe", area: "Nimman", km: 2.0, tags: ["Veg only", "Cafe"], note: "Vegetarian Thai, quiet garden." },
  ],
  "Thailand::Krabi": [
    { name: "May & Mark's", area: "Krabi Town", km: 0.6, tags: ["Cafe"], note: "Breakfast in Krabi Town, and bread they bake themselves." },
    { name: "Tandoor Indian Restaurant", area: "Ao Nang beach", km: 0.9, tags: ["Indian food"], note: "Ao Nang, on the main beach road." },
    { name: "Lae Lay Grill", area: "Above Ao Nang", km: 2.7, tags: ["Seafood"], note: "Up the hill, with the view back over the bay." },
    { name: "Jay food stalls", area: "Krabi Town market", km: 0.7, tags: ["Veg only", "Street food"], note: "Look for the yellow and red jay sign. All of it is vegan, no onion or garlic." },
  ],
  "Thailand::Phuket": [
    { name: "Natraj Restaurant", area: "Patong", km: 1.1, tags: ["Indian food", "Jain"], note: "Patong. Jain food if you ask when booking." },
    { name: "Raya Restaurant", area: "Phuket Old Town", km: 0.7, tags: ["Local food"], note: "Old Town, in a shophouse, and the crab curry is the order." },
    { name: "Baan Rim Pa", area: "Kalim cliff", km: 2.4, tags: ["Fine dining", "Seafood"], note: "Thai, on the cliff above Patong." },
    { name: "Jay kitchens, Old Town", area: "Ranong Road", km: 0.8, tags: ["Veg only", "Street food"], note: "Phuket takes jay food seriously. The yellow flag means no meat at all." },
  ],
  "Thailand::Koh Samui": [
    { name: "Taste of India", area: "Chaweng", km: 1.0, tags: ["Indian food"], note: "Chaweng, and it delivers to most resorts." },
    { name: "Fisherman's Village market", area: "Bophut", km: 4.2, tags: ["Street food", "Seafood"], note: "Friday nights at Bophut." },
    { name: "Krua Bang Po", area: "Bang Por", km: 8.5, tags: ["Seafood", "Local food"], note: "On the north shore, feet almost in the water." },
    { name: "Vikasa Life Cafe", area: "Chaweng Noi", km: 2.6, tags: ["Veg only", "Cafe"], note: "Vegetarian, on the rocks above the water at the yoga retreat." },
  ],

  // ── Maldives ──
  "Maldives::Malé": [
    { name: "Sala Thai", area: "Waterfront", km: 0.5, tags: ["Local food"], note: "Thai and Indian, near the waterfront." },
    { name: "Symphony Restaurant", area: "Majeedhee Magu", km: 0.8, tags: ["Indian food"], note: "South Indian breakfasts, which is rare here." },
    { name: "Seagull Cafe House", area: "Chaandhanee Magu", km: 0.4, tags: ["Cafe"], note: "A garden in the middle of the city." },
    { name: "Vegetarian thali counters", area: "Majeedhee Magu", km: 0.8, tags: ["Veg only", "Indian food"], note: "Several of the Indian-run cafes keep a pure veg counter at lunch." },
  ],
  "Maldives::Baa Atoll": [
    { name: "Your resort's main restaurant", area: "On your island", tags: ["Local food"], note: "Almost all meals are on the island. Say what you eat when you book." },
    { name: "The Indian speciality night", area: "On your island", tags: ["Indian food"], note: "Most resorts here run one. Ask which evening it is." },
    { name: "Private sandbank dinner", area: "A boat ride out", tags: ["Seafood"], note: "Arranged by the resort, weather permitting." },
    { name: "Vegetarian menu on request", area: "On your island", tags: ["Veg only"], note: "Resort kitchens will run one for the whole stay. Say so at booking, not on arrival." },
  ],
  "Maldives::S.Ari": [
    { name: "Your resort's main restaurant", area: "On your island", tags: ["Local food"], note: "Half board or all inclusive covers it. Flag diets at booking." },
    { name: "Overwater seafood grill", area: "On your island", tags: ["Seafood"], note: "Most resorts run one, a few nights a week." },
    { name: "Dhigurah local cafes", area: "Dhigurah village", tags: ["Local food"], note: "On the local island, if you are staying off resort." },
    { name: "Vegetarian menu on request", area: "On your island", tags: ["Veg only"], note: "Ask at booking. Half board and all inclusive both cover it at no extra cost." },
  ],
  "Maldives::Addu": [
    { name: "Your resort's main restaurant", area: "On your island", tags: ["Local food"], note: "There is almost nothing else on the atoll." },
    { name: "Hithadhoo local hotaa", area: "Hithadhoo", tags: ["Local food"], note: "Short eats and sweet black tea, on the causeway islands." },
    { name: "Beachfront grill night", area: "On your island", tags: ["Seafood"], note: "Booked through the resort." },
    { name: "Vegetarian menu on request", area: "On your island", tags: ["Veg only"], note: "Supplies come by boat here, so give the kitchen notice." },
  ],

  // ── Sri Lanka ──
  "Sri Lanka::Sigiriya": [
    { name: "Your hotel's rice and curry", area: "At your hotel", tags: ["Local food"], note: "Six or seven dishes, almost all vegetarian. The best meal here." },
    { name: "Ahinsa Restaurant", area: "Dambulla road", km: 2.8, tags: ["Veg only", "Local food"], note: "Vegetarian Sri Lankan, on the Dambulla road." },
    { name: "Sigiri Lion Lodge", area: "Sigiriya village", km: 1.2, tags: ["Local food"], note: "Simple, honest, and in sight of the rock." },
  ],
  "Sri Lanka::Kandy": [
    { name: "Balaji Dosai", area: "Kotugodella", km: 0.5, tags: ["Indian food", "Veg only"], note: "South Indian, entirely vegetarian, always full." },
    { name: "The Empire Cafe", area: "Temple Street", km: 0.3, tags: ["Cafe"], note: "Beside the lake, good for a long breakfast." },
    { name: "Kandy Muslim Hotel", area: "Dalada Veediya", km: 0.4, tags: ["Local food"], note: "Biryani and kottu, cheap, and not actually a hotel." },
  ],
  "Sri Lanka::Ella": [
    { name: "Cafe Chill", area: "Main Street", km: 0.2, tags: ["Local food"], note: "The main street's busiest table. Go early." },
    { name: "Matey Hut", area: "Passara road", km: 0.5, tags: ["Veg only", "Local food"], note: "Rice and curry cooked in front of you. Six tables." },
    { name: "AK Ristoro", area: "Kithalella road", km: 1.4, tags: ["Local food"], note: "Japanese and Sri Lankan, up the hill, with the view." },
  ],
  "Sri Lanka::Galle": [
    { name: "Lucky Fort Restaurant", area: "Inside the fort", km: 0.4, tags: ["Veg only", "Local food"], note: "A vegetarian rice and curry spread, inside the fort." },
    { name: "Church Street Social", area: "Church Street", km: 0.3, tags: ["Local food"], note: "Inside the Fort Bazaar. Quiet courtyard." },
    { name: "Mama's Galle Fort Roof Cafe", area: "By the lighthouse", km: 0.6, tags: ["Rooftop", "Seafood"], note: "On a roof, facing the lighthouse." },
  ],
  "Sri Lanka::Mirissa": [
    { name: "Zephyr Restaurant", area: "East end beach", km: 0.7, tags: ["Seafood", "Beachfront"], note: "Tables on the sand at the quiet end." },
    { name: "Papa Mango", area: "Matara road", km: 0.5, tags: ["Local food"], note: "Short menu, done properly, off the beach." },
    { name: "Dewmini Roti Shop", area: "Behind the beach", km: 1.1, tags: ["Veg only", "Local food"], note: "Rotis made to order in a family kitchen." },
  ],

  // ── New Zealand ──
  "New Zealand::Auckland": [
    { name: "Satya South Indian", area: "Ponsonby", km: 1.8, tags: ["Indian food"], note: "Several branches. The Ponsonby one is handiest." },
    { name: "Cassia", area: "Fort Lane, CBD", km: 0.4, tags: ["Indian food", "Fine dining"], note: "Modern Indian, and the city's best. Book it." },
    { name: "Depot Eatery", area: "Federal Street", km: 0.5, tags: ["Seafood"], note: "Small plates and oysters, no bookings." },
    { name: "Wise Boys", area: "Karangahape Road", km: 1.2, tags: ["Veg only"], note: "Vegan burgers, and the queue says it works." },
  ],
  "New Zealand::Rotorua": [
    { name: "Indian Star", area: "Tutanekai Street", km: 0.3, tags: ["Indian food"], note: "On Tutanekai Street, the town's eat street." },
    { name: "Atticus Finch", area: "Eat Streat", km: 0.3, tags: ["Local food"], note: "Sharing plates, and a real vegetarian half to the menu." },
    { name: "A hangi dinner", area: "Cultural village", km: 4.5, tags: ["Local food"], note: "Cooked in the ground, usually part of the cultural evening." },
    { name: "Zippy Central", area: "Tutanekai Street", km: 0.3, tags: ["Veg only", "Cafe"], note: "Vegetarian cafe food, and they will make most of it vegan." },
  ],
  "New Zealand::Queenstown": [
    { name: "The Bunker", area: "Cow Lane", km: 0.2, tags: ["Fine dining"], note: "Upstairs, small, and the one to book ahead." },
    { name: "Taj Mahal Queenstown", area: "Shotover Street", km: 0.3, tags: ["Indian food"], note: "Central, late, and used to Indian travellers." },
    { name: "Fergburger", area: "Shotover Street", km: 0.3, tags: ["Local food"], note: "The queue is real. There is a vegetarian one." },
    { name: "Vegetarian thali, Shotover Street", area: "Shotover Street", km: 0.3, tags: ["Veg only", "Indian food"], note: "Both Indian kitchens in town run a full veg thali. The easiest proper meal here." },
  ],
  "New Zealand::Wanaka": [
    { name: "Bombay Palace", area: "Ardmore Street", km: 0.4, tags: ["Indian food"], note: "The only proper Indian kitchen in town." },
    { name: "Francesca's Italian Kitchen", area: "Ardmore Street", km: 0.3, tags: ["Local food"], note: "Busy, loud, and worth booking." },
    { name: "Federal Diner", area: "Helwick Street", km: 0.3, tags: ["Cafe"], note: "Breakfast before the Roys Peak climb." },
    { name: "Vegetarian thali at the Indian kitchen", area: "Ardmore Street", km: 0.4, tags: ["Veg only", "Indian food"], note: "A small town with one reliable answer. Order ahead on a busy night." },
  ],
  "New Zealand::Christchurch": [
    { name: "Little India", area: "Oxford Terrace", km: 0.4, tags: ["Indian food"], note: "A city institution, central." },
    { name: "Riverside Market", area: "Cashel Street", km: 0.3, tags: ["Street food"], note: "Two floors of stalls, something for everyone." },
    { name: "Earl", area: "New Regent Street", km: 0.4, tags: ["Fine dining"], note: "Small, seasonal, and the best dinner in town." },
    { name: "Grater Goods", area: "St Asaph Street", km: 0.9, tags: ["Veg only"], note: "Vegan deli and sandwiches. Closes early, so go at lunch." },
  ],
};

// ─── A picture per place ───
//
// We hold no photograph of any of these restaurants, and putting a stock shot
// under a real name and calling it that restaurant would be a lie. So the
// pictures are plainly food and a room, dealt out so no two cards in one
// region match, and the card never claims the photo is of that kitchen.
const U = (id) => `https://images.unsplash.com/photo-${id}?w=700&q=75&auto=format&fit=crop`;
const FOOD_PHOTOS = [
  "1414235077428-338989a2e8c0", "1551632436-cbf8dd35adfa", "1517248135467-4c7edcad34c4",
  "1555396273-367ea4eb4db5", "1552566626-52f8b828add9", "1559339352-11d035aa65de",
  "1533777324565-a040eb52facd", "1424847651672-bf20a4b0982b", "1466978913421-dad2ebd01d17",
  "1565299624946-b28f40a0ae38", "1540189549336-e6e99c3679fe", "1504674900247-0877df9cc836",
].map(U);

// Stable per name, so a place keeps its picture between visits.
function spin(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export const regionFood = (dest, city) => {
  const list = REGION_FOOD[`${dest}::${city}`] || [];
  const used = new Set();
  return list.map((f) => {
    let i = spin(f.name) % FOOD_PHOTOS.length;
    while (used.has(i)) i = (i + 1) % FOOD_PHOTOS.length;
    used.add(i);
    return { ...f, img: FOOD_PHOTOS[i] };
  });
};

// Indian and Veg only decide where a couple eats; the rest describes the
// place. So the first two are always drawn in brand colour and always first.
export const FOOD_TAG = {
  "Indian food": { bg: "#FFF4E0", fg: "#B54708" },
  "Veg only": { bg: "#ECFDF3", fg: "#027A48" },
  Jain: { bg: "#ECFDF3", fg: "#027A48" },
};
const RANK = ["Indian food", "Veg only", "Jain", "Street food", "Local food"];
export const sortTags = (tags = []) =>
  [...tags].sort((a, b) => {
    const ia = RANK.indexOf(a), ib = RANK.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });

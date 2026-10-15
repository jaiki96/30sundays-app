// ─── What we know about a region beyond its photos ───
//
// Three things a couple asks that no other part of the app answers: how do we
// actually get there, how do we move around once we are there, and what kind
// of room should we be paying for. None of it exists in the itinerary data, so
// it is written out here, one entry per region we sell.
//
// Times are approximate and meant as a guide, not a quote. Airports and modes
// are the real ones. Anything a consultant would have to correct on a call is
// kept general rather than invented precisely.

export const REGION_GUIDE = {
  // ─────────────── Bali ───────────────
  "Bali::Ubud": {
    why: [
      "Terraces, river gorges and temples all within twenty minutes of town.",
      "The best food and spas on the island, at half the Seminyak price.",
      "High enough that the nights actually cool down.",
    ],
    whyNot: [
      "No beach. The nearest swim is ninety minutes away.",
      "The centre is one long traffic jam from ten in the morning.",
      "The monkeys at the forest will take sunglasses and phones.",
    ],
    area: "Central highlands",
    lead: "Bali's arts town, inland in the rice terraces.",
    sub: "Ninety minutes from the airport, and the only part of the island where the nights actually cool down.",
    reach: [
      { mode: "flight", title: "Delhi to Denpasar (DPS)", detail: "One stop via Kuala Lumpur or Singapore. No non-stop yet.", time: "About 10h with the change" },
      { mode: "car", title: "Denpasar to Ubud", detail: "Private transfer through Gianyar. Traffic doubles it on a Friday.", time: "About 1h 30m" },
    ],
    transport: [
      { label: "Scooter hire", note: "The way most people get around. Agree the price before you take the keys." },
      { label: "Grab and Gojek", note: "Cars and bikes, but drivers are kept out of the centre by local rules." },
      { label: "Hotel shuttle", note: "Most Ubud hotels run a free drop into town a few times a day." },
    ],
    stay: {
      headline: "A valley-view pool villa",
      note: "Ubud is about the gorge, not the beach. Pay for the view and the pool; the room itself matters less here than anywhere else in Bali.",
      rooms: ["Valley-view pool villa", "Rice-field suite", "Riverside one-bedroom"],
    },
  },
  "Bali::Seminyak": {
    why: [
      "Bali's best restaurants, within walking distance of each other.",
      "Sunset on the sand with a drink in your hand, every evening.",
      "Everything is open late, which almost nowhere else in Bali is.",
    ],
    whyNot: [
      "The beach is busy and the hawkers are persistent.",
      "Prices are the highest on the island.",
      "Traffic on the main strip is relentless.",
    ],
    area: "South-west coast",
    lead: "Bali's going-out strip, right on the sand.",
    sub: "Beach clubs, the island's best dining, and a sunset everyone comes out for.",
    reach: [
      { mode: "flight", title: "Delhi to Denpasar (DPS)", detail: "One stop via Kuala Lumpur or Singapore.", time: "About 10h with the change" },
      { mode: "car", title: "Denpasar to Seminyak", detail: "The shortest transfer on the island.", time: "About 30m" },
    ],
    transport: [
      { label: "Walking", note: "Eat Street and the beach clubs are all within twenty minutes on foot." },
      { label: "Grab and Gojek", note: "Works properly here, unlike Ubud. Cheap for the short hops." },
      { label: "Scooter hire", note: "Fine, but parking near the beach clubs is its own problem." },
    ],
    stay: {
      headline: "Beachfront, or one street back",
      note: "A sea-facing room here is worth the jump. One street back is markedly cheaper and still a five-minute walk to the sand.",
      rooms: ["Ocean-view suite", "Private pool villa", "Beachfront resort room"],
    },
  },
  "Bali::Sanur": {
    why: [
      "Flat, calm water. The only part of Bali you can swim at any tide.",
      "A seven-kilometre beach path with no traffic on it.",
      "The boats to Nusa Penida and Lembongan leave from here.",
    ],
    whyNot: [
      "Almost nothing happens after ten at night.",
      "The beach is narrow and the sand is grey.",
      "It skews older than the rest of the island.",
    ],
    area: "East coast",
    lead: "The calm side, facing the sunrise.",
    sub: "Flat water, a long beach path, and the boats out to the islands.",
    reach: [
      { mode: "flight", title: "Delhi to Denpasar (DPS)", detail: "One stop via Kuala Lumpur or Singapore.", time: "About 10h with the change" },
      { mode: "car", title: "Denpasar to Sanur", detail: "Straight up the bypass.", time: "About 40m" },
    ],
    transport: [
      { label: "The beach path", note: "Seven kilometres of flat promenade. Most of Sanur is walkable or cyclable." },
      { label: "Bicycle hire", note: "Almost every hotel lends them free. The nicest way to do Sanur." },
      { label: "Fast boat", note: "Sanur harbour is the departure point for Nusa Penida and Lembongan." },
    ],
    stay: {
      headline: "An old-Bali garden resort",
      note: "Sanur's hotels are low-rise and set in gardens rather than towers. A ground-floor room opening onto the lawn beats a high floor here.",
      rooms: ["Garden-view room", "Beachfront cottage", "Pool-access room"],
    },
  },
  "Bali::Canggu": {
    why: [
      "Serious surf and even more serious coffee.",
      "Rice fields and beach within the same ten minutes.",
      "Better value villas than anywhere else in the south.",
    ],
    whyNot: [
      "The lanes are single-track and journeys take twice as long as they look.",
      "It is changing fast and construction is everywhere.",
      "Black sand and strong currents on some beaches.",
    ],
    area: "South-west coast",
    lead: "Surf, cafes and a beach town that stayed up late.",
    sub: "Black sand, a serious coffee scene, and sunsets at Echo Beach.",
    reach: [
      { mode: "flight", title: "Delhi to Denpasar (DPS)", detail: "One stop via Kuala Lumpur or Singapore.", time: "About 10h with the change" },
      { mode: "car", title: "Denpasar to Canggu", detail: "Short in distance, slow in traffic.", time: "About 1h" },
    ],
    transport: [
      { label: "Scooter hire", note: "Close to essential. The lanes here are too narrow and too long for walking." },
      { label: "Grab and Gojek", note: "Available, but the shortcuts are single-track and journeys crawl." },
      { label: "Walking", note: "Fine within one strip, not between them." },
    ],
    stay: {
      headline: "A villa with its own pool",
      note: "Canggu is villa country rather than resort country. A two-bedroom with a pool and a kitchen often costs less than a hotel room in Seminyak.",
      rooms: ["Private pool villa", "Surf-side studio", "Rice-field villa"],
    },
  },
  "Bali::Uluwatu": {
    why: [
      "Clifftop views that nowhere else in Bali comes close to.",
      "The Kecak dance at the temple as the sun goes down.",
      "World-class surf breaks within a few kilometres.",
    ],
    whyNot: [
      "Getting to the beaches means long stairways down the cliffs.",
      "You will need a driver; nothing is walkable.",
      "The restaurants are resort restaurants, and priced like it.",
    ],
    area: "Bukit peninsula",
    lead: "Cliffs, clifftop temples and the island's big surf.",
    sub: "A hundred metres above the water, with the sunset show at the temple.",
    reach: [
      { mode: "flight", title: "Delhi to Denpasar (DPS)", detail: "One stop via Kuala Lumpur or Singapore.", time: "About 10h with the change" },
      { mode: "car", title: "Denpasar to Uluwatu", detail: "Up onto the Bukit, past Jimbaran.", time: "About 1h" },
    ],
    transport: [
      { label: "Car and driver", note: "The Bukit is spread out and the hills are steep. Most people hire a driver by the day." },
      { label: "Scooter hire", note: "Only if you are confident. The roads are fast and the descents to the beaches are sharp." },
      { label: "Grab and Gojek", note: "Patchy up here. Expect a wait." },
    ],
    stay: {
      headline: "A clifftop room facing the ocean",
      note: "The whole point of Uluwatu is the drop. A room without the view is a long way from anywhere for no reason.",
      rooms: ["Clifftop ocean suite", "Infinity-pool villa", "Cliff-edge bungalow"],
    },
  },
  "Bali::Nusa Penida": {
    why: [
      "Kelingking and Broken Beach, which is why you have seen this island.",
      "Manta rays at Manta Point almost all year.",
      "Far fewer people than mainland Bali.",
    ],
    whyNot: [
      "The roads are genuinely rough and the drives are long.",
      "Very little in the way of dining or nightlife.",
      "The crossing can be rough in the afternoon.",
    ],
    area: "Offshore island",
    lead: "The island that looks like the postcards.",
    sub: "Kelingking, Broken Beach and some of the best snorkelling in Indonesia.",
    reach: [
      { mode: "flight", title: "Delhi to Denpasar (DPS)", detail: "One stop via Kuala Lumpur or Singapore.", time: "About 10h with the change" },
      { mode: "car", title: "Denpasar to Sanur harbour", detail: "Road transfer to the jetty.", time: "About 40m" },
      { mode: "boat", title: "Sanur to Nusa Penida", detail: "Fast boat. Rough in the afternoon, so most people take a morning crossing.", time: "About 45m" },
    ],
    transport: [
      { label: "Car and driver", note: "The only sensible way to see the island. Book for the full day." },
      { label: "Scooter hire", note: "Cheap, but the roads are genuinely bad and the climbs are steep." },
      { label: "Boat tours", note: "The snorkelling spots are only reachable by boat." },
    ],
    stay: {
      headline: "Somewhere simple, near the coast you want",
      note: "Penida has no luxury hotels worth the money. Pick for location, stay two nights, and spend the budget on Bali instead.",
      rooms: ["Sea-view bungalow", "Cliffside cabin", "Simple pool guesthouse"],
    },
  },
  "Bali::Labuan Bajo": {
    why: [
      "Komodo dragons, in the only place they exist.",
      "Pink Beach and some of Asia's best snorkelling.",
      "Sunsets over the harbour that people fly in for.",
    ],
    whyNot: [
      "Everything is a boat trip, so the days are long.",
      "A separate flight from Bali, which costs you half a day.",
      "The town itself is small and not the draw.",
    ],
    area: "Flores, east of Bali",
    lead: "The gateway to Komodo.",
    sub: "Dragons, pink beaches and island-hopping, a short flight on from Bali.",
    reach: [
      { mode: "flight", title: "Delhi to Denpasar (DPS)", detail: "One stop via Kuala Lumpur or Singapore.", time: "About 10h with the change" },
      { mode: "flight", title: "Denpasar to Labuan Bajo (LBJ)", detail: "Several domestic flights a day.", time: "About 1h 30m" },
    ],
    transport: [
      { label: "Boat", note: "Everything worth seeing is on the water. Day boats and liveaboards both run daily." },
      { label: "Town taxis", note: "The town itself is small and walkable along the harbour." },
      { label: "Car and driver", note: "For the inland drives and the viewpoints above the bay." },
    ],
    stay: {
      headline: "A room looking over the harbour",
      note: "You are here for the boats, so stay where you can see them. Hillside hotels have the better sunsets, harbour hotels the easier mornings.",
      rooms: ["Harbour-view room", "Hillside sunset suite", "Liveaboard cabin"],
    },
  },

  // ─────────────── Vietnam ───────────────
  "Vietnam::Hanoi": {
    why: [
      "Street food that is worth the trip on its own.",
      "A thousand years of history packed into walkable lanes.",
      "Cheap, and genuinely cheap rather than tourist-cheap.",
    ],
    whyNot: [
      "The traffic is overwhelming at first and crossing roads takes nerve.",
      "Winter can be grey and damp for weeks.",
      "Air quality is poor on the worst days.",
    ],
    area: "The north",
    lead: "A thousand-year-old capital that never slowed down.",
    sub: "Old Quarter lanes, lakes in the middle of the city, and the best street food in the country.",
    reach: [
      { mode: "flight", title: "Delhi to Hanoi (HAN)", detail: "Non-stop services run on most days.", time: "About 5h non-stop" },
      { mode: "car", title: "Airport to the Old Quarter", detail: "Across the Red River on the expressway.", time: "About 45m" },
    ],
    transport: [
      { label: "Grab", note: "Cars and motorbikes. The motorbike option is faster and a fraction of the price." },
      { label: "Walking", note: "The Old Quarter is small and best seen on foot. Crossing the road is the skill." },
      { label: "Metro", note: "Two lines, useful for the run out to the west of the city." },
    ],
    stay: {
      headline: "A boutique hotel in the Old Quarter",
      note: "Hanoi's good rooms are small and characterful rather than large. Stay inside the Old Quarter and accept the noise; outside it you lose the city.",
      rooms: ["Old Quarter boutique room", "Lake-view suite", "French Quarter heritage room"],
    },
  },
  "Vietnam::Ha Long": {
    why: [
      "Scenery that nothing in your photographs will prepare you for.",
      "Kayaking into caves and lagoons from the boat.",
      "A night on the water with nobody else around.",
    ],
    whyNot: [
      "The day-trip version is crowded and not worth doing.",
      "Cabins are small, and the better boats cost real money.",
      "Cruises are cancelled outright in bad weather.",
    ],
    area: "North coast",
    lead: "Limestone towers coming straight out of the sea.",
    sub: "Done properly as an overnight on the water rather than a day trip.",
    reach: [
      { mode: "flight", title: "Delhi to Hanoi (HAN)", detail: "Non-stop services run on most days.", time: "About 5h non-stop" },
      { mode: "car", title: "Hanoi to Ha Long", detail: "Expressway the whole way. Most cruises include the transfer.", time: "About 2h 30m" },
      { mode: "boat", title: "Tender to your cruise", detail: "From the cruise port out to the boat.", time: "About 20m" },
    ],
    transport: [
      { label: "The cruise boat", note: "Once aboard, the boat is your transport for the whole stay." },
      { label: "Kayak and tender", note: "For the caves, the lagoons and the floating villages." },
      { label: "Shuttle", note: "Cruise lines run the Hanoi road transfer both ways." },
    ],
    stay: {
      headline: "A cabin with a private balcony",
      note: "Sleep on the water, not in Ha Long City. A balcony cabin is the upgrade worth taking: the bay at dawn is the whole reason you came.",
      rooms: ["Balcony cabin", "Terrace suite", "Upper-deck cabin"],
    },
  },
  "Vietnam::Hoi An": {
    why: [
      "An old town that is genuinely beautiful after dark.",
      "Tailors who will make something in two days that fits properly.",
      "Beach, rice fields and old town all within a short cycle.",
    ],
    whyNot: [
      "Very touristed, and the old town charges admission.",
      "October and November floods regularly close the riverfront.",
      "It is small; two nights is usually enough.",
    ],
    area: "Central coast",
    lead: "A lantern-lit old town that escaped the war.",
    sub: "Tailors, a riverfront at night, and a beach fifteen minutes away.",
    reach: [
      { mode: "flight", title: "Delhi to Da Nang (DAD)", detail: "One stop, usually via Hanoi, Bangkok or Singapore.", time: "About 8h with the change" },
      { mode: "car", title: "Da Nang to Hoi An", detail: "Along the coast road past An Bang.", time: "About 45m" },
    ],
    transport: [
      { label: "Bicycle", note: "Flat, short distances, and most hotels lend them. The right way to do Hoi An." },
      { label: "Grab", note: "For the beach run and the airport. Cheap and everywhere." },
      { label: "Walking", note: "The old town is pedestrian-only for much of the evening." },
    ],
    stay: {
      headline: "Between the old town and the beach",
      note: "Hoi An makes you choose: lanterns at the door, or sand at the door. The hotels in the rice fields between the two give you both with a short cycle.",
      rooms: ["Rice-paddy view room", "Old town courtyard room", "An Bang beachfront villa"],
    },
  },
  "Vietnam::Da Nang": {
    why: [
      "Thirty kilometres of clean, swimmable beach.",
      "The Golden Bridge and Ba Na Hills, an hour away.",
      "A modern city with none of Hanoi's chaos.",
    ],
    whyNot: [
      "It lacks the character of Hanoi or Hoi An.",
      "The beachfront is a wall of large resorts.",
      "Typhoon season runs from September to November.",
    ],
    area: "Central coast",
    lead: "A beach city with mountains behind it.",
    sub: "Miles of sand, the Golden Bridge above the clouds, and bridges that breathe fire.",
    reach: [
      { mode: "flight", title: "Delhi to Da Nang (DAD)", detail: "One stop via Hanoi, Bangkok or Singapore.", time: "About 8h with the change" },
      { mode: "car", title: "Airport into town", detail: "The airport sits inside the city.", time: "About 15m" },
    ],
    transport: [
      { label: "Grab", note: "The default. Da Nang is spread out along the beach and fares are low." },
      { label: "Scooter hire", note: "Good roads and a proper coastal highway to ride." },
      { label: "Cable car", note: "Up to Ba Na Hills and the Golden Bridge, one of the longest in the world." },
    ],
    stay: {
      headline: "A sea-facing room on My Khe",
      note: "The beach strip is where Da Nang earns its money. A high floor facing the water is worth more here than any amount of extra room.",
      rooms: ["Ocean-view high floor", "Beachfront resort room", "Riverside city suite"],
    },
  },
  "Vietnam::HCMC": {
    why: [
      "The war museums and the Cu Chi tunnels, which are unforgettable.",
      "The best rooftop bars in the country.",
      "Food markets that run all night.",
    ],
    whyNot: [
      "Hot and humid all year, with no cool season.",
      "Traffic and noise are relentless.",
      "Little in the way of classic sightseeing beyond the centre.",
    ],
    area: "The south",
    lead: "Saigon, loud and awake at every hour.",
    sub: "War history in the morning, markets in the afternoon, rooftops after dark.",
    reach: [
      { mode: "flight", title: "Delhi to Ho Chi Minh City (SGN)", detail: "Non-stop services run several times a week.", time: "About 5h 30m non-stop" },
      { mode: "car", title: "Airport to District 1", detail: "Short hop, but the traffic decides.", time: "About 40m" },
    ],
    transport: [
      { label: "Grab bike", note: "Faster than any car in this city, and barely costs anything." },
      { label: "Metro", note: "Line 1 opened recently and runs through the centre." },
      { label: "Walking", note: "District 1 is walkable. The rest of the city is not." },
    ],
    stay: {
      headline: "A high floor in District 1",
      note: "Saigon is a skyline city. Height buys you quiet and a view; both are worth paying for here.",
      rooms: ["High-floor city-view room", "Rooftop-pool hotel room", "Heritage suite"],
    },
  },
  "Vietnam::Phu Quoc": {
    why: [
      "Proper white-sand beaches, which the mainland does not have.",
      "Sunsets over the water on the west coast.",
      "Good-value resorts compared with Thailand.",
    ],
    whyNot: [
      "Development is rapid and parts are a building site.",
      "The rainy season from July to September is heavy.",
      "You need a domestic flight to get here.",
    ],
    area: "Gulf of Thailand",
    lead: "Vietnam's beach island, at the far south.",
    sub: "White sand on the west coast, a night market, and sunsets over the water.",
    reach: [
      { mode: "flight", title: "Delhi to Ho Chi Minh City (SGN)", detail: "Non-stop services run several times a week.", time: "About 5h 30m non-stop" },
      { mode: "flight", title: "Saigon to Phu Quoc (PQC)", detail: "Frequent domestic flights all day.", time: "About 1h" },
    ],
    transport: [
      { label: "Grab", note: "Works on the island and is the simplest way between beaches." },
      { label: "Scooter hire", note: "The island is big but the roads are good and mostly empty." },
      { label: "Cable car", note: "The world's longest sea crossing, out to the southern islands." },
    ],
    stay: {
      headline: "West coast, facing the sunset",
      note: "The east coast is quieter but the sun sets behind you. On Phu Quoc the west side is worth the premium.",
      rooms: ["Sunset-facing beach villa", "Pool villa", "Beachfront resort room"],
    },
  },

  // ─────────────── Thailand ───────────────
  "Thailand::Bangkok": {
    why: [
      "Temples, markets and rooftops in one compact city.",
      "Public transport that actually works.",
      "Hotel quality far above what you pay.",
    ],
    whyNot: [
      "The heat and humidity are punishing from March to May.",
      "Traffic off the rail lines is immovable.",
      "Parts of the nightlife scene are best avoided.",
    ],
    area: "Central Thailand",
    lead: "Temples and tower bars in the same square mile.",
    sub: "A river running through it, street food on every corner, and the best transport in the region.",
    reach: [
      { mode: "flight", title: "Delhi to Bangkok (BKK)", detail: "Non-stop services many times a day.", time: "About 4h 15m non-stop" },
      { mode: "train", title: "Airport Rail Link into town", detail: "Straight to Phaya Thai, then the BTS.", time: "About 30m" },
    ],
    transport: [
      { label: "BTS and MRT", note: "Clean, cheap and air-conditioned. Stay near a station and you have solved Bangkok." },
      { label: "River boat", note: "The Chao Phraya express is the nicest way to reach the old city." },
      { label: "Grab and tuk-tuk", note: "Grab for price certainty, tuk-tuk for the short hop you want to remember." },
    ],
    stay: {
      headline: "Riverside, or on the Skytrain",
      note: "Bangkok hotels are enormous value. Either take a river-view room and travel by boat, or take a tower on the BTS and travel by rail. Anything in between means traffic.",
      rooms: ["River-view room", "Skytrain-side high floor", "Rooftop-pool suite"],
    },
  },
  "Thailand::Chiang Mai": {
    why: [
      "Hundreds of temples, and the old city is walkable.",
      "Ethical elephant sanctuaries, done properly here.",
      "Cooler and calmer than anywhere in the south.",
    ],
    whyNot: [
      "Burning season from February to April brings serious smoke.",
      "No beach, and the sea is a flight away.",
      "Quiet in the evenings compared with Bangkok.",
    ],
    area: "The north",
    lead: "The old kingdom, ringed by a moat.",
    sub: "Mountain air, hundreds of temples, and the elephant sanctuaries done properly.",
    reach: [
      { mode: "flight", title: "Delhi to Bangkok (BKK)", detail: "Non-stop services many times a day.", time: "About 4h 15m non-stop" },
      { mode: "flight", title: "Bangkok to Chiang Mai (CNX)", detail: "Hourly domestic flights.", time: "About 1h 15m" },
    ],
    transport: [
      { label: "Songthaew", note: "The red shared trucks. Flag one down, say where you are going, pay a flat fare." },
      { label: "Grab", note: "Reliable in the city and for the airport." },
      { label: "Scooter hire", note: "For the mountain roads up to Doi Suthep and the waterfalls." },
    ],
    stay: {
      headline: "Inside the old city walls",
      note: "The moat marks the difference. Inside it you walk everywhere; outside you are in traffic. Lanna-style rooms around a courtyard are the local speciality.",
      rooms: ["Old city courtyard room", "Lanna teak suite", "Riverside garden room"],
    },
  },
  "Thailand::Krabi": {
    why: [
      "Limestone cliffs rising straight out of the water.",
      "Railay, which you can only reach by boat.",
      "Island-hopping that is as good as it gets in Thailand.",
    ],
    whyNot: [
      "Monsoon from May to October cancels boat trips.",
      "Ao Nang's beach is not the reason you came.",
      "Longtail transfers add up over a week.",
    ],
    area: "Andaman coast",
    lead: "Limestone cliffs standing in green water.",
    sub: "Railay, the four islands, and the longtail boats that get you to them.",
    reach: [
      { mode: "flight", title: "Delhi to Bangkok (BKK)", detail: "Non-stop services many times a day.", time: "About 4h 15m non-stop" },
      { mode: "flight", title: "Bangkok to Krabi (KBV)", detail: "Several domestic flights a day.", time: "About 1h 25m" },
      { mode: "car", title: "Airport to Ao Nang", detail: "The beach most people base themselves on.", time: "About 40m" },
    ],
    transport: [
      { label: "Longtail boat", note: "Railay has no road. The boat is not optional, it is the only way in." },
      { label: "Songthaew", note: "Runs the Ao Nang to Krabi Town road all day for a few baht." },
      { label: "Car and driver", note: "For the hot springs, the pool and the inland temples." },
    ],
    stay: {
      headline: "Railay for the cliffs, Ao Nang for the ease",
      note: "Railay is cut off and spectacular. Ao Nang has the restaurants and the boats. Couples usually split the nights rather than choose.",
      rooms: ["Cliff-view bungalow", "Ao Nang sea-view room", "Beachfront pool villa"],
    },
  },
  "Thailand::Phuket": {
    why: [
      "A beach for every taste, from party to empty.",
      "The old town is genuinely charming and overlooked.",
      "The widest choice of hotels in Thailand.",
    ],
    whyNot: [
      "Patong is crowded and aggressive in a way nowhere else is.",
      "The island is big, so getting between beaches takes time.",
      "Taxi prices are high and the mafia keeps them that way.",
    ],
    area: "Andaman coast",
    lead: "The big island, with a beach for every mood.",
    sub: "Old town shophouses, quiet northern bays, and the boats to Phi Phi.",
    reach: [
      { mode: "flight", title: "Delhi to Phuket (HKT)", detail: "Non-stop services on several days a week, otherwise via Bangkok.", time: "About 5h non-stop" },
      { mode: "car", title: "Airport to the west beaches", detail: "Depends entirely which beach you pick.", time: "30m to 1h" },
    ],
    transport: [
      { label: "Grab", note: "Works, though the island taxi lobby makes it awkward at some beaches." },
      { label: "Car hire", note: "Phuket is big and the good beaches are far apart. A car pays for itself." },
      { label: "Speedboat", note: "For Phi Phi, James Bond Island and the Similans." },
    ],
    stay: {
      headline: "Pick the beach before the hotel",
      note: "Phuket is thirty beaches pretending to be one place. Kata and Kamala for couples, Patong only if you want the noise, Mai Khao if you want nobody.",
      rooms: ["Sea-view pool villa", "Hillside infinity-pool suite", "Beachfront resort room"],
    },
  },
  "Thailand::Koh Samui": {
    why: [
      "Calm, swimmable water on the east coast.",
      "Direct flights, so no long ferry.",
      "Resorts at a standard the islands nearby cannot match.",
    ],
    whyNot: [
      "The airport is privately owned and flights are expensive.",
      "Rain comes in November and December, out of step with the rest of Thailand.",
      "Chaweng is busy and loud.",
    ],
    area: "Gulf of Thailand",
    lead: "A coconut island that grew up well.",
    sub: "Calm water on the east, proper resorts, and the full-moon islands next door.",
    reach: [
      { mode: "flight", title: "Delhi to Bangkok (BKK)", detail: "Non-stop services many times a day.", time: "About 4h 15m non-stop" },
      { mode: "flight", title: "Bangkok to Koh Samui (USM)", detail: "Direct, into one of the prettiest small airports anywhere.", time: "About 1h 15m" },
    ],
    transport: [
      { label: "Songthaew", note: "Circles the ring road all day. Agree the fare before you get in." },
      { label: "Scooter hire", note: "The ring road is easy, the hill roads much less so." },
      { label: "Ferry", note: "To Koh Phangan and Koh Tao, several crossings a day." },
    ],
    stay: {
      headline: "East coast for calm, north for quiet",
      note: "Chaweng and Lamai have the life; Bophut and Maenam have the evenings you actually remember. A beachfront room on Samui costs less than you would expect.",
      rooms: ["Beachfront pool villa", "Hillside sea-view suite", "Garden pool villa"],
    },
  },

  // ─────────────── Maldives ───────────────
  "Maldives::Malé": {
    why: [
      "The cheapest way to see the Maldives at all.",
      "Local islands give you a country, not just a resort.",
      "Easy to combine with a resort stay at either end.",
    ],
    whyNot: [
      "The city itself is dense and has little to see.",
      "Local islands have dress rules and no alcohol.",
      "The beaches are nothing like the resort ones.",
    ],
    area: "North Malé atoll",
    lead: "The arrival point, and a city on one square mile.",
    sub: "Most couples pass straight through, but the local islands nearby are worth a night.",
    reach: [
      { mode: "flight", title: "Delhi to Malé (MLE)", detail: "Non-stop services most days.", time: "About 4h 30m non-stop" },
      { mode: "boat", title: "Airport to the city or a nearby island", detail: "Speedboat transfers run on demand.", time: "10m to 45m" },
    ],
    transport: [
      { label: "Speedboat", note: "Everything between islands runs on the water." },
      { label: "Public ferry", note: "Slow, cheap and the way locals move. Worth one crossing for the experience." },
      { label: "Walking", note: "Malé itself is crossable on foot in half an hour." },
    ],
    stay: {
      headline: "A guesthouse on a local island",
      note: "If you are spending a night near Malé, spend it on Maafushi or Hulhumalé rather than in the city. Half the price of a resort and you meet the country.",
      rooms: ["Local island guesthouse", "Beachfront room", "Airport transit hotel"],
    },
  },
  "Maldives::Baa Atoll": {
    why: [
      "Hanifaru Bay, and manta rays in numbers found nowhere else.",
      "Exceptional house reefs straight off the villa steps.",
      "Protected biosphere, so the diving is properly managed.",
    ],
    whyNot: [
      "Seaplane transfers are expensive and daylight-only.",
      "Peak manta season from June to November is also the wetter half.",
      "The resorts here are among the country's priciest.",
    ],
    area: "UNESCO biosphere",
    lead: "The atoll the manta rays come back to.",
    sub: "Hanifaru Bay in season, and the clearest water in the country.",
    reach: [
      { mode: "flight", title: "Delhi to Malé (MLE)", detail: "Non-stop services most days.", time: "About 4h 30m non-stop" },
      { mode: "flight", title: "Seaplane to Baa Atoll", detail: "Daylight hours only, which shapes which flight you book.", time: "About 30m" },
    ],
    transport: [
      { label: "Seaplane", note: "The only practical way in, and a sightseeing flight in its own right." },
      { label: "Resort dhoni", note: "Your resort moves you to the dive and snorkel sites." },
      { label: "On foot", note: "Most resort islands are a fifteen-minute walk end to end." },
    ],
    stay: {
      headline: "An overwater villa with a pool",
      note: "Baa is where the overwater villa earns its price: the reef is close enough that you snorkel from your own steps.",
      rooms: ["Overwater pool villa", "Beach villa with pool", "Sunset water villa"],
    },
  },
  "Maldives::S.Ari": {
    why: [
      "Whale sharks all year, which no other atoll can claim.",
      "Strong house reefs at most resorts.",
      "A choice of seaplane or a cheaper domestic flight.",
    ],
    whyNot: [
      "Whale shark sites get busy with boats.",
      "House reef quality varies a lot between resorts.",
      "Transfers can take over an hour by boat.",
    ],
    area: "South Ari atoll",
    lead: "Whale sharks, all year round.",
    sub: "The one atoll where the big fish are a reliable sighting rather than luck.",
    reach: [
      { mode: "flight", title: "Delhi to Malé (MLE)", detail: "Non-stop services most days.", time: "About 4h 30m non-stop" },
      { mode: "flight", title: "Seaplane or domestic flight", detail: "Seaplane direct, or a short domestic hop then a speedboat.", time: "25m to 1h 15m" },
    ],
    transport: [
      { label: "Seaplane", note: "Fastest way in. Daylight only." },
      { label: "Speedboat", note: "Resorts closer to the domestic airport use boats instead." },
      { label: "Dive boat", note: "The whale shark and manta sites are all boat trips." },
    ],
    stay: {
      headline: "A house-reef villa",
      note: "In South Ari the reef is the reason. Ask what the house reef is actually like before you pick the resort; it varies more than the photos suggest.",
      rooms: ["Overwater villa", "Beach villa with pool", "Reef-access bungalow"],
    },
  },
  "Maldives::Addu": {
    why: [
      "Islands joined by road, so you can actually explore.",
      "The British Loyalty wreck, a world-class dive.",
      "Far fewer visitors than the northern atolls.",
    ],
    whyNot: [
      "A domestic flight on top of your international one.",
      "Fewer resorts, so less choice.",
      "Less of the classic overwater-villa experience.",
    ],
    area: "The far south",
    lead: "The quiet end of the country.",
    sub: "Linked islands you can cycle between, and a wreck dive that is genuinely world class.",
    reach: [
      { mode: "flight", title: "Delhi to Malé (MLE)", detail: "Non-stop services most days.", time: "About 4h 30m non-stop" },
      { mode: "flight", title: "Malé to Gan (GAN)", detail: "Domestic flight to the southern atoll.", time: "About 1h 15m" },
    ],
    transport: [
      { label: "Causeway roads", note: "Addu is unusual: the islands are joined, so you can drive or cycle between them." },
      { label: "Bicycle", note: "Flat, quiet and the nicest way to see the atoll." },
      { label: "Dive boat", note: "For the British Loyalty wreck and the manta point." },
    ],
    stay: {
      headline: "A beach villa, not an overwater one",
      note: "Addu is about the land as much as the water. Spend on a beach villa with direct sand access and put the difference into diving.",
      rooms: ["Beach villa", "Garden pool villa", "Guesthouse sea-view room"],
    },
  },

  // ─────────────── Sri Lanka ───────────────
  "Sri Lanka::Sigiriya": {
    why: [
      "A fifth-century palace on top of a two-hundred-metre rock.",
      "Dambulla's cave temples, twenty minutes away.",
      "Elephant safaris at Minneriya in the dry months.",
    ],
    whyNot: [
      "The climb is twelve hundred steps and brutal after nine in the morning.",
      "Entry is expensive by Sri Lankan standards.",
      "Very little to do here in the evenings.",
    ],
    area: "Cultural triangle",
    lead: "A palace on top of a rock, built in the fifth century.",
    sub: "Climb it at dawn, then the cave temples and the safari parks nearby.",
    reach: [
      { mode: "flight", title: "Delhi to Colombo (CMB)", detail: "Non-stop services most days.", time: "About 3h 45m non-stop" },
      { mode: "car", title: "Colombo to Sigiriya", detail: "Through Dambulla. A driver for the whole trip is the normal way here.", time: "About 4h" },
    ],
    transport: [
      { label: "Car and driver", note: "Sri Lanka is a driver country. One car and driver for the whole itinerary is standard and good value." },
      { label: "Tuk-tuk", note: "For the short runs between the rock, the village and the temples." },
      { label: "Safari jeep", note: "For Minneriya and Kaudulla, where the elephants gather." },
    ],
    stay: {
      headline: "A lodge with the rock in view",
      note: "Several hotels here look straight at Sigiriya. A room facing it is the difference between visiting the rock and living beside it for two days.",
      rooms: ["Rock-view room", "Jungle chalet", "Infinity-pool villa"],
    },
  },
  "Sri Lanka::Kandy": {
    why: [
      "The Temple of the Tooth, the country's most important site.",
      "Botanical gardens that are worth half a day.",
      "The start of the hill country train line.",
    ],
    whyNot: [
      "The town centre is congested and not especially pretty.",
      "It rains here more than almost anywhere else on the island.",
      "One full day is usually enough.",
    ],
    area: "Hill country gateway",
    lead: "The last royal capital, around a lake.",
    sub: "The Temple of the Tooth, botanical gardens, and the start of the train line.",
    reach: [
      { mode: "flight", title: "Delhi to Colombo (CMB)", detail: "Non-stop services most days.", time: "About 3h 45m non-stop" },
      { mode: "car", title: "Colombo to Kandy", detail: "Up through the foothills.", time: "About 3h 30m" },
    ],
    transport: [
      { label: "Tuk-tuk", note: "The lake circuit and the temple are all short hops." },
      { label: "Train", note: "Kandy is where the hill country line begins. Book the Ella leg in advance." },
      { label: "Walking", note: "The lake path and the old town are pleasant on foot." },
    ],
    stay: {
      headline: "Above the lake, not beside the road",
      note: "Kandy's valley hotels are on the hillsides. A room with the lake below and the hills behind is worth the climb to get to it.",
      rooms: ["Lake-view room", "Hillside colonial suite", "Tea-estate bungalow"],
    },
  },
  "Sri Lanka::Ella": {
    why: [
      "The train ride in is one of the great journeys.",
      "Cool air and green hills after the heat of the coast.",
      "Walks to waterfalls and peaks straight from town.",
    ],
    whyNot: [
      "It has become very busy, and the bridge especially so.",
      "The town is one street and fills up fast.",
      "Mist can close in for days at a time.",
    ],
    area: "Hill country",
    lead: "Tea estates, waterfalls and the famous bridge.",
    sub: "Cool, green and the one place everybody slows down.",
    reach: [
      { mode: "flight", title: "Delhi to Colombo (CMB)", detail: "Non-stop services most days.", time: "About 3h 45m non-stop" },
      { mode: "train", title: "Kandy to Ella by train", detail: "The ride people come to Sri Lanka for. Sit on the right.", time: "About 6h" },
    ],
    transport: [
      { label: "Walking", note: "Little Adam's Peak and the Nine Arch Bridge are both walks from town." },
      { label: "Tuk-tuk", note: "For Ravana Falls and the tea factories further out." },
      { label: "Train", note: "The line continues to Haputale and Badulla if you want more of it." },
    ],
    stay: {
      headline: "A room facing Ella Gap",
      note: "Ella is about one view, straight down the valley to the south coast. Hotels that have it charge for it, and it is one of the few times that is fair.",
      rooms: ["Ella Gap view room", "Tea-estate bungalow", "Glass-front cabin"],
    },
  },
  "Sri Lanka::Galle": {
    why: [
      "A living Dutch fort, not a museum piece.",
      "The ramparts at sunset, which cost nothing.",
      "Beaches on both sides within fifteen minutes.",
    ],
    whyNot: [
      "The fort gets busy with day trippers from Colombo.",
      "Rooms inside the walls are small and not cheap.",
      "The sea at Galle itself is not for swimming.",
    ],
    area: "South coast",
    lead: "A Dutch fort on a headland, still lived in.",
    sub: "Ramparts at sunset, cafes in old merchant houses, and beaches either side.",
    reach: [
      { mode: "flight", title: "Delhi to Colombo (CMB)", detail: "Non-stop services most days.", time: "About 3h 45m non-stop" },
      { mode: "car", title: "Colombo to Galle", detail: "Southern Expressway most of the way.", time: "About 2h" },
    ],
    transport: [
      { label: "Walking", note: "The fort is small and entirely walkable. Do the ramparts at dusk." },
      { label: "Tuk-tuk", note: "For Unawatuna, Jungle Beach and the turtle hatcheries." },
      { label: "Coastal train", note: "Slow, cheap and right along the shoreline." },
    ],
    stay: {
      headline: "Inside the fort walls",
      note: "Staying inside the fort is the whole experience: the lanes empty after the day visitors leave. Rooms are small and old, and that is the point.",
      rooms: ["Fort heritage room", "Rampart-view suite", "Courtyard villa"],
    },
  },
  "Sri Lanka::Mirissa": {
    why: [
      "Blue whales offshore from November to April.",
      "A proper crescent beach with real surf.",
      "Relaxed, and still cheap by beach-town standards.",
    ],
    whyNot: [
      "Whale boats can be crowded and the sea rough.",
      "The beach is eroding and narrow at high tide.",
      "Dead quiet in the May to October monsoon.",
    ],
    area: "South coast",
    lead: "A crescent beach and the whales offshore.",
    sub: "Blue whales from November, and a coconut hill that everybody photographs.",
    reach: [
      { mode: "flight", title: "Delhi to Colombo (CMB)", detail: "Non-stop services most days.", time: "About 3h 45m non-stop" },
      { mode: "car", title: "Colombo to Mirissa", detail: "Expressway to Matara, then the coast road.", time: "About 2h 30m" },
    ],
    transport: [
      { label: "Tuk-tuk", note: "The way everyone moves along this coast. Fares are short and cheap." },
      { label: "Whale boat", note: "Morning departures from Mirissa harbour between November and April." },
      { label: "Scooter hire", note: "The coast road between Weligama and Dikwella is an easy ride." },
    ],
    stay: {
      headline: "On the sand, or on the headland",
      note: "Beach-level rooms put you in the surf noise; the headland hotels trade that for the view down the bay. Both are right, for different couples.",
      rooms: ["Beachfront cabana", "Headland sea-view room", "Pool villa above the bay"],
    },
  },

  // ─────────────── New Zealand ───────────────
  "New Zealand::Auckland": {
    why: [
      "Islands and vineyards within a short ferry ride.",
      "Black-sand west coast beaches an hour from the centre.",
      "The easiest place to start and end a trip.",
    ],
    whyNot: [
      "The city itself is not why people come to New Zealand.",
      "Expensive, even by New Zealand standards.",
      "Weather changes several times a day.",
    ],
    area: "North Island",
    lead: "A harbour city built on volcanoes.",
    sub: "Islands twenty minutes offshore, black-sand beaches an hour west.",
    reach: [
      { mode: "flight", title: "Delhi to Auckland (AKL)", detail: "One or two stops, usually via Singapore or Sydney.", time: "About 20h total" },
      { mode: "car", title: "Airport into the city", detail: "Motorway north.", time: "About 40m" },
    ],
    transport: [
      { label: "Ferry", note: "Devonport and Waiheke are both short crossings from the downtown terminal." },
      { label: "Car hire", note: "Essential for the west coast beaches and the Waitakere ranges." },
      { label: "Buses and trains", note: "Fine in the centre, thin everywhere else." },
    ],
    stay: {
      headline: "On the water, or on Waiheke",
      note: "A harbour-view room downtown, or skip the city and stay on Waiheke among the vineyards. The second is the better couple's choice.",
      rooms: ["Harbour-view room", "Waiheke vineyard lodge", "Viaduct apartment"],
    },
  },
  "New Zealand::Rotorua": {
    why: [
      "Geothermal landscapes you will not see anywhere else.",
      "The best Maori cultural experiences in the country.",
      "Lakes and forest walks on the doorstep.",
    ],
    whyNot: [
      "The sulphur smell is constant and takes a day to stop noticing.",
      "The main attractions are heavily commercialised.",
      "The town centre is tired.",
    ],
    area: "North Island",
    lead: "Geysers, mud pools and the smell of sulphur.",
    sub: "The centre of Maori culture, and the best geothermal country in the world.",
    reach: [
      { mode: "flight", title: "Delhi to Auckland (AKL)", detail: "One or two stops, usually via Singapore or Sydney.", time: "About 20h total" },
      { mode: "car", title: "Auckland to Rotorua", detail: "Straight down State Highway 1 then 5.", time: "About 3h" },
    ],
    transport: [
      { label: "Car hire", note: "The thermal parks are spread over twenty kilometres. You need your own wheels." },
      { label: "Walking", note: "The lakefront and Government Gardens are an easy stroll." },
      { label: "Shuttle", note: "The big parks and the cultural evenings run pickups from town." },
    ],
    stay: {
      headline: "A room with its own thermal pool",
      note: "Rotorua's speciality is private geothermal water on your own deck. It costs a little more and it is the thing you will talk about afterwards.",
      rooms: ["Private thermal-pool suite", "Lakefront room", "Forest lodge"],
    },
  },
  "New Zealand::Queenstown": {
    why: [
      "Mountains and lake in every direction.",
      "Milford Sound and Glenorchy within a day's drive.",
      "Every adventure sport, run to a high standard.",
    ],
    whyNot: [
      "Expensive, and busy in both summer and ski season.",
      "The Milford day trip is twelve hours of driving.",
      "Accommodation books out months ahead.",
    ],
    area: "South Island",
    lead: "Mountains straight out of a lake.",
    sub: "The adventure capital, with Milford Sound and the wineries within reach.",
    reach: [
      { mode: "flight", title: "Delhi to Auckland (AKL)", detail: "One or two stops, usually via Singapore or Sydney.", time: "About 20h total" },
      { mode: "flight", title: "Auckland to Queenstown (ZQN)", detail: "Frequent domestic flights, and a spectacular approach.", time: "About 2h" },
    ],
    transport: [
      { label: "Car hire", note: "For Glenorchy, the wineries and the Milford road. The drives are the attraction." },
      { label: "Walking", note: "Central Queenstown is compact and you can walk the lakefront for miles." },
      { label: "Gondola", note: "Up Bob's Peak for the view everybody comes for." },
    ],
    stay: {
      headline: "Facing the Remarkables",
      note: "The mountain view is the product here. A lake-and-mountain room in Queenstown or over in Frankton is worth more than extra space.",
      rooms: ["Lake-and-mountain view room", "Alpine chalet", "Lakeside suite"],
    },
  },
  "New Zealand::Wanaka": {
    why: [
      "Everything Queenstown has, with a fraction of the crowd.",
      "Lakefront walks straight from the town centre.",
      "A better base for Mount Aspiring and the Roys Peak climb.",
    ],
    whyNot: [
      "Far fewer restaurants and almost no nightlife.",
      "Most activities still mean a drive.",
      "Quiet enough to feel empty in the shoulder months.",
    ],
    area: "South Island",
    lead: "Queenstown's quieter neighbour.",
    sub: "A lake, one famous tree, and the walks that locals do instead.",
    reach: [
      { mode: "flight", title: "Delhi to Auckland (AKL)", detail: "One or two stops, usually via Singapore or Sydney.", time: "About 20h total" },
      { mode: "flight", title: "Auckland to Queenstown (ZQN)", detail: "Frequent domestic flights.", time: "About 2h" },
      { mode: "car", title: "Queenstown to Wanaka", detail: "Over the Crown Range, the highest sealed road in the country.", time: "About 1h 15m" },
    ],
    transport: [
      { label: "Car hire", note: "Needed. The trailheads and the lake road are all out of town." },
      { label: "Walking", note: "The lakefront, the tree and Mount Iron are all from the centre." },
      { label: "Bicycle", note: "A flat lakeside trail runs for kilometres in both directions." },
    ],
    stay: {
      headline: "Lakefront, within walking distance of town",
      note: "Wanaka is small enough that lakefront and walkable are the same thing. Take the view; there is nothing else you need to pay for here.",
      rooms: ["Lakefront room", "Alpine apartment", "Vineyard cottage"],
    },
  },
  "New Zealand::Christchurch": {
    why: [
      "Flat, green and genuinely easy to walk and cycle.",
      "A rebuilt centre with striking new architecture.",
      "The natural gateway to the south and to Tekapo.",
    ],
    whyNot: [
      "Earthquake gaps are still visible across the centre.",
      "Less dramatic than the rest of the South Island.",
      "It is a stopover rather than a destination.",
    ],
    area: "South Island",
    lead: "A garden city that rebuilt itself.",
    sub: "New architecture among the old, punting on the Avon, and the gateway to the south.",
    reach: [
      { mode: "flight", title: "Delhi to Christchurch (CHC)", detail: "Two stops, usually via Singapore or Sydney and Auckland.", time: "About 22h total" },
      { mode: "car", title: "Airport into the city", detail: "A short run across the plains.", time: "About 25m" },
    ],
    transport: [
      { label: "Tram", note: "The heritage loop covers the centre and doubles as a tour." },
      { label: "Car hire", note: "For Akaroa, the Banks Peninsula and the drive to Tekapo." },
      { label: "Walking and cycling", note: "Flat, green and full of cycle lanes. The easiest New Zealand city on foot." },
    ],
    stay: {
      headline: "Near the Botanic Gardens",
      note: "The centre is still filling back in. Staying beside the gardens puts you in the best of it, and the restaurants are a short walk either way.",
      rooms: ["Garden-side room", "City-centre loft", "Heritage boutique room"],
    },
  },
};

export function regionGuide(dest, city) {
  return REGION_GUIDE[`${dest}::${city}`] || null;
}

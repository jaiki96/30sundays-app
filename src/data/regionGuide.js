// ─── What we know about a region beyond its photos ───
//
// Three things a couple asks that no other part of the app answers: how do we
// actually get there, how do we move around once we are there, and what kind
// of room should we be paying for. None of it exists in the itinerary data, so
// it is written out here, one entry per region we sell.
//
// Plus the description itself, in three parts: `lead` is the one line a card
// can carry, `sub` the sentence under it, and `about` the paragraph the region
// page shows behind Read more. They are written to be read in that order and
// as one piece, so none of them repeats another.
//
// `stay` answers two questions and neither of them is where in town to sleep.
// It used to: "inside the fort walls", "pick the beach before the hotel". That
// is a question about the region, and the region page answers it everywhere
// else. What a couple cannot work out for themselves is what kind of place to
// book and which room in it to pay up for, so `headline` and `note` describe
// the kind of hotel and `rooms` the rooms worth asking for.
//
// `about` is descriptive rather than operational on purpose. It says what a
// place is like, which stays true; it does not quote a price, an opening time
// or a journey length, which do not. Those live in reach, transport and stay
// below, where the page can label them as approximate.
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
    about: "Ubud is the part of Bali people come back for. The town itself is a few busy streets of galleries, warungs and spas, and ten minutes out in any direction it turns into rice terraces, river gorges and temples. Days here are made of short trips rather than one big outing, so a couple can fit a temple, a terrace walk and a long lunch into the same morning. It is the one base on the island where you will want a jumper after dark.",
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
      headline: "A pool villa, not a hotel room",
      note: "Ubud is villa country. One or two bedrooms with a private pool and a plunge of green in front costs little more than a resort room here, and it is the thing people come back for. Big-brand resorts exist and are the weakest value on the island.",
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
    about: "Seminyak is where Bali goes out. The strip behind the beach is the island's best run of restaurants, and the beach clubs along the sand are the reason most couples book here for a few nights of their trip. Everything is walkable, which almost nowhere else in Bali is, and everything stays open late. Mornings are slow and the day does not really start until the afternoon.",
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
      headline: "A design hotel or a private-pool villa",
      note: "Two kinds of stay work here and they cost about the same: a small design hotel with a rooftop, or a walled villa with its own pool and a cook. Couples who want to be out every evening take the hotel; couples who want the day to stay in take the villa.",
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
    about: "Sanur faces east, so the sun comes up over the water and the sea is flat behind a reef. That makes it the calmest swimming on the south coast and the easiest place to spend a day doing very little. A paved path runs the length of the beach for a few kilometres, lined with cafes, and the fast boats to Nusa Penida and the Gilis leave from here. It is noticeably older and quieter than the west coast.",
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
      headline: "A low-rise garden resort",
      note: "Sanur's hotels are old-Bali: two storeys, big gardens, and a pool under the trees rather than a tower with a view. They are the best-value proper resorts on the island and they suit a slow week.",
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
    about: "Canggu was rice fields and a surf break, and it is now the part of Bali that everyone under thirty has heard of. The sand is black and volcanic, the surf is consistent, and the cafes between the breaks are as good as anywhere in Asia. It is spread out rather than walkable, so most people hire a scooter for a few days. Evenings are casual: a sunset at Echo Beach and dinner somewhere with no shoes on.",
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
      note: "Barely a resort town. What we book here is villas, usually two bedrooms with a pool and a kitchen, which works out cheaper than two hotel rooms and is how everyone stays.",
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
    about: "The Bukit peninsula is a limestone plateau that ends in cliffs, so the hotels here sit a hundred metres above the sea with staircases down to small beaches. The surf is the island's most serious, and the temple on the cliff edge runs a kecak dance as the sun goes down, which is the single most photographed thing in Bali. There is less to walk to than anywhere else on the island, which is the trade: you come here for the view and the water, not the town.",
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
      headline: "A clifftop resort",
      note: "The Bukit is resorts rather than villas, and they are built down the cliff in terraces so almost every room faces the water. There is nothing to walk to, so the resort is the holiday: pick one with a beach club or a good restaurant.",
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
    about: "Nusa Penida is the island in the photographs: Kelingking, Broken Beach, Angel's Billabong. It is a forty minute boat ride from Sanur, and the sights sit at the ends of long rough roads, so a day here is a lot of driving for a handful of extraordinary views. The snorkelling is the best anywhere near Bali, and the manta cleaning stations are a reliable sighting rather than a lucky one. Most couples do it as a long day trip; a night on the island buys you the viewpoints before the boats arrive.",
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
      headline: "A simple guesthouse",
      note: "There is no luxury on Penida worth the money. A clean room with a pool and air conditioning is the ceiling, so spend two nights, keep the budget for the boats and the drivers, and sleep somewhere easy.",
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
    about: "Labuan Bajo is in Flores, a short flight east of Bali, and it is the harbour everything in Komodo leaves from. The town is small and functional, and the reason to be here is the water: dragons on Komodo and Rinca, the pink beach, Padar's three bays from the ridge, and manta rays at the channel. Almost every day is spent on a boat. It is the one part of a Bali trip that feels like a separate holiday.",
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
      headline: "A small harbour hotel, or a boat",
      note: "Two shapes: a hillside hotel in town for a night either side of the boats, or a cabin on a liveaboard for the Komodo nights themselves. Most couples do both, and the boat is the part they remember.",
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
    about: "Hanoi has been a capital for a thousand years and it has never been tidied up. The Old Quarter is thirty-six lanes, each one named for the trade it used to hold, and the pavements belong to scooters, plastic stools and kitchens. There are lakes in the middle of the city to slow down beside, a French quarter of wide streets and old villas, and street food that most people rate the best in the country. It is cooler than the south and genuinely cold for a few weeks in winter.",
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
      headline: "A small boutique, not a chain",
      note: "Hanoi's good hotels are converted townhouses: twenty rooms, a lift that fits two, breakfast on the roof. The rooms are small by resort standards and the service is better than anything at the price. The international towers are further out and duller.",
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
    about: "Ha Long Bay is nearly two thousand limestone islands standing in green water, and the only way to see it properly is to sleep on it. An overnight cruise gets you the caves and the kayaking after the day boats have gone home, and the bay at six in the morning is a different place entirely. Day trips from Hanoi exist and are a long drive for a short look. Most couples give it one or two nights and treat the boat as the hotel.",
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
      headline: "A cruise boat, not a hotel",
      note: "You sleep on the water. Boats run from functional to genuinely smart, and the jump in price buys you fewer cabins and better food rather than a bigger room. Hotels in Ha Long City are a last resort.",
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
    about: "Hoi An was a trading port for four hundred years and came through the war intact, so the old town is still the merchant houses, the Japanese bridge and the Chinese assembly halls. It is closed to traffic for much of the day, which makes it the one place in Vietnam you can simply walk. The lanterns go on at dusk and the riverfront fills up. There is a beach fifteen minutes away, and the tailors here will make something in a day.",
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
      headline: "A garden resort",
      note: "The old town itself has small boutiques with no space; ten minutes out, the resorts sit in the rice fields with pools and free bicycles and cost less. Most couples take the resort and cycle in.",
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
    about: "Da Nang is a working city with thirty kilometres of beach along one side and mountains on the other. The sand is the draw, and it is the base most couples use for Hoi An and the Marble Mountains. Above the city, Ba Na Hills has the Golden Bridge held up by two stone hands, which is a cable car ride and a crowd and worth it anyway. The bridges in the centre are lit at night and one of them breathes fire at the weekend.",
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
      headline: "A beach resort",
      note: "This is the one place in Vietnam that does big international beach resorts properly, and they are priced well below their equivalents in Thailand. Take a high floor: the difference in cost is small and the difference in view is the whole thing.",
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
    about: "Saigon is the loud end of Vietnam and it does not close. The war history is here and it is confronting: the Cu Chi tunnels an hour out, the War Remnants Museum in the middle of town. Between those, it is markets, coffee, and some of the best food in the country eaten on the street. The rooftops come into their own after dark. Two nights is usually enough, often paired with a day out to the Mekong Delta.",
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
      headline: "A tower hotel, high up",
      note: "Saigon is a city-break stay rather than a resort one. The international towers are good value, and height is what you are buying: quiet, a long view, and a pool above the traffic.",
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
    about: "Phu Quoc sits in the Gulf of Thailand, closer to Cambodia than to the rest of Vietnam, and it is where Vietnamese beach holidays happen. The west coast has the sand and the sunsets, the south has the cable car out to Hon Thom, and the middle of the island is still national park. It is the only part of a Vietnam trip that is genuinely about lying still. The night market in Duong Dong is the best eating on the island.",
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
      headline: "A beach resort with a pool",
      note: "Almost everything here is a resort on its own stretch of sand, and the newer ones on the west coast are very good for the money. A private pool or direct pool access is the upgrade worth taking.",
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
    about: "Bangkok puts the Grand Palace and a sixty-storey rooftop bar within the same square mile, and it is better at both than it has any right to be. The river is the spine of it, and the boats are faster than the roads. Street food is everywhere and the transport is the best in the region, so a couple with two days can see the temples, eat properly and still get a massage. It is hot, loud and far more organised than it looks.",
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
      headline: "A big-brand tower",
      note: "Bangkok hotels are the best value in Asia: five-star for the price of mid-range anywhere else. Take the extra floor and the club lounge rather than a smaller boutique, because the pool and the breakfast are what you will actually use.",
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
    about: "Chiang Mai was the capital of its own kingdom and the moat around the old city is still there, with a few hundred temples inside and behind it. The air is cooler than the south and the pace is slower. It is the best place in Thailand to learn to cook, and the elephant sanctuaries that do it properly, with no riding, are an hour out of town. The Sunday walking street is the one market worth planning around.",
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
      headline: "A Lanna-style boutique",
      note: "Low teak buildings round a courtyard pool, usually under forty rooms. They are the character of the place and they cost very little. The resorts out in the valley are beautiful and leave you reliant on a driver.",
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
    about: "Krabi is limestone cliffs standing in flat green water, and the coast is cut up enough that boats are the normal way to get about. Railay is a beach you can only reach by longtail, and the four-island trip is the standard day out and a good one. The climbing here is world class and beginner friendly. Inland there are hot springs and the Emerald Pool, which is a long drive and a short swim.",
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
      headline: "A resort with its own beach",
      note: "The coast is cut up by cliffs, so what you want is a resort that owns the sand in front of it rather than one across a road. That single thing matters more here than the star rating.",
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
    about: "Phuket is big enough to be several holidays. The west coast beaches run from Patong, which is loud, to quiet bays in the north where the resorts sit on their own. The old town in the middle is Sino-Portuguese shophouses and good coffee, and it surprises people. The boats to Phi Phi and the islands leave from the east side. Pick the beach carefully and it is one of the easiest places in Asia to be.",
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
      headline: "A resort on a quiet bay",
      note: "Phuket does every kind of hotel there is, which makes it easy to book the wrong one. A mid-size resort on a calm bay with its own beach is the version couples like; the big party-strip hotels are cheaper for a reason.",
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
    about: "Samui is a coconut island that grew into a proper resort destination without losing the shape of one. The east coast has the calm water and most of the hotels, Fisherman's Village is the nicest hour's walk on the island, and the interior is still jungle and waterfalls. Ang Thong marine park is a day on a boat and the best thing to do here. The full-moon island is the next one over, which is close enough to visit and far enough to ignore.",
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
      headline: "A beach resort with a private pool",
      note: "Samui's speciality is the pool villa at a sane price: your own water, a few steps of garden, and the beach through the gate. It is the one upgrade here that changes the holiday rather than the photographs.",
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
    about: "Malé is the arrival point and one of the densest cities in the world, a capital on about one square mile. Most couples pass through it in an hour on the way to a resort. If you do stop, the old coral-stone mosque and the fish market are worth the walk, and the local islands a short ferry away are the cheapest way to see what the Maldives looks like without a resort around it. It is the one part of the country with traffic.",
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
      headline: "A local-island guesthouse",
      note: "Not a resort. Guesthouses on the nearby local islands are a fraction of the price, the snorkelling off them is real, and a night either side of a flight is what they are for. Expect simple rooms and no alcohol.",
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
    about: "Baa Atoll is a UNESCO biosphere reserve, and in season the manta rays gather at Hanifaru Bay in numbers that happen almost nowhere else. The water here is the clearest in a country known for clear water. The resorts are spread across the atoll and reached by seaplane, which is itself one of the better twenty minutes of a trip. Beyond the water there is nothing to do, which is the entire point.",
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
      note: "This is the atoll where overwater earns its money, because the reef is close enough to swim to from the steps. A private pool on the deck is standard at this level and worth holding out for.",
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
    about: "South Ari is the atoll where whale sharks are resident all year, so a sighting is a reasonable expectation rather than a lucky one. The reefs are good and the house reefs at several of the resorts are good enough that you need not get on a boat at all. It is a thirty minute seaplane or a longer speedboat from Malé. Like the rest of the country, the day is swimming, eating and watching the light change.",
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
      headline: "A villa on the house reef",
      note: "In South Ari the reef is the product, so the question is not overwater or beach but which villas sit on the good side of it. Ask what the house reef is actually like before the room type.",
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
    about: "Addu is the far south, almost on the equator, and it is the quiet end of the Maldives. The islands here are linked by a causeway you can cycle along, which makes it the one atoll where you can see more than the island you are staying on. There is a British wartime base, some remnants of which are still standing, and the British Loyalty wreck, which is a genuinely world-class dive. It takes an extra domestic flight to reach and feels further from everything than it is.",
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
      note: "Addu is about the land as much as the water: linked islands, bicycles, a wreck dive. Direct sand access and a bike at the door beats a walkway over the lagoon here.",
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
    about: "Sigiriya is a palace built on top of a two hundred metre rock in the fifth century, with the frescoes and the lion's paws still on the way up. Climb it early, because there is no shade and the stairs fill up. Pidurangala, the rock opposite, gives you the better photograph of Sigiriya itself. The cave temples at Dambulla and the safari parks are both within an hour, so this is the base for the cultural triangle rather than a stop on the way through.",
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
      headline: "A lodge in its own grounds",
      note: "Hotels here are low lodges set in scrub and lake, built around a pool, with the rock somewhere in the view. They are quiet, there is nothing to walk to, and that is the point after a dawn climb.",
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
    about: "Kandy was the last royal capital of Sri Lanka and it held out against the Europeans longest, which is why it still feels like its own place. The Temple of the Tooth sits by the lake in the middle of town and the evening ceremony is worth timing your day around. The botanical gardens at Peradeniya are among the best in Asia. It is also where the hill country train line starts, and that ride is the reason many couples come this way at all.",
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
      headline: "A hillside boutique",
      note: "The good rooms are in small hotels up on the valley sides, ten or fifteen of them, usually a converted house. The big hotels are on the main road and you will hear it.",
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
    about: "Ella is a small town in the hills surrounded by tea estates, and it is where everybody slows down. The Nine Arches Bridge with a train crossing it is the photograph, Little Adam's Peak is an easy hour for the view, and Ella Rock is a harder three. It is cool and green and wet more often than the coast. The train in from Kandy or Nuwara Eliya is one of the best rail journeys anywhere.",
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
      headline: "A small hotel with a view room",
      note: "Everything here is small: eight or ten rooms clinging to the hillside, run by the family who built it. Pay for the view room rather than the bigger room, because the view is the reason Ella exists.",
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
    about: "Galle Fort is a Dutch walled town on a headland, still lived in rather than preserved as a museum. The ramparts take an hour to walk and are the thing to do at sunset. Inside, the old merchant houses are now cafes, galleries and small hotels, and the streets are quiet enough to wander without a plan. There are beaches on both sides, and the surf at Hikkaduwa and the turtles are a short drive up the coast.",
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
      headline: "A restored merchant house",
      note: "Inside the fort the stays are old Dutch townhouses turned into six-room hotels, with courtyards and verandahs. They are the experience rather than the accommodation, and the lanes empty out after the day visitors leave.",
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
    about: "Mirissa is a crescent of sand with headlands at both ends and the deep water close offshore, which is why the blue whales are here. The boats go out early from November, and it is one of the most reliable whale sightings in the world. Coconut Tree Hill at the end of the beach is the photograph everybody takes. The rest of it is surf lessons, seafood on the sand, and not much else, which is what people come for.",
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
      headline: "A small beach hotel or a villa",
      note: "No big resorts, and that is the appeal. A dozen rooms above the sand, or a villa up on the headland with a pool and a cook. Both are inexpensive by the standards of anywhere else on this list.",
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
    about: "Auckland is built on about fifty volcanoes and wrapped around two harbours, so there is water at the end of most streets and a hill to climb for the view. The islands are the best of it: Waiheke is forty minutes by ferry and full of vineyards, Rangitoto is a volcano you can walk up. West of the city the beaches are black sand and serious surf. It is where most trips start, and two nights is usually right before heading south.",
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
      headline: "A harbour hotel, or a vineyard stay",
      note: "Either a city hotel facing the water for a short stop, or skip the city and stay among the vines on Waiheke, forty minutes by ferry. The second is the better night and the one people wish they had booked.",
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
    about: "Rotorua sits on a geothermal field, so there are geysers, mud pools and steam coming out of the pavements, and the whole town smells faintly of sulphur. It is also the centre of Maori culture in New Zealand, and the cultural evenings here are the real thing rather than a show. Hobbiton is an hour away and is a better morning than non-readers expect. For everything else there are the lakes, the redwood forest and the hot pools.",
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
      headline: "A lodge with a private thermal pool",
      note: "Rotorua's one speciality is geothermal water on your own deck, and it is available at ordinary prices. It costs a little more than a standard room and is the single best thing about staying here.",
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
    about: "Queenstown is a small town on a lake with mountains standing straight out of it, and it has made itself the adventure capital of the world. Bungee started here, and the jet boats, skydiving and paragliding all followed. None of that is compulsory: the gondola, the lake cruise and the wineries at Gibbston make a gentler version of the same place. Milford Sound is a long day out and one of the great ones, and Arrowtown is twenty minutes away.",
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
      headline: "A lakeview hotel or an alpine lodge",
      note: "In town, a hotel room facing Wakatipu and the Remarkables; out of town, a lodge with a car and silence. Queenstown is busy, so the choice is really how much of that you want at breakfast.",
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
    about: "Wanaka is an hour over the hill from Queenstown and it is what Queenstown was before the crowds. Same lake-and-mountains setting, a fraction of the traffic, and the walks that locals actually do. Roys Peak is a hard climb for the most photographed view in the country. The famous tree is at the edge of the lake five minutes from town. There is less to do here, deliberately, and couples who want the scenery without the queues base here instead.",
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
      headline: "A lakefront apartment or a small lodge",
      note: "Apartments are the norm here and they suit it: a kitchen, a washing machine and a balcony over the water, for less than a hotel room in Queenstown. The lodges out of town are the quiet alternative.",
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
    about: "Christchurch rebuilt itself after the earthquakes and the result is a city of new architecture dropped among the Victorian stone that survived. The botanic gardens and Hagley Park take up a large part of the centre, and you can be punted down the Avon through the middle of them. The Port Hills give you the harbour on one side and the plains on the other. It is the gateway to the south, and the TranzAlpine train west is one of the great rail journeys.",
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
      headline: "A small design hotel",
      note: "The centre is new again and the best stays are small design hotels in it, a few dozen rooms, walking distance to the gardens and the trams. The airport chains are cheaper and you will see nothing.",
      rooms: ["Garden-side room", "City-centre loft", "Heritage boutique room"],
    },
  },
};

export function regionGuide(dest, city) {
  return REGION_GUIDE[`${dest}::${city}`] || null;
}

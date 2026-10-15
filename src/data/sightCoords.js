// ─── Where the named sights actually are ───
//
// The region map pins the things to do, so it needs a real position for each
// one. The activity catalogue holds a name and a photograph and nothing else,
// so the positions live here, keyed by the same name the catalogue uses.
//
// Two rules, and they matter more than the coverage:
//
//   1. Only places that are places. Half the catalogue is "Beach day", "Spa
//      afternoon", "Yoga session": real things to do that are not anywhere in
//      particular. Those get no pin, and the map says how many it is showing
//      rather than implying it is showing everything.
//   2. Nothing invented. A pin is a claim about where something is, and a
//      wrong one sends a couple to the wrong side of an island. Anything not
//      listed here simply is not pinned.
//
// These are approximate, to a few hundred metres, and good enough to show which
// side of town a thing is on. They want a pass from someone who has been before
// this goes in front of a customer.

export const SIGHT_COORDS = {
  // ── Bali ──
  "Sacred Monkey Forest": { lat: -8.5188, lng: 115.2583 },
  "Tirta Empul purification": { lat: -8.4156, lng: 115.3153 },
  "Ubud Art Market stroll": { lat: -8.5073, lng: 115.2626 },
  "Tegallalang rice terrace trek": { lat: -8.4312, lng: 115.2792 },
  "Kintamani volcano hike": { lat: -8.2422, lng: 115.3753 },
  "Campuhan ridge walk": { lat: -8.5063, lng: 115.2528 },
  "White water rafting": { lat: -8.4789, lng: 115.2497 },
  "Tanah Lot temple visit": { lat: -8.6212, lng: 115.0869 },
  "Tanah Lot sunset": { lat: -8.6212, lng: 115.0869 },
  "Jimbaran seafood dinner": { lat: -8.7906, lng: 115.1639 },
  "Echo Beach sunset": { lat: -8.6565, lng: 115.1283 },
  "Uluwatu temple": { lat: -8.8291, lng: 115.0849 },
  "Surfing at Padang Padang": { lat: -8.8103, lng: 115.1021 },
  "Blue Point beach": { lat: -8.8139, lng: 115.0875 },
  "Sundays Beach Club": { lat: -8.8436, lng: 115.1096 },
  "Le Mayeur Museum": { lat: -8.6786, lng: 115.2619 },
  "Sanur Night Market": { lat: -8.6836, lng: 115.2588 },
  "Kelingking Beach hike": { lat: -8.7513, lng: 115.4722 },
  "Broken Beach viewpoint": { lat: -8.7236, lng: 115.4517 },
  "Angel's Billabong": { lat: -8.7247, lng: 115.4506 },
  "Crystal Bay beach": { lat: -8.7160, lng: 115.4594 },
  "Peguyangan waterfall": { lat: -8.7847, lng: 115.4745 },
  "Komodo dragon trek": { lat: -8.5847, lng: 119.4406 },
  "Pink Beach snorkeling": { lat: -8.6283, lng: 119.6253 },
  "Padar Island viewpoint": { lat: -8.6533, lng: 119.5742 },
  "Manta Point snorkel": { lat: -8.5231, lng: 119.5731 },
  "Rangko Cave swim": { lat: -8.4186, lng: 119.7831 },
  "Cunca Wulang waterfall": { lat: -8.5597, lng: 120.0375 },

  // ── Vietnam ──
  "Old Quarter walking tour": { lat: 21.0343, lng: 105.8510 },
  "Water puppet show": { lat: 21.0288, lng: 105.8528 },
  "Train Street visit": { lat: 21.0283, lng: 105.8440 },
  "West Lake cycling": { lat: 21.0583, lng: 105.8203 },
  "Ceramic village tour": { lat: 20.9739, lng: 105.9136 },
  "Kayaking through caves": { lat: 20.8206, lng: 107.0917 },
  "Floating village visit": { lat: 20.8089, lng: 107.0533 },
  "Deep cave exploration": { lat: 20.8469, lng: 107.0961 },
  "Ancient town walk": { lat: 15.8773, lng: 108.3270 },
  "Japanese Bridge": { lat: 15.8773, lng: 108.3261 },
  "Tra Que herb village": { lat: 15.9011, lng: 108.3250 },
  "Golden Bridge": { lat: 15.9953, lng: 107.9967 },
  "Marble Mountains": { lat: 16.0036, lng: 108.2639 },
  "My Khe Beach": { lat: 16.0589, lng: 108.2472 },
  "Dragon Bridge night": { lat: 16.0614, lng: 108.2275 },
  "Son Tra Peninsula hike": { lat: 16.1192, lng: 108.2767 },
  "Cu Chi Tunnels": { lat: 11.1422, lng: 106.4644 },
  "War Remnants Museum": { lat: 10.7797, lng: 106.6922 },
  "Notre-Dame Cathedral": { lat: 10.7797, lng: 106.6990 },
  "Ben Thanh market tour": { lat: 10.7725, lng: 106.6980 },
  "Cable car ride": { lat: 10.0183, lng: 104.0194 },
  "Sunset fishing village": { lat: 10.2089, lng: 104.0400 },

  // ── Thailand ──
  "Grand Palace & Wat Phra Kaew": { lat: 13.7500, lng: 100.4913 },
  "Wat Arun boat ride": { lat: 13.7437, lng: 100.4889 },
  "Chinatown walk": { lat: 13.7398, lng: 100.5100 },
  "Chatuchak Weekend Market": { lat: 13.7999, lng: 100.5503 },
  "Floating market visit": { lat: 13.5203, lng: 99.9589 },
  "Doi Suthep temple": { lat: 18.8048, lng: 98.9217 },
  "Night Bazaar walk": { lat: 18.7870, lng: 98.9993 },
  "Sunday walking street": { lat: 18.7900, lng: 98.9870 },
  "Big Buddha visit": { lat: 7.8278, lng: 98.3122 },
  "Patong nightlife": { lat: 7.8961, lng: 98.2966 },
  "Kata Beach day": { lat: 7.8186, lng: 98.2983 },
  "Old Town walk": { lat: 7.8844, lng: 98.3878 },
  "Sunset at Promthep Cape": { lat: 7.7622, lng: 98.3047 },
  "Phi Phi Island day trip": { lat: 7.7407, lng: 98.7784 },
  "Railay Beach day": { lat: 8.0069, lng: 98.8375 },
  "Tiger Cave temple": { lat: 8.1253, lng: 98.9242 },
  "Emerald Pool swim": { lat: 7.9247, lng: 99.2669 },
  "Hot Springs dip": { lat: 7.9139, lng: 99.2347 },
  "Big Buddha temple": { lat: 9.5681, lng: 100.0603 },
  "Fisherman's Village walk": { lat: 9.5578, lng: 100.0589 },
  "Ang Thong Marine Park": { lat: 9.6167, lng: 99.6667 },
  "Grandmother Rock": { lat: 9.4594, lng: 100.0586 },

  // ── Sri Lanka ──
  "Sigiriya Rock climb": { lat: 7.9570, lng: 80.7603 },
  "Pidurangala Rock sunset": { lat: 7.9697, lng: 80.7600 },
  "Dambulla cave temple": { lat: 7.8567, lng: 80.6492 },
  "Temple of the Tooth": { lat: 7.2936, lng: 80.6413 },
  "Botanical gardens walk": { lat: 7.2697, lng: 80.5956 },
  "Nine Arches Bridge": { lat: 6.8761, lng: 81.0608 },
  "Little Adam's Peak": { lat: 6.8692, lng: 81.0569 },
  "Ella Rock sunrise hike": { lat: 6.8519, lng: 81.0458 },
  "Ravana Falls swim": { lat: 6.8456, lng: 81.0458 },
  "Galle Fort walk": { lat: 6.0266, lng: 80.2170 },
  "Maritime museum": { lat: 6.0272, lng: 80.2169 },
  "Dutch Reformed Church": { lat: 6.0274, lng: 80.2165 },
  "Unawatuna Beach": { lat: 6.0100, lng: 80.2489 },
  "Lighthouse viewpoint": { lat: 6.0258, lng: 80.2175 },
  "Surfing at Hikkaduwa": { lat: 6.1395, lng: 80.1063 },
  "Coconut tree hill climb": { lat: 5.9442, lng: 80.4661 },
  "Sunset at Secret Beach": { lat: 5.9433, lng: 80.4647 },
  "Stilt fishermen visit": { lat: 5.9731, lng: 80.4292 },

  // ── New Zealand ──
  "Sky Tower visit": { lat: -36.8485, lng: 174.7622 },
  "Waiheke Island ferry": { lat: -36.8014, lng: 175.0833 },
  "Ponsonby cafe crawl": { lat: -36.8542, lng: 174.7458 },
  "Rangitoto Island hike": { lat: -36.7869, lng: 174.8597 },
  "Bridge climb": { lat: -36.8300, lng: 174.7444 },
  "Te Puia geothermal": { lat: -38.1631, lng: 176.2528 },
  "Hobbiton tour": { lat: -37.8722, lng: 175.6831 },
  "Redwoods treewalk": { lat: -38.1556, lng: 176.2764 },
  "Lake Tarawera cruise": { lat: -38.2000, lng: 176.4333 },
  "Bungee jumping": { lat: -45.0003, lng: 168.7914 },
  "Skyline gondola & luge": { lat: -45.0294, lng: 168.6567 },
  "Arrowtown walk": { lat: -44.9394, lng: 168.8336 },
  "Milford Sound day trip": { lat: -44.6716, lng: 167.9256 },
  "Roys Peak hike": { lat: -44.6619, lng: 169.0975 },
  "Wanaka Tree photo": { lat: -44.6975, lng: 169.1203 },
  "Puzzling World": { lat: -44.6931, lng: 169.1664 },
  "Canterbury Museum": { lat: -43.5309, lng: 172.6269 },
  "Botanic Gardens": { lat: -43.5314, lng: 172.6200 },
  "Arts Centre walk": { lat: -43.5306, lng: 172.6283 },
  "New Regent Street": { lat: -43.5300, lng: 172.6375 },
  "Hagley Park walk": { lat: -43.5306, lng: 172.6186 },
  "Port Hills hike": { lat: -43.5897, lng: 172.6500 },

  // ── Maldives ──
  "Hukuru Miskiy mosque": { lat: 4.1772, lng: 73.5106 },
  "Fish market tour": { lat: 4.1783, lng: 73.5097 },
  "Villingili beach": { lat: 4.1775, lng: 73.4789 },
};

export const sightCoords = (name) => SIGHT_COORDS[name] || null;

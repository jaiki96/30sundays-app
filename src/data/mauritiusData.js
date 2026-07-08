// Mauritius data: destination content, itineraries, and real hotels with
// per-hotel inclusions (honeymoon perks + value add-ons) parsed from the
// Mauritius hotels sheet. Consumed by data.js (destData/allItineraries) and
// ItineraryDetail (getHotels → real hotels + inclusions accordion).

export const MAURITIUS_DEST = {
  "name": "Mauritius",
  "flag": "🇲🇺",
  "startPrice": "72,998",
  "circle": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&q=80&auto=format&fit=crop",
  "card": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80&auto=format&fit=crop",
  "hero": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80&auto=format&fit=crop",
  "visa": "Visa-free on arrival (up to 60 days). Passport valid 6+ months.",
  "flights": "Direct flights from Mumbai & Delhi (Air Mauritius, IndiGo).",
  "idealNights": "6-8 nights to enjoy the north, west and south coasts",
  "activities": [
    "Catamaran Cruise",
    "Dolphin Watching",
    "Ile aux Cerfs",
    "Underwater Waterfall Viewpoint",
    "Seven Coloured Earth",
    "Black River Gorges"
  ],
  "actImgs": [
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1607153333879-c174d265f1d2?w=900&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=900&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=900&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502786129293-79981df4e689?w=900&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900&q=80&auto=format&fit=crop"
  ]
};

export const MAURITIUS_ITINERARIES = [
  { id: 500, dest: "Mauritius", vibe: "Relaxed", name: "Lagoons & Sunsets", nights: 6, price: "84,998", route: [{ city: "Grand Baie", n: 3 }, { city: "Belle Mare", n: 3 }], veg: true, img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&q=80&auto=format&fit=crop",
    days: [{ city: "Grand Baie", n: 3, sub: "Catamaran cruise \u00b7 Beach day \u00b7 Grand Baie town" }, { city: "Belle Mare", n: 3, sub: "Ile aux Cerfs \u00b7 Lagoon swim \u00b7 Spa day" }],
    pace: "Unhurried", crowds: "Low", vegFood: "Medium" },
  { id: 501, dest: "Mauritius", vibe: "Explorer", name: "Island Discovery", nights: 8, price: "1,08,498", route: [{ city: "Flic en Flac", n: 3 }, { city: "Le Morne", n: 2 }, { city: "Belle Mare", n: 3 }], veg: false, img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=900&q=80&auto=format&fit=crop",
    days: [{ city: "Flic en Flac", n: 3, sub: "Dolphin watching \u00b7 Casela park \u00b7 Sunset beach" }, { city: "Le Morne", n: 2, sub: "Kitesurf beach \u00b7 Le Morne walk \u00b7 Underwater falls viewpoint" }, { city: "Belle Mare", n: 3, sub: "Ile aux Cerfs \u00b7 Lagoon swim \u00b7 Spa day" }],
    pace: "Balanced", crowds: "Mixed", vegFood: "Medium" },
  { id: 502, dest: "Mauritius", vibe: "Relaxed", name: "Honeymoon Hideaway", nights: 7, price: "96,998", route: [{ city: "Trou aux Biches", n: 3 }, { city: "South Coast", n: 4 }], veg: true, img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80&auto=format&fit=crop",
    days: [{ city: "Trou aux Biches", n: 3, sub: "Snorkeling \u00b7 Beach day \u00b7 Northern islands" }, { city: "South Coast", n: 4, sub: "Seven Coloured Earth \u00b7 Black River Gorges \u00b7 Waterfalls" }],
    pace: "Unhurried", crowds: "Low", vegFood: "High" },
  { id: 503, dest: "Mauritius", vibe: "Offbeat", name: "North & Wild Coast", nights: 7, price: "88,498", route: [{ city: "Grand Baie", n: 2 }, { city: "Flic en Flac", n: 3 }, { city: "Le Morne", n: 2 }], veg: false, img: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=900&q=80&auto=format&fit=crop",
    days: [{ city: "Grand Baie", n: 2, sub: "Catamaran cruise \u00b7 Beach day \u00b7 Grand Baie town" }, { city: "Flic en Flac", n: 3, sub: "Dolphin watching \u00b7 Casela park \u00b7 Sunset beach" }, { city: "Le Morne", n: 2, sub: "Kitesurf beach \u00b7 Le Morne walk \u00b7 Underwater falls viewpoint" }],
    pace: "Balanced", crowds: "Low", vegFood: "Medium" }
];

// Real hotels keyed by their sheet code. inclusions = { minStay, honeymoon[], valueAdds[], note }.
export const MAURITIUS_HOTELS = {
 "104": {
  "code": "104",
  "name": "Casuarina Resort & Spa",
  "stars": 4,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/f1bdfe0a-26c6-484f-8ba5-4cdcff7de82e_b.jpg",
  "region": "Trou aux Biches",
  "address": "Coastal Road, Trou-aux-Biches, Mauritius",
  "desc": "The 106 rooms and 14 family cottages of Casuarina Resort & Spa surround visitors with the captivating beauty of Mauritius. Accommodations are an opportunity to indulge in a beautiful view over Trou aux Biches lagoon and the tropical garden of the hotel.",
  "inclusions": {
   "minStay": "Minimum 6 nights' stay - 02 t-shirts",
   "honeymoon": [
    "1 fruit basket in room upon arrival",
    "One bottle of sparkling wine in the room upon arrival. half hour steam bath at the Spa for the couple",
    "50% discount on Spa Treatments",
    "(NOTE0)-A marriage certificate not older than 6 months will be asked upon check in"
   ],
   "valueAdds": [],
   "note": ""
  }
 },
 "95": {
  "code": "95",
  "name": "The Westin Turtle Bay Resort & Spa, Mauritius",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/423bf750-1595-44a9-840e-9eb6a73eb6f5_b.jpg",
  "region": "Trou aux Biches",
  "address": "Turtle Bay, Balaclava, Mauritius 21307",
  "desc": "Revel in the extraordinary views, superb service and luxury amenities at The Westin Turtle Bay Resort and Spa, Mauritius. Set adjacent to a protected marine park, hotel guests are invited to explore idyllic Turtle Bay, historic Port Louis and lively Grand Bay. After an exciting day in Mauritius, recharge in one of our spacious resort acco",
  "inclusions": {
   "minStay": "",
   "honeymoon": [
    "1 bottle of Sparkling Wine, 1 Fruit basket, 30% discount on Spa treatments during the stay"
   ],
   "valueAdds": [],
   "note": "(Offer Validity 12 months from date of marriage)"
  }
 },
 "2": {
  "code": "2",
  "name": "Le Meridien Ile Maurice",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/85fb12c3-6204-482d-b927-66fab935ef26.jpeg",
  "region": "Trou aux Biches",
  "address": "MU, Village Hall Lane, Pointe aux Piments, Mauritius",
  "desc": "Beautifully positioned alongside 1km of sandy beach on the northwest coast of the island, Le Meridien Ile Maurice has a long history of reference in the Mauritian hospitality landscape. Featuring a unique design, Le Meridien Ile Maurice maintains its rich heritage while surprising its guests with inspired multicultural local artwork and s",
  "inclusions": {
   "minStay": "",
   "honeymoon": [
    "1 bottle of Sparkling Wine, 1 Fruit basket, 30% discount on Spa treatments during the stay"
   ],
   "valueAdds": [],
   "note": "Validity - 12 months from date of marriage"
  }
 },
 "60": {
  "code": "60",
  "name": "Laguna Beach Hotel & Spa",
  "stars": 3,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/5c0f3a1b-1d95-48dd-b23e-2b6eea73ff1c.jpg",
  "region": "Mauritius",
  "address": "Camp Des Pecheurs, Grand River South East, Mauritius",
  "desc": "Set against the scenic backdrop of the Grand-Port mountain range, the Laguna Beach Hotel & Spa is a gem in its kind; a postcard beauty with a real soul: Tropical architecture, pristine beach and the transparency of an exquisite lagoon. The Laguna Beach Hotel & Spa is located in Grand River South East, along the South East coast of the isl",
  "inclusions": {
   "minStay": "",
   "honeymoon": [
    "1 fruit platter, 1 bottle of sparkling wine, floral decoration in room",
    "During stay: One romantic dinner (excluding drinks)"
   ],
   "valueAdds": [],
   "note": "A copy of the Wedding/Civil Partnership Certificate (not exceeding 12 months) must be forwarded to the Reservation Department at the time of booking and to be presented by guests upon check-in"
  }
 },
 "87": {
  "code": "87",
  "name": "Long Beach Mauritius",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/ed254e4c-0900-4d11-9216-c5c33271d664.jpg",
  "region": "Belle Mare",
  "address": "Coastal Road, Belle Mare, Mauritius 41601",
  "desc": "A Sun Resorts property, Long Beach Golf & Spa Resort is located on the east coast, along one of the island's longest and widest natural beaches. Opened in 2011, it is an elegant and affable holiday resort featuring a unique blend of island chic architecture and tropical landscape. Its 255 rooms are harmoniously arranged in three semi-circ",
  "inclusions": {
   "minStay": "Minimum of 4 nights stay required",
   "honeymoon": [
    "Special turndown with gifts in room on day of arrival",
    "Romantic Signature 3-course dinner once during the stay",
    "For all stays of minimum 7 nights, Come Alive expericence SWING & DRIFT for 20 minutes is offered for the couple, once per stay. To be taken between 14h - 16h, booked upon check in. Join us and our mixologist for a weekly get together and savor our cocktails designed with medicinal healing properties",
    "15% discount upon booking a private dinner at the Gazebo",
    "50% discount upon booking a couple massage between 10h - 15h",
    "15% discount for a personalized photoshoot with 30 digital photos"
   ],
   "valueAdds": [
    "Guaranteed early check-in",
    "Breakfast upon arrival",
    "One lunch on arrival or departure",
    "ONE HONEYMOON DINNER (for honeymoners only)"
   ],
   "note": "A wedding/Civil partnership certificate not exceeding 18 months from date of issue at time of travel must be presented upon booking/check in.Failure to produce such document will encompass guests to pay prevailing Public Rates on day of check in"
  }
 },
 "96": {
  "code": "96",
  "name": "The St Regis Le Morne Resort Mauritius",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/45314750-626e-4db8-abe8-065902961403_b.jpeg",
  "region": "Le Morne",
  "address": "Coastal Road Le Morne Peninsula, Le Morne, Mauritius 91102",
  "desc": "Recline along the white sandy beach of the legendary Le Morne Peninsula of Mauritius. The St Regis Le Morne Resort Mauritius is a luxury family friendly hotel which provides idyllic views over the lagoon with a befitting backdrop of Le Morne Brabant Mountain, a UNESCO World Heritage Site. Our resort offers immersive experiences and endles",
  "inclusions": {
   "minStay": "",
   "honeymoon": [
    "1 bottle of Sparkling Wine, 1 Fruit basket, 30% discount on Spa treatments during the stay"
   ],
   "valueAdds": [],
   "note": "(Offer Validity : 12 months from date of marriage)"
  }
 },
 "57": {
  "code": "57",
  "name": "Mauricia Beachcomber Resort & Spa",
  "stars": 4,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/31c7897f-a128-4429-9951-7125b731c214.jpg",
  "region": "Grand Baie",
  "address": "Royal Road, Grand Baie 30512, Mauritius",
  "desc": "Located on the sun-drenched northern coast of Mauritius, Mauricia Beachcomber Resort & Spa, a four-star Beachcomber hotel, is cosmopolitan and relaxed, simple yet cosy. Comfort and simplicity take centre stage. The hotel's architecture evokes the traditional Mediterranean style. All has been done to provide sweeping views of the bay from ",
  "inclusions": {
   "minStay": "Minimum stay of 4 nights (to choose in the catalogue of experiences",
   "honeymoon": [
    "Lunches (2 course) are offered in a selected restaurant",
    "1 Bottle of Sparkling Wine",
    "1 free experience offered to the couple for a"
   ],
   "valueAdds": [],
   "note": "Wedding certificate has to be produced at time of check in. 'HM/WAG' to be mentioned at time of booking"
  }
 },
 "88": {
  "code": "88",
  "name": "Sugar Beach Mauritius",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/11ea241f-ec1b-491d-b263-c6e6df208fa2.jpeg",
  "region": "Flic en Flac",
  "address": "Wolmar, Flic En Flac, Mauritius",
  "desc": "At the heart of 12 acres of tropical gardens, the luxurious Sugar Beach Resort extends along a vast white sandy beach bordered by the sparkling turquoise waters of the Indian Ocean. An idyllic setting surrounded by lush greenery and open spaces, this cool Mauritian Resort displays a colonial style blended with contemporary architecture. T",
  "inclusions": {
   "minStay": "Minimum of 4 nights stay required",
   "honeymoon": [
    "Romantic turndown on arrival day",
    "A souvenir gift for the couple",
    "Sundowner with signature cocktail; drinks and canape",
    "Romantic breakfast served in room once during stay",
    "Romantic upgraded 3-course dinner on the beach once during stay",
    "Come Alive Experience Free Dance lessons"
   ],
   "valueAdds": [],
   "note": "A wedding/Civil partnership certificate not exceeding 18 months from date of issue at time of travel must be presented upon booking/check in. Failure to produce such document will encompass guests to pay prevailing Public Rates on day of check in"
  }
 },
 "4": {
  "code": "4",
  "name": "Anelia Resort & Spa",
  "stars": 4,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/a9ac2723-3322-4f79-a74c-31ec56c18a68.jpg",
  "region": "Flic en Flac",
  "address": "Dolphins Bay, Flic En Flac, Mauritius",
  "desc": "A breath of fresh air and flare in the West Coast, Anelia Resort & Spa is a newly built 4 star beach resort with 150 rooms. Anelia, the name, epitomizes the peaceful harmonization of our multi-cultural and diverse society and takes you to a journey of discovery and fun",
  "inclusions": {
   "minStay": "Minimum 4 night stay",
   "honeymoon": [
    "1 fruit platter, 1 bottle of sparkling wine, floral decoration in room",
    "During stay: One romantic dinner (excluding drinks)"
   ],
   "valueAdds": [],
   "note": "A copy of the Wedding/Civil Partnership certificate must be sent to the Reservation department as part of the booking procedure. Wedding/Civil Partnership certificate must not exceed 12 months from date of issue at time of travel and will be required at check-in). (Offer Code: HMUSD)"
  }
 },
 "58": {
  "code": "58",
  "name": "Canonnier Beachcomber Golf Resort & Spa",
  "stars": 4,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/def5f1f0-a3e0-40cd-85d1-a549448148b8.jpg",
  "region": "Grand Baie",
  "address": "Costal Rd, Grand Baie, Mauritius",
  "desc": "Bearing testimony to the island's historical past are ruins of a lighthouse and fortress blending seamlessly into the tropical gardens. A wide variety of land and water sports is on offer. A unique feature of the resort is its Spa built in the branches of a banyan tree where therapists soothe body and mind. Guests can select the optional ",
  "inclusions": {
   "minStay": "Minimum stay of 4 nights (to choose in the catalogue of experiences",
   "honeymoon": [
    "Lunches (2 course) are offered in a selected restaurant",
    "1 Bottle of Sparkling Wine",
    "1 free experience offered to the couple for a"
   ],
   "valueAdds": [],
   "note": "Wedding certificate has to be produced at time of check in. Valid 12 months as from the wedding date. 'HM/WAG' to be mentioned at time of booking"
  }
 },
 "167": {
  "code": "167",
  "name": "Sofitel Mauritius L'Imperial Resort & Spa",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/9a3f11f0-2721-43ad-8de5-fd7d9a5f8241_b.jpg",
  "region": "Flic en Flac",
  "address": "Wolmar, Flic En Flac, Mauritius 90517",
  "desc": "Niched along the sheltered west coast of this tropical paradise, Sofitel Mauritius L'Imperial enchants all who sojourn here. It is a magical place where lush gardens spill onto sugary sand and then the placid sea - a timeless retreat graced by French art de vivre and Mauritian vivacity. We invite you to escape and discover. Swim among col",
  "inclusions": {
   "minStay": "Minimum 5 nights stay",
   "honeymoon": [
    "One SO/ Romantic breakfast in room with a complimentary glass of sparkling wine per person",
    "One SO/ Romantic Aperitif for the couple",
    "20% discount on spa treatments for slots from 10 am. to 2 pm",
    "(not applicable on rituals, packages and other promotions)",
    "A 30-minute couple massage for stays as from 7 nights and above",
    "Valid for slots from 10 am. to 2 pm",
    "(In-Room amenities once during stay): 1 bottle of sparkling wine, fruit platter with Mauritius delights upon arrival, special turdown with flower petals"
   ],
   "valueAdds": [],
   "note": "Honeymoon offer: Valid within 12 months after the wedding date. Wedding certificate or livret de famille or PACS certificate will be required"
  }
 },
 "175": {
  "code": "175",
  "name": "Trou Aux Biches Beachcomber Golf Resort & Spa",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/0a6d47ba-eb9f-4457-b33d-e94573221284_b.jpeg",
  "region": "Trou aux Biches",
  "address": "Royal Road, Trou aux Biches, Mauritius 22302",
  "desc": "THE MOST ROMANTIC HOTEL IN MAURITIUS A strip of white sandy beach, a turquoise lagoon with crystal-clear waters, a 35-hectare tropical garden...These are some of the timeless charms of Trou aux Biches Beachcomber Golf Resort & Spa, a luxury hotel in Mauritius. Its situation on the north west coast of Mauritius ensures one of the best clim",
  "inclusions": {
   "minStay": "Minimum stay of 4 nights (to choose in the catalogue of experiences",
   "honeymoon": [
    "Lunches (2 course) are offered in a selected restaurant, if booked on Half Board",
    "1 Bottle of Sparkling Wine",
    "1 free experience offered to the couple for a"
   ],
   "valueAdds": [],
   "note": "Valid 12 months as from the wedding date. Wedding certificate has to be produced at time of check in. 'HM/WAG' to be mentioned at time of booking"
  }
 },
 "5": {
  "code": "5",
  "name": "Constance Belle Mare Plage Poste De Flacq",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/5c92c897-1a03-4e06-99bf-a7d675b29b90.png",
  "region": "Belle Mare",
  "address": "Belle Mare Plage Belle Mare Poste de Flacq MU, Belle Mare",
  "desc": "Unwind. Rewind. And let it all go in this 5* ode to Mauritian radiance. Enjoy its championship golf courses enveloped by nature, whether a golfer or not. Food and wine lovers will find their heaven in the 7 restaurants and 6 bars. Do absolutely nothing. Or everything. Your choice at every turn. Whatever your idea of perfection, this chic ",
  "inclusions": {
   "minStay": "",
   "honeymoon": [
    "One bottle of sparkling wine and confectionary",
    "Special turndown decoration",
    "One gift",
    "During stay: 25% discount per pax once during stay at Constance Spa booked between 09hrs30 and 14hrs00",
    "One Candlelight dinner (excluding drinks) in one of our restaurants",
    "One cake (applicable for wedding anniversaries only)"
   ],
   "valueAdds": [],
   "note": "Stay must not be more than 12 months after date of wedding"
  }
 },
 "222": {
  "code": "222",
  "name": "The Oberoi Beach Resort, Mauritius",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/44baf916-3569-4605-85e0-9930e817e535_b.jpg",
  "region": "Trou aux Biches",
  "address": "Turtle Bay Balaclava Terre Rouge, Petite Pointe aux Piments, Mauritius Island, Mauritius, 20108",
  "desc": "Located in the Indian Ocean far off the south east coast of Africa, Mauritius is a melange of multiple ethnicities, languages and religions. It was colonised by the Dutch, French and British, who came for its natural resources; from ebony trees to vanilla, sugarcane and peppercorns. The island's capital city: Port Louis has a diverse cult",
  "inclusions": {
   "minStay": "Minimum 5 Night Stay Required",
   "honeymoon": [
    "Couples celebrating their Honeymoon, Wedding or Landmark Anniversary will receive a three course candlelit dinner for two (food only) once during the stay along with a honeymoon turndown on the second night of their stay including one bottle of wine"
   ],
   "valueAdds": [],
   "note": "Honeymoon specials are applicable for stays in a 6 months' period of the ceremony. Proof of authenticity is required upon booking. OFFER CODE: TF-NUSHM"
  }
 },
 "91": {
  "code": "91",
  "name": "Ambre Mauritius (Adult Only)",
  "stars": 4,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/9a869185-11bb-41bd-a570-9e68f717e23e.jpg",
  "region": "Belle Mare",
  "address": "Coastal Road, Palmar, Mauritius 41604",
  "desc": "Ambre Resort is an all-inclusive adult only resort located in Belle Mare, on the east coast of Mauritius. The resort is one hour away from the airport and from the capital city of Port-Louis. The resort boasts a 700-metre white natural sandy beach running along a sheltered bay. The adjacent tropical lagoon is a haven for fish and marine l",
  "inclusions": {
   "minStay": "Minimum of 4 nights stay",
   "honeymoon": [
    "Special turndown once during stay. 1 Sundowner cocktail; drinks and canape feet in the sand at Ti-Bar. 1 bottle of house wine (375ml) and fresh fruit skewer on day of arrival. Breakfast once in room during stay. 4 course candlelit dinner at the beach restaurant, La Plage, once during stay"
   ],
   "valueAdds": [],
   "note": "A wedding/Civil partnership certificate not exceeding 18 months from date of issue at time of travel must be presented upon booking/check in. Failure to produce such document will encompass guests to pay prevailing Public Rates on day of check in. \"HONEYMOON/WEDDING ANNIVERSARY SPECIAL OFFER\" must be specified on booki"
  }
 },
 "159": {
  "code": "159",
  "name": "Constance Le Chaland IKO - Mauritius",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/a33972b2-23dc-4087-83ca-c36c3bd5cfce_b.jpg",
  "region": "South Coast",
  "address": "Blue Bay Marine Park Le Chaland, Blue Bay, Mauritius 51510",
  "desc": "Immerse yourself in wellness and adventure on the fringe of Le Chaland Beach. Anantara Iko Mauritius Resort & Villas connects you with traditional Mauritian culture alongside the spectacular surrounding landscapes. Explore nature from our tranquil tropical destination and discover unique experiences on land and sea, from nature trail in t",
  "inclusions": {
   "minStay": "Minimum Stay Of 3 Nights",
   "honeymoon": [
    "In room/Villa upon arrival evening:- One bottle of sparkling wine and One welcome cake",
    "During stay:- 30 mins Spa treatment per pax once during stay at Constance Spa booked between 09hrs30 and 14hrs00",
    "One Romantic breakfast per couple once during stay",
    "One Romantic candlelight dinner (special menu) in one of our restaurants once during stay",
    "One Romantic bath and special turndown during stay"
   ],
   "valueAdds": [
    "One Free Lunch for every 3 nights stay",
    "Free flow of water during all meals",
    "Free Breakfast for early check in on arrival day"
   ],
   "note": "Stay must not be more than 12 months after date of wedding. A wedding certificate must be provided at time of booking and must be shown at check-in for both Honeymoon and Wedding Anniversaries"
  }
 },
 "270": {
  "code": "270",
  "name": "Hilton mauritius resort & spa",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/463416e8-3460-401c-986f-10325ca8ef0d_b.jpeg",
  "region": "Flic en Flac",
  "address": "Wolmar, Coastal Road MU, Flic en Flac 90503, Mauritius",
  "desc": "Our resort offers sunset views of the Indian Ocean and direct access to the beach. We have a variety of water activities available including pedalos and kayaking. We offer a kids' pool and lagoon, kids club, and babysitting services. Enjoy daily entertainment, our steam room, our poolside bars, and four restaurants offering a variety of c",
  "inclusions": {
   "minStay": "Minimum Stay of 4 Nights",
   "honeymoon": [
    "Arrival fruit platter delivered to the villa",
    "Welcome bottle of Champagne with special amenities",
    "Romantic bed decoration prior to arrival",
    "US$120 nett Amingiri Spa & Hammam credit per person per stay with a choice of 60- or 90-minutes spa treatment(s) of guest's choice (voucher will be presented upon check-in)",
    "No cash value",
    "A special departure gift from Hilton Maldives Amingiri Resort & Spa"
   ],
   "valueAdds": [
    "Welcome drinks and cold towels upon arrival at the pier",
    "Dedicated multilingual Guest Experience Makers (GEMs), throughout the stay",
    "Wifi in-villa and throughout the resort",
    "Morning service and turn down service per villa",
    "Use of bicycles during the stay",
    "Two bottles of complimentary Hilton still water per villa, per day. Replenishing of water during morning service and turndown service"
   ],
   "note": "To be eligible a copy of the wedding certificate is required at the time of booking. For couples to avail of honeymoon amenities the validity would be within eight(8) months of their wedding date"
  }
 },
 "178": {
  "code": "178",
  "name": "Victoria Beachcomber Resort & Spa",
  "stars": 4,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/054bc39e-2a3f-411b-94eb-f554c95a4269_b.jpeg",
  "region": "Trou aux Biches",
  "address": "Coastal Road, Pointe Aux Piments, Mauritius 21304",
  "desc": "A SPACIOUS BEACHSIDE RESORT IN MAURITIUS Located North-west on the coast of Mauritius, Victoria Beachcomber Resort & Spa is conveniently situated between the tourist hub of Grand Baie and Port Louis, the capital city. Facing the splendid sunsets, Victoria Beachcomber is one of the most popular family resorts in Mauritius.",
  "inclusions": {
   "minStay": "Minimum stay of 4 nights (to choose in the catalogue of experiences",
   "honeymoon": [
    "Lunches (2 course) are offered in a selected restaurant",
    "1 Bottle of Sparkling Wine",
    "1 free experience offered to the couple for a"
   ],
   "valueAdds": [],
   "note": "Wedding certificate has to be produced at time of check in. Valid 12 months as from the wedding date. 'HM/WAG' to be mentioned at time of booking"
  }
 },
 "368": {
  "code": "368",
  "name": "RIU Palace Mauritius",
  "stars": 4,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/d8ef61f1-bad2-42e3-b88a-ccc59e1e5d89_b.jpeg",
  "region": "Le Morne",
  "address": "Pointe Sud Ouest, MU, Le Morne 91202, Mauritius",
  "desc": "The Hotel Riu Palace Mauritius - Adults Only, located on Le Morne Brabant peninsula to the southwest of the island of Mauritius, offers our excellent 24-hour All-Inclusive* service so you can enjoy an unforgettable, worry-free holiday by the sea in the best company. This exclusive beachfront hotel for over 18s has over 300 rooms that are ",
  "inclusions": {
   "minStay": "",
   "honeymoon": [
    "1 bottle of wine or sparkling wine. room decoration"
   ],
   "valueAdds": [],
   "note": "offer valid up to 6 months after the wedding. Marriage certificate should be shown upon arrival)"
  }
 },
 "237": {
  "code": "237",
  "name": "Heritage Le Telfair Golf & Wellness Resort",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/9acf9469-0a69-480e-93fa-2db6ae6dcc3e_b.jpeg",
  "region": "South Coast",
  "address": "B9 Coastal Road, Bel Ombre, Mauritius",
  "desc": "Nestled respectfully amidst nature and history in the tranquility of the Bel Ombre sanctuary. Named after Charles Telfair, the acclaimed Northern Irish botanist who lived in the area in the early 19th century, and characterised by the refined grandeur of the French plantation estate architecture of that time; a combination that seamlessly",
  "inclusions": {
   "minStay": "",
   "honeymoon": [
    "Free gifts in the room upon arrival (once per stay)",
    "A Romantic candle light dinner OR a Romantic beach breakfast",
    "Exclusive Signature cake and a bottle of bubbles",
    "A Beach bag for Mrs and a Polo shirt for Mr"
   ],
   "valueAdds": [],
   "note": "Applicable for stays of 5 nights. The above amenities are applicable for 2 Adults only. A wedding certificate not older than 12 months must be shown at check-in.) Honeymoon Freebies Also applicable to same sex couples, provided that they present a legal document equivalent to a civil wedding in their country of origin."
  }
 },
 "183": {
  "code": "183",
  "name": "DINAROBIN BEACHCOMBER GOLF RESORT & SPA",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/83899e86-0554-4aaf-af4e-4f033e7872ae_b.jpeg",
  "region": "Mauritius",
  "address": "Case Noyale, Mauritius 91202",
  "desc": "THE SYMBOL OF TROPICAL ELEGANCE An elegant five-star resort in Mauritius, Dinarobin Beachcomber Golf Resort & Spa is a haven of peace and tranquility - the ideal setting for your luxury holiday in Mauritius and the perfect sanctuary to renew your body and soul. Cascading pools dotted with islets bright with flowers, spacious wooden decks,",
  "inclusions": {
   "minStay": "Minimum stay of 4 nights (to choose in the catalogue of experiences",
   "honeymoon": [
    "1 Bottle of Sparkling Wine",
    "1 free experience offered to the couple for a . For multi-property stays, the experience will be offered in each hotel, provided clients stay a minimum of 4 nights in each resort",
    "Wedding certificate has to be produced at time of check in"
   ],
   "valueAdds": [],
   "note": "Offer Code: HM/WAG. (NOTE: A copy of the Wedding/Civil Partnership certificate must be sent to the Reservation department as part of the booking procedure. Wedding/Civil Partnership certificate must not exceed 12 months from date of issue at time of travel and will be required at check-in)"
  }
 },
 "171": {
  "code": "171",
  "name": "Paradis Beachcomber Golf Resort & Spa",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/810bad84-6b2e-4e16-98b7-ccef75b42081_b.jpg",
  "region": "Le Morne",
  "address": "Case Noyale, Le Morne, Mauritius 91202",
  "desc": "THE ULTIMATE LEISURE RESORT IN MAURITIUS! If you are looking for outstanding luxury family holidays in Mauritius, look no further than Paradis Beachcomber Golf Resort & Spa. One of the finest luxury hotels in Mauritius, Paradis Beachcomber enjoys a superb location on the island's south-western tip. Situated on Le Morne peninsula, the reso",
  "inclusions": {
   "minStay": "Minimum stay of 4 nights (to choose in the catalogue of experiences",
   "honeymoon": [
    "Lunches (2 course) are offered in a selected restaurant, if booked on Half Board",
    "1 Bottle of Sparkling Wine",
    "1 free experience offered to the couple for a"
   ],
   "valueAdds": [],
   "note": "Wedding certificate has to be produced at time of check in. 'HM/WAG' to be mentioned at time of booking"
  }
 },
 "369": {
  "code": "369",
  "name": "Riu Turquoise",
  "stars": 4,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/8a0c32bf-77c9-4513-9443-1e5ce5756d50_b.jpg",
  "region": "Le Morne",
  "address": "Pointe Sud Ouest, Le Morne, Mauritius 91202",
  "desc": "The Hotel Riu Turquoise on the island of Mauritius is the perfect choice for a holiday on the heavenly beaches of the Le Morne Peninsula. With RIU's exclusive 24-hour All-Inclusive service, this hotel for families with children is ideal for an unforgettable family getaway to one of the world's most beautiful locations.",
  "inclusions": {
   "minStay": "",
   "honeymoon": [
    "1 bottle of wine or sparkling wine. room decoration"
   ],
   "valueAdds": [],
   "note": "offer valid up to 6 months after the wedding. Marriage certificate should be shown upon arrival)"
  }
 },
 "85": {
  "code": "85",
  "name": "InterContinental Resort Mauritius, an IHG Hotel",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/61e7724c-1a92-4d28-bcfd-d88e0c4aefe8.jpeg",
  "region": "Trou aux Biches",
  "address": "Balaclava Fort Coastal Road, Balaclava, Mauritius 21306",
  "desc": "Secluded within the boundaries of exclusive Balaclava Bay, on the island's northern coast, this 210-room Mauritius resort was designed to blend modern convenience with traditional Mauritius flavour. It was also created to cater to the needs of couples, families and business travellers alike. At this luxury Mauritius resort, you can choose",
  "inclusions": {
   "minStay": "Minimum 04 Nights stay required",
   "honeymoon": [
    "25% Discount on the SPA. 1 complimentary bottle of sparkling wine upon arrival 1 Romantic 4 course candle lit dinner on the beach Weather Permiting"
   ],
   "valueAdds": [
    "Welcome Breakfast Uopn Arrival (Breakfast timings: 6:30 AM to 10:30 AM)",
    "Complimentary Water Sports",
    "Kayak (On Site)",
    "Paddling (On Site)",
    "Water ski (On Site)",
    "Windsurfing (On Site)"
   ],
   "note": ""
  }
 },
 "238": {
  "code": "238",
  "name": "Veranda Grand Baie Hotel & Spa",
  "stars": 4,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/13f7649a-e56d-4d4c-9bb2-5aca2956e740_b.jpeg",
  "region": "Grand Baie",
  "address": "MU, Route Royale, Grand Baie, Mauritius",
  "desc": "This exclusive cocoon is an ode to Mauritian history, where the elaborate codes of colonial interior design, from white walls to carved woodwork meet the simple charm of creole homes and their corrugated metal sheet roofs. Out on the beach, under traditional kiosks, deck chairs invite you to comfortably settle for a day of farniente. Vera",
  "inclusions": {
   "minStay": "MINIMUM 5 NIGHTS REQUIRED",
   "honeymoon": [
    "Free gifts in the room upon arrival (once per stay): Seasonal fruits and 1 bottle of sparkling wine",
    "Romantic 3 course privatised dinner (excluding drinks) at the Beach Restaurant (weather permitting)"
   ],
   "valueAdds": [],
   "note": "A wedding certificate not older than 12 months must be shown at check-in. Also applicable to same sex couples, provided that they present a legal document equivalent to a civil wedding in their country of origin"
  }
 },
 "338": {
  "code": "338",
  "name": "Veranda Palmar Beach Hotel",
  "stars": 3,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/c0697533-ee61-4bc8-b2aa-77e8b8bd94fb_b.jpeg",
  "region": "Belle Mare",
  "address": "Coastal Road Belle Mare MU, 42210, Mauritius",
  "desc": "Welcome to Veranda Palmar Beach Hotel - All Inclusive, a stunning 3-star hotel nestled in the heart of Mauritius Island, Mauritius. With its idyllic beachfront location, this hotel offers a truly unforgettable tropical getaway. As you step into Veranda Palmar Beach Hotel, you will be greeted by warm hospitality and a serene atmosphere. Wi",
  "inclusions": {
   "minStay": "MINIMUM 5 NIGHTS REQUIRED",
   "honeymoon": [
    "Free gifts in the room upon arrival (once per stay): Seasonal fruits and a bottle of sparkling wine",
    "One upgraded dinner (set menu) either by the pool or at Horizon beach restaurant"
   ],
   "valueAdds": [],
   "note": "A wedding certificate not older than 12 months must be shown at check-in. Also applicable to same sex couples, provided that they present a legal document equivalent to a civil wedding in their country of origin. (Booking Code: VPB/USD/26-27/HWV)"
  }
 },
 "92": {
  "code": "92",
  "name": "Veranda Paul et Virginie Hotel & Spa",
  "stars": 4,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/2cb7b0b1-7adb-427d-8c2e-c6a8460c2692_b.jpeg",
  "region": "Grand Baie",
  "address": "Royal Road, Grand Gaube, Mauritius 30617",
  "desc": "Set in the picturesque village of Grand Gaube, Veranda Paul et Virginie is the new intimate and tranquil address for couples in Mauritius, designed to encourage total escapism. Tandem ride in the village, duo massage on the water, all-day breakfast in room, surprise apero and private dinner under the stars, exclusive cruise on our catamar",
  "inclusions": {
   "minStay": "FOR MINIMUM 5 NIGHTS STAY",
   "honeymoon": [
    "Free gifts in the room (once per stay): Fruit platter and 1 bottle of sparkling wine upon check-in",
    "One candlelight dinner (set menu - excluding drinks & seafood) at Saint Geran"
   ],
   "valueAdds": [],
   "note": "A wedding certificate not older than 12 months must be shown at check-in. Also applicable to same sex couples, provided that they present a legal document equivalent to a civil wedding in their country of origin.(Booking Code: VPV/USD/26-27/HWV)"
  }
 },
 "93": {
  "code": "93",
  "name": "Veranda Pointe Aux Biches Hotel",
  "stars": 4,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/72684201-b363-40b0-b7cc-49da449e341c_b.jpg",
  "region": "Trou aux Biches",
  "address": "Royal Road, Pointe Aux Piments, Mauritius 22310",
  "desc": "Are you in a quest for new experiences and a change of scenery? Are you looking for outdoor sports activities, and an immersion in nature? Or would you rather enjoy authentic experiences to discover Mauritian culture? Veranda Pointes aux Biches is THE resort for you.",
  "inclusions": {
   "minStay": "MINIMUM 5 NIGHTS REQUIRED",
   "honeymoon": [
    "Free gifts in the room upon arrival (once per stay): Seasonal fruits and 1 bottle of sparkling wine",
    "Romantic 3 course privatised set menu dinner (excluding drinks) on Sandy Lane Beach",
    "(weather permitting)",
    "Romantic touch, special turn down"
   ],
   "valueAdds": [],
   "note": "A wedding certificate not older than 12 months must be shown at check-in. Also applicable to same sex couples, provided that they present a legal document equivalent to. a civil wedding in their country of origin. (Booking Code: VPAB/USD/26-27/HWV)"
  }
 },
 "94": {
  "code": "94",
  "name": "Veranda Tamarin Hotel & Spa",
  "stars": 3,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/32dd3884-38dd-469c-968a-517376f9600a_b.jpeg",
  "region": "Flic en Flac",
  "address": "Tamarin Bay, Royal Road Tamarin MU, 90921, Mauritius",
  "desc": "Veranda Tamarin hotel invites you to enjoy the most laidback getaway to the soothing sound of waves. The hotel's unique location allows you to discover the charming village of Tamarin on foot.",
  "inclusions": {
   "minStay": "Minimum 5 Night of stay",
   "honeymoon": [
    "Free gifts in the room upon arrival(once per stay)",
    "Seasonal fruits and Sparkling wine",
    "Turn down in room",
    "One dinner by the pool (weather permitting), excluding drinks"
   ],
   "valueAdds": [],
   "note": "A wedding certificate not older than 12 months must be shown at check-in. Also applicable to same sex couples, provided that they present a legal document equivalent to a civil wedding in their country of origin. (Booking Code: VTAM/USD/26-27/HWV)"
  }
 },
 "156": {
  "code": "156",
  "name": "SO Sofitel Mauritius",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/34bfd268-e797-40a6-a329-4edf68011281_b.jpg",
  "region": "South Coast",
  "address": "Royal Road, Beau Champ, Bel Ombre, Mauritius 61008",
  "desc": "Discover the real Mauritius at SO Sofitel Mauritius, a 5-star luxury hotel on the island's pristine south coast. Discover an exclusive collection of eco-friendly rooms, suites and beach villas, architecture by Lek Bunnag and interior design by Kenzo Takada. Discover peace, intimacy, a turquoise lagoon, forests rich in flora and fauna, and",
  "inclusions": {
   "minStay": "Minimum 5 nights stay",
   "honeymoon": [
    "One SO/ Romantic breakfast in room with a complimentary glass of sparkling wine per person",
    "One SO/ Romantic Aperitif for the couple",
    "20% discount on spa treatments for slots from 10 am. to 2 pm",
    "(not applicable on rituals, packages and other promotions)",
    "A 30-minute couple massage for stays as from 7 nights and above",
    "Valid for slots from 10 am. to 2 pm",
    "(In-Room amenities once during stay): 1 bottle of sparkling wine, fruit platter with Mauritius delights upon arrival, special turdown with flower petals"
   ],
   "valueAdds": [],
   "note": "Honeymoon offer: Valid within 12 months after the wedding date. Wedding certificate or livret de famille or PACS certificate will be required"
  }
 },
 "341": {
  "code": "341",
  "name": "Heritage Awali Golf & Spa",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/86826fae-f5e5-4b69-9239-ed8be059531d_b.jpeg",
  "region": "South Coast",
  "address": "MU, Coastal Rd, Bel Ombre 61002, Mauritius",
  "desc": "Nestled on the stunning Mauritius Island in Mauritius, Heritage Awali Golf & Spa Resort - All Inclusive offers a truly unforgettable vacation experience. This 5-star hotel, built in 2005, combines luxury, comfort, and adventure, making it the perfect destination for both relaxation and exploration. With a check-out time until 12:00 PM, gu",
  "inclusions": {
   "minStay": "Minimum 5 Night of Stay",
   "honeymoon": [
    "Free gifts in the room upon arrival (once per stay): Fruit Basket, Pareo and Hat",
    "Special turndown with sparkling wine and canapes on 1st night",
    "Bubbles breakfast in room or on terrace once during stay",
    "Candle lit dinner at Infinity Blue restaurant one per stay, ** A supplement is charged for dinner in the beach kiosk and same can be booked via the Restaurant Booking Desk prior to arrival (weather permitting)"
   ],
   "valueAdds": [],
   "note": "A wedding certificate not older than 12 months must be shown at check-in. Booking Code: (HA/USD/26-27/HWV)"
  }
 },
 "191": {
  "code": "191",
  "name": "Le Jadis Beach  Resort & Wellness Mauritius",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/c0661960-cb47-4e25-b83f-056e3038218f_b.jpeg",
  "region": "Trou aux Biches",
  "address": "Baie aux Tortues, Le Goulet Rd, Balaclava, Mauritius",
  "desc": "It all began with a chance stop in Balaclava one breezy afternoon, at Baie aux Tortues, also known as Turtle Bay, on the North West coast of Mauritius. We caught sight of old ruins and remnants; an ancient wall made of cut stones and another one with arched openings, signs of an olden civilization and colonization. Our imagination ran wil",
  "inclusions": {
   "minStay": "Minimum Stay Of 3 Nights",
   "honeymoon": [
    "1 Bottle of Wine (once per stay)",
    "1 Fruit selection (once per stay)",
    "1 Breakfast in Bed in the Privacy of your Suite; or 1 Floating Breakfast in your Private Heated Pool (applicable for guests in pool suites only)",
    "1 Intimate Moment Set-Up: Romantic Bath Soak & Turndown",
    "1 Romantic Dinner for 2 by the Pool (excluding beverages)"
   ],
   "valueAdds": [],
   "note": "The Romantic Dinner for 2 (excluding beverages) will not be applicable on the following dates: 24/12, 25/12 & 31/12, 01/01, 14/02, 17/02 & 18/02, and any other dates as per the hotel. Honeymoon benefits are applicable provided that dates of travel fall within 12 months of the wedding date. A copy of the wedding certifi"
  }
 },
 "192": {
  "code": "192",
  "name": "Tamassa Bel Ombre",
  "stars": 4,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/923a4080-0410-4928-8a16-3a0e165e8c83_b.jpeg",
  "region": "South Coast",
  "address": "Coastal Road, Bel Ombre, Mauritius",
  "desc": "Set on a dazzling white beach, Tamassa Bel Ombre is surrounded by dramatic mountains and dense sugarcane fields. Edged by a postcard-perfect turquoise lagoon with the Indian Ocean as our backdrop, we're blessed with some of the best sunsets on the island. Fabulous drinking and dining experiences available any time of day -all the more enj",
  "inclusions": {
   "minStay": "",
   "honeymoon": [
    "One Honeymoon cake",
    "One \"Top-notch\" turn down, including a romantic bath and a bottle of sparkling wine with chocolate dipped fruit skewers",
    "A \"Sun-kissed\" breakfast for two feet in the sand",
    "A wish ritual at the Garden of wishes followed by a 30 minutes romantic photoshoot",
    "For clients booked on Half Board basis minimum, one romantic dinner for the couple (drinks not included and restaurant as per hotel's selection)",
    "For all stays of 4 nights minimum get one Spa credit per adult per stay : 2000MUR/stay/adult - valid at the Spa of the hotel (appointment compulsory)"
   ],
   "valueAdds": [],
   "note": "A copy of the Wedding/Civil Partnership certificate must be sent to the Reservation department as part of the booking procedure. Wedding/Civil Partnership certificate must not exceed 12 months from date of issue at time of travel and will be required at check-in. Voucher must specify \"HONEYMOON/PACS-SAME SEX COUPLE/WED"
  }
 },
 "193": {
  "code": "193",
  "name": "LUX GRAND GAUBE",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/10d4b80f-026f-4ab6-958f-fd4039a50437_b.jpg",
  "region": "Grand Baie",
  "address": "MU, Coastal Road, Grand Gaube 30617, Mauritius",
  "desc": "The totally reimagined retro-chic tropical retreat, tucked away on a peninsula bordering two coves, celebrates life in the tropics the LUX* way. The eye-catching design of Kelly Hoppen blends perfectly with the surrounding tropical greenery, and each room, suite and villa is made to feel like a home-that is, if home is having an outdoor b",
  "inclusions": {
   "minStay": "",
   "honeymoon": [
    "One tropical and tasty breakfast by the pool",
    "Plant-based Cooking Class (5* vegetarian cooking class using fresh local products)",
    "Stir up a shot of fun with a cocktail-making class and experience with our mixologist",
    "Toast to love with canapes & bubbles at the comfort of your Terrace",
    "For clients booked on Half Board basis minimum, one romantic dinner for the couple (drinks not included and restaurant as per hotel's selection)",
    "For all stays of 4 nights minimum get one Spa credit per adult per stay : 3000MUR/stay/adult - valid at the Spa of the hotel (appointment compulsory)"
   ],
   "valueAdds": [],
   "note": "A copy of the Wedding/Civil Partnership certificate must be sent to the Reservation department as part of the booking procedure. Wedding/Civil Partnership certificate must not exceed 12 months from date of issue at time of travel and will be required at check-in. BOOKING CODE: HONEYMOON/PACS-SAME SEX COUPLE/WEDDING ANN"
  }
 },
 "141": {
  "code": "141",
  "name": "Le Cardinal Exclusive Resort",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/f516d07f-a45c-4f35-b510-700429f2a491_b.jpg",
  "region": "Trou aux Biches",
  "address": "Coastal Road, Trou aux Biches, Mauritius",
  "desc": "Ideally located in the North West of Mauritius, Le Cardinal Exclusive Resort is a Boutique Hotel that offers an exclusive exotic and exhilarating atmosphere. Enjoy an all year-round pleasant climate and wide variety of tourist attractions to discover in the vicinity. All our suites offer a breathtaking view on our private beach and the tu",
  "inclusions": {
   "minStay": "Minimum 5 nights' stay - 1 fruit basket in room upon arrival",
   "honeymoon": [
    "One bottle of sparkling wine in the room upon arrival",
    "One Honeymoon dinner (excluding drinks)",
    "Two bottles of water provided in room daily"
   ],
   "valueAdds": [],
   "note": "A marriage certificate not older than 6 months will be asked upon check in"
  }
 },
 "173": {
  "code": "173",
  "name": "Royal Palm Beachcomber Luxury",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/dd031c26-7f03-454c-9985-4ae492e274a5_b.jpg",
  "region": "Grand Baie",
  "address": "Royal Road, Grand Baie, Mauritius 30512",
  "desc": "The highest standards of hospitality in a location straight from a dream, a stay at the Royal Palm Beachcomber Luxury leaves you feeling like royalty. Located on the picturesque northwest coast along a pure white sandy beach, the Royal Palm Beachcomber Luxury is a tranquil, tropical haven with an uncompromising commitment to excellence. S",
  "inclusions": {
   "minStay": "Minimum stay of 4 nights (to choose in the catalogue of experiences",
   "honeymoon": [
    "1 Bottle of Champagne",
    "1 free experience offered to the couple for a . For multi-property stays, the experience will be offered in each hotel, provided clients stay a minimum of 4 nights in each resort",
    "Wedding certificate has to be produced at time of check in"
   ],
   "valueAdds": [],
   "note": "Offer Code: HM/WAG.(NOTE: A copy of the Wedding/Civil Partnership certificate must be sent to the Reservation department as part of the booking procedure. Wedding/Civil Partnership certificate must not exceed 12 months from date of issue at time of travel and will be required at check-in)"
  }
 },
 "208": {
  "code": "208",
  "name": "Shangri-La Le Touessrok Resort & Spa, Mauritius",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/42ccfcdc-f0f1-413c-a990-b73d36b41b99_b.jpg",
  "region": "East Coast",
  "address": "Coastal Road, Trou d'Eau Douce, Mauritius Island, Mauritius, 42212",
  "desc": "Nestled on the quiet shores of Trou d'Eau Douce, Shangri-La Le Touessrok, Mauritius is a luxurious private hideaway embodying the true spirit of Mauritius. The resort offers uninterrupted views of the Indian Ocean from its exclusive accommodations and sandy white beaches at your doorstep. Discover Le Touessrok's rich history with touches ",
  "inclusions": {
   "minStay": "Minimum length of stay of 04 nights applies",
   "honeymoon": [
    "Personalize Welcome Note",
    "Welcome Amenities",
    "Bottle of champagne in the room upon arrival",
    "A special romantic room turndown (once per stay)",
    "1 hour couple massage at Chi The Spa between 10:00am - 02:00pm",
    "Departure premium gift",
    "Early Check-In and Late Check Out subject to availability"
   ],
   "valueAdds": [],
   "note": "Marriage certificate must be presented at check in and offer must be consumed within 9 months post wedding"
  }
 },
 "219": {
  "code": "219",
  "name": "SALT of Palmar an adult only boutique hotel",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/aef45aee-591e-49db-a5a0-e843635ca664_b.jpeg",
  "region": "Belle Mare",
  "address": "Coastal Road, Palmar, Palmar Coast, Mauritius Island, Mauritius",
  "desc": "SALT are beautiful hotels that give you everything you need to discover the place you are in. But also everything you need to relax, escape, and recharge.",
  "inclusions": {
   "minStay": "",
   "honeymoon": [
    "Homemade cookies with love",
    "Honeymoon decor & handmade card",
    "One 15 minutes Halotherapy at the Spa (appointment compulsory)",
    "One Sunset Aperitif Experience for 2 persons once per stay (bar as per hotel's selection)",
    "For clients booked on Half Board basis minimum, one romantic dinner for the couple (drinks not included and restaurant as per hotel's selection)",
    "For all stays of 4 nights minimum get one Spa credit per adult per stay : 2000MUR/stay/adult - valid at the Spa of the hotel (appointment compulsory)"
   ],
   "valueAdds": [],
   "note": "A copy of the Wedding/Civil Partnership certificate must be sent to the Reservation department as part of the booking procedure. Wedding/Civil Partnership certificate must not exceed 12 months from date of issue at time of travel and will be required at check-in. Voucher must specify \"HONEYMOON/PACS-SAME SEX COUPLE/WED"
  }
 },
 "235": {
  "code": "235",
  "name": "LUX LE MORNE",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/a8ec5eb7-7258-481a-9f55-5d93b4b007f1_b.jpg",
  "region": "Le Morne",
  "address": "Coastal Road, Le Morne, Mauritius",
  "desc": "Blessed with the best sunset of the island, life's a beach at LUX* Le Morne. The chic and serene boutique resort at the foot of Le Morne mountain calls all lovers of mindful luxury. The postcard beach barely needs an introduction. As for the hotel, it's a gem that not only embodies the spirit of island living- it elevates it.",
  "inclusions": {
   "minStay": "",
   "honeymoon": [
    "One tropical and tasty breakfast by the pool",
    "Plant-based Cooking Class (5* vegetarian cooking class using fresh local products)",
    "Stir up a shot of fun with a cocktail-making class and experience with our mixologist",
    "Toast to love with canapes & bubbles at the comfort of your Terrace",
    "For clients booked on Half Board basis minimum, one romantic dinner for the couple (drinks not included and restaurant as per hotel's selection)",
    "For all stays of 4 nights minimum get one Spa credit per adult per stay : 3000MUR/stay/adult - valid at the Spa of the hotel (appointment compulsory)"
   ],
   "valueAdds": [],
   "note": "A copy of the Wedding/Civil Partnership certificate must be sent to the Reservation department as part of the booking procedure. Wedding/Civil Partnership certificate must not exceed 12 months from date of issue at time of travel and will be required at check-in. BOOKING CODE: HONEYMOON/PACS-SAME SEX COUPLE/WEDDING ANN"
  }
 },
 "271": {
  "code": "271",
  "name": "Shanti Maurice Resort & Spa Mauritius",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/5c9e62b4-24af-4828-a73b-527cf9cecff8_b.jpg",
  "region": "Mauritius",
  "address": "Saint Felix, Coastal Road Mauritius",
  "desc": "We live our lives through our senses. Whether you enjoy relaxing on our soft sandy beach with a refreshing cocktail in hand as the scent of sweet sugarcane fills the air or prefer indulging in the freshest food in our restaurants, Shanti Maurice has everything covered.",
  "inclusions": {
   "minStay": "For minimum 7 nights & above only (Applicable when booked on half board basis",
   "honeymoon": [
    "Complimentary upgrade to the \"Club Level Experience\"",
    "One bottle of sparkling wine (0,75l) in Suites or one bottle of Champagne (0,75l) in all Villas upon arrival",
    "One fruit basket on arrival",
    "One couple massage for 2 persons of 45 mins once per stay at Shanti Spa (from 10:00 to 15:00hrs)",
    "One romantic candlelight dinner on the beach (or in the Wine Cellar) once per stay"
   ],
   "valueAdds": [
    "Access to Avalon Golf Estate (18 holes) with unlimited green fees, golf cart, and round-trip transfers",
    "Up to daily 5 complementary wellness sessions ( including yoga & fitness )",
    "Complimentary consultation with our in house Ayurvedic doctor, Yoga master, Fitness master"
   ],
   "note": "Valid for 18 months after the wedding date and subject to producing a copy of the wedding certificate upon booking"
  }
 },
 "272": {
  "code": "272",
  "name": "Ocean's Creek Beach Hotel",
  "stars": 4,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/4cd42daa-455d-483b-a68f-d8bf1ff739c6_b.jpg",
  "region": "Trou aux Biches",
  "address": "Coastal Road, Balaclava Bay, Port Louis, Mauritius Island, Mauritius",
  "desc": "Nestled in the sunny Northwest coast of Mauritius where long hours of sunshine await our traveler's, \"Ocean's Creek\" is a cosy 4-star hotel named after the lower reaches of the Tebeau river meeting the Indian Ocean. The hotel enjoys easy access to the sandy beaches with open views of iridescent sunsets over the teal blue bay. On either si",
  "inclusions": {
   "minStay": "Minimum length of stay required is 4 Nights",
   "honeymoon": [
    "A Special Ocean's Creek Honeymoon Gift",
    "A Romantic Dinner for 2 (once per stay, when booked on HB or AI )",
    "Ocean's Creek special Apero moment (once per stay)",
    "A Romantic Turndown (once per stay)",
    "A bottle of sparkling wine / juice (once per stay)",
    "25% discount on Massage at the shanti Wellness (Massage of 60 mins or more",
    "Massage have to be done before 14h00)"
   ],
   "valueAdds": [],
   "note": "Valid for 12 months after the wedding date and subject to producing a copy of the wedding certificate upon booking and at check-in"
  }
 },
 "344": {
  "code": "344",
  "name": "The Residence Mauritius",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/e38d1039-41e4-4efa-b4be-4fd5175c9fef_b.jpeg",
  "region": "Mauritius",
  "address": "The Residence, Coastal Road, Quatre Cocos, Mauritius",
  "desc": "The Residence Mauritius is situated on the east coast of Mauritius along a mile-long beach of immaculate white sand, fringed by the azure Indian Ocean and tropical gardens - an idyllic retreat for your unreserved relaxation. Inspired by the island's stately turn-of-the-century plantation houses, this luxury Mauritius resort blends modern ",
  "inclusions": {
   "minStay": "Minimum stay of 4 nights-Couples on their honeymoon will have an exotic fresh fruit bowl and bottle of Sparkling Wine in their room",
   "honeymoon": [
    "1 beach bag",
    "1 pareo",
    "1 t-shirt",
    "1 Table set up at The Plantation during Diner once during stay"
   ],
   "valueAdds": [],
   "note": "The offer is valid for up to 9 months after the wedding date.|A copy of the marriage certificatemust be sent to the hotel before the arrival of the guests"
  }
 },
 "202": {
  "code": "202",
  "name": "CORAL AZUR BEACH RESORT",
  "stars": 3,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/59cf6326-5eb0-4709-ad57-ff359b738f06_b.jpg",
  "region": "Trou aux Biches",
  "address": "B36, Trou-aux-Biches, Mauritius",
  "desc": "Nestling in a pretty garden a few kilometres from Trou aux Biches and Grand Bay, Mont Choisy Coral Azur overlooks a delightful beach of golden sand bordered by filao trees. A good part of its success is due to the atmosphere skilfully created by local staff, always respecting the traditional welcome, hospitality and gastronomy of the isla",
  "inclusions": {
   "minStay": "MINIMUM 7 NIGHTS STAY",
   "honeymoon": [
    "Special Attention In The Room On Arrival(Pareo, T-Shirt, Bottle Of Local Rum, Fresh Fruit Platter) , One Romantic Dinner during the stay"
   ],
   "valueAdds": [],
   "note": ""
  }
 },
 "429": {
  "code": "429",
  "name": "The Bay Club at Anahita",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/030825f8-829d-44d4-b204-63db4f3d8b8b_b.jpg",
  "region": "South Coast",
  "address": "Beau Champ, Grande Riviere Sud Est, Mauritius",
  "desc": "With two 18-hole golf courses, Anahita Golf & Spa Resort offers the ultimate golfing experience: that of having the total freedom of choice between two exceptional golf courses: Anahita & Ile aux Cerfs courses. Golf is complimentary on both courses which includes 1 green fee and 55 practice balls per personne per night.",
  "inclusions": {
   "minStay": "Minimum stay of 3 nights",
   "honeymoon": [
    "Couple duo massage (30 Min) once during stay",
    "Complimentary amenities in room upon arrival",
    "Special Turndown once during stay",
    "1 Bottle of sparkling wine",
    "Bubble Bath with petal of flowers once during stay",
    "Candle light Dinner once during stay (Reservation need to be done 48hrs in advance)",
    "Excluding Drinks"
   ],
   "valueAdds": [
    "Complimentary Benefit: Complimentary green fees valid once per stay"
   ],
   "note": "Maximum 12 months after wedding date- Wedding certificate or livret de famille or PACS certificate to be provided upon reservation"
  }
 },
 "439": {
  "code": "439",
  "name": "Pearle Beach Resort & Spa",
  "stars": 4,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/a105ecea-153b-44cc-afb4-b1583ed0871e_b.jpg",
  "region": "Flic en Flac",
  "address": "Belle Beach, Coastal Rd, Flic en Flac, Mauritius",
  "desc": "OCEANIC, a charming structure with a seating capacity of 32 people, is aptly named. Its architecture, reminiscent of an ocean liner, will make you feel as if you have left the mainland and set sail for a fantastic culinary voyage. Live a unique experience in this \"à la carte\" restaurant while the Indian Ocean undulates quietly not far fro",
  "inclusions": {
   "minStay": "",
   "honeymoon": [
    "Special Fruit Platter",
    "Sparkling wine",
    "Pareo and Tshirt as Gift in room upon arrival",
    "Special Candle Lit dinner on the beach for the Honeymoon couple",
    "25% Discount on Spa Treatment"
   ],
   "valueAdds": [
    "Special Candle Lit dinner on the beach for the Honeymoon couple",
    "25% Discount on Spa Treatment"
   ],
   "note": "Certificate to be presented to agenct-Validity 6 months"
  }
 },
 "232": {
  "code": "232",
  "name": "LUX Belle Mare",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/1e648dcc-b5d5-410f-a942-b053611df573_b.jpeg",
  "region": "Mauritius",
  "address": "Coastal Road, Mauritius",
  "desc": "There's the iconic postcard beach, the striking design in shades of sand white, coral and greens, a wild variety of dining experiences, mindful wellness… The spirit of tropical island living permeates throughout our beloved resort, calling travellers of all ages to live Life Extraordinary.",
  "inclusions": {
   "minStay": "",
   "honeymoon": [
    "One tropical and tasty breakfast by the pool",
    "Plant-based Cooking Class (5* vegetarian cooking class using fresh local products)",
    "Stir up a shot of fun with a cocktail-making class and experience with our mixologist",
    "Toast to love with canapes & bubbles at the comfort of your Terrace",
    "For clients booked on Half Board basis minimum, one romantic dinner for the couple (drinks not included and restaurant as per hotel's selection)",
    "For all stays of 4 nights minimum get one Spa credit per adult per stay : 3000MUR/stay/adult - valid at the Spa of the hotel (appointment compulsory)"
   ],
   "valueAdds": [],
   "note": "A copy of the Wedding/Civil Partnership certificate must be sent to the Reservation department as part of the booking procedure. Wedding/Civil Partnership certificate must not exceed 12 months from date of issue at time of travel and will be required at check-in.Voucher must specify \"HONEYMOON/PACS-SAME SEX COUPLE/WEDD"
  }
 },
 "56": {
  "code": "56",
  "name": "C Mauritius",
  "stars": 4,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/6cd4a8c3-1601-420a-978f-ef5740aae19b.jpg",
  "region": "Belle Mare",
  "address": "C MAURITIUS\nCoastal Road, PALMAR\nMAURITIUS",
  "desc": "Remember the simple pleasures of your childhood summers? The joy and thrill of hide-and-seek, silly dance moves and cannonballing into the swimming pool? At C Resorts, you can go back to these days again! Our unique experiences, our Cignatures will make your island holiday an unforgettable adventure. DISCOVER O",
  "inclusions": {
   "minStay": "",
   "honeymoon": [
    "In room upon arrival: One bottle of sparkling wine",
    "Bed decoration with flowers and one Gift",
    "During stay: 25% discount per pax once during stay at C Spa booked between 09hrs30 and 14hrs00",
    "One Candlelight dinner in one of our restaurants"
   ],
   "valueAdds": [],
   "note": "Stay must not be more than 12 months after date of wedding. A wedding certificate not older than 12 months must be provided at time of booking and must be shown at check-in"
  }
 },
 "218": {
  "code": "218",
  "name": "LUX GRAND BAIE",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/24730bb8-f5b9-46e3-a058-9b1182ffd07c_b.jpeg",
  "region": "Grand Baie",
  "address": "MU, Coastal Road, Grand Baie 30510, Mauritius",
  "desc": "LUX* Grand Baie, a modernist marvel seemingly dropped onto a crescent of sand on the northern shores of Mauritius, turns heads. This new generation boutique-style resort introduces travelers to the seductive, slow pace of island living. But not too slow… LUX* Grand Baie, mirroring the adjacent beach town from which it takes its name, is e",
  "inclusions": {
   "minStay": "",
   "honeymoon": [
    "One Champagne breakfast at \"Bisou\" rooftop restaurant",
    "A private couple's stretching session with your own coach/trainer",
    "High Tea at Maison LUX* with canapes, pastries, tea, and coffee",
    "Tasting of our best selection of local beverages (special and unique location as per hotel's selection)",
    "For clients booked on Half Board basis minimum, one romantic dinner for the couple (drinks not included and restaurant as per hotel's selection)",
    "For all stays of 4 nights minimum get one Spa credit per adult per stay : 4000MUR/stay/adult - valid at the Spa of the hotel (appointment compulsory)"
   ],
   "valueAdds": [],
   "note": "A copy of the Wedding/Civil Partnership certificate must be sent to the Reservation department as part of the booking procedure. Wedding/Civil Partnership certificate must not exceed 12 months from date of issue at time of travel and will be required at check-in. Voucher must specify \"HONEYMOON/PACS-SAME SEX COUPLE/WED"
  }
 },
 "8": {
  "code": "8",
  "name": "Tarisa Resort & Spa",
  "stars": 3,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/1bf462ea-26e9-45dc-b808-25269ef13b0f.jpg",
  "region": "Mauritius",
  "address": "Coastal Road-Mont Choisy , Mauritius",
  "desc": "Tarisa Resort & Spa is a fully renovated 3* SUP Hotel nestled in the north of Mauritius at Mont-Choisy facing one of the most popular sandy beach and turquoise lagoon of the island. Charming and friendly, Tarisa Resort & Spa consists of 75 rooms, 2 restaurants, a bar, a spa, a kid's club, a gym, a boat-house and conference room.",
  "inclusions": {
   "minStay": "Minimum 4 Nights stay required",
   "honeymoon": [
    "One Bottle of Sparkling wine in room",
    "Souvenir Gift in Room",
    "25 % Discount per person on Spa Treatment"
   ],
   "valueAdds": [],
   "note": "A wedding certificate not older than 12 months will be required at the check-in.)"
  }
 },
 "86": {
  "code": "86",
  "name": "Outrigger Mauritius Beach Resort",
  "stars": 5,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/a5eebcf8-0c5a-4ac7-b9c3-40281d95cc6f.jpg",
  "region": "South Coast",
  "address": "Allee des Cocotiers, Bel Ombre, Mauritius 61010",
  "desc": "Outrigger Mauritius Beach Resort offers an absolutely breathtaking beachfront location alongside the turquoise lagoons of the Indian Ocean. Nestled in the nature reserve of Bel Ombre, this stunning new deluxe property blends the needs of the most sophisticated traveller with the charm and tradition of an early 17th century Mauritian sugar",
  "inclusions": {
   "minStay": "",
   "honeymoon": [
    "A bottle of sparkling wine",
    "Special fruit amenities"
   ],
   "valueAdds": [],
   "note": "A copy of the Wedding/Civil partnership certificate must be sent to the Reservation department as part of the booking procedure. Wedding/Civil Partnership certificate must be presented and must not exceed 12 months of date of issue at time of travel and will be required at check in. Vouchers must specify Honeymoon Offe"
  }
 },
 "90": {
  "code": "90",
  "name": "La Pirogue Mauritius",
  "stars": 4,
  "img": "https://images.bingo.travel/Images/Hotel/Hero/Big/b6e2b7c8-d0f2-4cec-858e-f10b3df8633d.jpg",
  "region": "Flic en Flac",
  "address": "Wolmar, Flic En Flac, Mauritius 57100",
  "desc": "Renowned for its authenticity, La Pirogue, Mauritius is well versed in the art of Mauritian hospitality. This resort has enjoyed a solid reputation for romance and excellent service since its creation in 1976. With its warm atmosphere, wonderful beach, exquisite restaurants, lively bars, high-end Cinq Mondes Spa and the extensive recreati",
  "inclusions": {
   "minStay": "Minimum of 4 nights stay",
   "honeymoon": [
    "Special Sundowner with one bottle of sparkling wine and canapes once during the stay",
    "ONE Upgraded 3-course romantic dinner at Magenta A la carte restaurant",
    "Voucher worth of 800 MUR per couple to be spent in Van Der Stel Wine Bar once during the stay",
    "Come Alive Experience Pirogue Painting, Sega Zoomba, Dodo wish, Marsan Confit Free of charge"
   ],
   "valueAdds": [],
   "note": "HONEYMOON: A wedding/Civil partnership certificate not exceeding 18 months from date of issue at time of travel must be presented upon booking/check in. Failure to produce such document will encompass guests to pay prevailing Public Rates on day of check in. \"HONEYMOON/WEDDING ANNIVERSARY SPECIAL OFFER\" must be specifi"
  }
 }
};

// Which real hotel each itinerary uses per stay (by sheet code).
const ITINERARY_HOTELS = {
 "500": [
  "218",
  "232"
 ],
 "501": [
  "88",
  "96",
  "87"
 ],
 "502": [
  "175",
  "159"
 ],
 "503": [
  "193",
  "90",
  "235"
 ]
};

// The real hotel for a given itinerary + stay index. Falls back to the first
// hotel in the stay's region, then to any hotel, so a card always resolves.
const byRegion = (region) => Object.values(MAURITIUS_HOTELS).filter((h) => h.region === region);
export function getMauritiusHotel(itineraryId, stayIndex, city) {
  const codes = ITINERARY_HOTELS[String(itineraryId)];
  if (codes && codes[stayIndex] && MAURITIUS_HOTELS[codes[stayIndex]]) {
    return MAURITIUS_HOTELS[codes[stayIndex]];
  }
  const inRegion = byRegion(city);
  if (inRegion.length) return inRegion[stayIndex % inRegion.length];
  const all = Object.values(MAURITIUS_HOTELS);
  return all[stayIndex % all.length] || null;
}

// Look up a hotel's inclusions by name (used by booked trips, where hotels are
// stored by display name like "LUX* Grand Baie"). Matches loosely on letters.
const normName = (s) => String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
export function getMauritiusInclusionsByName(name) {
  const target = normName(name);
  if (!target) return null;
  const hit = Object.values(MAURITIUS_HOTELS).find((h) => {
    const n = normName(h.name);
    return n === target || n.includes(target) || target.includes(n);
  });
  const inc = hit?.inclusions;
  if (inc && (inc.honeymoon?.length || inc.valueAdds?.length)) return inc;
  return null;
}

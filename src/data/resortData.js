import { C, maldivesImgs, customerPhotos } from "../data";

// ─── Category Badge Colors (from spec section 6) ───
export const CATEGORY_COLORS = {
  experience_seaplane: { text: "#194185", bg: "#D1E9FF" },
  quiet_intimate: { text: "#3E1C96", bg: "#EBE9FE" },
  budget_friendly: { text: "#027A48", bg: "#ECFDF3" },
  popular_couples: { text: "#89123E", bg: "#FFE4E8" },
  indian_restaurant: { text: "#B54708", bg: "#FFFAEB" },
  ultra_luxury: { text: "#5A3A00", bg: "#FDF6D3" },
};

export const CATEGORY_META = {
  experience_seaplane: { emoji: "🛩️", label: "Experience Seaplane", subtitle: "Arrive in style" },
  quiet_intimate: { emoji: "🤫", label: "Quiet & Intimate", subtitle: "Privacy over party" },
  budget_friendly: { emoji: "💰", label: "Budget Friendly", subtitle: "Maldives without the splurge" },
  popular_couples: { emoji: "💑", label: "Popular among Indian Couples", subtitle: "Handpicked favourites from Indian honeymooners" },
  indian_restaurant: { emoji: "🍛", label: "Indian Restaurant", subtitle: "Taste of home, far from home" },
  ultra_luxury: { emoji: "💎", label: "Ultra Luxury", subtitle: "The finest overwater escapes money can book" },
};

const CDN = "https://cdn.30sundays.club/app_content";

// ─── Resort Data ───
export const resorts = [
  {
    id: "cocogiri",
    name: "Cocogiri Island Resort",
    star_rating: 4.5,
    atoll: "Vaavu Atoll",
    distance_from_airport: "1hr 10m",
    transfer_type: "speedboat",
    transfer_duration_minutes: 70,
    transfer_included: true,
    check_in_time: "14:00",
    check_out_time: "12:00",
    refundable: true,
    editorial_description: "Cocogiri is the kind of place you come to when you want the Maldives to feel real, not filtered. A compact island with just 40-odd villas, it sits in the quiet Vaavu Atoll where the reef is pristine and the crowd is nearly absent. Perfect for couples who want barefoot luxury without the performative glamour.",
    about_hotel_text: "Cocogiri Island Resort & Spa is a boutique 4.5-star resort set on a private island in the untouched Vaavu Atoll. With overwater and beach villas, world-class diving, and a house reef teeming with marine life, it offers an intimate Maldivian escape. The resort features two restaurants, a sunset bar, an overwater spa, and a PADI dive centre. It's particularly loved for its excellent snorkeling right off the jetty and its warm, personalized service.",
    categories: ["budget_friendly", "popular_couples", "indian_restaurant"],
    veg_friendly: true,
    google_rating: 4.6,
    google_rating_count: 892,
    rating_breakdown: { room: 4.7, service: 4.8, location: 4.5, food: 4.4, value: 4.6 },
    hero_image: maldivesImgs[0],
    images: [maldivesImgs[0], maldivesImgs[1], maldivesImgs[2], maldivesImgs[3], maldivesImgs[4]],
    video_url: null,
    visa_info: "Visa on arrival, Free",
    green_tax_note: "Green Tax is a mandatory country tax. All resorts charge USD 6.00 per person, per night. It's included in your total price.",
    amenities: ["Pool", "Spa", "Gym", "WiFi", "Bar", "Beach Towel", "Mini Bar", "Laundry", "Restaurant", "Dive Centre", "Snorkeling Gear", "Kayaks"],
    watersports: [
      { name: "Snorkeling Safari", image: maldivesImgs[4] },
      { name: "Banana Ride", image: maldivesImgs[5] },
      { name: "Sunset Fishing", image: maldivesImgs[6] },
      { name: "Couple Photoshoot", image: maldivesImgs[7] },
    ],
    property_highlights: [
      { name: "House Reef Snorkeling", image: maldivesImgs[8] },
      { name: "Overwater Dining", image: maldivesImgs[9] },
      { name: "Sunset Bar", image: maldivesImgs[10] },
    ],
    night_configs: [
      {
        nights: 3,
        combos: [
          { combo_id: "cocogiri-3n-1", rooms: [{ room_type: "Beach Villa", nights: 1, image: maldivesImgs[1] }, { room_type: "Water Villa", nights: 2, image: maldivesImgs[2] }], total_price: "1,24,998", per_night_price: "41,666", is_default: true },
          { combo_id: "cocogiri-3n-2", rooms: [{ room_type: "Water Villa", nights: 3, image: maldivesImgs[2] }], total_price: "1,38,498", per_night_price: "46,166", is_default: false },
        ],
      },
      {
        nights: 4,
        combos: [
          { combo_id: "cocogiri-4n-1", rooms: [{ room_type: "Beach Villa", nights: 2, image: maldivesImgs[1] }, { room_type: "Water Villa", nights: 2, image: maldivesImgs[2] }], total_price: "1,66,768", per_night_price: "41,692", is_default: true },
          { combo_id: "cocogiri-4n-2", rooms: [{ room_type: "Water Villa", nights: 4, image: maldivesImgs[2] }], total_price: "1,84,996", per_night_price: "46,249", is_default: false },
          { combo_id: "cocogiri-4n-3", rooms: [{ room_type: "Beach Villa", nights: 4, image: maldivesImgs[1] }], total_price: "1,48,540", per_night_price: "37,135", is_default: false },
        ],
      },
    ],
    meal_plans: [
      { plan_id: "fb", name: "Full Board", description: "Breakfast, lunch & dinner included", price_delta: 0, is_base: true },
      { plan_id: "fbp", name: "Full Board Plus", description: "All meals + select beverages", price_delta: 4500 },
      { plan_id: "ai", name: "All Inclusive", description: "All meals + drinks & snacks all day", price_delta: 8000 },
      { plan_id: "aip", name: "All Inclusive Premium", description: "All meals + premium drinks & mini bar", price_delta: 14000 },
    ],
    inclusions: {
      standard: ["Return speedboat transfers", "All meals as per selected plan", "Welcome drink on arrival", "Complimentary snorkeling gear", "WiFi throughout the resort", "Beach towels & sun loungers", "Access to gym & infinity pool"],
      honeymoon: ["In-villa flower decoration", "Honeymoon cake", "Sparkling wine on arrival", "Couple spa session (30 min)", "Candlelight dinner on the beach"],
      anniversary: ["Room decoration", "Anniversary cake", "Sparkling wine", "Couple photoshoot (15 min)"],
      birthday: ["Room decoration", "Birthday cake", "Complimentary dessert at dinner"],
    },
    faqs: [
      { question: "What is the check-in and check-out time?", answer: "Check-in is at 2:00 PM and check-out is at 12:00 PM noon. Early check-in and late check-out are subject to availability." },
      { question: "How do I reach Cocogiri from Malé Airport?", answer: "Cocogiri is reached by a 70-minute speedboat ride from Velana International Airport. Transfers are included in your package." },
      { question: "Is this resort suitable for honeymooners?", answer: "Absolutely! Cocogiri is one of the most popular honeymoon resorts in the Maldives. We offer special honeymoon packages with beach dinners, spa treatments, and villa decorations." },
      { question: "What dining options are available?", answer: "The resort has two restaurants, Kaage (buffet, international) and Malaafaiy (à la carte, seafood), plus a sunset bar and in-villa dining options." },
    ],
    cancellation_policy: [
      { window: "60+ days before check-in", fee: "No cancellation fee" },
      { window: "30–59 days before check-in", fee: "25% of total booking" },
      { window: "15–29 days before check-in", fee: "50% of total booking" },
      { window: "0–14 days before check-in", fee: "100% of total booking" },
    ],
  },
  {
    id: "soneva-fushi",
    name: "Soneva Fushi",
    star_rating: 5,
    atoll: "Baa Atoll",
    distance_from_airport: "30 min seaplane",
    transfer_type: "seaplane",
    transfer_duration_minutes: 30,
    transfer_included: true,
    check_in_time: "15:00",
    check_out_time: "12:00",
    refundable: true,
    editorial_description: "If there's one resort that defines what ultra-luxury in the Maldives should feel like, it's Soneva Fushi. Set on the largest island in the Baa Atoll, a UNESCO Biosphere Reserve, it's where barefoot luxury was literally invented. This is the Maldives for people who've already done the Maldives.",
    about_hotel_text: "Soneva Fushi is a legendary 5-star resort in the Baa Atoll UNESCO Biosphere Reserve. Famous for its 'no shoes, no news' philosophy, it offers spacious jungle and beachfront villas with private pools. Highlights include an open-air cinema, observatory, chocolate room, ice cream parlour, and a 1.4km sandbank. The house reef features manta rays during season.",
    categories: ["experience_seaplane", "quiet_intimate", "ultra_luxury"],
    veg_friendly: false,
    google_rating: 4.8,
    google_rating_count: 1243,
    rating_breakdown: { room: 4.9, service: 4.9, location: 4.8, food: 4.7, value: 4.3 },
    hero_image: maldivesImgs[3],
    images: [maldivesImgs[3], maldivesImgs[4], maldivesImgs[5], maldivesImgs[6], maldivesImgs[7]],
    video_url: null,
    visa_info: "Visa on arrival, Free",
    green_tax_note: "Green Tax is a mandatory country tax. All resorts charge USD 6.00 per person, per night. It's included in your total price.",
    amenities: ["Private Pool", "Spa", "Gym", "WiFi", "Bar", "Observatory", "Cinema", "Chocolate Room", "Ice Cream Parlour", "Dive Centre", "Library", "Tennis Court"],
    watersports: [
      { name: "Manta Snorkeling", image: maldivesImgs[8] },
      { name: "Diving", image: maldivesImgs[9] },
      { name: "Sandbank Escape", image: maldivesImgs[10] },
      { name: "Dolphin Cruise", image: maldivesImgs[11] },
    ],
    property_highlights: [
      { name: "Open-Air Cinema", image: maldivesImgs[12] },
      { name: "Observatory Stargazing", image: maldivesImgs[13] },
      { name: "1.4km Sandbank", image: maldivesImgs[14] },
    ],
    night_configs: [
      {
        nights: 3,
        combos: [
          { combo_id: "soneva-3n-1", rooms: [{ room_type: "Beach Villa with Pool", nights: 1, image: maldivesImgs[4] }, { room_type: "Water Villa", nights: 2, image: maldivesImgs[5] }], total_price: "2,85,000", per_night_price: "95,000", is_default: true },
          { combo_id: "soneva-3n-2", rooms: [{ room_type: "Jungle Reserve", nights: 3, image: maldivesImgs[6] }], total_price: "3,45,000", per_night_price: "1,15,000", is_default: false },
        ],
      },
      {
        nights: 4,
        combos: [
          { combo_id: "soneva-4n-1", rooms: [{ room_type: "Beach Villa with Pool", nights: 2, image: maldivesImgs[4] }, { room_type: "Water Villa", nights: 2, image: maldivesImgs[5] }], total_price: "3,80,000", per_night_price: "95,000", is_default: true },
          { combo_id: "soneva-4n-2", rooms: [{ room_type: "Jungle Reserve", nights: 4, image: maldivesImgs[6] }], total_price: "4,60,000", per_night_price: "1,15,000", is_default: false },
        ],
      },
    ],
    meal_plans: [
      { plan_id: "fb", name: "Full Board", description: "Breakfast, lunch & dinner included", price_delta: 0, is_base: true },
      { plan_id: "ai", name: "All Inclusive", description: "All meals + drinks & snacks all day", price_delta: 18000 },
      { plan_id: "aip", name: "All Inclusive Premium", description: "All meals + premium drinks & mini bar", price_delta: 32000 },
    ],
    inclusions: {
      standard: ["Return seaplane transfers", "All meals as per selected plan", "Welcome champagne on arrival", "Complimentary bicycles", "WiFi throughout the resort", "Open-air cinema", "Observatory access", "Ice cream parlour & chocolate room"],
      honeymoon: ["Overwater villa decoration with flowers", "Honeymoon cake & champagne", "Couple spa ritual (60 min)", "Private sandbank dinner", "Stargazing session for two"],
      anniversary: ["Villa decoration", "Anniversary cake & wine", "Couple photoshoot (30 min)", "Sunset cruise for two"],
    },
    faqs: [
      { question: "What is the check-in and check-out time?", answer: "Check-in is at 3:00 PM and check-out is at 12:00 PM noon." },
      { question: "How do I reach Soneva Fushi?", answer: "A scenic 30-minute seaplane ride from Velana International Airport. Seaplane operates during daylight hours only, if you arrive after dark, an overnight stay in Malé may be needed." },
      { question: "What makes Soneva Fushi special?", answer: "Soneva Fushi pioneered the 'no shoes, no news' concept. Set in a UNESCO Biosphere Reserve, it offers an unmatched combination of eco-luxury, privacy, and unique experiences like an observatory and open-air cinema." },
      { question: "Is the resort suitable for vegetarians?", answer: "While not exclusively vegetarian, all restaurants offer extensive vegetarian and vegan menus. The chefs can customize any meal to dietary preferences." },
    ],
    cancellation_policy: [
      { window: "60+ days before check-in", fee: "No cancellation fee" },
      { window: "30–59 days before check-in", fee: "25% of total booking" },
      { window: "15–29 days before check-in", fee: "50% of total booking" },
      { window: "0–14 days before check-in", fee: "100% of total booking" },
    ],
  },
  {
    id: "ozen-life-maadhoo",
    name: "OZEN LIFE MAADHOO",
    star_rating: 5,
    atoll: "South Malé Atoll",
    distance_from_airport: "35 min speedboat",
    transfer_type: "speedboat",
    transfer_duration_minutes: 35,
    transfer_included: true,
    check_in_time: "14:00",
    check_out_time: "12:00",
    refundable: true,
    editorial_description: "OZEN is what happens when you take the Maldives' best all-inclusive concept and execute it flawlessly. Everything, from underwater dining at M6m to the Spa by Clarins, is included. No bill anxiety, no mental math. Just pure holiday. Ideal for couples who want premium without the premium stress.",
    about_hotel_text: "OZEN LIFE MAADHOO is a luxury all-inclusive resort in South Malé Atoll. Its signature INDULGENCE plan includes all meals across 4 restaurants (including the underwater M6m), premium beverages, spa treatments, excursions, and more. Featuring both Earth and Wind villas (beach and overwater), it offers one of the most complete luxury experiences in the Maldives.",
    categories: ["popular_couples", "budget_friendly", "indian_restaurant", "ultra_luxury"],
    veg_friendly: true,
    google_rating: 4.7,
    google_rating_count: 1567,
    rating_breakdown: { room: 4.8, service: 4.7, location: 4.7, food: 4.8, value: 4.5 },
    hero_image: maldivesImgs[6],
    images: [maldivesImgs[6], maldivesImgs[7], maldivesImgs[8], maldivesImgs[9], maldivesImgs[10]],
    video_url: null,
    visa_info: "Visa on arrival, Free",
    green_tax_note: "Green Tax is a mandatory country tax. All resorts charge USD 6.00 per person, per night. It's included in your total price.",
    amenities: ["Pool", "Spa by Clarins", "Gym", "WiFi", "Bar", "Underwater Restaurant", "Mini Bar", "Laundry", "4 Restaurants", "Dive Centre", "Water Sports Centre"],
    watersports: [
      { name: "Diving", image: maldivesImgs[11] },
      { name: "Parasailing", image: maldivesImgs[12] },
      { name: "Jet Ski", image: maldivesImgs[13] },
      { name: "Sandbank Picnic", image: maldivesImgs[14] },
    ],
    property_highlights: [
      { name: "M6m Underwater Restaurant", image: maldivesImgs[0] },
      { name: "Spa by Clarins", image: maldivesImgs[1] },
      { name: "Infinity Pool", image: maldivesImgs[2] },
    ],
    night_configs: [
      {
        nights: 3,
        combos: [
          { combo_id: "ozen-3n-1", rooms: [{ room_type: "Earth Villa with Pool", nights: 1, image: maldivesImgs[7] }, { room_type: "Wind Villa with Pool", nights: 2, image: maldivesImgs[8] }], total_price: "2,10,000", per_night_price: "70,000", is_default: true },
          { combo_id: "ozen-3n-2", rooms: [{ room_type: "Wind Villa with Pool", nights: 3, image: maldivesImgs[8] }], total_price: "2,40,000", per_night_price: "80,000", is_default: false },
        ],
      },
      {
        nights: 4,
        combos: [
          { combo_id: "ozen-4n-1", rooms: [{ room_type: "Earth Villa with Pool", nights: 2, image: maldivesImgs[7] }, { room_type: "Wind Villa with Pool", nights: 2, image: maldivesImgs[8] }], total_price: "2,80,000", per_night_price: "70,000", is_default: true },
          { combo_id: "ozen-4n-2", rooms: [{ room_type: "Wind Villa with Pool", nights: 4, image: maldivesImgs[8] }], total_price: "3,20,000", per_night_price: "80,000", is_default: false },
          { combo_id: "ozen-4n-3", rooms: [{ room_type: "Earth Villa with Pool", nights: 4, image: maldivesImgs[7] }], total_price: "2,40,000", per_night_price: "60,000", is_default: false },
        ],
      },
    ],
    meal_plans: [
      { plan_id: "ai", name: "All Inclusive (INDULGENCE)", description: "All meals + premium drinks + spa + excursions", price_delta: 0, is_base: true },
      { plan_id: "aip", name: "INDULGENCE Plus", description: "INDULGENCE + upgraded room service & premium wines", price_delta: 12000 },
    ],
    inclusions: {
      standard: ["Return speedboat transfers", "INDULGENCE all-inclusive plan", "Unlimited dining across 4 restaurants", "Premium beverages all day", "One spa treatment per person", "One excursion per person", "WiFi & mini bar", "Snorkeling gear & non-motorized water sports"],
      honeymoon: ["Overwater villa floral decoration", "Honeymoon cake", "Champagne on arrival", "Couple spa session (45 min)", "Candlelight dinner at M6m underwater restaurant"],
      anniversary: ["Villa decoration", "Anniversary cake & champagne", "Sunset dolphin cruise for two"],
    },
    faqs: [
      { question: "What is included in the INDULGENCE plan?", answer: "Everything: all meals across 4 restaurants, premium beverages, one spa treatment per stay, one excursion, snorkeling gear, non-motorized water sports, and more." },
      { question: "How do I reach OZEN LIFE MAADHOO?", answer: "A quick 35-minute speedboat ride from Velana International Airport. Transfers operate at all hours." },
      { question: "What is M6m?", answer: "M6m is the resort's signature underwater restaurant, located 6 meters below sea level. It serves fine dining surrounded by ocean life, an unforgettable experience included in your INDULGENCE plan." },
    ],
    cancellation_policy: [
      { window: "60+ days before check-in", fee: "No cancellation fee" },
      { window: "30–59 days before check-in", fee: "25% of total booking" },
      { window: "15–29 days before check-in", fee: "50% of total booking" },
      { window: "0–14 days before check-in", fee: "100% of total booking" },
    ],
  },
  {
    id: "st-regis",
    name: "The St. Regis Maldives",
    star_rating: 5,
    atoll: "Dhaalu Atoll",
    distance_from_airport: "45 min seaplane",
    transfer_type: "seaplane",
    transfer_duration_minutes: 45,
    transfer_included: true,
    check_in_time: "15:00",
    check_out_time: "12:00",
    refundable: true,
    editorial_description: "The St. Regis is for couples who want the Maldives dialled up to its absolute maximum. Butler service, whale shark excursions in the Dhaalu Atoll, the Iridium Spa, Blue Hole bar, every touchpoint is unapologetically premium. If budget is not the constraint and experience is, this is your answer.",
    about_hotel_text: "The St. Regis Maldives Vommuli Resort is a landmark of ultra-luxury in the Dhaalu Atoll. Every villa comes with a private pool and dedicated butler. The resort's architecture is inspired by marine life, the Whale Bar is shaped like a whale and the Iridium Spa like a jellyfish. With a world-class dive centre, tennis courts, and exceptional dining, it's the pinnacle of Maldivian hospitality.",
    categories: ["experience_seaplane", "quiet_intimate", "popular_couples", "ultra_luxury"],
    veg_friendly: false,
    google_rating: 4.9,
    google_rating_count: 978,
    rating_breakdown: { room: 4.9, service: 5.0, location: 4.8, food: 4.8, value: 4.4 },
    hero_image: maldivesImgs[9],
    images: [maldivesImgs[9], maldivesImgs[10], maldivesImgs[11], maldivesImgs[12], maldivesImgs[13]],
    video_url: null,
    visa_info: "Visa on arrival, Free",
    green_tax_note: "Green Tax is a mandatory country tax. All resorts charge USD 6.00 per person, per night. It's included in your total price.",
    amenities: ["Private Pool", "Butler Service", "Iridium Spa", "Gym", "WiFi", "Whale Bar", "Tennis Court", "Library", "Dive Centre", "Kids Club", "Yoga Pavilion"],
    watersports: [
      { name: "Whale Shark Safari", image: maldivesImgs[0] },
      { name: "Diving", image: maldivesImgs[1] },
      { name: "Sunset Cruise", image: maldivesImgs[2] },
      { name: "Kayaking", image: maldivesImgs[3] },
    ],
    property_highlights: [
      { name: "The Whale Bar", image: maldivesImgs[4] },
      { name: "Iridium Spa", image: maldivesImgs[5] },
      { name: "Butler Service", image: maldivesImgs[6] },
    ],
    night_configs: [
      {
        nights: 3,
        combos: [
          { combo_id: "stregis-3n-1", rooms: [{ room_type: "Garden Villa with Pool", nights: 1, image: maldivesImgs[10] }, { room_type: "Overwater Villa with Pool", nights: 2, image: maldivesImgs[11] }], total_price: "4,20,000", per_night_price: "1,40,000", is_default: true },
        ],
      },
      {
        nights: 4,
        combos: [
          { combo_id: "stregis-4n-1", rooms: [{ room_type: "Garden Villa with Pool", nights: 2, image: maldivesImgs[10] }, { room_type: "Overwater Villa with Pool", nights: 2, image: maldivesImgs[11] }], total_price: "5,60,000", per_night_price: "1,40,000", is_default: true },
          { combo_id: "stregis-4n-2", rooms: [{ room_type: "Overwater Villa with Pool", nights: 4, image: maldivesImgs[11] }], total_price: "6,40,000", per_night_price: "1,60,000", is_default: false },
        ],
      },
    ],
    meal_plans: [
      { plan_id: "hb", name: "Half Board", description: "Breakfast & dinner only", price_delta: 0, is_base: true },
      { plan_id: "fb", name: "Full Board", description: "Breakfast, lunch & dinner included", price_delta: 8000 },
      { plan_id: "ai", name: "All Inclusive", description: "All meals + drinks & snacks all day", price_delta: 22000 },
    ],
    inclusions: {
      standard: ["Return seaplane transfers", "All meals as per selected plan", "Dedicated butler service", "Welcome amenities", "WiFi throughout the resort", "Non-motorized water sports", "Access to gym & yoga pavilion"],
      honeymoon: ["Romantic villa setup with roses & candles", "Champagne & chocolate on arrival", "Couple spa journey (90 min)", "Private overwater dinner", "Sunrise breakfast in-villa"],
      anniversary: ["Villa decoration", "Anniversary cake & Moët", "Couple photoshoot (45 min)", "Private sunset cruise"],
      birthday: ["Villa decoration with balloons", "Custom birthday cake", "Complimentary bottle of wine at dinner"],
    },
    faqs: [
      { question: "What is butler service?", answer: "Every villa at The St. Regis comes with a dedicated butler available 24/7. They handle everything from unpacking to restaurant reservations, activity bookings, and personalized experiences." },
      { question: "How do I reach The St. Regis?", answer: "A scenic 45-minute seaplane flight from Velana International Airport. Seaplanes operate only during daylight hours." },
      { question: "Is this resort good for a proposal?", answer: "The St. Regis is one of the top proposal destinations in the Maldives. Your butler can arrange everything, from a private sandbank setup to underwater proposals. Just let us know." },
    ],
    cancellation_policy: [
      { window: "60+ days before check-in", fee: "No cancellation fee" },
      { window: "30–59 days before check-in", fee: "30% of total booking" },
      { window: "15–29 days before check-in", fee: "50% of total booking" },
      { window: "0–14 days before check-in", fee: "100% of total booking" },
    ],
  },
  {
    id: "centara-grand",
    name: "Centara Grand Island Resort",
    star_rating: 4,
    atoll: "South Ari Atoll",
    distance_from_airport: "25 min seaplane",
    transfer_type: "seaplane",
    transfer_duration_minutes: 25,
    transfer_included: true,
    check_in_time: "14:00",
    check_out_time: "12:00",
    refundable: true,
    editorial_description: "Centara Grand is the sweet spot, premium enough to feel special, inclusive enough to not worry about the bill. Sitting in the whale shark corridor of South Ari Atoll, it delivers some of the best marine encounters in the Maldives at a price point that feels fair. Great for first-time Maldives visitors.",
    about_hotel_text: "Centara Grand Island Resort & Spa sits on one of the largest resort islands in South Ari Atoll. The lush island features 112 villas (beachfront and overwater), a SPA Cenvaree, two pools, and an all-inclusive concept that covers most activities. Its location in the South Ari whale shark corridor makes it a top choice for marine life enthusiasts.",
    categories: ["experience_seaplane", "budget_friendly", "indian_restaurant"],
    veg_friendly: true,
    google_rating: 4.5,
    google_rating_count: 2134,
    rating_breakdown: { room: 4.5, service: 4.6, location: 4.7, food: 4.4, value: 4.6 },
    hero_image: maldivesImgs[12],
    images: [maldivesImgs[12], maldivesImgs[13], maldivesImgs[14], maldivesImgs[0], maldivesImgs[1]],
    video_url: null,
    visa_info: "Visa on arrival, Free",
    green_tax_note: "Green Tax is a mandatory country tax. All resorts charge USD 6.00 per person, per night. It's included in your total price.",
    amenities: ["Pool", "SPA Cenvaree", "Gym", "WiFi", "Bar", "Kids Club", "Mini Bar", "Laundry", "3 Restaurants", "Dive Centre", "Tennis Court", "Games Room"],
    watersports: [
      { name: "Whale Shark Tour", image: maldivesImgs[2] },
      { name: "Diving", image: maldivesImgs[3] },
      { name: "Banana Ride", image: maldivesImgs[4] },
      { name: "Glass Bottom Boat", image: maldivesImgs[5] },
    ],
    property_highlights: [
      { name: "Whale Shark Corridor", image: maldivesImgs[6] },
      { name: "Lush Island Walks", image: maldivesImgs[7] },
      { name: "Overwater Spa", image: maldivesImgs[8] },
    ],
    night_configs: [
      {
        nights: 3,
        combos: [
          { combo_id: "centara-3n-1", rooms: [{ room_type: "Beach Suite", nights: 1, image: maldivesImgs[13] }, { room_type: "Overwater Suite", nights: 2, image: maldivesImgs[14] }], total_price: "1,65,000", per_night_price: "55,000", is_default: true },
          { combo_id: "centara-3n-2", rooms: [{ room_type: "Overwater Suite", nights: 3, image: maldivesImgs[14] }], total_price: "1,89,000", per_night_price: "63,000", is_default: false },
        ],
      },
      {
        nights: 4,
        combos: [
          { combo_id: "centara-4n-1", rooms: [{ room_type: "Beach Suite", nights: 2, image: maldivesImgs[13] }, { room_type: "Overwater Suite", nights: 2, image: maldivesImgs[14] }], total_price: "2,20,000", per_night_price: "55,000", is_default: true },
          { combo_id: "centara-4n-2", rooms: [{ room_type: "Overwater Suite", nights: 4, image: maldivesImgs[14] }], total_price: "2,52,000", per_night_price: "63,000", is_default: false },
          { combo_id: "centara-4n-3", rooms: [{ room_type: "Beach Suite", nights: 4, image: maldivesImgs[13] }], total_price: "1,88,000", per_night_price: "47,000", is_default: false },
        ],
      },
    ],
    meal_plans: [
      { plan_id: "fb", name: "Full Board", description: "Breakfast, lunch & dinner included", price_delta: 0, is_base: true },
      { plan_id: "ai", name: "All Inclusive", description: "All meals + drinks & snacks all day", price_delta: 6000 },
      { plan_id: "aip", name: "All Inclusive Premium", description: "All meals + premium drinks & mini bar", price_delta: 11000 },
    ],
    inclusions: {
      standard: ["Return seaplane transfers", "All meals as per selected plan", "Welcome drink on arrival", "Complimentary snorkeling gear", "WiFi throughout the resort", "Non-motorized water sports", "Access to pools, gym & tennis"],
      honeymoon: ["Villa flower decoration", "Honeymoon cake", "Sparkling wine on arrival", "Couple spa session (30 min)", "Candlelight dinner on the beach"],
      anniversary: ["Room decoration", "Anniversary cake", "Champagne", "Sunset cruise for two"],
    },
    faqs: [
      { question: "What is the check-in and check-out time?", answer: "Check-in is at 2:00 PM and check-out is at 12:00 PM." },
      { question: "Can I see whale sharks here?", answer: "Yes! Centara Grand is in the South Ari whale shark corridor. Whale shark excursions run year-round, with the best sightings from November to April." },
      { question: "Is this resort vegetarian friendly?", answer: "Yes, the resort offers extensive vegetarian options across all three restaurants. The chef can customize meals for dietary requirements." },
    ],
    cancellation_policy: [
      { window: "60+ days before check-in", fee: "No cancellation fee" },
      { window: "30–59 days before check-in", fee: "25% of total booking" },
      { window: "15–29 days before check-in", fee: "50% of total booking" },
      { window: "0–14 days before check-in", fee: "100% of total booking" },
    ],
  },
  {
    id: "anantara-veli",
    name: "Anantara Veli",
    star_rating: 4.5,
    atoll: "South Malé Atoll",
    distance_from_airport: "30 min speedboat",
    transfer_type: "speedboat",
    transfer_duration_minutes: 30,
    transfer_included: true,
    check_in_time: "14:00",
    check_out_time: "12:00",
    refundable: true,
    editorial_description: "Anantara Veli is the adults-only sibling of the larger Anantara Dhigu, same atoll, same reef, but quieter and more refined. It's the resort 30 Sundays recommends most often for honeymooners who want premium without ultra-luxury pricing. The overwater villas here are some of the best-value in the Maldives.",
    about_hotel_text: "Anantara Veli Maldives Resort is an adults-only retreat on a private island in South Malé Atoll. Connected by a bridge to sister resort Anantara Dhigu, it offers access to both properties' facilities while maintaining its own tranquil, couples-focused atmosphere. The resort features overwater bungalows, a world-class spa, and direct house reef access.",
    categories: ["quiet_intimate", "popular_couples", "budget_friendly", "indian_restaurant"],
    veg_friendly: true,
    google_rating: 4.6,
    google_rating_count: 1456,
    rating_breakdown: { room: 4.7, service: 4.7, location: 4.6, food: 4.5, value: 4.7 },
    hero_image: maldivesImgs[14],
    images: [maldivesImgs[14], maldivesImgs[0], maldivesImgs[1], maldivesImgs[2], maldivesImgs[3]],
    video_url: null,
    visa_info: "Visa on arrival, Free",
    green_tax_note: "Green Tax is a mandatory country tax. All resorts charge USD 6.00 per person, per night. It's included in your total price.",
    amenities: ["Pool", "Anantara Spa", "Gym", "WiFi", "Bar", "Adults Only", "Mini Bar", "Laundry", "2 Restaurants", "Dive Centre", "House Reef Access"],
    watersports: [
      { name: "Snorkeling Safari", image: maldivesImgs[4] },
      { name: "Diving", image: maldivesImgs[5] },
      { name: "Sunset Fishing", image: maldivesImgs[6] },
      { name: "Couple Photoshoot", image: maldivesImgs[7] },
    ],
    property_highlights: [
      { name: "Adults-Only Island", image: maldivesImgs[8] },
      { name: "House Reef Snorkeling", image: maldivesImgs[9] },
      { name: "Anantara Spa", image: maldivesImgs[10] },
    ],
    night_configs: [
      {
        nights: 3,
        combos: [
          { combo_id: "veli-3n-1", rooms: [{ room_type: "Deluxe Overwater Bungalow", nights: 3, image: maldivesImgs[0] }], total_price: "1,35,000", per_night_price: "45,000", is_default: true },
          { combo_id: "veli-3n-2", rooms: [{ room_type: "Overwater Pool Bungalow", nights: 3, image: maldivesImgs[1] }], total_price: "1,62,000", per_night_price: "54,000", is_default: false },
        ],
      },
      {
        nights: 4,
        combos: [
          { combo_id: "veli-4n-1", rooms: [{ room_type: "Deluxe Overwater Bungalow", nights: 2, image: maldivesImgs[0] }, { room_type: "Overwater Pool Bungalow", nights: 2, image: maldivesImgs[1] }], total_price: "1,98,000", per_night_price: "49,500", is_default: true },
          { combo_id: "veli-4n-2", rooms: [{ room_type: "Overwater Pool Bungalow", nights: 4, image: maldivesImgs[1] }], total_price: "2,16,000", per_night_price: "54,000", is_default: false },
          { combo_id: "veli-4n-3", rooms: [{ room_type: "Deluxe Overwater Bungalow", nights: 4, image: maldivesImgs[0] }], total_price: "1,80,000", per_night_price: "45,000", is_default: false },
        ],
      },
    ],
    meal_plans: [
      { plan_id: "hb", name: "Half Board", description: "Breakfast & dinner only", price_delta: 0, is_base: true },
      { plan_id: "fb", name: "Full Board", description: "Breakfast, lunch & dinner included", price_delta: 3500 },
      { plan_id: "ai", name: "All Inclusive", description: "All meals + drinks & snacks all day", price_delta: 9000 },
      { plan_id: "aip", name: "All Inclusive Premium", description: "All meals + premium drinks & mini bar", price_delta: 15000 },
    ],
    inclusions: {
      standard: ["Return speedboat transfers", "All meals as per selected plan", "Welcome drink on arrival", "Complimentary snorkeling gear", "WiFi throughout the resort", "Access to Dhigu sister resort", "Non-motorized water sports"],
      honeymoon: ["Villa decoration with flowers & candles", "Honeymoon cake", "Sparkling wine on arrival", "Couple spa treatment (45 min)", "Candlelight beach dinner"],
      anniversary: ["Villa decoration", "Anniversary cake & wine", "Couple photoshoot (20 min)"],
      birthday: ["Villa decoration", "Birthday cake", "Complimentary cocktails at dinner"],
    },
    faqs: [
      { question: "Is Anantara Veli adults only?", answer: "Yes, Anantara Veli is exclusively for adults (18+). For families, the sister resort Anantara Dhigu is connected by a bridge and welcomes children." },
      { question: "How do I reach Anantara Veli?", answer: "A 30-minute speedboat ride from Velana International Airport. Transfers operate at all hours." },
      { question: "Can I use the facilities at Anantara Dhigu?", answer: "Yes! Anantara Veli and Dhigu are connected by a bridge. You can freely access Dhigu's restaurants, spa, and beach areas while staying at Veli." },
    ],
    cancellation_policy: [
      { window: "60+ days before check-in", fee: "No cancellation fee" },
      { window: "30–59 days before check-in", fee: "25% of total booking" },
      { window: "15–29 days before check-in", fee: "50% of total booking" },
      { window: "0–14 days before check-in", fee: "100% of total booking" },
    ],
  },
];

// ─── Helper functions ───

export function getResortsByCategory(category) {
  return resorts.filter(r => r.categories.includes(category));
}

export function getResortById(id) {
  return resorts.find(r => r.id === id);
}

export function getDefaultCombo(resort, nights) {
  const config = resort.night_configs.find(c => c.nights === nights);
  if (!config) return null;
  return config.combos.find(c => c.is_default) || config.combos[0];
}

export function getRoomSplitLabel(combo) {
  return combo.rooms.map(r => `${r.nights}N ${r.room_type}`).join(" · ");
}

export function getStartingPrice(resort) {
  // Return lowest price across all configs
  let min = null;
  for (const config of resort.night_configs) {
    for (const combo of config.combos) {
      const numPrice = parseInt(combo.total_price.replace(/,/g, ""));
      if (min === null || numPrice < min) min = numPrice;
    }
  }
  if (min === null) return null;
  return min.toLocaleString("en-IN");
}

// Maldives customer photos for reviews section
export const maldivesCustomerPhotos = customerPhotos.Maldives || [];

// ─── Mock Trip Data for My Trips ───
const CDN = "https://cdn.30sundays.club/app_content";

// Helper to add/subtract days from today
const addDays = (d, n) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};
const fmt = (d) => d.toISOString().split("T")[0];
const fmtDisplay = (d) => d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const today = new Date();

export const mockTrips = [
  // ── Trip 1: Upcoming Thailand (starts in ~39 days) ──
  {
    id: "trip-1",
    tripName: "Rahul's Thailand Trip",
    destination: "Thailand",
    emoji: "🌴",
    status: "upcoming",
    startDate: fmt(addDays(today, 39)),
    endDate: fmt(addDays(today, 46)),
    startDateDisplay: fmtDisplay(addDays(today, 39)),
    endDateDisplay: fmtDisplay(addDays(today, 46)),
    nightsBreakdown: "3N Phuket • 2N Krabi • 2N Bangkok",
    totalNights: 7,
    heroImages: [
      `${CDN}/thailand/pileh_lagoon_439.jpg`,
      `${CDN}/thailand/big_buddha_temple_koh_samui_459.jpg`,
      `${CDN}/thailand/long_beach_koh_phi_phi_468.jpg`,
    ],
    totalPackageValue: 324000,
    amountPaid: 160000,
    installments: [
      { id: 1, label: "Installment 1", date: "Mar 22, 2026", amount: 80000, status: "paid" },
      { id: 2, label: "Installment 2", date: "Mar 28, 2026", amount: 80000, status: "paid" },
      { id: 3, label: "Installment 3", date: "Apr 09, 2026", amount: 82000, status: "due" },
      { id: 4, label: "Installment 4", date: "Apr 20, 2026", amount: 82000, status: "pending" },
    ],
    documents: {
      itineraryPdf: "#",
      paymentReceipts: [{ id: 1, label: "Receipt #1", url: "#" }],
      travelerDocuments: [],
    },
    leadTraveler: { name: "Rahul Sharma", phone: "+91 98765 43210", role: "Lead traveler" },
    coTravelers: [{ name: "Priya Sharma", phone: "+91 98765 43211", role: "Co-traveler" }],
    consultant: { name: "Riya Shah", phone: "+919876500011" },
    addOns: {
      visa: { purchased: true, documentUrl: null },
      insurance: { purchased: false },
      forex: { enabled: true },
    },
    itineraryDays: [
      { day: 1, city: "Phuket", activities: ["Arrive in Phuket", "Check-in at Andakira Hotel", "Patong Beach sunset walk"] },
      { day: 2, city: "Phuket", activities: ["Phi Phi Island day trip", "Snorkeling at Maya Bay", "Seafood dinner at Banzaan Market"] },
      { day: 3, city: "Phuket", activities: ["Big Buddha visit", "Old Phuket Town walking tour", "Thai cooking class"] },
      { day: 4, city: "Krabi", activities: ["Transfer to Krabi", "Railay Beach exploration", "Rock climbing intro session"] },
      { day: 5, city: "Krabi", activities: ["4 Islands tour by longtail boat", "Emerald Pool & Hot Springs", "Night market shopping"] },
      { day: 6, city: "Bangkok", activities: ["Fly to Bangkok", "Grand Palace & Wat Phra Kaew", "Khao San Road evening"] },
      { day: 7, city: "Bangkok", activities: ["Chatuchak Weekend Market", "Rooftop bar sunset", "Departure"] },
    ],
    flights: [
      {
        id: "fl-1",
        date: fmtDisplay(addDays(today, 39)),
        departTime: "10:50",
        arriveTime: "16:25",
        airline: "Air India Express",
        airlineLogo: "AI",
        from: { code: "HYD", city: "Hyderabad" },
        to: { code: "HKT", city: "Phuket" },
        duration: "4h 5m",
        stops: "Direct",
        baggage: [
          { traveler: "Trav 1", cabin: "7 Kg", checkin: "20 Kg" },
          { traveler: "Trav 2", cabin: "7 Kg", checkin: "20 Kg" },
        ],
      },
      {
        id: "fl-2",
        date: fmtDisplay(addDays(today, 44)),
        departTime: "08:30",
        arriveTime: "09:45",
        airline: "Bangkok Airways",
        airlineLogo: "PG",
        from: { code: "KBV", city: "Krabi" },
        to: { code: "BKK", city: "Bangkok" },
        duration: "1h 15m",
        stops: "Direct",
        baggage: [
          { traveler: "Trav 1", cabin: "7 Kg", checkin: "20 Kg" },
          { traveler: "Trav 2", cabin: "7 Kg", checkin: "20 Kg" },
        ],
      },
      {
        id: "fl-3",
        date: fmtDisplay(addDays(today, 46)),
        departTime: "22:10",
        arriveTime: "01:35",
        airline: "Air India Express",
        airlineLogo: "AI",
        from: { code: "BKK", city: "Bangkok" },
        to: { code: "HYD", city: "Hyderabad" },
        duration: "4h 25m",
        stops: "Direct",
        baggage: [
          { traveler: "Trav 1", cabin: "7 Kg", checkin: "20 Kg" },
          { traveler: "Trav 2", cabin: "7 Kg", checkin: "20 Kg" },
        ],
      },
    ],
    hotels: [
      {
        id: "ht-1",
        dayRange: "Day 1 – 4",
        city: "Phuket",
        name: "Andakira Hotel",
        roomType: "Superior Room",
        stars: 4,
        bookingRating: 8.1,
        photo: `${CDN}/hotels/thailand/hero-images/andakira.jpg`,
        fallbackPhoto: `${CDN}/thailand/pileh_lagoon_439.jpg`,
      },
      {
        id: "ht-2",
        dayRange: "Day 4 – 6",
        city: "Krabi",
        name: "Dusit Thani Krabi Beach Resort",
        roomType: "Deluxe Room",
        stars: 5,
        bookingRating: 8.7,
        photo: `${CDN}/thailand/long_beach_koh_phi_phi_468.jpg`,
        fallbackPhoto: `${CDN}/thailand/long_beach_koh_phi_phi_468.jpg`,
      },
      {
        id: "ht-3",
        dayRange: "Day 6 – 8",
        city: "Bangkok",
        name: "Centara Watergate Pavilion Hotel",
        roomType: "Superior Room",
        stars: 4,
        bookingRating: 8.3,
        photo: `${CDN}/thailand/big_buddha_temple_koh_samui_459.jpg`,
        fallbackPhoto: `${CDN}/thailand/big_buddha_temple_koh_samui_459.jpg`,
      },
    ],
    journeyMapCities: [
      { name: "Phuket", number: 1 },
      { name: "Krabi", number: 2 },
      { name: "Bangkok", number: 3 },
    ],
    beforeYouGo: {
      moneySim: {
        title: "Money & SIM",
        icon: "💰",
        subtitle: "Cash, cards and connectivity sorted for two",
        items: [
          "Carry USD 200–300 for arrival expenses",
          "Thai Baht available at airport exchange counters",
          "Get a local SIM at the airport (AIS or DTAC ~₹400 for 8 days)",
          "Most places accept cards, but carry cash for markets & street food",
        ],
      },
      packing: {
        title: "Packing",
        icon: "🧳",
        subtitle: "Because 'I thought you packed it' isn't a plan",
        checklist: [
          { item: "Sunscreen SPF 50+", checked: false },
          { item: "Swimwear (2 sets)", checked: false },
          { item: "Light cotton clothes", checked: false },
          { item: "Comfortable walking shoes", checked: false },
          { item: "Rain jacket / poncho", checked: false },
          { item: "Insect repellent", checked: false },
          { item: "Power adapter (Type A/B/C)", checked: false },
          { item: "Passport + 2 photocopies", checked: false },
          { item: "Travel insurance printout", checked: false },
          { item: "Snorkeling gear (or rent there)", checked: false },
        ],
      },
      atDestination: {
        title: "At Your Destination",
        icon: "✈️",
        subtitle: "From touchdown to check-in, stress-free",
        items: [
          "Immigration: Have hotel booking confirmation & return ticket ready",
          "Airport transfer: Pre-arranged driver will hold your name sign",
          "Hotel check-in: Usually 2 PM, early check-in on request",
          "Keep offline Google Maps downloaded for Phuket, Krabi & Bangkok",
        ],
      },
      goodToKnow: {
        title: "Good to Know",
        icon: "⚠️",
        subtitle: "Local know-how for a smooth trip together",
        items: [
          "Dress modestly when visiting temples (cover knees & shoulders)",
          "Remove shoes before entering temples",
          "Bargain at markets, start at 50% of asking price",
          "Tipping: 20–50 Baht for good service is appreciated",
          "Thailand time is 1.5 hours ahead of IST",
        ],
      },
      emergencyContacts: {
        title: "Emergency Contacts",
        icon: "🆘",
        subtitle: "Hope you never need this, but just in case",
        items: [
          "Tourist Police: 1155 (English-speaking)",
          "Ambulance: 1669",
          "Indian Embassy Bangkok: +66 2 258 0300",
          "30 Sundays 24/7 Helpline: +91 80 4567 8900",
        ],
      },
    },
    dayWise: [
      {
        date: fmt(addDays(today, 39)),
        dateDisplay: fmtDisplay(addDays(today, 39)),
        dayNumber: 1,
        city: "Phuket",
        activities: [
          {
            title: "Arrive in Phuket",
            venue: "Phuket International Airport",
            description: "Land at HKT airport. Your pre-arranged driver will meet you at arrivals with a name sign.",
            photo: `${CDN}/thailand/pileh_lagoon_439.jpg`,
          },
          {
            title: "Check-in at Andakira Hotel",
            venue: "Andakira Hotel, Patong",
            description: "Settle into your Superior Room. The hotel is a 5-minute walk from Patong Beach.",
            photo: `${CDN}/thailand/big_buddha_temple_koh_samui_459.jpg`,
          },
          {
            title: "Patong Beach Sunset Walk",
            venue: "Patong Beach",
            description: "Stroll along the famous Patong Beach as the sun sets. Grab fresh coconut water from the beach vendors.",
            photo: `${CDN}/thailand/long_beach_koh_phi_phi_468.jpg`,
          },
        ],
        hotel: {
          name: "Andakira Hotel",
          stars: 4,
          bookingRating: 8.1,
          roomType: "Superior Room",
          city: "Phuket",
          photo: `${CDN}/thailand/pileh_lagoon_439.jpg`,
        },
        restaurants: [
          { name: "Pure Vegan Heaven", cuisine: "Vegan • Raw Food • Smoothies", rating: 4.8, priceRange: "₹1,600 – 2,800", city: "Phuket, Thailand", photo: `${CDN}/thailand/angel_waterfall_park_493.jpg` },
          { name: "Baan Rim Pa", cuisine: "Thai • Seafood • Fine Dining", rating: 4.6, priceRange: "₹2,200 – 4,500", city: "Phuket, Thailand", photo: `${CDN}/thailand/dolphin_show_phuket_494.jpg` },
          { name: "Mom Tri's Kitchen", cuisine: "Thai-European • Beachfront", rating: 4.7, priceRange: "₹3,000 – 5,000", city: "Phuket, Thailand", photo: `${CDN}/thailand/pileh_lagoon_439.jpg` },
        ],
      },
      {
        date: fmt(addDays(today, 40)),
        dateDisplay: fmtDisplay(addDays(today, 40)),
        dayNumber: 2,
        city: "Phuket",
        activities: [
          {
            title: "Phi Phi Island Day Trip",
            venue: "Phi Phi Islands",
            description: "Full-day speedboat tour to Phi Phi Islands. Visit Maya Bay, Pileh Lagoon, and Viking Cave.",
            photo: `${CDN}/thailand/pileh_lagoon_439.jpg`,
          },
          {
            title: "Snorkeling at Maya Bay",
            venue: "Maya Bay, Phi Phi Leh",
            description: "Crystal-clear waters with vibrant coral reefs. Snorkeling gear provided on the boat.",
            photo: `${CDN}/thailand/long_beach_koh_phi_phi_468.jpg`,
          },
        ],
        hotel: {
          name: "Andakira Hotel",
          stars: 4,
          bookingRating: 8.1,
          roomType: "Superior Room",
          city: "Phuket",
          photo: `${CDN}/thailand/pileh_lagoon_439.jpg`,
        },
        restaurants: [
          { name: "The Suay Restaurant", cuisine: "Thai Modern • Fusion", rating: 4.5, priceRange: "₹1,800 – 3,500", city: "Phuket, Thailand", photo: `${CDN}/thailand/big_buddha_temple_koh_samui_459.jpg` },
        ],
      },
      {
        date: fmt(addDays(today, 41)),
        dateDisplay: fmtDisplay(addDays(today, 41)),
        dayNumber: 3,
        city: "Phuket",
        activities: [
          {
            title: "Big Buddha Visit",
            venue: "Phra Phutthamingmongkol Akenakkiri",
            description: "45-meter white marble Buddha statue on Nakkerd Hill. Stunning panoramic views of the island.",
            photo: `${CDN}/thailand/big_buddha_temple_koh_samui_459.jpg`,
          },
          {
            title: "Old Phuket Town Tour",
            venue: "Thalang Road, Old Town",
            description: "Explore Sino-Portuguese architecture, street art, and local cafes in the charming old quarter.",
            photo: `${CDN}/thailand/angel_waterfall_park_493.jpg`,
          },
        ],
        hotel: {
          name: "Andakira Hotel",
          stars: 4,
          bookingRating: 8.1,
          roomType: "Superior Room",
          city: "Phuket",
          photo: `${CDN}/thailand/pileh_lagoon_439.jpg`,
        },
        restaurants: [],
      },
      {
        date: fmt(addDays(today, 42)),
        dateDisplay: fmtDisplay(addDays(today, 42)),
        dayNumber: 4,
        city: "Krabi",
        activities: [
          {
            title: "Transfer to Krabi",
            venue: "Phuket to Krabi",
            description: "Scenic drive from Phuket to Krabi (about 3 hours). Stop at Sarasin Bridge for photos.",
            photo: `${CDN}/thailand/long_beach_koh_phi_phi_468.jpg`,
          },
          {
            title: "Railay Beach Exploration",
            venue: "Railay Beach, Krabi",
            description: "Accessible only by boat, dramatic limestone cliffs, pristine sand, and turquoise waters.",
            photo: `${CDN}/thailand/pileh_lagoon_439.jpg`,
          },
        ],
        hotel: {
          name: "Dusit Thani Krabi Beach Resort",
          stars: 5,
          bookingRating: 8.7,
          roomType: "Deluxe Room",
          city: "Krabi",
          photo: `${CDN}/thailand/long_beach_koh_phi_phi_468.jpg`,
        },
        restaurants: [],
      },
      {
        date: fmt(addDays(today, 43)),
        dateDisplay: fmtDisplay(addDays(today, 43)),
        dayNumber: 5,
        city: "Krabi",
        activities: [
          {
            title: "4 Islands Tour",
            venue: "Krabi Islands",
            description: "Longtail boat tour to Poda Island, Chicken Island, Tup Island, and Phra Nang Cave Beach.",
            photo: `${CDN}/thailand/angel_waterfall_park_493.jpg`,
          },
          {
            title: "Emerald Pool & Hot Springs",
            venue: "Khao Phra Bang Khram Nature Reserve",
            description: "Swim in the natural emerald-colored pool hidden in the rainforest, then relax in natural hot springs.",
            photo: `${CDN}/thailand/dolphin_show_phuket_494.jpg`,
          },
        ],
        hotel: {
          name: "Dusit Thani Krabi Beach Resort",
          stars: 5,
          bookingRating: 8.7,
          roomType: "Deluxe Room",
          city: "Krabi",
          photo: `${CDN}/thailand/long_beach_koh_phi_phi_468.jpg`,
        },
        restaurants: [],
      },
      {
        date: fmt(addDays(today, 44)),
        dateDisplay: fmtDisplay(addDays(today, 44)),
        dayNumber: 6,
        city: "Bangkok",
        activities: [
          {
            title: "Fly to Bangkok",
            venue: "Krabi Airport → Suvarnabhumi Airport",
            description: "Morning flight from Krabi to Bangkok. Transfer to hotel in the Pratunam area.",
            photo: `${CDN}/thailand/big_buddha_temple_koh_samui_459.jpg`,
          },
          {
            title: "Grand Palace & Wat Phra Kaew",
            venue: "Grand Palace, Bangkok",
            description: "Thailand's most sacred Buddhist temple and the stunning Grand Palace complex.",
            photo: `${CDN}/Thailand/Activities/Safari%20World.jpeg`,
          },
        ],
        hotel: {
          name: "Centara Watergate Pavilion Hotel",
          stars: 4,
          bookingRating: 8.3,
          roomType: "Superior Room",
          city: "Bangkok",
          photo: `${CDN}/thailand/big_buddha_temple_koh_samui_459.jpg`,
        },
        restaurants: [],
      },
      {
        date: fmt(addDays(today, 45)),
        dateDisplay: fmtDisplay(addDays(today, 45)),
        dayNumber: 7,
        city: "Bangkok",
        activities: [
          {
            title: "Chatuchak Weekend Market",
            venue: "Chatuchak, Bangkok",
            description: "One of the world's largest outdoor markets with 15,000+ stalls. Bargain for clothes, art, and souvenirs.",
            photo: `${CDN}/Thailand/Activities/Safari%20World.jpeg`,
          },
          {
            title: "Rooftop Bar Sunset",
            venue: "Sky Bar, Lebua Hotel",
            description: "End your trip at one of Bangkok's iconic rooftop bars with panoramic city views at sunset.",
            photo: `${CDN}/thailand/big_buddha_temple_koh_samui_459.jpg`,
          },
        ],
        hotel: {
          name: "Centara Watergate Pavilion Hotel",
          stars: 4,
          bookingRating: 8.3,
          roomType: "Superior Room",
          city: "Bangkok",
          photo: `${CDN}/thailand/big_buddha_temple_koh_samui_459.jpg`,
        },
        restaurants: [],
      },
    ],
  },

  // ── Trip 2: Ongoing Bali ──
  {
    id: "trip-2",
    tripName: "Ananya's Bali Trip",
    destination: "Bali",
    emoji: "🌺",
    status: "ongoing",
    startDate: fmt(addDays(today, -3)),
    endDate: fmt(addDays(today, 4)),
    startDateDisplay: fmtDisplay(addDays(today, -3)),
    endDateDisplay: fmtDisplay(addDays(today, 4)),
    nightsBreakdown: "3N Ubud • 2N Seminyak • 2N Nusa Penida",
    totalNights: 7,
    heroImages: [
      `${CDN}/bali/bali_swing_experience_1.jpg`,
      `${CDN}/bali/tegallalang_rice_fields_4.jpg`,
      `${CDN}/bali/kelingking_beach_65.jpg`,
    ],
    totalPackageValue: 248000,
    amountPaid: 248000,
    installments: [
      { id: 1, label: "Installment 1", date: "Feb 15, 2026", amount: 82000, status: "paid" },
      { id: 2, label: "Installment 2", date: "Feb 28, 2026", amount: 83000, status: "paid" },
      { id: 3, label: "Installment 3", date: "Mar 10, 2026", amount: 83000, status: "paid" },
    ],
    documents: {
      itineraryPdf: "#",
      paymentReceipts: [
        { id: 1, label: "Receipt #1", url: "#" },
        { id: 2, label: "Receipt #2", url: "#" },
      ],
      travelerDocuments: [],
    },
    leadTraveler: { name: "Ananya Reddy", phone: "+91 90000 12345", role: "Lead traveler" },
    coTravelers: [{ name: "Vikram Reddy", phone: "+91 90000 12346", role: "Co-traveler" }],
    consultant: { name: "Aarav Mehta", phone: "+919876500022" },
    addOns: {
      visa: { purchased: true, documentUrl: "#" },
      insurance: { purchased: true, documentUrl: "#" },
      forex: { enabled: true },
    },
    itineraryDays: [
      { day: 1, city: "Ubud", activities: ["Arrive in Bali", "Check-in at Ubud resort", "Monkey Forest visit"] },
      { day: 2, city: "Ubud", activities: ["Tegallalang Rice Terraces", "Tirta Empul Temple", "Yoga session"] },
      { day: 3, city: "Ubud", activities: ["Mount Batur sunrise trek", "Coffee plantation visit", "Ubud art market"] },
      { day: 4, city: "Seminyak", activities: ["Transfer to Seminyak", "Beach club afternoon", "Sunset at Tanah Lot"] },
      { day: 5, city: "Seminyak", activities: ["Spa morning", "Shopping at Seminyak Square", "Beachfront dinner"] },
      { day: 6, city: "Nusa Penida", activities: ["Ferry to Nusa Penida", "Kelingking Beach", "Broken Beach & Angel's Billabong"] },
      { day: 7, city: "Nusa Penida", activities: ["Snorkeling with Manta Rays", "Crystal Bay", "Return ferry & departure"] },
    ],
    flights: [
      {
        id: "fl-4",
        date: fmtDisplay(addDays(today, -3)),
        departTime: "06:15",
        arriveTime: "14:45",
        airline: "IndiGo",
        airlineLogo: "6E",
        from: { code: "DEL", city: "Delhi" },
        to: { code: "DPS", city: "Bali" },
        duration: "7h 30m",
        stops: "1 stop (KUL)",
        baggage: [
          { traveler: "Trav 1", cabin: "7 Kg", checkin: "15 Kg" },
          { traveler: "Trav 2", cabin: "7 Kg", checkin: "15 Kg" },
        ],
      },
    ],
    hotels: [
      {
        id: "ht-4",
        dayRange: "Day 1 – 4",
        city: "Ubud",
        name: "Komaneka at Bisma",
        roomType: "Valley Pool Villa",
        stars: 5,
        bookingRating: 9.1,
        photo: `${CDN}/bali/tegallalang_rice_fields_4.jpg`,
        fallbackPhoto: `${CDN}/bali/tegallalang_rice_fields_4.jpg`,
      },
      {
        id: "ht-5",
        dayRange: "Day 4 – 6",
        city: "Seminyak",
        name: "The Legian Seminyak",
        roomType: "Ocean View Suite",
        stars: 5,
        bookingRating: 8.9,
        photo: `${CDN}/bali/bali_swing_experience_1.jpg`,
        fallbackPhoto: `${CDN}/bali/bali_swing_experience_1.jpg`,
      },
    ],
    journeyMapCities: [
      { name: "Ubud", number: 1 },
      { name: "Seminyak", number: 2 },
      { name: "Nusa Penida", number: 3 },
    ],
    beforeYouGo: {
      moneySim: {
        title: "Money & SIM",
        icon: "💰",
        subtitle: "Cash, cards and connectivity sorted for two",
        currencyRates: [
          { label: "1 USD", value: "₹92.1 INR" },
          { label: "1 INR", value: "192 IDR" },
          { label: "1 USD", value: "15,800 IDR" },
        ],
        forex: {
          intro: "Best way to pay: Card with no/low forex fees (eg: Niyo) or IDR cash. Carry ~300 USD in $50, $100 bills. Exchange to IDR gradually \u2014 carrying too much cash is risky and rates vary daily.",
          options: [
            { icon: "\u2B50", text: "Local forex store \u2014 best rates. Ask our driver. Trusted: Central Kuta Money Exchange, GAV Money Changer." },
            { icon: "\uD83C\uDFE7", text: "ATM \u2014 good backup. Fees Rp 20K\u201350K. Withdraw large amount in one go." },
            { icon: "\u2708\uFE0F", text: "Airport counter (DPS) \u2014 convenient but rates higher. OK for small amount." },
            { icon: "\uD83D\uDEAB", text: "Exchange in India \u2014 avoid. IDR rates in India are very poor." },
          ],
          warning: "Do NOT get IDR from India or convert INR to IDR in Bali. At card machines, always pay in IDR (not INR) \u2014 paying in INR costs 3\u20135% extra. Some places add surcharge on international cards, ask first.",
        },
        sim: {
          title: "SIM & Connectivity",
          intro: "Get a local SIM at the airport for cheap data + keep your Indian SIM on roaming for OTPs. This is the best combo for staying connected.",
          options: [
            { icon: "\uD83D\uDCF1", text: "Local SIM at airport \u2014 Telkomsel recommended. ~Rp 100K for 10GB + calls. Counter is right after customs." },
            { icon: "\uD83D\uDCF6", text: "eSIM \u2014 works if phone supports it. Try Airalo or Holafly. Set up before you fly." },
            { icon: "\uD83D\uDCE1", text: "Hotel/cafe wifi \u2014 generally good in tourist areas. Spotty in Nusa Penida." },
          ],
        },
      },
      packing: {
        title: "Packing",
        icon: "\uD83E\uDDF3",
        subtitle: "Because \u2018I thought you packed it\u2019 isn\u2019t a plan",
        checklist: [
          { item: "1 dinner outfit", emoji: "\uD83D\uDC57", person: "her", checked: false },
          { item: "Cotton t-shirts (5\u20136)", emoji: "\uD83D\uDC54", person: "his", checked: false },
          { item: "Shorts (3\u20134)", emoji: "\uD83D\uDC54", person: "his", checked: false },
          { item: "1 long trouser (temples)", emoji: "\uD83D\uDC54", person: "his", checked: false },
          { item: "Swim shorts (2)", emoji: "\uD83D\uDC54", person: "his", checked: false },
          { item: "Walking sandals + flip flops", emoji: "\uD83D\uDC54", person: "his", checked: false },
          { item: "1 dinner outfit", emoji: "\uD83D\uDC54", person: "his", checked: false },
          { item: "Phone chargers + cables", emoji: "\uD83D\uDD0C", person: "essential", checked: false },
          { item: "Power bank (hand luggage)", emoji: "\uD83D\uDD0C", person: "essential", checked: false },
          { item: "Universal adapter (C/F)", emoji: "\uD83D\uDD0C", person: "essential", checked: false },
          { item: "Sunscreen SPF 50+ (reef-safe)", emoji: "\uD83D\uDD0C", person: "essential", checked: false },
          { item: "Insect repellent", emoji: "\uD83D\uDD0C", person: "essential", checked: false },
          { item: "Reef shoes", emoji: "\uD83D\uDD0C", person: "essential", checked: false },
          { item: "Day backpack", emoji: "\uD83D\uDD0C", person: "essential", checked: false },
        ],
      },
      atDestination: {
        title: "At Your Destination",
        icon: "\u2708\uFE0F",
        subtitle: "From touchdown to check-in, stress-free",
        arrivalSteps: [
          { icon: "\u2708\uFE0F", title: "Before landing", description: "Web check-in. Fill customs form at customs.dgce.id. Save QR." },
          { icon: "\uD83C\uDDF8", title: "Immigration", description: "Join Foreign Passport line. Passport + customs QR ready." },
          { icon: "\u26A0\uFE0F", title: "Avoid scams", description: "'Fast track' line offers are unofficial. Avoid." },
          { icon: "\uD83D\uDCB0", title: "Visa on Arrival", description: "500,000 IDR or 35 USD pp. Card accepted, 4% fee." },
          { icon: "\uD83D\uDCF6", title: "Get connected", description: "Free wifi 'Free Wifi DPS Airport'. Or buy SIM after duty free." },
          { icon: "\uD83E\uDDF3", title: "Collect luggage", description: "Check screens for belt number. Trolleys free." },
          { icon: "\uD83D\uDFE2", title: "Customs", description: "Green Channel. Show customs QR code." },
          { icon: "\uD83D\uDE97", title: "Meet driver", description: "Details on WhatsApp 1 day before. Ignore touts." },
        ],
        foodDining: {
          title: "Food & Dining",
          dishes: [
            { name: "Nasi Goreng", description: "Fried rice (everywhere)", veg: false },
            { name: "Mie Goreng", description: "Fried noodles", veg: false },
            { name: "Gado-Gado", description: "Veggie salad, peanut sauce", veg: true },
            { name: "Sate Lilit", description: "Satay on lemongrass", veg: false },
            { name: "Babi Guling", description: "Roast suckling pig (Bali specialty)", veg: false },
            { name: "Lawar", description: "Mixed veggies, grated coconut", veg: true },
          ],
          tip: "Veg: say \u2018Tidak pakai daging\u2019 (no meat). Ubud has many veg cafes. Never drink tap water. Carry ORS. \u2018Spicy\u2019 here is spicier than Indian spicy. Tipping not expected, 5\u201310% at upscale places.",
        },
      },
      goodToKnow: {
        title: "Good to Know",
        icon: "\u26A0\uFE0F",
        subtitle: "Local know-how for a smooth trip together",
        sections: [
          {
            icon: "\uD83D\uDD12",
            title: "Safety",
            text: "Bali is very safe in main tourist areas. Keep valuables in hotel safe. Scooter roads are narrow and chaotic \u2014 always wear helmet. Ubud Monkey Forest: monkeys snatch phones and sunglasses, secure everything.",
          },
          {
            icon: "\uD83E\uDDA0",
            title: "Scams",
            text: "Money changers \u2014 unlicensed ones shortchange, use recommended stores. ATM skimmers \u2014 use bank-attached ATMs, cover keypad. Airport fast track \u2014 unofficial offers, avoid. \u2018Free\u2019 temple guides \u2014 demand large tips, politely decline.",
          },
          {
            icon: "\uD83D\uDDE3\uFE0F",
            title: "Phrases",
            items: [
              { phrase: "Terima kasih", meaning: "Thank you" },
              { phrase: "Selamat pagi", meaning: "Good morning" },
              { phrase: "Berapa harganya?", meaning: "How much?" },
              { phrase: "Tidak, terima kasih", meaning: "No, thank you" },
              { phrase: "Tolong", meaning: "Please / Help" },
              { phrase: "Permisi", meaning: "Excuse me" },
            ],
          },
        ],
        electricityNote: "Type C/F plugs (European 2-pin). 230V. Bali is UTC+8 \u2014 2.5 hours ahead of India.",
      },
      emergencyContacts: {
        title: "Emergency Contacts",
        icon: "\uD83C\uDD98",
        subtitle: "Hope you never need this, but just in case",
        screenshotWarning: "Screenshot this section for offline access.",
        numbers: [
          { label: "General Emergency", number: "112" },
          { label: "Police", number: "110" },
          { label: "Ambulance", number: "118 / 119" },
          { label: "Fire", number: "113" },
          { label: "Search & Rescue", number: "115" },
        ],
        hospitals: [
          { name: "BIMC Hospital (Kuta)", phone: "+62 361 761 263", mapUrl: "#" },
          { name: "BIMC Hospital (Nusa Dua)", phone: "+62 361 300 0911", mapUrl: "#" },
          { name: "Siloam Hospitals (Denpasar)", phone: "+62 361 779 900", mapUrl: "#" },
        ],
      },
    },
    dayWise: [
      {
        date: fmt(addDays(today, -3)),
        dateDisplay: fmtDisplay(addDays(today, -3)),
        dayNumber: 1,
        city: "Ubud",
        activities: [
          { title: "Arrive in Bali", venue: "Ngurah Rai Airport", description: "Welcome to Bali! Transfer to Ubud (1.5 hours drive).", photo: `${CDN}/bali/bali_swing_experience_1.jpg` },
          { title: "Monkey Forest Visit", venue: "Sacred Monkey Forest, Ubud", description: "Walk through the ancient temple ruins and meet the playful long-tailed macaques.", photo: `${CDN}/bali/tegallalang_rice_fields_4.jpg` },
        ],
        hotel: { name: "Komaneka at Bisma", stars: 5, bookingRating: 9.1, roomType: "Valley Pool Villa", city: "Ubud", photo: `${CDN}/bali/tegallalang_rice_fields_4.jpg` },
        restaurants: [
          { name: "Locavore", cuisine: "Indonesian • Farm-to-table", rating: 4.9, priceRange: "₹3,000 – 5,500", city: "Ubud, Bali", photo: `${CDN}/bali/bali_swing_experience_1.jpg` },
        ],
      },
    ],
  },

  // ── Trip 3: Completed Vietnam ──
  {
    id: "trip-3",
    tripName: "Meera's Vietnam Trip",
    destination: "Vietnam",
    emoji: "🎋",
    status: "completed",
    startDate: fmt(addDays(today, -45)),
    endDate: fmt(addDays(today, -38)),
    startDateDisplay: fmtDisplay(addDays(today, -45)),
    endDateDisplay: fmtDisplay(addDays(today, -38)),
    nightsBreakdown: "2N Hanoi • 2N Ha Long • 3N HCMC",
    totalNights: 7,
    heroImages: [
      `${CDN}/vietnam/kissing_bridge_495.jpg`,
      `${CDN}/vietnam/kayaking_halong_bay_500.jpg`,
      `${CDN}/vietnam/hoi_an_memories_show_502.jpg`,
    ],
    totalPackageValue: 286000,
    amountPaid: 286000,
    installments: [
      { id: 1, label: "Installment 1", date: "Jan 10, 2026", amount: 95000, status: "paid" },
      { id: 2, label: "Installment 2", date: "Jan 25, 2026", amount: 95000, status: "paid" },
      { id: 3, label: "Installment 3", date: "Feb 05, 2026", amount: 96000, status: "paid" },
    ],
    documents: {
      itineraryPdf: "#",
      paymentReceipts: [
        { id: 1, label: "Receipt #1", url: "#" },
        { id: 2, label: "Receipt #2", url: "#" },
        { id: 3, label: "Receipt #3", url: "#" },
      ],
      travelerDocuments: [{ id: 1, label: "Visa Copy", url: "#" }],
    },
    leadTraveler: { name: "Meera Nair", phone: "+91 87654 32100", role: "Lead traveler" },
    coTravelers: [{ name: "Arjun Nair", phone: "+91 87654 32101", role: "Co-traveler" }],
    consultant: { name: "Kabir Iyer", phone: "+919876500033" },
    addOns: {
      visa: { purchased: false },
      insurance: { purchased: false },
      forex: { enabled: true },
    },
    itineraryDays: [
      { day: 1, city: "Hanoi", activities: ["Arrive in Hanoi", "Old Quarter walking tour", "Water Puppet Show"] },
      { day: 2, city: "Hanoi", activities: ["Ho Chi Minh Mausoleum", "Temple of Literature", "Street food tour"] },
      { day: 3, city: "Ha Long", activities: ["Transfer to Ha Long Bay", "Cruise check-in", "Kayaking at sunset"] },
      { day: 4, city: "Ha Long", activities: ["Sunrise Tai Chi on deck", "Cave exploration", "Cooking class on cruise"] },
      { day: 5, city: "HCMC", activities: ["Fly to Ho Chi Minh City", "Cu Chi Tunnels tour", "Ben Thanh Night Market"] },
      { day: 6, city: "HCMC", activities: ["Mekong Delta day trip", "Coconut village", "River cruise"] },
      { day: 7, city: "HCMC", activities: ["War Remnants Museum", "Notre Dame Cathedral", "Departure"] },
    ],
    flights: [],
    hotels: [],
    journeyMapCities: [
      { name: "Hanoi", number: 1 },
      { name: "Ha Long", number: 2 },
      { name: "HCMC", number: 3 },
    ],
    beforeYouGo: null,
    dayWise: [],
  },
];

// Helpers
export function getCountdown(dateStr) {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const remainDays = days % 30;
  if (months > 0) return `${months}m ${remainDays}d to go`;
  return `${days}d to go`;
}

export function getTripsByStatus(status) {
  if (status === "active") {
    return mockTrips
      .filter(t => t.status === "upcoming" || t.status === "ongoing")
      .sort((a, b) => {
        if (a.status === "ongoing" && b.status !== "ongoing") return -1;
        if (b.status === "ongoing" && a.status !== "ongoing") return 1;
        return new Date(a.startDate) - new Date(b.startDate);
      });
  }
  return mockTrips
    .filter(t => t.status === "completed")
    .sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
}

export function getTripById(id) {
  return mockTrips.find(t => t.id === id);
}

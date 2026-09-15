// ─── Community: Q&A and cohort chat, all fake ───
// Bali November 2026 is the main scenario. Mauritius sits below the cohort
// threshold so the Q&A only state can be shown, and Vietnam has already
// travelled so its cohort is closed and read only.

export const COHORT_THRESHOLD = 8;

// The couple using the app. They have been to Vietnam, so they have a stamp of
// their own to answer with, and they are going to Bali in November.
export const ME = {
  couple: "Priya & Rahul",
  city: "Mumbai",
  stamp: { destination: "Vietnam", month: "August 2026" },
};

export const DESTINATIONS = {
  bali: {
    id: "bali",
    name: "Bali",
    month: "November 2026",
    tripId: "trip-5",
    hero: "/lab-locations/bali-kelingking-beach-viewpoint.jpg",
    cohort: { state: "open", members: 14, lastActiveMins: 12 },
    about: "Most questions here are about the drive times between the south and Ubud, what to pack for November, and which beach clubs are worth it. Ask anything.",
  },
  mauritius: {
    id: "mauritius",
    name: "Mauritius",
    month: "October 2026",
    tripId: "trip-4",
    hero: "/lab-locations/mauritius-le-morne-brabant.jpg",
    // Below the threshold, so there is no group to join yet.
    cohort: { state: "below", members: 3 },
    about: "A quieter month for Mauritius, so answers here come mostly from our team and from couples who went earlier in the year.",
  },
  vietnam: {
    id: "vietnam",
    name: "Vietnam",
    month: "August 2026",
    tripId: "trip-3",
    hero: "/lab-locations/vietnam-ha-long-bay-cruise.jpg",
    // The month has been and gone, so the group is read only.
    cohort: { state: "closed", members: 11, closedOn: "31 August 2026" },
    about: "This group has wrapped up. The questions stay here for the couples travelling after you both.",
  },
};

export const getDest = (id) => DESTINATIONS[id] || DESTINATIONS.bali;

// ─── People who answer ───
// A stamp is what makes an answer worth reading, so every couple carries one.
const c = (couple, city, destination, month) => ({ couple, city, stamp: { destination, month } });
export const OPS = { couple: "30 Sundays team", ops: true };

export const PEOPLE = {
  riya: c("Riya & Arjun", "Pune", "Bali", "March 2026"),
  neha: c("Neha & Vikram", "Bengaluru", "Bali", "June 2026"),
  sana: c("Sana & Imran", "Hyderabad", "Bali", "January 2026"),
  meera: c("Meera & Kabir", "Delhi", "Bali", "April 2026"),
  tara: c("Tara & Nikhil", "Chennai", "Bali", "July 2026"),
  ananya: c("Ananya & Rohan", "Kolkata", "Bali", "February 2026"),
  divya: c("Divya & Karan", "Ahmedabad", "Bali", "May 2026"),
  ishita: c("Ishita & Aditya", "Jaipur", "Vietnam", "May 2026"),
  pooja: c("Pooja & Sameer", "Surat", "Mauritius", "March 2026"),
};

// ─── Questions ───
// `answers` are in posting order. `acceptedId` pins one to the top as solved.
// `quotes` on an answer points at what it is replying to.

export const QUESTIONS = [
  {
    id: "q1", dest: "bali",
    title: "How bad is the drive from the airport to Ubud in the evening?",
    body: "We land at 7pm and our first two nights are in Ubud. Should we just stay near the airport the first night instead? We would rather not spend our first evening together stuck in a car.",
    author: PEOPLE.riya, minsAgo: 8, acceptedId: "a2",
    answers: [
      { id: "a1", author: PEOPLE.neha, minsAgo: 6,
        body: "It took us close to three hours on a Friday evening. Worth knowing before you book.", likes: 4 },
      { id: "a2", author: OPS, minsAgo: 5,
        body: "Ninety minutes on a good day, and closer to two and a half hours on a Friday or Saturday evening. For a 7pm landing we usually put couples in Seminyak for the first night and move them to Ubud after breakfast, so you both start the trip rested. Tell your consultant and they will shift it at no cost.",
        likes: 22 },
      { id: "a3", author: PEOPLE.sana, minsAgo: 4,
        body: "We did exactly this and it was the right call. Ubud in the morning light is much nicer as a first impression anyway.",
        quotes: { author: OPS, text: "we usually put couples in Seminyak for the first night and move them to Ubud after breakfast" },
        likes: 9 },
    ],
  },
  {
    id: "q2", dest: "bali",
    title: "Is November too wet for the beach clubs?",
    body: "Everything we read says November is the start of the rains. Are the beach days still worth planning for, or should we build the trip around indoor things?",
    author: PEOPLE.meera, minsAgo: 64, acceptedId: null,
    answers: [
      { id: "b1", author: PEOPLE.tara, minsAgo: 52,
        body: "We were there in July so not quite the same, but every couple we met who went in November said mornings were clear and the rain came in short bursts after 3pm.", likes: 6 },
      { id: "b2", author: OPS, minsAgo: 40,
        body: "November averages around twelve rainy days, and the rain tends to be heavy for an hour rather than all day. Plan the beach for mornings and keep the afternoons loose. Every beach club we work with has covered seating, so a shower does not end the day.",
        likes: 18 },
      { id: "b3", author: PEOPLE.divya, minsAgo: 30,
        body: "Add a light rain jacket each and you will barely notice it. We got caught out and ended up buying ponchos at three times the price.", likes: 7 },
      { id: "b4", author: PEOPLE.ananya, minsAgo: 22,
        body: "Agree with the mornings point. We shifted our Nusa Penida day trip to the earliest slot and it made all the difference, the sea was much calmer.",
        quotes: { author: OPS, text: "Plan the beach for mornings and keep the afternoons loose." },
        likes: 11 },
      { id: "b5", author: PEOPLE.neha, minsAgo: 14,
        body: "One more thing. The infinity pool photos everyone wants come out better under cloud than in harsh sun, so a grey afternoon is not a lost one.", likes: 5 },
    ],
  },
  {
    id: "q3", dest: "bali",
    title: "Do we need to carry cash or is card accepted everywhere?",
    body: "Trying to work out how much we should change before we fly out.",
    author: PEOPLE.ananya, minsAgo: 170, acceptedId: "c2",
    answers: [
      { id: "c1", author: PEOPLE.sana, minsAgo: 150,
        body: "Cards worked at every hotel and restaurant. We only needed cash for the small warungs and for tipping the driver.", likes: 8 },
      { id: "c2", author: OPS, minsAgo: 120,
        body: "Carry the equivalent of about fifteen thousand rupees in rupiah between you both for the first two days, then withdraw as you go. Cards are accepted nearly everywhere you will be. Avoid the airport counters, the rate is noticeably worse.",
        likes: 26 },
    ],
  },
  {
    id: "q4", dest: "bali",
    title: "Which side of the island for the last two nights?",
    body: "We have two nights left over at the end and cannot decide between Uluwatu and Seminyak. We like quiet evenings more than nightlife.",
    author: PEOPLE.tara, minsAgo: 320, acceptedId: null,
    answers: [
      { id: "d1", author: PEOPLE.riya, minsAgo: 280,
        body: "Uluwatu, easily, if quiet is what you are after. Seminyak is livelier and you are closer to the airport, which only matters on the last morning.", likes: 12 },
      { id: "d2", author: PEOPLE.divya, minsAgo: 200,
        body: "We did Uluwatu and the clifftop sunsets were the thing we both talk about most.", likes: 9 },
    ],
  },
  {
    id: "q5", dest: "bali",
    title: "Is the Nusa Penida day trip worth the early start?",
    body: "Our itinerary has a 5am pickup for it. We are not naturally early risers.",
    author: PEOPLE.divya, minsAgo: 700, acceptedId: null,
    answers: [
      { id: "e1", author: PEOPLE.meera, minsAgo: 620,
        body: "Yes. The early boat is calmer and you get Kelingking before the crowds. We went back to the hotel and slept in the afternoon, which worked out fine.", likes: 15 },
      { id: "e2", author: OPS, minsAgo: 540,
        body: "The early crossing is also the safest one in November, when the afternoon swell picks up. If either of you gets seasick, take something thirty minutes before boarding.",
        likes: 13 },
    ],
  },
  {
    id: "q6", dest: "bali",
    title: "Can we do a private dinner on the beach without it feeling staged?",
    body: "Our anniversary falls on the fourth night and we would like to do something for it, but the photos we have seen look a bit much.",
    author: PEOPLE.neha, minsAgo: 1500, acceptedId: null,
    answers: [
      { id: "f1", author: PEOPLE.ananya, minsAgo: 1400,
        body: "Ask for the simple setup rather than the full one. We did ours at Jimbaran with just lanterns and no flower arch and it was lovely.", likes: 10 },
    ],
  },
  {
    id: "q7", dest: "bali",
    title: "How much should we budget for a driver for the day?",
    body: "We would rather have one person for the whole day than book cars each time.",
    author: PEOPLE.sana, minsAgo: 2600, acceptedId: null,
    answers: [],
  },
  {
    id: "q8", dest: "bali",
    title: "Any tips for the visa on arrival queue?",
    body: "We have read it can take a while. Is there anything we can do before we fly to make it quicker?",
    author: PEOPLE.meera, minsAgo: 4300, acceptedId: null,
    answers: [],
  },
  {
    id: "q9", dest: "bali",
    title: "Are the rice terrace swings actually worth doing?",
    body: "They are on our itinerary but we are wondering whether to swap them for something else.",
    author: PEOPLE.riya, minsAgo: 7000, acceptedId: null,
    answers: [
      { id: "g1", author: PEOPLE.tara, minsAgo: 6800,
        body: "We skipped the swings and did a walk through the terraces instead. Quieter, and we got better photos of just the two of us.", likes: 14 },
    ],
  },

  // ── Mauritius: below the cohort threshold, so Q&A only ──
  {
    id: "m1", dest: "mauritius",
    title: "Is October a good month for the south coast?",
    body: "We are told the wind picks up. Does that spoil the beach days?",
    author: PEOPLE.pooja, minsAgo: 180, acceptedId: "m1a",
    answers: [
      { id: "m1a", author: OPS, minsAgo: 140,
        body: "October is one of the better months. The wind is what makes Le Morne good for kitesurfing, but the east and north stay sheltered. We would keep your beach days on the north coast and use the south for the drives and the viewpoints.",
        likes: 7 },
    ],
  },
  {
    id: "m2", dest: "mauritius",
    title: "Do we need to book the catamaran in advance?",
    body: "Or is it something we can decide on the day once we see the weather?",
    author: PEOPLE.pooja, minsAgo: 900, acceptedId: null,
    answers: [],
  },

  // ── Vietnam: already travelled, kept for the couples coming after ──
  {
    id: "v1", dest: "vietnam",
    title: "Is one night on the Ha Long cruise enough?",
    body: "We are deciding between one night and two.",
    author: PEOPLE.ishita, minsAgo: 40000, acceptedId: "v1a",
    answers: [
      { id: "v1a", author: OPS, minsAgo: 39000,
        body: "One night suits most couples. The second night adds a quieter bay and a kayak morning, so take it if you both want slow rather than more.",
        likes: 19 },
      { id: "v1b", author: PEOPLE.ishita, minsAgo: 20000,
        body: "We went with one and did not regret it. By the second morning we were ready to be back on land.", likes: 6 },
    ],
  },
];

export const questionsFor = (dest) => QUESTIONS.filter(q => q.dest === dest);
export const findQuestion = (id) => QUESTIONS.find(q => q.id === id);

// ─── Pinned rows, always the first two in the feed ───
export const GUIDELINES = [
  ["Keep it about the trip", "Questions and answers about the destination, the plan, and what to expect. That is what everyone came here for."],
  ["Say where you both went", "Every answer carries the month you travelled. It is the reason people trust what you write, so keep it honest."],
  ["No phone numbers or handles", "Keep contact details out of posts. If you need our team, your consultant is one tap away in your trip."],
  ["Nothing for sale", "No selling, reselling, or promoting anything, including your own trip dates or bookings."],
  ["Be kind about other couples' plans", "Different couples want different holidays. Answer the question that was asked, and leave the rest."],
];

// ─── Cohort chat ───
export const CHAT = [
  { id: "ch1", author: OPS, minsAgo: 8600, checkpoint: true,
    title: "Visas, six weeks out",
    text: "A quick one for everyone. Visa on arrival is fine for all of you, but both of your passports need six months left on them from 1 November. Have a look tonight and message your consultant if either of you is close." },
  { id: "ch2", author: PEOPLE.riya, minsAgo: 8300,
    text: "Checked ours, both good until 2029. Thanks for the nudge." },
  { id: "ch3", author: PEOPLE.neha, minsAgo: 8100,
    text: "Mine expires in March. Getting it renewed this week, glad this came up now and not in October." },
  { id: "ch4", author: PEOPLE.meera, minsAgo: 6000,
    text: "Is anyone else landing on the 4th? We are on the early flight and would love to know who else is around." },
  { id: "ch5", author: PEOPLE.tara, minsAgo: 5900,
    text: "We land on the 4th too, in the evening. Two nights in Seminyak first." },
  { id: "ch6", author: PEOPLE.ananya, minsAgo: 5400,
    text: "We are the 6th. Doing Ubud first and then south." },
  { id: "ch7", author: OPS, minsAgo: 4300, checkpoint: true,
    title: "What November actually looks like",
    text: "Weather note for the group. Expect clear mornings and short heavy showers in the late afternoon, around twelve days of rain across the month. Pack a light rain jacket each and keep afternoons flexible. None of your booked activities get cancelled for rain, and if the sea is rough on a boat day we move it and tell you the night before." },
  { id: "ch8", author: PEOPLE.divya, minsAgo: 4100,
    text: "This is useful. We were about to pack for pure sunshine." },
  { id: "ch9", author: PEOPLE.sana, minsAgo: 3400,
    text: "Has anyone done the cooking class in Ubud? Deciding whether to add it." },
  { id: "ch10", author: PEOPLE.riya, minsAgo: 3200,
    text: "We did it in March. Go for the morning one, you shop at the market first and that is the best part of it." },
  { id: "ch11", author: PEOPLE.meera, minsAgo: 1500,
    text: "Random, but does anyone know if the beach clubs need booking ahead in November?" },
  { id: "ch12", author: PEOPLE.tara, minsAgo: 900,
    text: "We booked two days ahead and that was plenty. Weekends fill up faster." },
  { id: "ch13", author: PEOPLE.neha, minsAgo: 240,
    text: "Passport renewed, appointment done. See you all in November." },
  { id: "ch14", author: PEOPLE.ananya, minsAgo: 120,
    text: "Starting a note of everything from this group so we do not lose it. Happy to share it closer to the date." },
  { id: "ch15", author: PEOPLE.divya, minsAgo: 12,
    text: "Yes please. Ours is a mess of screenshots at the moment." },
];

// ─── Moderation ───
// First offence explains and offers an edit. Second offence blocks the post.
const RULES = [
  { id: "contact", test: /(\+?\d[\d\s-]{8,}\d)|([\w.]+@[\w.]+\.\w+)|(@[A-Za-z0-9_]{3,})|(instagram|whatsapp|telegram)/i,
    what: "It looks like there are contact details in this post.",
    why: "We keep phone numbers, emails and handles out of the feed so nobody gets messaged off the back of a question. Your consultant is one tap away inside your trip." },
  { id: "selling", test: /\b(selling|for sale|discount code|dm me|commission|book through me|cheaper rate)\b/i,
    what: "This reads as though something is being sold.",
    why: "Nothing is bought or sold here. Answers are for helping the couple who asked, nothing else." },
];

export const checkPost = (text) => {
  for (const r of RULES) if (r.test.test(text || "")) return r;
  return null;
};

// ─── Time ───
export const ago = (mins) => {
  if (mins < 1) return "now";
  if (mins < 60) return `${Math.round(mins)}m`;
  if (mins < 1440) return `${Math.round(mins / 60)}h`;
  if (mins < 43200) return `${Math.round(mins / 1440)}d`;
  return `${Math.round(mins / 43200)}mo`;
};

export const clock = (mins) => {
  const d = new Date(Date.now() - mins * 60000);
  return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
};

export const dayLabel = (mins) => {
  const d = new Date(Date.now() - mins * 60000);
  const days = Math.floor(mins / 1440);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

export const track = (event, props) => console.log("[analytics]", event, props || "");

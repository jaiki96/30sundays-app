// AI Couple Photos: mock catalog + copy.
//
// Prototype only. There is no image generation here. Each "generated" image is
// a real couple photo already in the app's library, paired with a curated
// location name so the gallery reads the way the real feature would.
import { customerPhotos, destData } from "../data";

// No daily rotation: a couple uploads once, picks a place, and gets the whole
// set back at once. A set holds whatever has been generated for that
// destination, so this is the target rather than a promise the data can keep.
export const IMAGES_PER_BATCH = 5;

// The real generated set. Same couple, same clothes, placed at real spots, so
// the prototype finally shows what the feature actually produces.
//
// Only these five exist today, spread over four countries, so a destination has
// as many pictures as were made for it rather than a padded five. Adding more
// is a matter of dropping files in public/ai-photos and listing them here.
const IMG = "/ai-photos";

// What the couple uploaded. Plain wall, daylight, both faces, head to toe:
// exactly what the upload screen asks for, so it doubles as the good example.
export const ORIGINAL_PHOTO = `${IMG}/original.jpg`;

export const AI_DESTINATIONS = [
  {
    slug: "bali",
    name: "Bali",
    hero: destData.Bali?.hero,
    blurb: "Rice terraces, cliff temples, warm evenings",
    facts: [
      "Kelingking Beach is on Nusa Penida, a boat ride off Bali's east coast.",
      "Ubud is green and quiet. The south coast is where the beach clubs are.",
      "Most couples need six or seven nights to see both sides without rushing.",
      "The west coast is the sunset side. Book dinner late and eat facing the sea.",
    ],
    images: [
      { src: `${IMG}/bali-kelingking.jpg`, location: "Kelingking Beach" },
    ],
  },
  {
    slug: "thailand",
    name: "Thailand",
    hero: destData.Thailand?.hero,
    blurb: "Island water, temple mornings, night markets",
    facts: [
      "Railay has no roads. The only way in is by longtail boat.",
      "Chiang Mai in the north is cooler and quieter than the islands.",
      "Most couples split the trip: a few nights in a city, then the islands.",
      "Wat Rong Khun, the white temple, sits near Chiang Rai in the far north.",
    ],
    images: [
      { src: `${IMG}/thailand-railay.jpg`, location: "Railay Beach at sunset" },
      { src: `${IMG}/thailand-white-temple.jpg`, location: "Wat Rong Khun" },
    ],
  },
  {
    slug: "maldives",
    name: "Maldives",
    hero: destData.Maldives?.hero,
    blurb: "Overwater mornings and very quiet evenings",
    facts: [
      "There are no roads. You move between islands by speedboat or seaplane.",
      "Most resorts have an island to themselves, so it stays quiet all week.",
      "Overwater rooms cost a good bit more than the ones on the beach.",
      "Seaplanes only fly in daylight, so your landing time decides your first day.",
    ],
    images: [
      { src: `${IMG}/maldives-jetty.jpg`, location: "Your overwater deck" },
    ],
  },
  {
    slug: "vietnam",
    name: "Vietnam",
    hero: destData.Vietnam?.hero,
    blurb: "Bays, lantern streets, mountain mornings",
    facts: [
      "The Golden Bridge sits in the hills above Da Nang, reached by cable car.",
      "North to south is over 1,600 km, so most couples fly between stops.",
      "Ha Long Bay is best as an overnight on the water, not a day trip.",
      "Hoi An turns its lanterns on every evening once it gets dark.",
    ],
    images: [
      { src: `${IMG}/vietnam-golden-bridge.jpg`, location: "The Golden Bridge" },
    ],
  },
];

export function getDestination(slug) {
  return AI_DESTINATIONS.find((d) => d.slug === slug) || null;
}

// Every generated image there is, as one flat set. The picked destination's own
// pictures lead, the rest follow.
//
// The five that exist span four countries, so a per-destination set would be
// one or two pictures long. Showing all five and labelling each with its real
// place beats showing one: the gallery reads the way it will read once there
// are five for every destination.
export function getGeneratedBatch(slug) {
  const ordered = [
    ...AI_DESTINATIONS.filter((d) => d.slug === slug),
    ...AI_DESTINATIONS.filter((d) => d.slug !== slug),
  ];
  return ordered.flatMap((dest) =>
    dest.images.map((img, i) => ({
      id: `${dest.slug}-${i}`,
      src: img.src,
      location: img.location,
      destination: dest.name,
      slug: dest.slug,
    }))
  ).map((img, index) => ({ ...img, index }));
}

// ─── Upload guidance ───
// Shown as pictures, not just a list, because a photo of the wrong photo is
// worth more than a sentence about it.
const CP = customerPhotos;

export const GOOD_EXAMPLE = { src: ORIGINAL_PHOTO, caption: "Both faces, head to toe" };

export const BAD_EXAMPLES = [
  { src: (CP.Thailand || [])[14], caption: "More than two people" },
  { src: (CP.Vietnam || [])[6], caption: "Face covered or too close" },
  { src: (CP.Maldives || [])[1], caption: "Too far to see who you are" },
];

// ─── Home section ───
// The couple's own photo stays put while four destinations sweep over it, so
// "one photo in, many places out" is shown rather than explained. Hand picked
// so every one is clearly a couple.
export const SECTION_OWN_PHOTO = ORIGINAL_PHOTO;

export const SECTION_SHOTS = [
  { src: `${IMG}/bali-kelingking.jpg`, place: "Bali" },
  { src: `${IMG}/thailand-railay.jpg`, place: "Thailand" },
  { src: `${IMG}/maldives-jetty.jpg`, place: "Maldives" },
  { src: `${IMG}/vietnam-golden-bridge.jpg`, place: "Vietnam" },
];

export const GUIDELINES = [
  "Both of your faces clearly visible",
  "Head to toe, standing together",
  "Daylight, and no heavy filters",
];

// ─── Copy ───
// Couples-anchored throughout. Never "package", "deal", "cheap", "standard".
export const COPY = {
  // Home section
  sectionKicker: "NEW",
  sectionTitleLead: "See yourselves",
  sectionTitleAccent: "there",
  sectionSub: "One photo now. Five holiday pictures you have not taken yet.",
  sectionCta: "Add your photo",

  // The section mirrors the module. Once a couple starts, this is where they
  // come back to, so it has to say where things stand without them tapping in.
  sectionBusyKicker: "IN PROGRESS",
  sectionBusyTitle: "Your pictures are on the way",
  sectionBusySub: "We are making them now. They will show up right here.",
  sectionBusyCta: "View gallery",
  sectionReadyKicker: "READY",
  sectionReadyTitle: "Yayy! Your vacation pics are here.",
  sectionReadySub: (destName) => `You two in ${destName}, and a few more places.`,
  sectionReadyCta: "View your photos",
  sectionProgress: (n, total) => `${n} of ${total} ready`,

  // Upload
  uploadTitle: "Add one photo of you two",
  uploadSub: "This one photo is going to five places.",
  uploadPickCta: "Choose a photo",
  uploadChangeCta: "Choose a different photo",
  uploadEmpty: "One photo with both of you in it",
  goodTitle: "What works",
  badTitle: "What won't work",
  // Consent is carried by the act of continuing, so there is no checkbox to
  // tick before the button will work.
  consentInline: "By continuing, you agree we can use this photo to create images of you two with AI.",
  uploadSubmitCta: "Continue",
  aiNote: "*Your images will be AI generated",

  // Destination
  destTitle: "Where are you dreaming of?",
  destSub: "Pick where you're dreaming of. We'll start there.",
  surpriseTitle: "Surprise us",
  surpriseSub: "We'll pick a place for you two",

  // Generating
  generatingTopBar: "In transit",
  generatingTitle: (destName) => `Painting you both into ${destName}`,
  generatingSub: "Each one lands as it finishes. This takes a few seconds.",
  // Something to read while the pictures land, so the wait is never a blank
  // screen with a spinner on it.
  factLabel: (destName) => `While you wait, about ${destName}`,

  // The baggage belt line. It says "delayed, not lost", which is the thing they
  // actually want to know: the photo is still there and nothing needs redoing.
  failedTopBar: "Small hiccup",
  failedTitle: "Your pictures missed the belt",
  failedSub: "They come round again. Give it one more go.",
  failedCta: "Try again",

  // Gallery
  galleryTitle: "Just landed",
  changePhoto: "Change photo",
  changePlace: "Change place",
  removeAll: "Remove my photos",

  aiTag: "AI generated",
  planTripCta: (destName) => `Plan my ${destName} trip`,

  // Share
  shareTitle: (destName) => `Look at us in ${destName}`,
  shareText: (destName, location) => `Look at us at ${location}. ${destName} is next. Made on 30 Sundays.`,
  shareSheetTitle: "Share this",
  shareCopied: "Link copied",

  // Remove
  removeTitle: "Remove your photos?",
  removeSub: "This deletes your photo and every image we made of you two. You can start again any time.",
  removeConfirm: "Remove everything",
  removeCancel: "Keep them",

  // Rejection. Wired but never triggered by real detection in this prototype:
  // the dev panel forces each one so the wording can be reviewed.
  rejections: {
    no_face: {
      title: "We can't see both faces",
      body: "We need to see both of you clearly. Try a photo taken in daylight with nothing covering your faces.",
    },
    group_photo: {
      title: "There are more than two people here",
      body: "This one is just for the two of you. Try a photo with only you both in it.",
    },
    too_far: {
      title: "You're a bit too far away",
      body: "Try a photo where you're both closer to the camera, head to toe if you can.",
    },
    moderation: {
      title: "This photo won't work",
      body: "Try another one.",
    },
    minor_detected: {
      title: "We can't use this photo",
      body: "This photo looks like it has a child in it. Please use a photo of adults only.",
    },
  },
};

// Analytics stub. The prototype fires nothing. Handlers and event names match
// section 15 of the PRD so wiring the real layer later is mechanical.
export function track(event, props = {}) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(`[analytics] ${event}`, props);
  }
}

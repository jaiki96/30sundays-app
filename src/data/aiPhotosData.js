// AI Couple Photos: mock catalog + copy.
//
// Prototype only. There is no image generation here. Each "generated" image is
// a real couple photo already in the app's library, paired with a curated
// location name so the gallery reads the way the real feature would.
import { customerPhotos, destData } from "../data";

// One batch per destination. No daily rotation: a couple uploads once, picks a
// place, and gets the whole set back at once.
export const IMAGES_PER_BATCH = 5;

// Indices are hand picked so every image actually shows a couple. Most of the
// library is candid holiday snaps, plenty of them solo.
export const AI_DESTINATIONS = [
  {
    slug: "bali",
    name: "Bali",
    hero: destData.Bali?.hero,
    blurb: "Rice terraces, cliff temples, warm evenings",
    locations: [
      "Tegallalang Rice Terraces",
      "Uluwatu Cliff Temple",
      "Kelingking Beach",
      "Handara Gate",
      "Tanah Lot at sunset",
    ],
    photos: [0, 2, 3, 13, 7].map((i) => (customerPhotos.Bali || [])[i]),
  },
  {
    slug: "thailand",
    name: "Thailand",
    hero: destData.Thailand?.hero,
    blurb: "Island water, temple mornings, night markets",
    locations: [
      "Phi Phi Viewpoint",
      "Wat Arun",
      "Railay Beach",
      "Doi Suthep",
      "Maya Bay",
    ],
    photos: [0, 3, 2, 6, 10].map((i) => (customerPhotos.Thailand || [])[i]),
  },
  {
    slug: "maldives",
    name: "Maldives",
    hero: destData.Maldives?.hero,
    blurb: "Overwater mornings and very quiet evenings",
    locations: [
      "Your overwater deck",
      "A private sandbank",
      "Sunset on the shore",
      "The coral garden",
      "Dinner on the sand",
    ],
    photos: [6, 12, 14, 8, 0].map((i) => (customerPhotos.Maldives || [])[i]),
  },
  {
    slug: "vietnam",
    name: "Vietnam",
    hero: destData.Vietnam?.hero,
    blurb: "Bays, lantern streets, mountain mornings",
    locations: [
      "Ha Long Bay",
      "Golden Bridge",
      "Hoi An lanterns",
      "Ninh Binh by boat",
      "Sapa terraces",
    ],
    photos: [7, 5, 0, 12, 2].map((i) => (customerPhotos.Vietnam || [])[i]),
  },
];

export function getDestination(slug) {
  return AI_DESTINATIONS.find((d) => d.slug === slug) || null;
}

// The whole set for a destination, in the order it is shown in the gallery.
export function getGeneratedBatch(slug) {
  const dest = getDestination(slug);
  if (!dest) return [];
  return dest.locations.slice(0, IMAGES_PER_BATCH).map((location, i) => ({
    id: `${slug}-${i}`,
    src: dest.photos[i],
    location,
    destination: dest.name,
    slug: dest.slug,
    index: i,
  }));
}

// ─── Upload guidance ───
// Shown as pictures, not just a list, because a photo of the wrong photo is
// worth more than a sentence about it.
const CP = customerPhotos;

export const GOOD_EXAMPLE = { src: (CP.Thailand || [])[0], caption: "Both faces, standing together" };

export const BAD_EXAMPLES = [
  { src: (CP.Thailand || [])[14], caption: "More than two people" },
  { src: (CP.Vietnam || [])[6], caption: "Face covered or too close" },
  { src: (CP.Maldives || [])[1], caption: "Too far to see who you are" },
];

export const GUIDELINES = [
  "Both of your faces clearly visible",
  "Head to toe, standing together",
  "Daylight, and no heavy filters",
];

// ─── Copy ───
// Couples-anchored throughout. Never "package", "deal", "cheap", "standard".
export const COPY = {
  // Upload
  uploadTitle: "Add one photo of you two",
  uploadSub: "We'll use it to make five pictures of you both at the place you pick.",
  uploadPickCta: "Choose a photo",
  uploadChangeCta: "Choose a different photo",
  uploadEmpty: "One photo with both of you in it",
  goodTitle: "What works",
  badTitle: "What won't work",
  consent: "We'll use this photo to create images of you two.",
  uploadSubmitCta: "Continue",
  aiNote: "*Your images will be AI generated",

  // Destination
  destTitle: "Where are you dreaming of?",
  destSub: "Pick one. We'll place you both at five spots there.",
  surpriseTitle: "Surprise us",
  surpriseSub: "We'll pick a place for you two",

  // Generating
  generatingTitle: (destName) => `Painting you both into ${destName}`,
  generatingSub: "This takes a few seconds. You can stay on this screen.",

  failedTitle: "That didn't come through",
  failedSub: "Nothing lost. Give it another go.",
  failedCta: "Try again",

  // Gallery
  galleryTitle: "You two in",
  changePhoto: "Change photo",
  changePlace: "Change place",
  removeAll: "Remove my photos",

  aiTag: "AI generated",
  planTripCta: (destName) => `Plan my ${destName} trip`,

  // Share
  shareTitle: (destName) => `Us two in ${destName}`,
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

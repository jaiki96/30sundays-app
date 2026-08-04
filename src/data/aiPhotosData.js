// AI Couple Photos: mock catalog + copy.
//
// Prototype only. There is no image generation here. Each "generated" image is
// a real couple photo already in the app's library, paired with a curated
// location name so the carousel reads the way the real feature would.
//
// Content rule from the PRD: a destination needs all 7 locations before it can
// appear in the picker, so only these three are live.
import { customerPhotos, destData } from "../data";

// 7 curated locations per destination, in cycle order. Location 1 is always
// what a couple sees first, and the cycle loops back to it after location 7.
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
      "Campuhan Ridge Walk",
      "Tirta Empul",
    ],
    photos: (customerPhotos.Bali || []).slice(0, 7),
  },
  {
    slug: "thailand",
    name: "Thailand",
    hero: destData.Thailand?.hero,
    blurb: "Island water, temple mornings, night markets",
    locations: [
      "Wat Arun",
      "Railay Beach",
      "Phi Phi Viewpoint",
      "Doi Suthep",
      "Maya Bay",
      "The Grand Palace",
      "Erawan Falls",
    ],
    photos: (customerPhotos.Thailand || []).slice(0, 7),
  },
  {
    slug: "maldives",
    name: "Maldives",
    hero: destData.Maldives?.hero,
    blurb: "Overwater mornings and very quiet evenings",
    locations: [
      "Your overwater deck",
      "A private sandbank",
      "Banana Reef",
      "Sea of Stars beach",
      "The coral garden",
      "Sunset on a dhoni",
      "Dinner on the sand",
    ],
    photos: (customerPhotos.Maldives || []).slice(0, 7),
  },
];

export const LOCATIONS_PER_DESTINATION = 7;

export function getDestination(slug) {
  return AI_DESTINATIONS.find((d) => d.slug === slug) || null;
}

// The image + location for a given destination and point in the cycle.
// Index wraps, so day 8 is location 1 again.
export function getGeneratedImage(slug, locationIndex) {
  const dest = getDestination(slug);
  if (!dest) return null;
  const i = ((locationIndex % LOCATIONS_PER_DESTINATION) + LOCATIONS_PER_DESTINATION) % LOCATIONS_PER_DESTINATION;
  return {
    src: dest.photos[i],
    location: dest.locations[i],
    locationIndex: i + 1, // 1-based, matches the analytics property
    destination: dest.name,
    slug: dest.slug,
  };
}

// ─── Copy ───
// Couples-anchored throughout. Never "package", "deal", "cheap", "standard".
export const COPY = {
  nudgeTitle: (destName) => `Picture you both in ${destName}.`,
  nudgeSub: "One photo of you two, and we'll take it from there.",

  uploadTitle: "See you both there",
  uploadSub: "Add one photo of you two. We'll place you at a new spot every day.",
  uploadHint: "Blurry, sunglasses, side profile: all fine. Faces just need to be visible.",
  uploadPickCta: "Choose a photo",
  uploadChangeCta: "Choose a different photo",
  consent: "We'll use this photo to create images of you two. Both of you agreed to this.",
  uploadSubmitCta: "Continue",

  destTitle: "Where are you dreaming of?",
  destSub: "Pick one. You'll see you both somewhere new there each day.",

  generatingTitle: (destName) => `Painting you both into ${destName}`,
  generatingSub: "This takes a few seconds.",

  failedTitle: "That didn't come through",
  failedSub: "Nothing lost. Give it another go.",
  failedCta: "Try again",

  revealKicker: "Here you are",

  aiTag: "AI generated",
  offlineTag: "Offline. Showing your last one.",

  settingsTitle: "Your photos",
  removeTitle: "Remove your photo?",
  removeSub: "This deletes your photo and every image we made of you two. You can start again any time.",
  removeConfirm: "Remove everything",
  removeCancel: "Keep them",

  // Rejection copy. Wired but never triggered by real detection in this
  // prototype: the dev panel forces each one so the wording can be reviewed.
  rejections: {
    no_face: {
      title: "We can't see a face",
      body: "We need at least one face we can recognise. Try a photo where you're both facing the camera.",
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

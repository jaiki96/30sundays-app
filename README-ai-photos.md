# AI Couple Photos - prototype

A clickable prototype: a couple uploads one photo, picks a place, and gets five
pictures of the two of them there.

This is for design review. There is no image generation, no face detection and
no real auth. Generation is a 6 second delay that swaps in a real generated set:
the same couple, in the same clothes, placed at real spots. The photo they
"upload" is the real source photo those were made from.

## Where it runs

| Where | Address |
|---|---|
| Its own deployment | the ai-photos subdomain, where the AI home is `/` |
| The module itself | `/ai-photos` |
| Section designs, for review | `/ai-section-options` |
| The main prototype | untouched |

The two share one branch. The app checks the hostname, so nothing needs
configuring per environment.

## The flow

Full screen throughout. No bottom sheets.

1. **Upload.** One photo of the two of them. Guidance is shown as pictures, not
   just a list: one example of what works with three rules beside it, then three
   examples of what won't. Continue enables as soon as a usable photo is in.
   Consent rides on the button: a line above it says that continuing means the
   photo can be used to make their images with AI. There is nothing to tick.
2. **Rejection.** If the photo is wrong, the reason sits flat under the picker
   with no panel of its own, so it does not compete with the photo card above
   it, and a "Choose another photo" button follows. Continue locks. Five reasons
   are written: no face, group photo, too far, moderation, minor detected.
   Nothing detects any of them; the dev panel forces each one.
3. **Destination.** Four places plus "Surprise us", which picks for them and
   never repeats the one they are already on.
4. **Generating.** Five tiles land one at a time over the delay, so the wait has
   a shape. Failure gets its own screen with a retry.
5. **Gallery.** All five images in a 9:16 grid, the picked destination's own
   pictures leading. Each tile carries its real spot and country. Two chips at
   the top change the photo or the place. Bin icon removes everything, and asks
   first.
6. **Viewer.** Tap any image for full screen. Swipe or drag between the five,
   arrow keys on desktop. Close, share, an AI generated tag, thumbs up and down
   (one vote per image), a counter, dots, and "Plan my [place] trip".

**Share** calls the Web Share API, so on a phone it opens the real iOS or
Android drawer and the couple picks the app themselves, WhatsApp included.
Dismissing that drawer does nothing. Where the API does not exist (desktop
review) a labelled stand-in sheet opens, WhatsApp first. The share carries a
title, a line of text and the app link; attaching the image itself needs a real
file, so that comes with real generation.

## Reaching every state

Open the dev panel with the flask button at the bottom left of `/ai-photos`.

| State | How to reach it |
|---|---|
| Logged out | Dev panel, Logged out. The entry point opens the app's own login screen, which lands on upload, not home. |
| No photo | Dev panel, No photo |
| Generating | Dev panel, Generating |
| Gallery ready | Dev panel, Gallery ready |
| Generation failed | Dev panel, Generation failed |
| Removed | Dev panel, Removed |
| Offline | Dev panel, Offline |
| Any upload rejection | Dev panel, Upload rejection. Each one opens the upload screen so the wording reads in place. |
| Any screen directly | Dev panel, Screen |

## Entry points

**The home section**, directly under the three USPs. A blush panel with the
title, one line, and one image: the couple's own photo stays put while four
destinations sweep over it in turn, each holding for two seconds before sweeping
back off. The place name arrives clipped with its own picture. Reduced motion
gets a held split instead. The button opens `/ai-photos`.

It is slotted into the shared lower sections through an optional prop that only
the AI home passes, so the live home at `/` is untouched.

**Account**, under the Account group.

The six designs that were considered are still at `/ai-section-options`.

## Notes for whoever builds this for real

- Analytics fire nothing. Handlers are named to match the event names in the
  PRD, so wiring the real layer is mechanical. In dev they log to the console.
- State lives in React plus a small in-memory store, so it survives navigation
  and resets on reload. No browser storage, deliberately.
- Reduced motion is respected.
- **Five generated images exist so far, across four countries**: Bali 1,
  Thailand 2, Maldives 1, Vietnam 1. A per-destination set would therefore be
  one or two pictures long, so the gallery shows all five with the picked
  destination leading, and each tile names its real spot and country. The
  header is "Your photos" rather than "You two in X", because the set spans
  places. Once there are roughly five per destination, `getGeneratedBatch`
  goes back to returning just that destination's slice and the header can name
  it again. Drop files in `public/ai-photos` and list them in
  `AI_DESTINATIONS`.
- The three "what won't work" examples are still library snaps, deliberately:
  they need to look wrong.

## Not built

Real generation, real face detection, real auth, notifications, backend
persistence, and analytics delivery. Share hands off to the OS for real, but
sends a link rather than the image file.

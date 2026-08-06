# AI Couple Photos - prototype

A clickable prototype: a couple uploads one photo, picks a place, and gets five
pictures of the two of them there.

This is for design review. There is no image generation, no face detection and
no real auth. Generation is a 6 second delay that swaps in real couple photos
from the app's existing library, paired with curated location names.

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
   examples of what won't. Consent must be ticked before Continue enables.
2. **Rejection.** If the photo is wrong, the reason appears against the picker,
   Continue locks, and a "Choose another photo" button sits inside the message.
   Five reasons are written: no face, group photo, too far, moderation, minor
   detected. Nothing detects any of them; the dev panel forces each one.
3. **Destination.** Four places plus "Surprise us", which picks for them and
   never repeats the one they are already on.
4. **Generating.** Five tiles land one at a time over the delay, so the wait has
   a shape. Failure gets its own screen with a retry.
5. **Gallery.** Five images in a 9:16 grid. Two chips at the top change the
   photo or the place. Bin icon removes everything, and asks first.
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

Account, under the Account group. The home screen section that will be the main
entry point is still being chosen: five designs are at `/ai-section-options`.
Once one is picked it sits under the three USPs and opens `/ai-photos`.

## Notes for whoever builds this for real

- Analytics fire nothing. Handlers are named to match the event names in the
  PRD, so wiring the real layer is mechanical. In dev they log to the console.
- State lives in React plus a small in-memory store, so it survives navigation
  and resets on reload. No browser storage, deliberately.
- Reduced motion is respected.
- The photos are candid customer snaps, not shot for this. Indices are hand
  picked so every one actually shows a couple; plenty of the library is solo.
  A real launch wants proper generated samples.

## Not built

Real generation, real face detection, real auth, notifications, backend
persistence, and analytics delivery. Share hands off to the OS for real, but
sends a link rather than the image file.

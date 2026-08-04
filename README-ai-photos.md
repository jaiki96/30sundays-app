# AI Couple Photos - prototype

A clickable prototype of the home hero feature: a couple uploads one photo and
sees themselves at a new spot in their chosen destination each day.

This is for design review. There is no image generation, no face detection and
no real auth. Generation is a 6 second delay that swaps in a real couple photo
from the app's existing library, paired with a curated location name.

## Where it runs

| Where | Address |
|---|---|
| Its own deployment | the ai-photos subdomain, where this is the home at `/` |
| The main prototype | `/ai`, so the live home at `/` is untouched |
| Locally | `npm run dev`, then `/ai` |

The two share one branch. The app checks the hostname, so nothing needs
configuring per environment.

## Reaching every state

Open the dev panel: tap the flask button at the bottom left, or triple tap the
hero. Every state below is one tap away, so nobody has to wait out the
generation delay.

| State | What renders | How to reach it |
|---|---|---|
| Logged out | Marketing slides plus the nudge. Tapping opens a mock login, which lands on the upload sheet, not back on home. | Dev panel, Logged out |
| Logged in, no photo | Marketing slides plus the nudge. Tapping opens the upload sheet directly. | Dev panel, No photo |
| Generating | In-progress slide in slot 0. The carousel keeps rotating and the whole home stays interactive. | Dev panel, Generating |
| Generated, unseen | Reveal plays once in slot 0, then settles into the carousel. Never replays. | Dev panel, Generated unseen |
| Generated, seen | Personalized slide in slot 0. Tap opens full screen. | Dev panel, Generated seen |
| Generation failed | Retry sits in the slot. Retry re-runs the delay and succeeds. | Dev panel, Generation failed |
| Hidden | Slide pulled from the carousel. The nudge does not come back. Unhide from settings. | Dev panel, Hidden |
| Removed | Back to no photo. The nudge does not come back. | Dev panel, Removed |
| Nudge dismissed | Closes instantly, no confirmation. | Tap the X, or dev panel, Nudge |
| Offline | The cached image still renders, with the offline treatment. | Dev panel, Offline |
| Upload rejections | Copy for no face, moderation and minor detected. No real detection behind any of them. | Dev panel, Upload rejection, then open the upload sheet |

Destination and the spot in the 7 location cycle are also switchable from the
panel.

## Flows

**Upload.** Nudge, then a half-modal upload sheet. Any file is accepted, with no
person-count check: solo, couple and group all work. Consent must be ticked
before Continue enables. Then the destination picker, then generating, then the
reveal.

**Settings.** Reachable from "Your photos" under the hero once a photo exists.
Four rows: change destination (restarts the cycle at spot 1 and regenerates),
replace photo (regenerates the current spot), hide (instant), remove (asks
first).

**Full screen.** Image fills the frame. Close, hide, a subtle AI generated tag
and a thumbs-down.

## Carousel

Auto-advances every 10 seconds. The personalized slide is always first when
present. Swiping or tapping pauses it, and it resumes after 15 seconds idle. A
newly generated image pins to the first slot and plays its reveal before normal
rotation starts. A single item renders as a static hero with no dots. Every
slide carries the same scrim, since generated image brightness varies.

The auto-advance timer is local to the carousel. Lifting it up would re-render
the whole home every 10 seconds and reset the scroll position.

## Notes for whoever builds this for real

- Analytics fire nothing. Handlers are named to match the event names in section
  15 of the PRD, so wiring the real layer is mechanical. In dev they log to the
  console with the event name and properties.
- State lives in React plus a small in-memory store, so it survives navigation
  and resets on reload. No browser storage, deliberately.
- Reduced motion is respected: both the reveal and the auto-scroll have a
  reduced variant.
- Only Bali, Thailand and Maldives appear in the picker, matching the rule that
  a destination needs all 7 locations before it goes live.

## Not built

Real generation, real face detection, real auth, notifications, sharing, backend
persistence, the 30 day nudge timer, and analytics delivery.

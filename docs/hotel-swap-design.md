# Hotel Swap - Design Doc

Module: itinerary customisation, hotel substitution.
Scope: hotels only in this doc, but every decision is made so the same mental model can be reused for **day plan** swaps and **flight** swaps later.

---

## 1. Where the user is and how they feel

### 1.1 Funnel position
The user is on the **Itinerary Detail** page. They have already:
- Picked a destination.
- Seen a curated multi-day plan.
- Mentally committed to "this is roughly my trip".

They have **not yet** paid. The next button is "Plan My Trip".

This is the *high-intent, high-anxiety* moment in any travel funnel. Conversion research (Expedia, Booking, Phocuswright 2023) puts drop-off between "view itinerary" and "checkout" at 40-60% precisely because trust collapses if anything feels wrong or hidden.

### 1.2 Emotional state
Three things are happening at once in the user's head:

| Emotion | What is causing it | What they want |
|---|---|---|
| **Excitement** | They can finally see the trip. | Visual confirmation, hero imagery, "this is real". |
| **Doubt** | "Is this hotel actually good? Is there something better?" | Social proof, alternatives, a sense they explored. |
| **Loss aversion** | "If I commit and there was a better option, I lose." | Cheap, low-risk way to compare without losing the original. |

The swap feature exists primarily to **discharge doubt and loss aversion** so excitement wins. It is not really a "feature", it is a **trust mechanism**.

### 1.3 What they want to do
Ranked by frequency we should expect:

1. **Reassure themselves the recommended hotel is fine.** (60-70%) They open alternatives, glance, close. They do not swap. Design must reward this with confidence, not punish with friction.
2. **Upgrade.** (15-20%) They want a nicer room, better location, higher star. The "Upgrade to 5" strip already targets this.
3. **Downgrade / save money.** (5-10%) Especially price-sensitive segments (honeymoon-on-budget, solo).
4. **Switch area** (e.g. Ubud town vs rice fields). (5-10%) Location preference, not price.
5. **Replace a hotel they recognise and dislike.** (rare, but a hard stop if blocked.)

### 1.4 Why they want to do it
Because every travel buyer has been trained by Booking and Airbnb to **comparison shop**. Removing the ability to compare reads as "this brand is hiding something". The job of the swap UX is not to discourage swapping, it is to make the curated default **look like the winner of a comparison the user is allowed to run themselves**.

---

## 2. Goals

### 2.1 User goal
"Let me satisfy myself that this hotel is the right pick, with the smallest possible amount of work, and reverse it if I change my mind."

### 2.2 Business goals
1. Protect the curated recommendation (it is the cheapest to fulfil and highest margin).
2. Capture upgrades when the user wants more (margin lift).
3. Avoid breaking the bundle (room nights, dates, transfer logic must stay valid).
4. Keep "Plan My Trip" as the dominant CTA. The swap UX must not steal its visual weight.

---

## 3. The decisions that will come up in the management meeting

These are the choices that look small but each shifts conversion, margin, and brand perception. I will recommend one, name the alternatives, and explain why.

### 3.1 Per-card "Change Hotel" button vs single global "Edit hotels" entry

**Options**
- **A. Per-card button on every hotel card** (current state in screenshot).
- **B. One "Edit hotels" pencil icon in the section header.** Tapping it enters an "edit mode" for all hotel cards at once.
- **C. Hybrid:** section header "Edit" toggles a swap chip onto each card; default view has no per-card CTA.

**Trade-off**

| | A. Per-card | B. Global edit | C. Hybrid |
|---|---|---|---|
| Discoverability | Highest | Lowest (icon is invisible) | Medium |
| Visual repetition | High (button on every card) | None | Low |
| Cognitive load on first view | Slightly higher (more pink) | Lowest | Lowest |
| Steps to swap | 1 tap | 2 taps | 2 taps |
| Reads as "you can customise" | Strongly | Weakly | Medium |
| Risk of accidental edit mode | None | Low | Low |

**Recommendation: A, with restraint.**
Per-card is correct here because:
- The hotel section is **horizontally scrolled**. The user does not see all hotels at once, so a single "edit" entry at the top is invisible by the time they reach hotel 3.
- The Booking / Airbnb / Kayak / MMT mental model is "every item is independently swappable". B violates that.
- **Repetition concern is real but cosmetic.** Solve it by **demoting the button visually** instead of removing it. Make it a quiet ghost button or a small swap icon, not a pink-outlined CTA. Reserve the heavy pink for "Plan My Trip" (the conversion CTA). The current outline pink "Change Hotel" button is too loud and competes with the primary CTA.

This is the single most important visual change. See section 6.

### 3.2 Curated shortlist vs full inventory

Already decided: **tiered.** Curated 3-5 picks, then "See all" infinite scroll.

What still needs to be decided in the meeting:
- **How many curated picks?** Recommend **3**. Hick's Law: more options = slower decision. Three covers (a) cheaper, (b) same tier different vibe, (c) upgrade.
- **How are they tiered?** Recommend visible chips: "Best value", "Most reviewed", "Quieter area" (or "Upgrade"). Booking calls these "Genius picks"; Airbnb uses "Guest favourite"; Hopper uses "Best deal". Generic ranking with no reason is the worst pattern - the user does not know why we picked these three and so trusts none.
- **What does "See all" actually contain?** Just real Booking inventory in that city for those dates, ranked by our score. The user expects the same options they would find on Booking themselves. Filtering it down breaks trust.

### 3.3 In-line swap vs dedicated screen vs bottom sheet

**Options**
- Inline expand on the card.
- Push a new full-screen route (`/swap-hotel/:dayRange`).
- Bottom sheet that overlays the itinerary.

**Recommendation: bottom sheet that opens at 70% viewport, drag-to-expand to full screen.**

Reasons:
- Keeps the itinerary visible behind it. The user does not lose context. This is the Apple Maps / Airbnb / Uber pattern. It is the dominant mobile mental model in 2025.
- Drag to full screen lets us host the infinite "See all" list without a route change.
- Closing it preserves scroll position on the itinerary. A pushed route loses that.
- One animation instead of two transitions per swap means it feels lighter for the user reassuring themselves (case 1.3.1, the 60-70%).

A full-page route only wins if the swap experience itself is multi-step (filters, sort, map). For an MVP curated-first flow, the sheet is correct.

### 3.4 Price delta: when and how to show

Already decided: live recalculation.

What is not decided:
- **Where the delta appears.** Recommend two places: (1) **inside the swap sheet, on each option card** (e.g. `+₹4,500 / person` in coral, `-₹2,000` in green). (2) **In the sticky "Plan My Trip" footer** the new total replaces the old with a brief micro-animation so the user sees the change land.
- **Whether to show the original price struck through.** No. It reads as discounting language. Show only the delta on the option and the new total on the footer.
- **Per-person vs total.** Match what the footer already shows: per-person, since that is how the user originally evaluated the trip.
- **What if the price drops?** Show "-₹2,000 / person" in the brand green, but do not over-celebrate it. Users get suspicious of large unexplained drops.

### 3.5 Same-tier swap is "Change", different-tier is "Upgrade"

The current card already shows two distinct ideas: a pink "Change Hotel" button and an "Upgrade to 5 star" strip.

**Recommendation: keep them separate, do not merge.**

Reasons:
- "Change" is a *lateral* action. Low commitment, reversible, no upsell tension.
- "Upgrade" is a *commercial* action. It carries a price tag and a sales tone.
- Merging them means every swap interaction is also a price negotiation. That kills the 60-70% "I just want to look" use case.
- This separation is what TUI, Black Tomato, and Kensington Tours all do in concierge bundles. Booking and Airbnb do not need this split because they have no curated base, but we do.

What to clean up: the "Upgrade to 5" strip currently looks like part of the hotel card body. It should be a separate, slimmer row visually distinct from the card chrome. It should also state the upgrade delta on the strip itself, not require a "See details" tap.

### 3.6 Confirmation friction and undo

**Options**
- No confirmation, instant swap, undo toast for 5s. (Gmail pattern.)
- Soft confirmation: "Swap to X? Price changes by +₹4,500." (Booking pattern.)
- Hard confirmation modal.

**Recommendation: instant swap + 5s undo toast.** Plus the swap sheet stays open after selection for ~600ms with a visible tick on the chosen card so the user has visual closure before the sheet closes.

Reasons:
- The action is fully reversible (you can swap again).
- Confirmation modals on a low-stakes action train users to dismiss dialogs without reading. That is bad when we later need a real confirmation (e.g. flight time change).
- An undo toast is more trustworthy than a confirmation because it preserves the *Quick Look* nature of the whole feature.

### 3.7 What about the hotel detail page (PDP)?

The user currently navigates to a hotel PDP by tapping the card image / title. The "Change Hotel" button should **not** go to the PDP. PDP is for *evaluating the current hotel*. Swap is for *evaluating alternatives*. Mixing them is the most common mistake in travel UX (Expedia historically conflated these and saw measured drop in swap rate).

So the rule is:
- Tap **card body / image / title** = open this hotel's PDP.
- Tap **Change Hotel** = open swap sheet.
- Inside the swap sheet, tap an **alternative's image** = open *that* hotel's PDP modally (pushed on top of the sheet, dismiss returns you to the sheet with state preserved).
- Inside the swap sheet, tap **Select** on an option = perform swap.

---

## 4. Competitive benchmarks

| Brand | Pattern | What we steal | What we reject |
|---|---|---|---|
| **Booking.com** | Full search, filter heavy, no curation. | Inventory depth, review density display, "Genius pick" badge language. | The naked-search feeling. We are a curator, not a search engine. |
| **Airbnb** | Wishlist + side-by-side compare. "Guest favourite" badge. | The reason-to-believe badge per option. The clean card with image priority. | Map-first interaction. Our user does not yet care about map. |
| **Kayak / Skyscanner** | Sort/filter rails. | Sort chip pattern at the top of the list. | Filter heaviness on first open. |
| **Hopper** | Price-prediction-first, color emotion. | The price-delta colour language (green / coral). The "freeze price" trust gesture (not for v1 but worth noting). | Game-y tone. |
| **MakeMyTrip Holidays** | Bundle with per-component "Change" buttons, modal swap. | The "Change" affordance per component (it is the local mental model in India and our user base). | The cluttered card, the upsell strips stacked everywhere. |
| **Expedia bundles** | Tabbed change flow (hotel / flight / car). | Treating the bundle as the unit of price truth. | Tabbed editing is heavy. |
| **TUI / Thomas Cook** | Pre-bundled, opaque swap. | The "if you change this, your day plan stays valid" guarantee. | Opacity. We will be transparent. |
| **Black Tomato / Kensington** (concierge) | "Tell us what you want and we adjust." | The trust-by-curation positioning. | Non-self-serve. |
| **Headout / Klook** (activities) | Per-slot swap. | The slot-and-swap pattern that we will reuse for days/activities later. | Volume-driven listing. |
| **Hotels.com** | Reward member badges, sort by "recommended". | "Recommended" with a why. | Loyalty noise. |
| **Apple Maps / Uber** | Bottom sheet, drag to expand. | The whole interaction shell for the swap sheet. | (nothing) |

The pattern we are building from this:
> **Curator-style bundle (TUI / MMT) + per-item Booking-style swap depth + Hopper-style price emotion + Apple Maps bottom sheet shell.**

---

## 5. Design principles applied

1. **Recognition over recall** (Nielsen #6). The user should never have to remember what hotel they had before. Original is pinned in the sheet header.
2. **Progressive disclosure.** Show the curated 3 first. The full list is one tap deeper.
3. **Default + escape hatch** (Hick's Law + Tesler's Law of conservation of complexity). Keep the default lightweight; do not punish the power user.
4. **Direct manipulation** (Shneiderman). The card swap happens in place, not on a confirmation page.
5. **Reversibility** (Nielsen #3). 5s undo. No data is lost on swap.
6. **Status visibility** (Nielsen #1). Price delta visible on each option and on the sticky footer.
7. **Aesthetic and minimalist design** (Nielsen #8). Demote the swap CTA so it does not fight the conversion CTA.
8. **Match between system and real world.** "Change hotel" is the everyday phrase. Not "modify accommodation".
9. **Consistency** (Nielsen #4). The same sheet pattern will be used for day swap and flight swap. Same triggers, same animations, same delta language.
10. **Speed of light feeling** (Apple HIG). Curated picks should be pre-fetched at itinerary load so the sheet opens instantly.

---

## 6. Recommended UX (synthesis)

### 6.1 On the itinerary card

What changes from today:

- The pink-outlined "Change Hotel" button becomes a **quiet ghost chip**: small swap icon + "Change" in 12px figtree, neutral grey border, sits at top-right of the hotel card. It stops competing with "Plan My Trip".
- The "Upgrade to 5" strip moves below the card as a thin row, with the price delta on the strip itself ("Upgrade to 5 star for +₹6,800 / person").
- Tapping the card body or image still opens the hotel PDP (unchanged).
- Tapping the Change chip opens the swap sheet.

### 6.2 The swap sheet (bottom sheet, opens at 70% viewport)

```
┌─────────────────────────────────────┐
│  ──                                 │  drag handle
│  Day 1-2 · Ubud · 2 nights          │  context line
│                                     │
│  Currently selected                 │
│  ┌─────────────────────────────┐    │
│  │ [img] Ubud Grand Resort     │    │  pinned original, lower opacity
│  │ ★4.1 · Deluxe Room          │    │
│  └─────────────────────────────┘    │
│                                     │
│  Our picks for you                  │  curated 3
│  ┌─────────────────────────────┐    │
│  │ [img]   Komaneka at Bisma   │    │
│  │ ★4.6 · Best value           │    │  badge: why we picked
│  │ Deluxe Room · same tier     │    │
│  │ Same price        [Select]  │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ [img]   Adiwana Bisma       │    │
│  │ ★4.7 · Quieter area         │    │
│  │ +₹1,200 / person [Select]   │    │  coral delta
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ [img]   Viceroy Bali        │    │
│  │ ★4.9 · Upgrade to 5★         │    │
│  │ +₹6,800 / person [Select]   │    │
│  └─────────────────────────────┘    │
│                                     │
│  ─────  See all Ubud hotels  ─────  │  expands sheet to full + infinite list
│                                     │
└─────────────────────────────────────┘
Sticky footer (always visible behind/below sheet):
   From ₹62,498 / person     [Plan My Trip →]
```

### 6.3 After selection

- The chosen card gets a tick for ~600ms.
- Sheet closes.
- Card in the itinerary updates in place with a brief 200ms cross-fade on the image.
- Footer total animates to the new value.
- A toast at the bottom edge: `Swapped to Komaneka at Bisma   [Undo]` (5s).

### 6.4 The "See all" experience

- Sheet expands to full screen with a back arrow.
- Top: sticky filter chips (Price, Star, Area). Default: none applied.
- List: infinite scroll, same card structure as curated, no "best value" badges (since they were the curators' picks).
- Tapping a card image opens hotel PDP modally over the sheet.
- Tapping Select performs the swap, sheet closes back to itinerary.

### 6.5 Edge cases that must be designed up-front

| Case | Behaviour |
|---|---|
| User picks a hotel cheaper than the original | Show `-₹2,000` in brand green, no celebratory copy. Footer total drops with the same animation. |
| User picks an upgrade that breaks budget cap they earlier set | Soft warning chip on the option card: "Above your set budget". Allow swap. Do not block. |
| Picked hotel is sold out by checkout | At "Plan My Trip" tap, validate. If gone, modal: "Komaneka at Bisma just sold out. Reverting to Ubud Grand Resort. [OK]". |
| User swaps then swaps back to original | Treat as a normal swap. Toast: "Back to Ubud Grand Resort". |
| No alternatives in city (rare) | Sheet shows the original pinned + a single line: "We could not find better matches for these dates. Try changing days from the itinerary header." |

---

## 7. Trade-offs we should name out loud in the meeting

1. **Repetition of swap affordance on every card vs discoverability.** We are choosing discoverability. Mitigated by visually demoting it. *Risk: still feels noisy with 4 city stays. Mitigation: monitor scroll depth + swap rate; consider hybrid (3.1.C) if data shows users never reach later cards.*

2. **Live price recalculation vs anxiety.** Live wins on trust, loses on calm. Mitigation: animate the footer change subtly, no red flashes for increases. *Risk: users abandon when they see the price climb. Mitigation: show the delta on the option card *before* they Select, so the surprise is never on the footer.*

3. **Curated 3 vs full search depth.** We are choosing curated default + escape hatch. *Risk: power users feel constrained. Mitigation: the "See all" link is prominent, not hidden in a menu.*

4. **Bottom sheet vs full page.** Sheet wins on context preservation, loses on hosting heavy filters. Mitigation: drag-to-expand means full filters live in expanded state when needed.

5. **Instant swap + undo vs confirmation.** Instant wins on speed, loses on protection against accidental taps. Mitigation: undo toast lives for 5s. *Risk: users miss the toast on a fast scroll. Mitigation: also show "Swapped just now - Undo" inside the card chrome for 5s.*

6. **Showing per-person vs total price.** Per-person wins for evaluation, loses for the magnitude shock. We are matching the original display.

7. **Letting users pick hotels above budget cap.** Allow vs block. We allow, with warning. Blocking infantilises and is the most-complained-about pattern in MMT/Cleartrip reviews.

8. **Brand-promise tension.** We say "curated". But we then expose full Booking inventory. The wrong framing makes us look like a thin layer on Booking. The right framing is "we curate, but we never hide". The copy on "See all" should reflect this: not "Browse all hotels" (search-engine) but "Explore every option in Ubud" (curator giving you the keys).

---

## 8. How this scales to days and flights

This is why the sheet pattern matters - it must transplant.

### 8.1 Day plan swap (curated day variants, not activity-level)
- Per-day card on the itinerary has a quiet "Change day" chip.
- Sheet opens: pinned current day + 2-3 alternative day variants ("Slower pace", "More culture", "More adventure").
- Each shows the activity list compactly and a delta in time/cost.
- Select swaps the whole day. Undo toast.
- "See all" is not relevant here because we deliberately do not expose individual activity editing (per your direction: reduce cognitive load by curating at the day level).

### 8.2 Flight swap
- Per-flight card has the same quiet "Change flight" chip.
- Sheet opens: pinned current + 2-3 alternatives labeled ("Cheapest", "Shortest", "Best timing").
- Each shows delta vs original.
- "See all flights" expands to full inventory with the same chip filters (Price / Duration / Stops / Time of day).
- Same instant-swap + undo + footer animation.

The win: one mental model the user learns once.

---

## 9. What I will change in code (after you approve)

Files to add / touch (this is the implementation plan, not yet executed):

**New components**
- `src/components/itinerary/SwapSheet.jsx` - the bottom-sheet shell. Drag handle, snap points 70% / 100%, ESC to close.
- `src/components/itinerary/SwapSheetOption.jsx` - the per-alternative card with delta chip and Select.
- `src/components/itinerary/SwapToast.jsx` - undo toast with 5s countdown.
- `src/components/itinerary/ChangeChip.jsx` - the demoted ghost chip used on every itinerary card (will be reused for days and flights later).

**Modified components**
- `src/pages/ItineraryDetail.jsx` - replace the loud pink "Change Hotel" button with `<ChangeChip />`; mount `<SwapSheet />` at the page root with open/close state; wire price recalculation to the existing total.
- `src/components/itinerary/HotelCard.jsx` (or inline JSX in ItineraryDetail) - remove the heavy button, attach ChangeChip top-right.
- Upgrade strip - extract into its own component `UpgradeStrip.jsx`, move below the card, surface the delta on the strip.

**Data**
- `src/data/hotelAlternates.js` (new) - keyed by `{destination}-{cityIndex}`, returns the curated 3 with reason badges (`best-value`, `quieter-area`, `upgrade`) and price deltas.
- `src/data/hotels.js` or equivalent (existing) - extended to support the "See all" list per city.

**State**
- Selected hotel per city stored in URL params or context so price recalculation is centralised. Today the screenshot suggests selection is already URL-tracked (`?current=Ubud-hotel-0`); we keep that.

**Phases**
1. Phase 1: ChangeChip + SwapSheet with curated 3 only. No "See all". No price recalc. Visual swap, no money math. *Ships in ~half a day.*
2. Phase 2: Price recalculation wired to footer with animation. Delta chips on options.
3. Phase 3: "See all" infinite list + filter chips.
4. Phase 4: Undo toast.
5. Phase 5: Port the pattern to day-swap and flight-swap.

---

## 10. Open questions for you before I build

1. **Curated 3 source of truth.** Do you have a way to generate "best value / quieter area / upgrade" picks per city, or do I stub a JSON for now and we wire it to real data later?
2. **Price delta math.** Is per-night-per-room delta available in the data today, or do I fake it for now (e.g. `+₹X` random within a sane range)?
3. **Reason-to-believe badges.** Do you want me to use the three I proposed (Best value / Quieter area / Upgrade) or rename them to match brand voice?
4. **Booking inventory for "See all".** Real API later, stub list now?
5. **Are we OK demoting the Change CTA to a ghost chip?** This is the most visible UI change and would surprise the team if it lands without discussion.

Answer these and I will start Phase 1.

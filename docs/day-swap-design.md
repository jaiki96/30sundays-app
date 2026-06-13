# Day Swap - Design Doc

Module: itinerary customisation, day-plan substitution.
Companion to `hotel-swap-design.md`. Reuses the same swap-sheet shell, undo, and price-delta language so the user learns one mental model.

Day-swap is **harder** than hotel-swap, for three reasons:
1. A day is a bundle of activities, not a single SKU. The user is buying a *vibe*, not a *brand*.
2. The user sees a day in **three different places** in the app (at-a-glance row, day-detail page, full-screen video viewer). Where we place the swap entry decides whether the feature is found.
3. Swapping a day can **cascade**: changing Day 1 to "adventure" makes a stack of 4 high-energy days back-to-back, which is a worse trip even though each day looks good in isolation.

This doc resolves those three.

---

## 1. Where the user is and how they feel

### 1.1 Funnel position
Same as hotel-swap: itinerary detail page, pre-checkout. But day-swap is reached **later** in the page than hotels. By the time the user is reading day plans, they have already:
- Trusted the destination.
- Possibly explored some traveler videos.
- Roughly accepted the hotels.

They are now reading the **shape of their trip**. This is the moment they ask: "Will this trip actually feel like *me*?"

### 1.2 Emotional state

| Emotion | What causes it | What they want |
|---|---|---|
| **Identity match** | They are projecting themselves onto the itinerary. "Are we yoga people or ATV people?" | A way to nudge the trip toward their identity without rebuilding it. |
| **Pace anxiety** | "This looks packed / too slow." | A faster, slower, or more balanced version. |
| **FOMO** | "But we'd also love a beach day." | Visibility of alternatives without losing the curated structure. |
| **Decision fatigue** | They have already chosen destination, dates, hotels. They are tired. | The smallest possible number of new choices. |

The dominant feeling at day-swap is *fatigue plus identity*. The UX must respect both: minimal choices, but the choices must feel personally meaningful.

### 1.3 What they want to do
Ranked by expected frequency:

1. **Read and reassure.** (50-60%) Skim the days, decide the recommendation is fine, move on. The swap entry must be *visible enough to signal flexibility* and *quiet enough not to invite tinkering*.
2. **Adjust the pace** of one or two days. (20-25%) "Day 2 is too active, give me something slower." This is the highest-value swap by satisfaction.
3. **Swap the theme** of a day. (10-15%) "I want a beach day, not a temple day." Especially common on multi-city trips where one city has two days.
4. **Reorder days.** (~5%) Rare but vocal when blocked. Out of scope for v1; called out in section 7.
5. **Add or remove a day.** Out of scope. That is a trip-length change, handled at destination selection.

### 1.4 Why they want to do it
Because every traveler has a **self-image of their trip** before they see the itinerary, and the itinerary will never match it perfectly. The job of day-swap is not to let them rebuild the trip; it is to **let them nudge it 10-20% toward their self-image** so they sign off feeling ownership.

The wrong design lets them rebuild from scratch. The right design lets them pick one of 2-3 pre-curated alternative shapes per day, fast.

---

## 2. Goals

### 2.1 User goal
"Let me feel like this trip is mine, with two or three taps, and let me undo if I overshoot."

### 2.2 Business goals
1. Protect the curated default (highest fulfilment efficiency).
2. Capture *upgrades* (active days, premium experiences, longer durations) where they exist.
3. Avoid cascading breakage: city order, hotel nights, and transfers must stay valid after a swap.
4. Keep day-swap from becoming activity-swap by design. Per the product direction, individual activity editing is *not* offered. Day-level only.

---

## 3. The decisions that will come up in the management meeting

### 3.1 Where does the swap entry live? (the central question you raised)

You listed four candidate locations. Here is each one analysed.

| Entry point | Discoverability | Decision quality | Cognitive load | Recommendation |
|---|---|---|---|---|
| **A. Per-day on Itinerary at a glance** (current) | High - every day surfaces it | Medium - user has only chips ("Temples / Rice terraces / Yoga"), low information | Medium - same affordance 5+ times on a multi-day trip | **Keep, but demote visually.** |
| **B. Single global "Edit days" in the section header** | Low - invisible on scroll | Low - lands on a generic edit screen, user has to pick the day first | Lowest on first view | **Reject.** A global entry suggests bulk editing, but the user always edits one day at a time. Adds a tap with no win. |
| **C. On the day-detail page** (after user taps into a day) | Medium - only seen after a tap | High - user has full context, all activities, descriptions | Low - one CTA in a focused page | **Add.** Catches users who came to read deeply. |
| **D. Inside the full-screen video viewer** (Instagram-like exploration) | High *while watching* - visible as part of the player chrome | Highest - user has just *experienced* the day through video, most informed comparison moment | Medium - must not interfere with playback or swipe | **Add. This is the killer entry.** |
| **E. Tap on the caption / description in the video viewer** | Lowest - buried, requires the user to imagine that captions are tappable | High in theory | Low because invisible | **Reject as a primary path, keep as a tertiary one.** Captions tapping to a "What's this day about" sheet is a known Instagram/TikTok pattern, but it cannot be the only or main swap entry because nobody will discover it. |

**Recommended pattern: A (demoted) + C + D, with E as a tertiary affordance.**

Why three entries instead of one:

The day is a *content object* that the user encounters in **three different reading modes**:

1. **Scanning** (Itinerary at a glance) - they want to see the trip's shape.
2. **Studying** (Day detail page) - they want to understand one day deeply.
3. **Experiencing** (Video viewer) - they want to feel what the day will be like.

A user in any of those three modes can decide "no, give me something else". Forcing them to leave their mode to find the swap entry breaks the experience. So the entry must follow them.

This is exactly the pattern Instagram uses for *Save / Share / More* - it appears on the grid, on the post, and on the reel. Three modes, same affordances.

But the visual weight must scale inversely with the mode's primary purpose:

- Scanning mode: **ghost chip** (the action is secondary to scanning).
- Studying mode: **outlined chip in the header** (the action is one of several equally available - swap, share, view photos).
- Experiencing mode: **floating quiet pill at the bottom edge of the viewer** (the action is the *only* swap entry that does not break flow, so it should be findable without dominating playback).

### 3.2 Tier the alternates by **pace** or by **theme**?

Each day swap needs 2-3 curated alternatives. The question is the primary axis.

**Pace axis** (Slower / Balanced / More active):
- Pros: matches the existing Pace metric in DayScoring. User already understands the vocabulary. Solves the most common complaint (too packed / too slow).
- Cons: doesn't help the "I want a beach day, not a temple day" user.

**Theme axis** (Culture / Nature / Wellness / Adventure / Food):
- Pros: matches identity (the strongest emotional driver here).
- Cons: combinatorial explosion. Curating five themes per city per day is expensive and many themes won't apply (no beach in Ubud).

**Recommendation: theme axis, with pace as a secondary label on each option.**

Each curated alternative shows:
- A short theme name in DM Serif (e.g. "Culture-led Ubud", "Adventure Ubud", "Wellness Ubud").
- A small pace pill underneath (Relaxed / Balanced / Active / Fast-paced) using the existing DayScoring palette.
- The 3-4 activities of that day variant.
- The price delta vs current.

Curate **2-3 variants per day**, not five. Variants that don't apply to a city are simply omitted (no "Beach" in Ubud, no "Temple" in Seminyak). Defaults that the user is already on does not need to appear as an option (it stays pinned at the top of the sheet like the original hotel does).

### 3.3 How to handle cascading and trip-level balance

This is the hardest UX problem in day-swap and the one that doesn't exist in hotel-swap.

If the user swaps Day 1 from "Wellness" to "Adventure", they may end up with:
- Day 1 Adventure (active)
- Day 2 Adventure (active)
- Day 3 Beach Clubs (active)
- Day 4 Shopping (medium)

That is exhausting. The user won't realise until day 3 of the trip.

**Options for handling this**

- **Do nothing.** Trust the user. Risk: bad trip = bad reviews.
- **Auto-balance.** Quietly swap a neighbouring day to compensate. Risk: surprising and feels manipulative.
- **Soft warning** in the swap sheet: "This makes 3 high-energy days in a row. Consider balancing Day 2."
- **Hard block.** Refuse the swap. Risk: infantilising.

**Recommendation: soft warning.**
- Appears on the chosen option card *before* the user taps Select, not after.
- Phrased as a recommendation, not a refusal: "This makes Days 1-3 all high-energy. We can show you a balanced Day 2 next."
- After the swap, if the user dismisses the warning, the toast says "Swapped to Adventure Ubud. Day 2 now also Active. [Rebalance trip]" - a one-tap fix that swaps Day 2 to a calmer variant.

This is the same pattern that fitness apps (Strava, Whoop) use for back-to-back high-strain days. It is well validated.

### 3.4 What about reordering days?

Out of scope for v1. Reasons:
- It cascades into hotel night counts, flights, and transfers.
- Almost nobody asks for it in the data (5% per industry norms; most ask to swap *what* the day contains, not *when*).
- If we offer it, we must validate every transfer, which is engineering-heavy.

Surface this clearly in the doc so we don't ship a half-baked version. Add a small footer line in the swap sheet: "Want different days in a different order? Talk to us." (link to support). Mention this in the meeting.

### 3.5 Swap on the video viewer: how exactly

The video viewer is full-bleed portrait, vertical-swipe between videos within a day, horizontal swipe between days. The user is consuming, not deciding.

The swap entry must:
- **Not interfere** with the swipe gestures.
- **Not block** captions or the play/pause area.
- **Be obviously about *this day*** that they're watching, not the whole trip.

**Recommended position:** a thin floating pill at the bottom-center, above the system home-indicator but below any caption. Label: "Change day". Icon: same refresh-arrows as today. Tap = sheet slides up *over* the video viewer with the video paused behind.

After they select, the viewer reloads with the new day's videos already cued up. This is the **biggest emotional payoff** in the whole feature: they watched one vibe, swapped, and immediately see the new vibe play.

This is what TikTok Shop and Instagram Reels Shopping do well. It will feel native.

### 3.6 Caption tap (option E) as tertiary affordance

In the video viewer, the day name and the chip list ("Temples / Rice terraces / Yoga") are visible at the top. Tapping the day name or the chip list should open the **day-detail page** (the same one option C lives on). This is the recognisable Instagram pattern (tap username = profile).

This is *not* a swap entry. It is an *information* entry. From the day-detail page they can then swap if they want, via the C entry. So we get the discoverability of E without the user having to imagine it.

### 3.7 Confirmation and undo

Identical to hotel-swap:
- Instant swap.
- 5s undo toast at the bottom.
- Selected card shows tick for 600ms before sheet closes.
- Footer animates if price changed.

### 3.8 Price delta visibility

Day swaps may or may not change price. A theme-swap to "Wellness" with a spa might add ₹4,000. An adventure day might subtract because it doesn't include a paid lunch. Same rules as hotel-swap:
- Delta on each option card.
- Footer recalculates with brief animation.
- No struck-through originals.
- Per-person.

### 3.9 Quiet ghost chip vs current pink "Change day plan" link

The current entry on Itinerary at a glance is **the loudest single element on the screen after "Plan My Trip"**. It is bright pink, repeated five times in the screenshot. It competes with the conversion CTA.

Recommendation: same demotion treatment as the hotel chip. Small refresh icon + "Change day" in neutral grey, 12px Figtree, right-aligned next to the day title. The conversion CTA stays the only pink object in the layout.

---

## 4. Competitive benchmarks

| Brand | Pattern | What we steal | What we reject |
|---|---|---|---|
| **Klook / Headout** | Activity-by-activity browse and add to cart. | The clarity of single-day pricing. | The activity-level editing, which inflates cognitive load. |
| **TUI / Thomas Cook** | Pre-bundled days, no edit. | The trust signal of "we've planned this for you". | Total opacity. |
| **GetYourGuide** | Day-trips by theme. | The **theme as primary axis** for organising day alternates. | The catalog feel. |
| **Black Tomato / Kensington** | Bespoke days via concierge. | The narrative naming of days ("Cultural Ubud" not "Day 1 option 2"). | Human-in-the-loop. |
| **Airbnb Experiences** | Hosted day-trips. | The host story / why-this-day framing. | Single-experience focus, no bundling. |
| **TikTok Shop / Instagram Reels Shopping** | Buy/swap action over content while watching. | The floating action over the player. The "watch then act" flow. | Aggressive commerce overlay. |
| **Strava / Whoop** | Weekly balance / strain meters. | The soft-warning pattern when too many high-strain days stack. | Numerical scoring of fun. |
| **Apple Fitness+** | Curated alternatives ("Try a 10 min instead") inline. | The compact alternative card with clear differentiation. | Workout vocabulary. |
| **Netflix "Because you watched"** | Curated alternatives anchored to current. | Anchoring the alternatives to the *current* item visually. | Endless rows. |
| **Spotify Daylist** | Single curated playlist with a name and vibe per slot. | The **vibe naming** ("Wellness Ubud") as identity hook. | Pure algorithmic feel. |

Pattern synthesis:
> **Spotify-style vibe naming + Netflix-style anchored alternatives + Strava-style trip balance warning + TikTok-Shop-style swap-while-watching shell.**

---

## 5. Design principles applied

1. **Match the user's reading mode** (where they are = where the swap entry must be).
2. **Identity over options.** Name the alternatives by vibe, not by ID. "Adventure Ubud" beats "Day 1 Option B".
3. **Anchor the alternative to the original.** The current day stays pinned at the top of the sheet. Comparison is the job.
4. **Soft warnings, never hard blocks.** Respect autonomy, surface consequences.
5. **Reversibility.** Same 5s undo.
6. **Demote the affordance to elevate the CTA.** Only "Plan My Trip" gets the loud pink.
7. **Consistency with hotel-swap.** Same sheet shell, same delta language, same undo.
8. **Recognition over recall.** Pace pill on each alternative uses the same colour code as the day-detail's pace tile.
9. **Progressive disclosure.** Theme as primary, pace as secondary, activity list as tertiary.
10. **Speed of light feeling.** Alternatives pre-fetched at itinerary load.

---

## 6. Recommended UX (synthesis)

### 6.1 On Itinerary at a glance (entry A)

```
○ Day 1: Ubud                            ⟳ Change day
  • Temples • Rice terraces • Yoga       (small grey chip, top-right)

  ⊙ Day 1 photos from travelers
  [3 thumbnails]
  ▶ See how 847+ couples experienced this
```

Changes from today:
- Pink "Change day plan" link demoted to small grey chip.
- Chip aligned to the right of the day title, not below.
- The day title remains tappable to open the day-detail page (entry C).

### 6.2 On the day-detail page (entry C)

Header row of the day-detail page gets a primary action area with three equally weighted chips: `Photos`, `Videos`, `Change day`. All three outlined, neutral. No pink.

### 6.3 In the video viewer (entry D)

```
┌─────────────────────────┐
│                         │  full-bleed video
│      [vertical video]    │
│                         │
│ Day 1 · Ubud            │  tappable = day-detail page
│ Temples · Rice · Yoga   │
│                         │
│      [⟳ Change day]     │  floating pill, bottom-center
│       ── home bar ──    │
└─────────────────────────┘
```

Tap the day name or chip list = open day-detail page.
Tap the floating pill = open swap sheet over the viewer (video pauses).

### 6.4 The swap sheet (bottom sheet, 70% viewport, drag to expand)

```
┌─────────────────────────────────────┐
│  ──                                 │
│  Day 1 · Ubud                       │
│                                     │
│  Currently selected                 │
│  ┌─────────────────────────────┐    │
│  │ Slow Ubud                    │   │  pinned current
│  │ Pace · Relaxed                │   │
│  │ • Temples • Rice • Yoga       │   │
│  └─────────────────────────────┘    │
│                                     │
│  Alternatives for Day 1             │
│  ┌─────────────────────────────┐    │
│  │ Adventure Ubud               │   │
│  │ Pace · Active                 │   │
│  │ • ATV • Waterfall • Swing     │   │
│  │ +₹1,200 / person   [Select]   │   │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ Culture-led Ubud             │   │
│  │ Pace · Balanced               │   │
│  │ • 3 temples • Painting class  │   │
│  │ Same price          [Select]  │   │
│  └─────────────────────────────┘    │
│                                     │
│  ⓘ Want a different day order?     │
│      Talk to us.                    │
└─────────────────────────────────────┘
Sticky footer:
   From ₹62,498 / person     [Plan My Trip →]
```

Notes:
- Each option's activity list shows max 3 items + `+2 more` if needed.
- Tapping an option's title opens a day-detail-style preview pushed over the sheet, dismiss returns to sheet.
- If the option would create a stack of 3+ high-energy days, a small amber line appears between the badge and the activity list: `Makes Days 1-3 all active`.

### 6.5 After selection

- Selected card gets a tick for 600ms.
- Sheet closes.
- Itinerary card updates in place (cross-fade on the chip list).
- Footer animates if price changed.
- Toast: `Swapped Day 1 to Adventure Ubud  [Undo]` (5s).
- If a balance warning was shown and ignored, the toast becomes two-action: `Swapped. Days 1-3 now active. [Rebalance] [Undo]`.

### 6.6 Edge cases

| Case | Behaviour |
|---|---|
| City has only 1 day | Same sheet, 2-3 alternates, same pattern. |
| City has 4+ days (rare in v1) | Same sheet per day. |
| All alternates same price | Show "Same price" instead of "+₹0". |
| User on the cheapest variant and all alternates are upgrades | Sheet sort: cheapest first remains, so the pinned current is at top, alternates increase in price below. |
| Network failure loading alternates | Sheet shows skeleton; if fail, an inline error: "Could not load alternatives. [Retry]". Do not silently dismiss. |
| User picks an alternate then taps Change again within 5s | Both undo toasts collapse; only the latest swap is undoable. |

---

## 7. Trade-offs to name out loud in the meeting

1. **Three entry points vs simplicity.** We are choosing three because each maps to a reading mode. Risk: confusion / "where is the swap?". Mitigation: identical icon and label across all three so users learn it once.

2. **Theme as primary axis vs pace.** Theme wins on identity, loses on the most common complaint (pace). Mitigation: pace pill on every option.

3. **Soft warning on cascade vs no warning.** Soft warning protects trip quality, but adds copy and a chance the user dismisses without reading. Mitigation: warning is one short sentence, never a modal.

4. **Day reordering out of scope.** Will frustrate the 5%. Mitigation: explicit copy + concierge fallback.

5. **No activity-level editing.** Will frustrate the power user who wants to "just swap the temple for a beach". Mitigation: this is a strategic choice (lower cognitive load, higher curation feasibility). Stay the course; communicate it externally as "we curate the day, not the items".

6. **Demoting the current loud pink link.** Conversion CTA wins back its dominance, but the team will worry that fewer users will find the swap. Mitigation: A/B test if we want, but the parallel entries on day-detail and video viewer more than compensate for the at-a-glance demotion.

7. **Live price recalculation.** Same trade-off as hotel-swap.

8. **Pre-fetching alternates at itinerary load.** Trades a bit of bandwidth for instant sheet opens. Worth it. Same as hotel.

9. **Swap-while-watching breaks the "consumption" mental model.** Some users may feel the video viewer is now a commerce surface. Mitigation: keep the pill quiet, neutral colour, single label. Do not animate it. Do not auto-show it.

10. **Naming alternates.** "Adventure Ubud" is opinionated. If we ever go international, naming will need to localise. Acceptable cost.

---

## 8. How this scales back to hotels and forward to flights

This document is the second of three. The shell is the same:

| Feature | Anchor | Alternatives | Axis | Inventory |
|---|---|---|---|---|
| Hotels | Current hotel pinned | 3 curated + "See all" | Tier / area / price | Real Booking |
| **Days** | Current day pinned | **2-3 curated, no "see all"** | **Theme + pace** | Curated only |
| Flights | Current flight pinned | 2-3 curated + "See all" | Cheapest / shortest / best timing | Real inventory |

The day-swap is the **most curated** of the three because day plans are content (not SKUs). This is also why day-swap *cannot* offer "see all": there is no full inventory of days, only the variants we author.

---

## 9. What I will change in code (after you approve)

**New components**
- `src/components/itinerary/ChangeChip.jsx` - the demoted swap chip; reused for hotels, days, flights.
- `src/components/itinerary/SwapSheet.jsx` - same shell as hotel-swap doc; takes a `kind` prop (`hotel | day | flight`) to render the right header and card shapes.
- `src/components/itinerary/DayOptionCard.jsx` - the per-alternative card with theme name, pace pill, activity list, delta, Select.
- `src/components/itinerary/VideoViewerSwapPill.jsx` - the floating pill in the video viewer.
- `src/components/itinerary/CascadeWarning.jsx` - one-line amber warning shown on options that would create a back-to-back active stack.

**Modified components**
- `src/pages/ItineraryDetail.jsx` - replace the loud pink `Change day plan` link with `<ChangeChip />`. Mount `<SwapSheet kind="day" />` at the page root.
- Day-detail page (find it; likely a route off ItineraryDetail) - add `<ChangeChip />` in its header.
- `src/pages/VideoViewer.jsx` or equivalent - mount `<VideoViewerSwapPill />`; pause video on tap; render `<SwapSheet kind="day" />` over the viewer.

**Data**
- `src/data/dayVariants.js` (new) - keyed by `{destination}-{dayIndex}`, returns 2-3 variants with `{name, theme, pace, activities, priceDelta}`.
- A helper `computeCascade(itinerary, dayIndex, candidateVariant)` returning `{willCreateActiveStack: boolean, message: string}` for the cascade warning.

**State**
- Selected variant per day stored alongside selected hotels in URL params or context, so the footer total recalculates centrally.

**Phases**
1. ChangeChip on at-a-glance + day-detail page. SwapSheet with curated 2-3, no cascade warning, no price recalc.
2. Price recalculation.
3. Cascade warning + rebalance suggestion.
4. Video viewer entry (pill + pause-on-tap + sheet-over-viewer + auto-reload videos).
5. Polish: pre-fetching, micro-animations, undo toast.

---

## 10. Open questions for you before I build

1. **Day-variants data.** Do you have authored variants per city per day, or do I stub a JSON (2-3 variants per Bali day) to wire up the UX, with real authoring later?
2. **Variant naming convention.** Are you OK with "Adventure Ubud", "Wellness Ubud", "Culture-led Ubud" as the naming pattern, or do you want a different voice?
3. **Cascade rule.** Is "3 or more active days in a row" the right trigger for the soft warning, or do you want a different threshold?
4. **Video viewer entry.** Is the floating pill at bottom-center acceptable, or do you want it tucked into a different corner (e.g. top-right next to a close button)?
5. **Day reordering.** Confirm out-of-scope for v1 so I do not build it.
6. **Demoting the pink "Change day plan" link to a ghost chip.** Same call as on the hotel doc. This is the most visible UI change; confirm before I land it.

Answer these and I will start Phase 1.

# Changing the Route - Design Doc

Module: itinerary customisation, the route (cities, order, nights).
Companion to `hotel-swap-design.md` and `day-swap-design.md`. Same shell language: a note with an action, undo, nothing silently refused.

Working prototype: `/route-edit-lab` in the app, on our recommended Vietnam trip. Every rule and message below is live there.

Second pass (22 Oct 2026): the screen was simplified after review. Nothing is explained up front. Everything is said at the moment it matters, in one note with our suggestion as a button and a way to keep it anyway. The two switches from the first pass are now decided: the trip follows the nights, and a long drive at either end is explained, not held.

Fourth pass (22 Oct 2026): zoom on the map; a building screen on Save, shared with the dates and travellers changes on the itinerary; and a screen of its own for a route with no cities.

Fifth pass (25 Oct 2026): the building screen is now the wizard's own wait screen (the countdown, the five areas, what goes into the trip, and the reels), with one card added that says what changes on a rebuild.

Third pass (22 Oct 2026): the screen opens as a plain full-screen list under a fixed header. Map in the header turns it into the wizard's map-and-sheet view, with three resting points, for as long as it is wanted: Close map, or pulling the sheet all the way up, returns to the plain screen at the same place in the list. Cards are one line each. Between cities, the way you travel is an icon on the line, with no time. When there are more cities than the nights can carry, a message at the foot says so, in the same shape as the other messages.

---

## 1. Where the user is and how they feel

### 1.1 Who does this
The route is the one part of the trip the customer never chose. The wizard asked which cities; we put them in order and shared out the nights. By the time somebody wants to change the route they have usually spoken to sales and done their own reading. They know Hoi An is near Da Nang. They know they want three nights in Phu Quoc, not two.

So this is the smallest audience of the three customisations, and the most opinionated. They are not browsing for ideas. They have a route in their head and they want ours to match it.

### 1.2 What they want, ranked
1. **More or fewer nights in one city.** (most common) "Three nights in Hoi An, not two."
2. **Drop a city.** "We do not need Ha Long."
3. **Add a city.** "Can we fit Phu Quoc in?"
4. **Change the order.** "We would rather end on the beach."
5. All of the above at once, because they have a whole route in mind.

### 1.3 What they are afraid of
- That changing one thing throws away everything else (the hotel they picked, the day plans they liked).
- That the app will let them build something that cannot actually be booked, and sales will tell them later.
- That they do not understand why the order is the order, so they cannot tell a good change from a bad one.

The third fear is the one nobody has addressed. The order is not arbitrary: two or three of the cities have the airport, the rest are a drive from one of them, and which end you start at decides how much of the holiday is spent in a car. Nobody has ever told the customer that.

---

## 2. Goals

### 2.1 User goal
"Let me set the route I have in my head, tell me straight away if any part of it cannot be done and why, and do not lose the rest of my trip when I save."

### 2.2 Business goals
1. Never let a route that cannot be flown reach sales as a saved version.
2. Keep the customer inside the app for a change that today ends in a WhatsApp message to the consultant.
3. Make the travel cost of a bad order visible, so fewer trips are booked with a day lost to driving.
4. Protect hotels and day plans in the cities that did not change, so a route edit is not a reset.

---

## 3. The decisions that will come up in the meeting

### 3.1 Where does it live
Two doors, one screen, both on the itinerary. The wizard's city step does not open it. There, under the chosen cities, one line says what happens and where it can be changed: "We'll set the order and nights. You can customise them once your itinerary is created." A door on that step was built and tried, and taken out again: it made the step more complex than the few who would use it are worth, and the itinerary is where the route is read anyway.

The cities chip at the top (Da Nang 2N · Phu Quoc 3N) and the Cities entry in the Customise picker. Both open this screen now; the wizard's tick-list picker that used to open there is gone from the itinerary and stays in the wizard. Save goes through the itinerary's own building screen, the same one dates and travellers use, and lands on the new version.

A bug came out while wiring it in: every built trip carries the same synthetic id, and the lookup that resolves a trip from the URL returned the first deal holding that id, so after a rebuild the page could show another deal's trip. The lookup now prefers the version asked for, then the deal in the URL.

### 3.2 One screen or a wizard step
The wizard step is a map and a list of cards you tick. It is right for choosing from nothing. It is wrong for editing: a tick list has no order and no nights.

**Decision:** a plain full screen first, because changing the cities is what it was opened for: a fixed header (Close, "Change cities", the city count and dates, Map) and the list scrolling under it. Map turns the screen into the wizard's city step: the map behind, the list on a sheet that slides down to halfway. From there the sheet has three resting points: down, so the map is the whole screen; halfway; and up under the header. It settles on the nearest one when a drag ends. At the top stop the map is out of sight, so that is where the map view ends: the plain screen takes over at the same place in the list. Close map in the header does the same by sliding the sheet up first. The list reads the way the trip runs, top to bottom: the airport you land at, each city, how you get to the next one, the airport you fly home from.

### 3.3 The trip length follows the nights
**Decided.** The customer taps plus on Hoi An and the trip is one night longer. The end date moves and the header says so ("4 cities · 21 Dec to 30 Dec"). There is no cap, no zero-sum stepper, no "all 8 nights are taken". On Save the itinerary is built for whatever the nights add up to. The dates screen exists for people whose dates are fixed.

### 3.4 A trip may start or finish somewhere without an airport
**Decided: explain, do not hold.** Starting in Hoi An is a good trip (land at Da Nang, drive 30 minutes). Starting in Ha Long means landing at Hanoi and driving 2h 30m first; most couples would not choose that if told. So it is allowed, and it is said in the one place it belongs: under the airport node, as the only line there. "Ha Long has no airport of its own. You land at Hanoi and drive about 2h 30m first." When the first and last cities are airport cities, the node is just the airport: "You land at Hanoi (HAN)."

The strict rule (start and end at or within 90 minutes of an airport) is still in the engine behind a flag, in case sales finds these starts cause real problems.

### 3.5 Hold, warn, or error at Save
Your ask: hold the user at the first place with reasoning, and if it still gets done, show errors on saving. Three tiers, and the line between them is whether the thing is impossible or merely costly.

| Tier | What | When it is said | What the user can do |
|---|---|---|---|
| **Hold** | A drag that cannot be flown: Phu Quoc dragged anywhere but beside HCMC. | At the drop. The card snaps back. | Put it beside HCMC (one tap), or Got it. |
| **Warn** | Costs something, or needs something. Order doubles back. Start or end away from an airport. A city added where it costs more. A city added without its hub. Removing a hub strands a city. | At the moment, in amber, allowed. | Our suggestion as a button (Put it back, Put it after Hanoi, Add HCMC, Keep HCMC), and Keep it. |
| **Error at Save** | Anything kept anyway that cannot be booked: a hub-only city without its hub, a trip under the country minimum, no cities. | On Save, in a sheet, each pointing at its row. | A fix action per error (Add HCMC), Show me, Back to the route. |

Holds are rare by design. Most mistakes are costs, and a cost with the hours written next to it and a way back is enough.

### 3.6 Adding a city: anywhere, then one note
"Add a city" sits between every pair of cities, and before the first and after the last, as a small link on the right. It is never dashed or refused.

The sheet lists every city not yet on the route, with search, the photo, the one-liner and the same tags the wizard uses. Every card can be tapped. Nothing is greyed out and nothing carries a reason, because the reason belongs with the route, where our suggestion can sit beside it as a button.

After the tap the city is on the route and, if there is anything to say, one note says it:
- **No airport, placed well.** Blue, information only. "Ha Long has no airport of its own. You get there by road, about 2h 30m from Hanoi. This is the best place for it." Got it.
- **No airport, placed where it costs.** Amber. "Ha Long has no airport of its own. The last day is about 2h 30m by road to Hanoi for the flight home. Here it adds about 3h 15m of travelling compared with putting it before Hanoi." Put it before Hanoi · Keep it here.
- **Hub-only city away from its hub.** Amber. "Phu Quoc only connects through Ho Chi Minh City. Away from HCMC you fly back through it anyway, about 3h and another flight on the bill." Put it beside HCMC · Keep it here.
- **Hub-only city with no hub on the trip.** Amber. "Phu Quoc has no flights of its own. It connects through HCMC, which is not on the trip. We would add HCMC next to it." Add HCMC · Keep as it is. Kept as it is, Save catches it.

### 3.7 Removing a city
Always allowed. A trash icon on the card. The only case that needs a word is removing a hub: "Phu Quoc only connects through HCMC. Without HCMC it cannot be flown." with Keep HCMC and Remove Phu Quoc too. Keep it is allowed, and Save catches it.

### 3.8 The drag handle
The number. It is already on the line where the order lives, it is the biggest thing on the left, and it means "position" without a label. Hold it and the other cards slide out of the way. There is no "hold to move" hint; the grip marks under the number are the hint.

The hit test is the finger, not the card's centre, so a short drag moves the card one place.

### 3.9 What Save does to the rest of the trip
Saving builds the itinerary for the new route as a new version. Today that rebuilds everything: every hotel choice and every day plan goes. That is the first fear in 1.3 and it is real.

**Requirement for the build:** rebuild only what changed. A city still on the route with the same nights keeps its hotel and its day plans. A city whose nights changed keeps its hotel and gets its days rebuilt. New cities are built fresh. Removed cities are gone. The prototype does not do this yet. See section 10.

---

## 4. The rules, as the engine applies them

All of this already exists in the app's travel engine (it powers How to reach on every region page). The editor reads it; nothing here is hand-maintained per route.

| Fact | Source | Used for |
|---|---|---|
| Which airport a city flies through | The region guide's reach legs | Own-airport cities, the airport nodes at either end |
| Which cities only connect through another (Phu Quoc via HCMC, Labuan Bajo via Denpasar) | Two flight legs in the region guide | Holds, the add-a-city notes, Save errors |
| Time between any two cities, by road, air, boat, with the change points | Straight-line distance at a speed per mode, plus the airport legs | The map's legs and mode icons, doubling-back warnings, the cost of where a city was added |
| Country minimum nights | Destination metadata | Save error |
| Our suggested nights per city | Destination areas | The nights a city starts with when it is added |

Everything says "about", because every time is worked out rather than looked up, and the consultant confirms the exact car or flight.

### 4.1 Message catalogue

| Situation | Where | Tier | Message | Actions |
|---|---|---|---|---|
| Hub-only city dragged away from its hub | Footer note | Hold | "Phu Quoc only connects through Ho Chi Minh City. Away from HCMC you fly back through it anyway, about 3h and another flight on the bill." | Put it beside HCMC · Got it |
| Order doubles back | Footer note | Warn | "That takes the route back on itself: about 45m more between cities, on the bill as well as the clock." | Put it back · Keep it |
| Start or end has no airport | Under the airport node, and in the note after the move | Warn | "Ha Long has no airport of its own. You land at Hanoi and drive about 2h 30m first." | Put it back · Keep it |
| City without an airport added where it is best placed | Footer note | Info | "Ha Long has no airport of its own. You get there by road, about 2h 30m from Hanoi. This is the best place for it." | close |
| City added at a costly point | Footer note | Warn | "Here it adds about 3h 15m of travelling compared with putting it before Hanoi." (after the no-airport line, when there is one) | Put it before Hanoi · Keep it here |
| Hub-only city added away from its hub | Footer note | Warn | As the drag hold above. | Put it beside HCMC · Keep it here |
| Hub-only city added without its hub | Footer note | Warn | "Phu Quoc has no flights of its own. It connects through HCMC, which is not on the trip. We would add HCMC next to it." | Add HCMC · Keep as it is |
| Hub removed | Footer note | Warn | "Phu Quoc only connects through HCMC. Without HCMC it cannot be flown." | Keep HCMC · Remove Phu Quoc too · Keep it |
| Hub-only city with no hub, at Save | Problems sheet | Error | "Phu Quoc only connects through Ho Chi Minh City, which is not on the trip. Add HCMC beside it, or take Phu Quoc out." | Add HCMC · Show me |
| Under the country minimum, at Save | Problems sheet | Error | "Vietnam trips are at least 7 nights. This one is 6 nights." | Show me |
| More cities than the nights carry | Footer note, while true and no other note is up | Warn | "6 cities in 8 nights is a lot of moving. That is a new hotel every day or two. Most couples keep to 2 or 3 nights in each city, so take a city out or add nights." | close |

---

## 5. The screen, top to bottom

**Header.** Fixed. Close. "Change cities". Subline: "4 cities · 21 Dec to 29 Dec". The start date is the one they already chose; the end date follows the nights, so adding a night moves it. The subline goes red when the trip is under the country minimum. A Map pill on the right, which becomes Close map while the map is showing.

**The map.** Only while Map is on. Behind the sheet, everything under the header, fitted for the halfway view from the start so it does not jump when first seen. It can be dragged and pinched, and has plus and minus at the top right. Its sheet carries a handle and "Your cities"; the handle toggles between halfway and up.

**No cities.** When the last city is taken out the list goes and a screen of its own takes its place: an icon, "Build your route from scratch", "Add the cities you want to stay in, in the order you will visit them. We put in the airports and the way between them.", and one button, Add your first city, which opens the add sheet. Nothing else: no footer, no Save, no suggested route. The header reads "No cities yet · starts 21 Dec" and Map is hidden. The first city added brings the list and the footer back, and the flow is the usual one from there. The route drawn through the airports it actually uses: roads solid, flights dashed, a small car, plane or boat beside each leg and no times. It is framed against the part of it that can still be seen, so the cities stay above the sheet at the halfway stop.

**The list.** The route as one line down the page:
- *You land at* Hanoi (HAN). If the first city has no airport of its own, the drive is the one line under it.
- A row between every two stops: on the line, the icon for how you get to the next city (car, plane, boat); on the right, a small "Add a city".
- *City card*, one line: number handle on the line; small photo, name, the nights stepper, trash. No label, no one-liner, no suggestion.
- *You fly home from* Da Nang (DAD), with the drive under it only if the last city has no airport.

**Footer.** Fixed. The note, when there is one: an icon in a ring, a bold one-line title ("Phu Quoc needs HCMC on the trip", "Ha Long is better before Hanoi", "That cannot be flown"), the reason under it. When there is something to do, a row underneath: our suggestion as a solid button, Keep it as text. When all there is to do is put it away, that is a small close at the end of the title row and there is no row underneath. Red for a hold, amber for a warning, blue for information. In the same place and shape, when no other note is showing: "6 cities in 8 nights is a lot of moving. That is a new hotel every day or two. Most couples keep to 2 or 3 nights in each city, so take a city out or add nights." It shows from three cities up, whenever the nights average under two a city; a small close at the end of its title row puts it away until the count or the nights change again. Then Save changes, grey until something has changed.

---

## 6. Add a city sheet
Opens at 84% height over the route. Title names the gap: "Add a city after Da Nang". Search box. Cards: photo, name, the one-liner, tags, a plus. Every card can be tapped; what the placement costs, if anything, is said back on the route (3.6).

## 7. The map
Not a separate sheet any more; it is the screen behind the route. Shows the shape of the trip and nothing to read: pins numbered in order, the line through the airports it uses, change points marked, a mode icon on each leg. The times are gone from it, as asked. Read-only; the editing is on the sheet.

## 8. Save
Runs the checks. With no errors, the wait screen the wizard shows while a trip is first built, over the itinerary: "Building your Vietnam trip" in the bar, no back button; a status card with "Your itinerary will be ready in 60 sec" and five areas (Route, Stays, Experiences, Timing, Price) stepping left to right every twelve seconds, green when passed, lit when live; then a "What changes" card unique to a rebuild, with the route and nights in pink and why: "New cities and nights mean new hotels, day plans and prices. Your destination and travellers stay as they are." and "Your previous version stays saved in My Plans."; then "What goes into your itinerary" (the three checks) and "Real trips, real reels", footage from the cities on the route first. Past sixty seconds the card turns to "Nearly there" and "A bit longer". Then the itinerary screen opens on the new version, with the route, dates and party in its header; nothing of the route editor stays on screen (see 3.9).

The same screen now fronts every change that rebuilds the trip from the itinerary: new travel dates ("New dates mean new hotels, day plans and prices for those days") and a different party ("A different party means new rooms and prices"). Both of those used to patch the version in place; they go through the builder now, as asked, with only the destination carried over (and the travellers, unless the party is what changed). With errors, a sheet: "One thing to fix first" / "2 things to fix first", "This route cannot be booked as it is.", each error in red with its fix action and Show me, which closes the sheet, scrolls to the row and pulses it. Back to the route.

---

## 9. Edge cases
- **One city.** No order to change. Nights and add still work. Removing the last city is refused by the Save check, not the trash icon.
- **Hub-only city with a hub that is not a city we sell** (Labuan Bajo via Denpasar). Treated as reachable from anywhere in Bali; the map shows the flight.
- **Boat-only places** (Nusa Penida). The hop says fast boat and the drive to the pier.
- **Maldives.** Hops are speedboat or seaplane under 200 km, domestic flight over. Malé is the only own-airport city.
- **Drag while the note is showing.** The new outcome replaces the note.
- **A city removed.** Its nights go with it and the trip gets shorter; the header shows the new end date.

---

## 10. Honest limits of the prototype and the data
1. **Rebuild is a full rebuild, by decision.** Cities, dates and the party all send the trip back through the builder; hotels and day plans are built again. The building screen says so, which is why it exists.
2. **Times are computed, not quoted.** Straight-line distance at a fixed speed per mode. Good enough to compare orders; not a timetable. The screen says "about" everywhere for this reason.
3. **Our recommended Vietnam order is not the engine's quickest.** Hanoi, Ha Long, Hoi An, Da Nang costs 9h 15m; starting in Ha Long costs 6h 45m. The comparison is no longer shown on the screen, but the engine's suggestions after an add or a drag come from the same numbers, so it will sometimes suggest Ha Long first. The recommended route should probably be Hanoi, Ha Long, Da Nang, Hoi An.
4. **Sri Lanka and Mauritius have no airport cities in our list.** The rule degrades to naming the gateway, which is correct, but the start/end education is weaker there.
5. **Nothing is tracked.** The events below are a build ask.

---

## 11. Events
All carry `itinerary_id`, `version_id`, `destination`, `route_before`, `route_after` where relevant.

**Opening**
- `route_edit_opened` (source: cities_chip | customise_picker)
- `route_map_opened`
- `route_map_closed` (how: pill | pulled_up)
- `route_sheet_rested` (stop: map | half)
- `route_crowded_shown` (cities, nights)

**Changes**
- `route_nights_changed` (city, from, to, trip_nights_after)
- `route_city_moved` (city, from_index, to_index, outcome: ok | warn | block, reason)
- `route_move_undone`
- `route_add_opened` (gap)
- `route_city_added` (city, gap, note: none | info | cost | hub_missing | hub_apart)
- `route_add_suggestion_used` (city, action: move | add_hub)
- `route_city_removed` (city, stranded: [cities])
- `route_removal_undone` (city)

**Saving**
- `route_save_attempted` (changed: bool)
- `route_save_blocked` (errors: [keys])
- `route_problem_fix_used` (key)
- `route_saved` (cities_added, cities_removed, cities_moved, nights_delta, travel_minutes_before, travel_minutes_after, version_id_new)
- `route_emptied` and `route_empty_add`
- `itinerary_rebuild_shown` (reason: route | dates | travellers, ms)
- `route_edit_closed` (saved: bool, changes_discarded: bool)

**Metrics**
- Share of saved versions with a route change (today: zero, it goes to sales).
- Block rate at drop and at Save. A high Save-block rate means a hold is missing earlier.
- Share of add-a-city notes where the suggestion was taken versus kept.
- Travel minutes before vs after across saved edits.
- Drop-off between route_edit_opened and route_saved.

---

## 12. What I would build, in plain terms
1. Done in the prototype: the route screen opens from the cities chip and the Customise picker, and Save rebuilds behind the building screen, the same call dates and travellers use.
2. The events.
3. Revisit the recommended Vietnam order (section 10.3).

## 13. Open questions for you
1. Is 90 minutes the right line for "near enough to an airport", if we ever turn the strict rule on?
2. Should the country minimum nights be a Save error, or a warning sales can override?
3. When a customer saves a route that doubles back, should sales see the warning on their side too?

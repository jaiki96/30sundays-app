ROUTE CUSTOMISATION: PRODUCT REQUIREMENTS

Product: 30 Sundays app, itinerary customisation
Scope: the itinerary detail screen's trip summary and Customise bar, and the Change cities screen
Prototype: https://30sundays-app-two.vercel.app (open a saved trip, tap the route chip or Customise > Cities)
Date: 22 October 2026


1. PURPOSE

The route (cities, order, nights) is created by the system from the cities picked in the wizard. Customers who have spoken to sales or done their own research want to change it; today that ends in a message to the consultant. This lets them change it themselves, tells them at once when something cannot be done and why, and never lets a route that cannot be booked reach sales as a saved version. It is for the minority with a fair understanding of the destination, so the surface stays simple and the rules speak only when needed.


2. ITINERARY DETAIL SCREEN

2.1 Trip summary. Three tappable chips at the top: the route ("Hanoi 2N · Ha Long 2N · Hoi An 3N +1 city", the rest counted as "+N cities"), the travel dates ("21 Dec – 30 Dec") and the travellers ("2 travellers"). Each opens the screen that changes it.

2.2 Customise bar. A pink "Customise" pill at the bottom right, 12 px above the sticky price bar whatever that bar's height. It slides off the right edge on scroll down and returns about 600 ms after scrolling stops; it hides while a toast shows. Tapping opens the picker.

2.3 Customise picker. A bottom sheet with five options, each with a hint:
1. Cities ("Where you stay, and for how long"): opens the Change cities screen (section 3).
2. Hotels ("Change the hotel in any city"): scrolls to the hotels section and pulses the Change hotel control.
3. Day plans ("Change what happens on a day"): scrolls to the day plans and pulses Change day plan.
4. Travel dates ("Change when you go, and for how long"): the wizard's calendar as its own screen, opened on the trip's dates; tap a start and an end day or drag a grip; "Save dates". Saving rebuilds the trip.
5. Travellers ("Change how many are going"): 2 adults, 4 or more adults, adults with children, solo. Only couples can be booked; the other three stay tappable and explain why. "Save N travellers". Saving rebuilds the trip.

2.4 Rebuilding. Changing cities, dates or travellers sends the trip through the itinerary builder: destination kept, travellers kept unless they changed, everything else (hotels, day plans, transfers, prices) built again as a new version. The previous version stays in My Plans. While the API runs, the wizard's wait screen (the one shown while a trip is first built) covers the itinerary, with one extra card. Top bar: "Building your [destination] trip", no back button. Status card: "Your itinerary will be ready in" and a 60 second countdown, with five areas (Route, Stays, Experiences, Timing, Price) stepping left to right every 12 seconds, green with a tick when passed, lit when live, grey when waiting; paced off the countdown, since the API reports no progress. Past 60 seconds: "Nearly there", "A bit longer", "Your [destination] trip is nearly built" and a line that bigger trips take more thinking. "What changes" card (rebuild only): the summary in pink (route and nights, dates, or party), one sentence on why (for cities: "New cities and nights mean new hotels, day plans and prices. Your destination and travellers stay as they are."), and "Your previous version stays saved in My Plans." Then "What goes into your itinerary" (stays rated 8.0 and above; a pace with room to breathe; no tourist traps) and "Real trips, real reels", a two-column grid of portrait clips, footage from the cities on the route first, each opening full screen with swipe between clips. It ends on the itinerary at the new version.


3. CHANGE CITIES SCREEN

3.1 Layout. A full screen. Fixed header: Close (X, closes without saving), title "Change cities", summary "4 cities · 21 Dec to 29 Dec" (start date as chosen, end date follows the nights, red when under the destination minimum), Map pill. Scrolling list: "You land at Hanoi (HAN)", then one card per city in trip order with a row between cities showing the commute icon (car, plane or boat, no time) and a small right-aligned "Add a city", then "You fly home from Da Nang (DAD)". "Add a city" also sits before the first and after the last city. When the first or last city has no airport, one line under the airport states the drive. A vertical line runs from airport to airport through the numbered handles. Fixed footer: the message box when there is one, and "Save changes", grey until something changed.

3.2 City card. One line: photo, name, nights stepper (minus, "2 nights", plus), trash. A numbered handle with grip dots sits on the timeline to the left.

3.3 Reorder. Hold the number, move, release. The held card lifts and the others slide out of the way (180 ms). The drop position follows the finger, so a short drag moves one place. On release: allowed (no message), allowed with a cost (a message says what it cost, with Put it back / Keep it), or not allowed (the card snaps back, a message says why, with our fix as a button and Got it).

3.4 Nights. Minimum 1 per city, no maximum. The trip is as long as the nights add up to; adding a night moves the end date in the header. Under the destination minimum, the header turns red and Save lists it.

3.5 Add a city. Opens a sheet titled with the position ("Add a city between Hanoi and Hoi An"), with search and a card per city not on the route (photo, name, one-liner, tags, plus). Every card is tappable. The city goes in with our suggested nights, and if there is anything to say, one message appears with our suggestion as a solid button and a way to keep it:
a. No airport, best place (info): "[City] has no airport of its own. You get there by road, about [time] from [airport city]. This is the best place for it." Close.
b. No airport, better place exists (warn): the drive line, then "Here it adds about [time] of travelling compared with putting it [before/after X]." Put it [before/after X] / Keep it here.
c. Connects only through a city on the trip, placed away from it (warn): "[City] only connects through [hub]. Away from [hub] you fly back through it anyway, about [time] and another flight on the bill." Put it beside [hub] / Keep it here.
d. Connects only through a city not on the trip (warn): "[City] has no flights of its own. It connects through [hub], which is not on the trip. We would add [hub] next to it." Add [hub] / Keep as it is. Kept, Save lists it.

3.6 Remove a city. The trash removes it at once; nights and end date follow. If another city only connects through it: "[Stranded] only connects through [removed]. Without [removed] it cannot be flown." Keep [removed] / Remove [stranded] too / Keep it. Kept, Save lists it.

3.7 No cities left. The list gives way to a screen with a route icon, "Build your route from scratch", one line of guidance and one button, "Add your first city". Header reads "No cities yet · starts [date]". Map and footer are hidden until the first city is added.

3.8 Map view. The Map pill turns the list into a sheet over the map and becomes "Close map". The sheet slides down to halfway (280 ms) so the map comes into view. Three resting points: down (map only, handle and "Your cities" showing), halfway, up (list only); the sheet settles on the nearest when released, and the handle toggles halfway and up. Pulling all the way up, or Close map, returns to the plain list at the same place. The map draws the route through the airports it actually uses: roads solid, flights dashed, numbered pins with names, "Change at [city]" dots where the mode changes, a small mode icon on each leg, no times. It stays framed above the sheet at each resting point, can be dragged and pinched, and has plus and minus zoom.

3.9 Rules (all from the travel engine behind How to reach, nothing hand-maintained):
a. Each city flies through a known airport; some have their own, others are a drive from one.
b. Hub-only cities (Phu Quoc through HCMC) must sit next to their hub, and the hub must be on the trip.
c. A trip may start or finish anywhere; a long drive at either end is stated, not blocked. (A strict 90-minute rule exists behind a flag, off.)
d. Every order has a travel time; doubling back and cheaper placements are stated in hours.
e. Each destination has a minimum trip length; under it, Save is blocked.
f. From three cities up, nights averaging under two per city trigger the "lot of moving" message.

3.10 Messages. Three tiers: hold (red, the change does not go through, our fix and Got it), warn (amber, the change goes through, our suggestion as a solid button and Keep it), error at Save (red sheet). Anatomy: icon in a ring, bold one-line title ("Phu Quoc needs HCMC on the trip", "Ha Long is better before Hanoi", "That cannot be flown"), the reason, then the actions; with nothing to do but dismiss, a small close sits at the end of the title row and there is no actions row. A new message replaces the last. Besides 3.5 and 3.6:
- Hub-only city dragged away from its hub (hold): as 3.5 c. Put it beside [hub] / Got it.
- Order doubles back (warn): "That takes the route back on itself: about [time] more between cities, on the bill as well as the clock." Put it back / Keep it.
- Start or end without an airport after a move (warn): "[City] has no airport of its own. You land at [airport city] and drive about [time] first." Put it back / Keep it.
- Too many cities (warn): "[N] cities in [M] nights is a lot of moving. That is a new hotel every day or two. Most couples keep to 2 or 3 nights in each city, so take a city out or add nights." Close; returns if the count or nights change. Does not block Save.
- At Save (error): "[City] only connects through [hub], which is not on the trip. Add [hub] beside it, or take [city] out." Add [hub] / Show me. And "[Destination] trips are at least [N] nights. This one is [M] nights." Show me.
All times read "about": they are computed, and the consultant confirms the car or flight before booking.

3.11 Save. Runs the rules. With no errors, the building screen (2.4), then the itinerary on the new version. With errors, a sheet: "One thing to fix first" or "[N] things to fix first", "This route cannot be booked as it is.", each error with its fix as a solid button and "Show me", which closes the sheet, scrolls to the row and pulses it for about 2.5 seconds. "Back to the route" closes it.

3.12 Motion. Drag: held card follows the finger, others slide 180 ms; snap back 180 ms. Map sheet: 280 ms ease-out between resting points. Show me: smooth scroll, then three pink pulses. Customise bar: 220 ms slide and fade. Building screen: steps tick at even intervals for the API duration.


4. WIZARD CITY STEP

No route customisation in the wizard. Under the chosen-city chips, one line: "We'll set the order and nights. You can customise them once your itinerary is created."


5. EDGE CASES

One city: no reordering or commute rows; nights and Add a city work. Same airport both ends (Bali): the same airport reads at top and bottom. Destinations with no airport city on our list (Sri Lanka): the gateway is named at both ends. A hub we do not sell (Labuan Bajo through Denpasar): reachable from anywhere. A drag while a message shows: the new outcome replaces it. Closing with unsaved changes: dropped without a prompt (open question). Trips over 14 nights go to the sales team from the wizard and never reach this screen.


6. EVENTS

All carry itinerary_id, deal_id, version_id, destination, travellers, and route_before / route_after (city and nights) where a route is involved.

Itinerary detail: customise_bar_tapped; customise_option_tapped (option: cities | hotels | day_plans | dates | travellers); trip_chip_tapped (chip: route | dates | travellers); travellers_change_saved (from, to); travellers_change_blocked (choice: four_plus | with_children | solo); dates_change_saved (from_start, to_start, from_nights, to_nights); itinerary_rebuild_started (reason: cities | dates | travellers); itinerary_rebuild_completed (reason, duration_ms, version_id_new); itinerary_rebuild_failed (reason, error).

Change cities: route_edit_opened (source: route_chip | customise_picker); route_edit_closed (saved, changes_discarded); route_map_opened; route_map_closed (how: pill | pulled_up); route_sheet_rested (stop: map | half); route_map_zoomed (direction); route_city_moved (city, from_index, to_index, outcome: ok | warn | block, reason); route_move_undone (city); route_nights_changed (city, from, to, trip_nights_after); route_add_opened (gap_index); route_add_searched (query); route_city_added (city, gap_index, note: none | info | cost | hub_apart | hub_missing); route_add_suggestion_used (city, action: move | add_hub); route_city_removed (city, stranded); route_removal_undone (city); route_removal_extended (cities_also_removed); route_emptied; route_empty_add_tapped; route_crowded_shown (cities, nights); route_crowded_dismissed; route_note_shown (key, tier); route_note_action (key, action); route_save_attempted (changed); route_save_blocked (errors); route_problem_fix_used (key); route_problem_show_me (key, city); route_saved (cities_added, cities_removed, cities_moved, nights_delta, travel_minutes_before, travel_minutes_after, version_id_new).

Metrics: share of saved versions with a route change (baseline zero); block rate at the action versus at Save; suggestion taken versus kept on add; travel minutes before versus after; drop-off from route_edit_opened to route_saved; rebuild duration and failure rate by reason.


7. OPEN QUESTIONS

1. Ask before discarding unsaved changes on close?
2. Destination minimum nights: a Save error, or a warning the consultant can override?
3. Should the consultant see the doubling-back warning on a saved route?
4. Our recommended Vietnam order is slower by the engine's count than Hanoi, Ha Long, Da Nang, Hoi An, and the engine's suggestions after a move come from the same numbers. Review the recommended route.

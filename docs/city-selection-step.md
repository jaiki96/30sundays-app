# City Selection

**Where:** Planning wizard, step 4 of 5. Previously called "Route", now "Cities".
**What:** A full-screen map of the country with a pull-up sheet of city cards over it.
**Why:** The step asked four questions at once. It now asks one: where do you want to stay.
**Reused on:** "Change cities" from a saved itinerary, same picker as its own screen.

## What changed

- Renamed from Route to Cities, in the step name, the stepper and the heading.
- Removed: the drag-and-drop route builder, the per-city nights dial, the route strip, the order note, the fit warning, the nights warning and the info panel.
- Added: a map as the main surface, a pull-up sheet of cities, tags on each card, a photo carousel per card, and a city detail page that opens as a sheet without leaving the step.
- Order and nights are now worked out by us. Both stay editable on the itinerary screen afterwards.
- No search box. A country has ten to fifteen regions, which is a scroll, not a query.

## Layout and animation

- The question stays pinned at the top while everything moves under it.
- The map fills the screen below it and stays put.
- The sheet has three rest positions: resting at the bottom showing only the handle and "N cities in {country}", halfway with the map still visible above it, and fully up covering the title. A flick settles on the nearest one. Past the top position it scrolls as an ordinary list.
- The step opens with the sheet at the halfway position.
- The map reframes itself whenever the sheet settles, so pins stay in the visible part.
- Selected cities appear as removable chips in a bar pinned above the Continue button. The bar hides when the sheet is at the bottom.

## Map

- Pins are city names, not numbered dots. Selected pins turn brand pink with a tick.
- Tapping a pin opens that city's detail sheet. Same sheet as "View details" on the card.
- The opening view fits the cluster of cities people actually choose between. A far outlier (for example Labuan Bajo in Bali) stays on the map but is excluded from the opening fit.

## City card

- Photo carousel on the left, flush to the card edge, full height, with dots. Swipe moves the photo, tap still selects the city.
- City name.
- One line saying what the place is, for example "Overnight bay cruise", "Old Quarter, lakes and food".
- One or two tags.
- Our suggested length, as a range: "~ 2 to 3 nights".
- "View details" link.
- A selection circle, always visible, empty until chosen, filled with a tick when chosen. The whole card is the tap target.
- Chosen cities sort to the top of the list, in trip order.

## Tags

Read off data we already hold, never a made-up rating or sales count. Maximum two per card.

- Trending (gold): the most of our itineraries stop there.
- Often booked (gold): at or above the middle of its country.
- Offbeat (teal): low crowd level.
- Gets busy (violet): high crowd level.
- Day trip (teal): somewhere you go and come back from.
- Theme fallback, when none of the above applies: Cruise and boats, Walkable, Nightlife and similar.

The same tags appear beside the city name on the city detail page, so the step and the page agree.

## Nights and fit

- Nights are split across the chosen cities in our recommended proportions, scaled to the trip length, never below one night per city. Recalculated on every change.
- Cities are ordered the way the trip would run them, not the order they were tapped.
- A line appears above the chips only when the choice does not fit: "Too much to see, too little time." Nothing is shown when the choice is fine.
- Continue needs at least one city.

## View details

- Opens as a sheet over the step. The wizard keeps every answer given so far.
- Two rest positions: arrives covering most of the screen with the step dimmed behind it, and scrolling it up takes it full screen. Pulling it down from the top of the page closes it, from either position.
- Contents, in order: photo gallery, city name with its tags, description, Top things to do, the honest bit, When to go, Real traveller itineraries, How to reach, Transport modes, Where to stay, Where to eat, Travellers pair this city with, Common questions.
- A bar at the foot of the sheet says "Add {city} to the trip", or "Added to the trip" when it is already chosen. Adding closes the sheet and returns to the step with the city selected.

## Events

Every event carries: destination, trip_nights, surface (wizard / itinerary_edit).

**Step**

- cities_step_viewed (cities_available, cities_preselected)
- cities_sheet_moved (position: bottom / half / full, method: drag / flick / tap)
- cities_list_scrolled (cards_seen, furthest_position)

**Map**

- cities_map_interacted (action: pan / zoom)
- cities_map_pin_tapped (city, was_selected)

**Selection**

- city_selected (city, position_in_list, source: card / map_pin / detail_sheet, tags, recommended_nights, cities_selected_count)
- city_deselected (city, source: card / chip / detail_sheet, cities_selected_count)
- cities_nights_allocated (cities, nights_per_city, total_nights)
- cities_fit_warning_shown (cities_selected_count, nights_wanted, nights_available)

**Card**

- city_card_impression (city, position, tags)
- city_card_photo_swiped (city, photo_index, photos_total)
- city_view_details_clicked (city, position, source: card / map_pin)

**Detail sheet**

- city_detail_opened (city, source: card / map_pin, is_selected)
- city_detail_expanded (city, to_position: full)
- city_detail_section_viewed (city, section_name)
- city_detail_added (city, scroll_depth_percent, time_on_sheet_seconds)
- city_detail_closed (city, added: true / false, scroll_depth_percent, time_on_sheet_seconds)

**Step completion**

- cities_step_completed (cities, cities_count, nights_per_city, fit_state, time_on_step_seconds, detail_sheets_opened)
- cities_step_abandoned (cities_selected_count, time_on_step_seconds)
- cities_step_back (has_selection)

Itinerary edit only:

- itinerary_cities_changed (itinerary_id, cities_before, cities_after, nights_before, nights_after)

## Success metrics

- Completion rate and time on step, against the other wizard steps.
- Average cities selected, and how often the fit warning appears.
- Share who open at least one city detail sheet, and whether they select more cities than those who do not.
- Add rate from inside the detail sheet against the card.
- Map versus list: which surface selections come from.
- Which tags sit on the cities that get selected most.
- How often cities are changed later on the itinerary screen, which says whether this step got it right.

## Open items

- Suggested nights per city are a hand-maintained list. Confirm who owns it.
- Photography outside Bali falls back to a shared country pool, so two cities can show the same frames. Needs real per-city photos.
- Decide whether crowd level, which drives Offbeat and Gets busy, should be seasonal rather than fixed.
- Decide whether to cap the number of cities for short trips rather than only warning.

# City Detail Page

**New screen.** There was no city-level page before. A country page listed regions and a couple picked one blind.
**What:** One page per city that answers what the place is, what you do there, when to come, how to get there, where to stay and eat.
**Opens from:** "View details" on a city card in the wizard, a map pin on the same step, the country page, and "Travellers pair this city with" on another city page.
**Two forms:** a pull-up sheet inside the wizard, so no answers are lost, and a full screen everywhere else. Same content either way.

## Sections, in order

1. **Photo hero.** Swipeable reel, up to 8 photos. Tap any photo to open the gallery. Save heart and back or close in the top corners. Photo count button.
2. **City name**, with a map button beside it, the city's tags underneath (same tags as the wizard card), then the description capped at three lines with "Read more".
3. **Top things to do.** Horizontal cards: photo, name, rating with review count, duration, and up to two chips (Top activity, Offbeat, Recommended, Audio guide). Tap opens the activity detail page.
4. **The honest bit.** A postcard with what is good and what is not, headed in handwriting as "{City}, honestly". No separate section heading.
5. **When to go.** Month by month, with the same season and weather labels as the travel dates step.
6. **Real itineraries by real travellers.** Rail of booked trips that stop in this city. "View all" opens the full list.
7. **How to reach.** Routes from Indian cities, shown as a timeline with stops and modes.
8. **Transport modes.** How to get around once there.
9. **Where to stay.** Areas within the city, and hotel cards that open the hotel page.
10. **Where to eat.** Restaurant list, with a map view.
11. **Travellers pair {city} with.** Other cities, each with two or three theme chips. Tap opens that city's page.
12. **Common questions.**
13. **Sticky bar.** Arrives as the hero scrolls away: save, and back or close. Inside the wizard it also carries "Add {city} to the trip", which becomes "Added to the trip".

## Overlays

- **Gallery.** Hero photos, activity photos and traveller photos in one mosaic grid, with a count in the header.
- **City map.** Pins for the attractions. Tapping a pin shows a card with the photo, name, distance from the centre, rating and the same chips as the activity card. Pins declutter as you zoom.
- **Food map.** The same, for restaurants.
- **Activity detail**, **hotel detail**, and **all trips** open over the page.

## Picture requirements

The page is mostly photography, so this is the part that decides whether it works.

- **Hero:** minimum 6 city-specific photos, 8 preferred. Landscape, 3:2 or wider, at least 1600px on the long edge.
- **Gallery:** at least 12 items once hero, activity and traveller photos are combined.
- **Activity cards:** one photo per activity, landscape 3:2.
- **Restaurants:** one photo each.
- **Pair-with cards and city cards:** reuse hero photos, 4 per city minimum, since the wizard card is a carousel.
- **Format:** WebP, under 300KB each. First hero image loads eagerly, everything else lazily.
- **Content rules:** no text, watermarks or logos burned into the image. Level horizon. Recognisable people only with consent.
- **Alt text:** city name on the first hero image, activity or restaurant name on the rest.
- **Known gap:** outside Bali we hold no per-city photography. Cities currently fall back to a shared country pool, so two cities can show the same frames. This is the single biggest quality issue on the page and it is a photography problem, not a build one.

## Events

Every event carries: destination, city, surface (wizard_sheet / full_screen).

**Page**

- city_detail_viewed (entry_point: city_card / map_pin / country_page / pair_with, is_selected)
- city_detail_section_viewed (section_name, position)
- city_detail_scroll_depth (percent: 25 / 50 / 75 / 100)
- city_detail_closed (scroll_depth_percent, time_on_page_seconds, added: true / false)

**Hero and gallery**

- city_hero_swiped (photo_index, photos_total)
- city_gallery_opened (source: hero_tap / count_button, items_total)
- city_gallery_closed (items_viewed, time_seconds)

**Content**

- city_description_expanded
- city_activity_card_clicked (activity_name, position, rating, chips)
- city_when_to_go_viewed (months_scrolled)
- city_trip_card_clicked (itinerary_id, position)
- city_trips_view_all_clicked (trips_total)
- city_how_to_reach_viewed (origin_cities_shown)
- city_hotel_card_clicked (hotel_name, position)
- city_restaurant_clicked (restaurant_name, position)
- city_pair_with_clicked (from_city, to_city, themes)
- city_faq_expanded (question)

**Maps**

- city_map_opened (source: map_button / where_to_eat)
- city_map_pin_tapped (pin_name, pin_type: activity / restaurant, distance_km)
- city_map_pin_card_clicked (pin_name, pin_type)

**Actions**

- city_saved (saved: true / false, scroll_depth_percent)
- city_added_to_trip (scroll_depth_percent, time_on_page_seconds, sections_viewed)

## Success metrics

- Share of wizard users who open at least one city page, and whether they select more cities than those who do not.
- Add-to-trip rate from this page against adding straight from the card.
- Scroll depth, and which sections are reached before people decide.
- Which sections precede an add, which tells us what actually convinces.
- Activity and hotel click-through, as a signal of what to merchandise.
- Pair-with click-through, as a measure of whether it builds multi-city trips.
- Bounce rate by city, which will expose the cities with weak photography or thin content.

## Open items

- Per-city photography, per the gap above. Needs a shoot or a licensed library.
- Confirm who writes and owns the honest bit, the description and the FAQ per city.
- Confirm the India flight routes table against real schedules. It is hand-maintained.
- Decide whether traveller photos in the gallery need per-customer consent before go-live.
- Decide what the page shows for a city with no activities, no hotels or no restaurants yet, rather than silently dropping sections.

# Real Itineraries by Real Travellers

**Where:** Home page, after "Why we're the perfect match". Also reused on city pages, filtered to that city.
**What:** Horizontal rail of recently booked trips. "View all" opens a filterable list.
**Why:** Proof you can scroll. Reviews say we are good; this says what people bought.

## Which bookings qualify

- Confirmed, priced bookings only. Exclude test deals, cancelled deals, flight-only.
- Exclude any trip whose itinerary cannot be opened in the app.
- Exclude customers who have opted out.

## Config (changeable without a release)

- Lookback window: default 30 days (options 7 / 15 / 30 / 60 / 90).
- Max cards in rail: 12. Max in View all: 50, paginated at 20.
- Minimum to show the section: 6. Below that, hide the section.
- If below minimum, widen the window until it is met.
- Max 3 cards per country in the rail.

## Sorting

- Rail and View all default: most recently booked first.
- View all also offers: price low to high, price high to low, nights ascending, nights descending.

## Card content

- Destination photo, no repeats within a country.
- First name, home city, relative time ("3h ago", "2w ago"). No surname, no exact date.
- Route with nights per city, total nights, number of travellers.
- Price per person.
- Up to two category chips.
- Tap opens that itinerary.

## Trip categories (itinerary level, maintained by ops)

- Pace, mandatory: Relaxed, Balanced, Explorer.
- Character, mandatory: Classic, Offbeat, Culture, Foodie, Adventure, Beach.
- Value, derived from price: Budget friendly, Premium, Luxury.
- Separate from the existing day-level vibes. Needs a field on the itinerary and a column in the ops tool.

## View all

- Country filter, multi-select. Only countries with bookings in the window.
- Budget buckets on price per person, multi-select: under ₹50k, ₹50k to ₹1L, ₹1L to ₹2L, ₹2L and above.
- Sort, single select.
- Active filter count on the filter button. Reset clears filters, keeps sort.
- Empty state: "No trips match that yet. Try a wider budget." with a one-tap reset.

## Events

Every event carries: surface (home / city_page), window_days, user_state.

- real_itineraries_section_viewed (card_count, window_days, backfilled)
- real_itineraries_rail_scrolled (max_position_reached)
- real_itinerary_card_impression (itinerary_id, destination, nights, price_per_person, price_band, pace, character, booking_age_days, position)
- real_itinerary_card_clicked (same properties)
- real_itineraries_view_all_clicked
- real_itineraries_view_all_viewed (result_count)
- real_itineraries_filter_applied (filter_type, filter_value, filters_active_count, result_count)
- real_itineraries_filter_reset
- real_itineraries_sort_applied (sort_value, result_count)
- real_itineraries_empty_state_shown (filters_active)
- real_itineraries_view_all_closed (time_spent_seconds, cards_viewed, filters_used)
- itinerary_viewed (itinerary_id, entry_point)
- wizard_started (entry_point, source_itinerary_id)
- real_itineraries_section_hidden (reason, available_count)

## Success metrics

- Click rate on the rail, and on View all.
- Share of home visitors who open a real itinerary.
- Planning starts from those visitors against those who did not open one.
- Most-opened countries, price bands and categories.
- How often the window has to widen.

## Open items

- Near real time feed or daily refresh. "3h ago" needs the former.
- Consent and opt-out, with legal.
- Who owns the category fields, and whether old itineraries get backfilled.
- Price per person or total trip value.
- Whether a trip cancelled after booking is pulled from the rail.

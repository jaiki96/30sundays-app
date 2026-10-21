# Recreate a Real Traveller's Itinerary

**Where:** From "Real itineraries by real travellers" on the home page, its View all list, and the same rail on city pages.
**What:** Tapping a card opens that traveller's trip read-only. From there it can be recreated on your own dates as your own itinerary.
**Why:** The hardest part of planning is the blank page. Someone else's finished trip is the answer, and it should take two questions to have it.

## A. Reading the trip

- Opens the normal itinerary screen, read-only: hero, day plans, hotels, flights, map, cost.
- Title names the traveller, for example "Karan's Vietnam trip · 7N". Dates carry the year.
- No edit anywhere: no change day, change hotel, change flights, save, customise, consultant or co-planner.
- Hotels are tappable and read-only, showing only the room the trip was priced on.
- Flights show the legs and the departure city, no fares.
- Cost breakdown in full, taxes and the TCS claim line included.
- Bottom bar: the total including GST and TCS, a PDF, and **Recreate this trip**.
- No personal details anywhere, on screen or in the PDF: first name and home city at most.

## B. The recreate sheet

Two questions, on one sheet. Not the wizard: the wizard builds from nothing, this takes a trip that exists.

- Header names the owner: "Recreate Karan's trip".
- **Start date.** One field. The length is fixed at the trip's own nights, because changing it adds or drops hotels and the trip would arrive as a different trip. The sheet says when they are back.
- **Travellers.** Adults and children as counts. The wizard's rule applies: couples only, so an even number of adults and no children yet. Breaking it shows one line in error red, names the sales team as the way forward, and disables the button.
- **Flights.** Stated before anything is made: not part of the itinerary we create, fares and availability move by the hour, our team quotes them.
- CTA: **Create my itinerary**. The wait names what it is doing, ticking off hotels, pricing and creation.

## C. What gets created

- A new itinerary owned by that user, with its own deal and version.
- **Carried over:** cities, order, nights per city, day plans, activities, hotels.
- **Not carried over:** flights, which the app does not sell, and the price, which is worked out for the new dates and party.
- The source trip is never touched and stays read-only. The same trip can be recreated again.
- Everything is editable from then on, and changes re-price.

## D. Two endings

- **Everything available.** The version is priced and saved on the spot. The traveller lands on a finished itinerary (V1, final price, PDF) with a toast saying it is saved and that changes re-price it.
- **A hotel sold out.** The itinerary is still created, as an unsaved draft. It lands scrolled to the Hotels section with that stay badged Sold out and pulsing, the rail scrolled across to it, and a toast saying to pick another and then save. The decision stays with the traveller.

## E. Events

Every event carries: source_itinerary_id, destination, nights, surface (home_rail / view_all / city_page).

**Reading**

- real_itinerary_opened (entry_point, owner_first_name, price_band)
- real_itinerary_section_viewed (section_name)
- real_itinerary_scroll_depth (percent: 25 / 50 / 75 / 100)
- real_itinerary_pdf_downloaded (scroll_depth_percent)
- real_itinerary_hotel_opened (city, stay_index)
- real_itinerary_closed (scroll_depth_percent, time_seconds, recreated: true / false)

**The sheet**

- recreate_opened (scroll_depth_percent, time_on_trip_seconds)
- recreate_date_selected (start_date, days_from_today, month_season)
- recreate_party_changed (adults, children)
- recreate_party_blocked (reason: odd_adults / solo / children, adults, children)
- recreate_submitted (start_date, adults, children, nights)
- recreate_abandoned (had_date, had_valid_party, time_on_sheet_seconds)

**The result**

- recreate_availability_checked (result: clear / sold_out, sold_out_city, sold_out_stay_index)
- itinerary_created (new_itinerary_id, source_itinerary_id, start_date, nights, travellers, price, state: saved / draft_sold_out)
- recreate_soldout_surfaced (city, stay_index)
- recreate_soldout_resolved (city, old_hotel, new_hotel, minutes_after_create)
- recreate_first_edit (action_type, minutes_after_create)
- recreate_saved (new_itinerary_id, minutes_after_create, edits_before_save)
- recreate_flights_requested (new_itinerary_id, channel: call / whatsapp)

## F. Success metrics

- Share of real-itinerary views that open the sheet, and that finish it.
- Drop-off inside the sheet: no date, blocked party, abandoned.
- How often the party rule blocks, and which reason, as a read on demand we turn away.
- Share of creations that hit a sold-out stay, and how many resolve it rather than abandoning the draft.
- Recreated trips against wizard-built trips: completion, time to save, and conversion to booking.
- Which source trips get recreated most, as an input to what the rail shows.

## G. Open items

- Live hotel availability at create time. The check is seeded today.
- Flights: decide how the sales handoff is triggered from a created itinerary, and track it.
- Confirm with legal that an anonymised real booking can be shown, downloaded and recreated without that customer's explicit consent.
- Decide whether a recreated trip reaches a consultant immediately or only once the traveller engages.
- Decide what happens to the source card if that trip is later cancelled.

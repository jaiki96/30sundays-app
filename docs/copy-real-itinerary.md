# View and Copy a Real Itinerary

**Scope:** Only from the "Real itineraries by real travellers" section. The home rail, its View all list, and the same rail on city pages. Nowhere else, for now.
**What:** Tapping a card opens that trip in full, read only. From there a couple can download it as a PDF, or copy it as their own and edit it.

## A. The view-only itinerary

- Opens the same itinerary layout a customer sees for their own trip: section nav, trip header, day by day plan, hotels, flights, journey map, cost.
- Trip header keeps its format: cities, nights, travellers. Dates show the month the trip ran and the number of nights, not the exact date range. The viewer is not booking those dates, and an exact range ties back to a real customer.
- Every edit entry point is removed: change dates, change cities, change day plan, change hotel, change flights, save version, compare versions.
- Price is shown in full, inclusive of GST and TCS, with the same cost split, labelled as the price that trip was sold at. A line says the price for their own dates will differ.
- **No personal information, on screen or in the PDF:** no surname, no contact details, no traveller list, no documents, no consultant name, no payment or invoice detail. The card's "first name, home city" is the most that is ever shown.
- Bottom bar carries two actions only: **Download PDF** and **Use this itinerary**.
- PDF is the same itinerary with the same exclusions, marked as a sample.

## B. Copying it

- Action is called "Use this itinerary" in the product. "Steal their itinerary" stays in marketing copy only.
- Two inputs, nothing else:
  - **Start date.** The length is fixed at the original trip's nights, so only a start is picked. Same calendar as the wizard, with season and weather labels, and the end date filled in automatically and locked.
  - **Travellers.** Adults, and children if any.
- **What copies:** the route, the nights per city, the day order, the activities on each day, and the hotels.
- **What does not copy:** flights. We cannot promise availability or fare, so flights are chosen fresh in the normal flight step after the copy.
- On confirm, a new itinerary is created in that user's account, fully editable from then on, with all the usual change actions restored.
- Price is recalculated for the new dates and party. The original price is never carried across.
- The copy is independent. Later changes to the source trip never affect it, and the viewer can never edit the source.
- Copying the same trip more than once is allowed.

## C. When something is not available

The copy never fails. It completes, and says what changed.

- **All available:** straight into the new itinerary, no banner.
- **A hotel is sold out:** substitute the nearest equivalent in the same area, star band and price band. A banner at the top lists each swap, with one tap to review or change it.
- **No hotel available in a city:** keep the city and its nights, mark the stay "to be confirmed", and flag it to the consultant.
- **An activity is not available on those dates:** keep the day, flag the activity, and offer that city's alternatives.
- **Price moved:** if the recalculated total differs from the original by more than a set threshold, say so on arrival rather than leaving them to notice.
- **Season mismatch:** if the original ran in peak and the new dates are off season, or the reverse, note that the days may read differently.

## D. Events

Every event carries: source_itinerary_id, destination, nights, surface (home_rail / view_all / city_page).

**View only**

- real_itinerary_opened (entry_point, destination, nights, price_band)
- real_itinerary_section_viewed (section_name)
- real_itinerary_scroll_depth (percent: 25 / 50 / 75 / 100)
- real_itinerary_pdf_downloaded (scroll_depth_percent)
- real_itinerary_closed (scroll_depth_percent, time_seconds, copied: true / false)

**Copy flow**

- copy_itinerary_started (scroll_depth_percent, time_on_view_seconds)
- copy_start_date_selected (start_date, days_from_today, month_season, nights_locked)
- copy_travellers_set (adults, children)
- copy_itinerary_confirmed (start_date, adults, children, nights)
- copy_itinerary_abandoned (step: date / travellers / confirm)

**Result**

- copy_itinerary_created (new_itinerary_id, source_itinerary_id, price_original, price_new, price_delta_percent, swaps_count, cities_unresolved_count)
- copy_substitution_shown (city, original_hotel, substitute_hotel, reason: sold_out / unavailable_dates)
- copy_substitution_reviewed (city, action: kept / changed)
- copy_activity_flagged (city, day, activity_name)
- copy_price_change_shown (price_delta_percent)
- copy_season_mismatch_shown (original_season, new_season)
- copy_itinerary_edited_first_action (action_type, minutes_after_create)
- copy_flights_added (new_itinerary_id, minutes_after_create)

## E. Success metrics

- Share of real itinerary views that start a copy, and that finish one.
- Drop-off by input step: date, travellers, confirm.
- Share of copies that hit a substitution, and how many substitutions get changed afterwards.
- Price delta distribution between original and copy.
- Share of copies that go on to add flights, and to a booking.
- Copies against trips started from a blank wizard, on completion rate and on value.

## F. Open items

- Confirm that showing the month rather than the exact dates is acceptable, or whether the exact range is wanted.
- Agree the price delta threshold that triggers a warning.
- Confirm hotel availability can be checked live at copy time. If not, the copy proceeds optimistically and the consultant resolves it, which needs a different banner.
- Decide whether a copied itinerary is visible to the consultant immediately, or only once the traveller engages with it.
- Confirm with legal that an anonymised itinerary of a real booking can be shown and downloaded without that customer's explicit consent.
- Decide what happens if the source trip is later cancelled or the itinerary is withdrawn.

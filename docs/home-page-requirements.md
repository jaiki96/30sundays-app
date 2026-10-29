# New Home Page: Requirement Document

**Product:** 30 Sundays app, Home / Explore tab
**Status:** Prototype built and live
**Owner:** Kashyap Tibrewal

## 1. Background

- The old home opened with a title "Explore", a row of destination circles, and then five country-wise itinerary carousels stacked one after another.
- A first-time visitor had to scroll past roughly three screens of product lists before the page said who we are, what we sell, or why we are different.
- The reasons to choose us sat in a small 2x2 grid near the bottom, set at caption size.
- Proof (Google rating, real couples, reviews) was at the very end, after the decision had already been made or abandoned.
- There was no single clear action. Every card led somewhere different, and the "Plan my trip" button appeared only at the bottom.

## 2. Objective

- Say what we do and why we are the right fit within the first screen.
- Give the page one primary action: start the trip planner.
- Move proof up, so it is read before the ask and not after it.
- Reduce the number of competing choices so the page reads as a story instead of a catalogue.

## 3. What changed and why

- **Full-screen hero instead of a title bar.** Rotating photography, the logo, one promise line ("Complete Picture of your Holiday"), and a single "Plan my trip" button. Tapping the photo plays the brand video.
- **Google rating moved onto the hero image.** 4.6 and 25,000+ travellers now sit directly above the button, so the last thing read before the tap is the proof. Earlier it was buried near the footer.
- **Country-wise itinerary carousels removed.** They asked a visitor to compare specific packages before they had picked a country. Replaced by a simple six-country grid.
- **Prices removed from the country cards.** A price with no context invites the wrong comparison. Price now appears on the destination screen where it can be explained.
- **"Why we're the perfect match" promoted to a full section.** The three claims (Made for Couples, Price Transparency, No Tourist Traps) now get a card and a line each, with brand artwork, instead of caption-size text.
- **Real booked itineraries added as a new section.** Shows what other travellers actually bought last week: route, nights, travellers, price, pace. This is proof you can scroll, which reviews alone cannot do.
- **Educational videos reframed.** The old generic "Can't decide where to go?" teaser became "Torn between two?", a comparison series (Bali vs Vietnam, Maldives vs Mauritius, and so on), which is the question couples actually ask.
- **One heading style across the page.** The old page used five different heading sizes and weights for sections of the same rank. All section headings are now set identically.
- **Visual system cleaned up.** Cream background, white cards, a light dotted texture on the lower half, and pink reserved for buttons and accents only.
- **Section order reworked** so the page runs: promise, where, why us, proof, education, more proof, ask.

## 4. Sections on the new home page (in order)

1. **Hero** - rotating destination photography, logo, headline, Google rating and traveller count, tap-to-play brand video, "Plan my trip" button leading to the planning wizard.
2. **Curated Destinations** - six countries in a two-column grid, photo and name only, each opening the destination page.
3. **Why we're the perfect match** - short intro line plus three claim cards with illustrations.
4. **Real itineraries by real travellers** - horizontal rail of recently booked trips. Each card shows who booked and when, destination, route with nights per city, number of travellers, pace tag, and price. "View all" opens a full list with budget chips, destination filters, and sort.
5. **Sunday School: Torn between two?** - horizontal carousel of comparison videos. Tapping one opens a full-screen player with a row of save-to-wishlist chips for the places covered.
6. **Traveller Moments** - horizontal strip of portrait photo and video reels from real trips.
7. **Traveller Reviews** - 4.6 out of 5 summary block, verified-on-Google badge, a strip of real couples with their destination, and three review cards.
8. **Closing call to action** - "Ready to plan your getaway?" leading to the planning wizard.
9. **Bottom navigation** - Explore, My Plans, My Trips, Account.

## 5. Events to be tracked

Note: the prototype has no analytics wired in yet. This list is the instrumentation ask.

**Page level**

- home_viewed (user_state, app_version, platform)
- home_section_viewed (section_name, position) - fire once per section at 50 percent visibility
- home_scroll_depth (percent: 25 / 50 / 75 / 100)

**Hero**

- home_hero_impression (image_name, slide_index)
- home_hero_video_played (video_name)
- home_hero_video_progress (video_name, watch_percent: 25 / 50 / 75 / 100)
- home_plan_trip_clicked (placement: hero)

**Curated Destinations**

- home_destination_clicked (destination_name, position)

**Why we're the perfect match**

- home_usp_section_viewed
- home_usp_clicked (usp_name)

**Real itineraries by real travellers**

- home_itinerary_card_impression (trip_id, destination, nights, price_band, position)
- home_itinerary_card_clicked (trip_id, destination, nights, price, pace, position)
- home_itineraries_rail_scrolled (max_position_reached)
- home_itineraries_view_all_clicked
- home_itineraries_filter_applied (filter_type: budget / destination, filter_value, result_count)
- home_itineraries_sort_applied (sort_value)

**Sunday School: Torn between two?**

- home_lesson_card_clicked (lesson_title, comparison_pair, position)
- home_lesson_video_progress (lesson_title, watch_percent: 25 / 50 / 75 / 100)
- home_lesson_topic_saved (topic_name, topic_type: city / activity, saved: true / false)
- home_lesson_closed (lesson_title, watch_percent)

**Traveller Moments**

- home_moment_impression (moment_id, destination, media_type)
- home_moment_clicked (moment_id, destination, media_type)

**Traveller Reviews**

- home_reviews_section_viewed
- home_couple_photo_clicked (couple_name, destination)
- home_review_read_all_clicked

**Closing call to action and handoff**

- home_plan_trip_clicked (placement: footer)
- wizard_started (entry_point: hero / footer / nav, destination_preselected)

**Navigation**

- bottom_nav_clicked (tab_name, from_screen)

## 6. Success metrics

- Click rate on "Plan my trip" from the hero, and from the footer separately.
- Share of home visitors who start the planning wizard, and who finish it.
- Scroll depth distribution, specifically the share reaching the Real itineraries section.
- Click rate on Real itinerary cards, and whether those visitors convert better than hero-only visitors.
- Video play rate and completion rate on the comparison series.
- Drop-off point: the last section viewed before leaving.

## 7. Open items

- Traveller Moments tiles are not tappable yet. Decide whether they open a full-screen reel player before instrumenting the click event.
- The three illustrations and two leaf graphics load from the website CDN rather than from the app. Decide whether to bundle them.
- "View all" in Real itineraries opens a sheet, not a separate screen. Confirm this is the intended pattern before we track it as a screen view.

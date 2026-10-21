# Travel Date Selection

**Where:** Planning wizard, step 3 of 5, titled "Select travel dates".
**What:** A scrolling month-by-month calendar with season and weather labels on every month.
**Why:** A couple picks dates and length in one place, and sees what that month is actually like before they commit.
**Reused on:** "Change travel dates" from a saved itinerary, same calendar, same rules.

## What changed from the old step

- Horizontal month chips replaced by a vertical scrolling calendar, the pattern every booking app already uses.
- One combined month chip split into two: how busy the month is, and what the sky is doing. Different questions.
- Negative weather wording removed. "Heavy rain" is now "Rainy".
- Seven labels, seven distinct colours. No green (reads as a pass mark) and no red (tells people not to go where we sell).
- A start date now auto-fills the recommended end date instead of leaving the length unanswered.
- Both ends can be dragged. Start and end boxes in the footer are controls, not readouts.
- Calendar opens on next month, with the last week of this month visible above it.

## Behaviour

- Opens on next month. The last week of the current month shows above the heading, so it reads as scrollable.
- Only yesterday and earlier are blocked. No lead-time wall for visas or flights.
- Tap a day: sets the start and lays out the recommended number of nights for that destination. The marker moves to the end.
- Tap a later day: moves the end. Tap an earlier day: starts again.
- Drag either end of the selection to change the length.
- Tap the Start or End box: takes the marker, scrolls to that day and flashes it.
- Shorter than recommended: amber bar with "Make it N nights" as a one-tap fix.
- At or above recommended: green confirmation.
- Footer stays on screen while the calendar scrolls, and always shows start, nights, end.
- Continue is enabled only when both a start and a length are set.
- Maldives uses a variant: one start date and fixed night options.

## Month labels

- **Season:** Peak Season (highest demand, peak rates), Mid-season (fewer crowds, better rates), Off Season (quietest time, base rates). Purple, bronze, grey.
- **Weather:** Sunny, Cloudy, Light rain, Rainy, each with typical low and high temperature. Gold, cyan, blue, indigo.
- Driven by per-destination peak and shoulder months, and by climate averages. These are guidance, not a forecast.

## Changing dates on an existing trip

- Opens on the trip's own dates, with the week above showing, not on next month.
- Changing the length redistributes nights across the cities already in the trip. Nights are added to the shortest stays and taken from the longest, never below one night per city.

## Events

Every event carries: destination, surface (wizard / itinerary_edit), min_nights_recommended.

- dates_step_viewed (entry_month, has_existing_dates)
- dates_calendar_scrolled (months_scrolled, furthest_month)
- dates_start_selected (start_date, days_from_today, month_season, month_weather)
- dates_end_autofilled (end_date, nights)
- dates_end_changed (end_date, nights, method: tap / drag)
- dates_start_changed (start_date, method: tap / drag)
- dates_leg_box_tapped (leg: start / end)
- dates_short_warning_shown (nights, min_nights_recommended)
- dates_make_it_n_clicked (nights_before, nights_after)
- dates_validated (nights, meets_recommendation)
- dates_step_completed (start_date, end_date, nights, month_season, month_weather, time_on_step_seconds, edits_count)
- dates_step_abandoned (had_start, had_end, time_on_step_seconds)
- dates_step_back (step_from, has_dates)

Itinerary edit only:

- itinerary_dates_changed (itinerary_id, old_start, new_start, old_nights, new_nights, nights_respread: true / false)

## Success metrics

- Completion rate of this step, and time spent on it against the other wizard steps.
- Share who accept the auto-filled length without editing it.
- Share who land below the recommended nights, and how many use "Make it N".
- Distribution of selected months by season, to see whether the labels shift demand into shoulder and off season.
- Scroll depth, which tells us whether ten months is the right range.
- Drop-off on this step against the step before and after.

## Open items

- Confirm peak and shoulder months per destination with ops, and who maintains them.
- Confirm the climate averages table, and how often it is reviewed.
- Decide whether season should carry a price signal (for example "typically 15 percent lower") rather than words alone.
- Decide whether to block or warn on dates that are too close to departure for visas.

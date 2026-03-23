# 30 Sundays App — Complete Design Brief for Claude Code

## Company
30 Sundays is an AI-first travel company that crafts personalized international holiday packages exclusively for Indian couples — honeymoons, anniversaries, romantic getaways.

## Design System

### Font
- **Figtree** from Google Fonts (import all weights 300-800)
- H1: 32px/32px, H2: 24px/32px, H3: 21px/30px, H4: 18px/24px
- Body B1: 18px/24px Semibold/Regular, B2: 16px/24px, B3: 14px/22px, B4: 12px/18px
- Caption C1: 12px/16px, C2: 10px/14px

### Colors
- **Primary**: 900=#89123E, 600=#E31B53, 300=#FEA3B4, 100=#FFE4E8
- **Blue**: 900=#194185, 600=#1570EF, 300=#84CAFF, 100=#D1E9FF
- **Purple**: 900=#3E1C96, 600=#6938EF, 300=#BDB4FE, 100=#EBE9FE
- **Success**: Text=#027A48, Main=#039855, Border=#C0E5D5, BG=#ECFDF3
- **Danger**: Text=#B42318, Main=#D92D20, Border=#F6CAC7, BG=#FEF3F2
- **Warning**: Text=#B54708, Main=#DC6803, Border=#F6D9C0, BG=#FFFAEB
- **Neutral**: Heading=#181D27, SubHead=#535862, Inactive=#A4A7AE, Icon=#D5D7DA, Divider=#E9EAEB, BG=#F5F5F5

### Spacing & Layout
- 8px grid system, 16px screen padding
- Card border-radius: 12px, shadow: 0 2px 12px rgba(0,0,0,0.08)
- Phone frame: 390x844px with rounded corners (44px), fake status bar + notch

### Vibe Colors (for itinerary tags)
- **Relaxed**: bg=#FFF5F0, text=#D85A30, border=#F0997B
- **Explorer**: bg=#E1F5EE, text=#0F6E56, border=#5DCAA5
- **Offbeat**: bg=#EBE9FE, text=#534AB7, border=#BDB4FE

---

## App Structure

### Navigation
- **4-tab bottom nav**: Explore (Compass icon), Plan (Map icon), My Trips (Briefcase icon), Account (User icon)
- Active tab: #E31B53 with 3px indicator line above
- No login wall — Explore tab is the first screen

### User State Toggle (for prototype only)
Show 4 small toggle buttons at the top of the phone frame:
- **New User**: Clean explore page, no banners
- **Lead**: Pink banner "Welcome back, Priya! Your Bali itinerary is ready — take a look"
- **Customer**: Green banner "Your Vietnam trip starts in 31 days!" with quick links
- **Trip Done**: Purple banner "Plan your next getaway!" with CTA

---

## Screen 1: HOME (Explore Tab)

### Content order (top to bottom):
1. **Header**: "Explore" (H1 left) + notification bell (right, with red dot)
2. **User state banner** (only if not "new")
3. **Destination circles**: Horizontal scroll of 7 circles (Bali, Vietnam, Thailand, Maldives, Sri Lanka, New Zealand, Dubai) — each with circular image + name below. Tap → opens Destination Page.
4. **Relaxed carousel**: Section header with 🧘 emoji + "Relaxed" title + "Slow mornings & sunsets" subtitle + "View all >" link. Horizontal scroll of full-bleed itinerary cards.
5. **Explorer carousel**: Same format with 🧭 emoji
6. **Offbeat carousel**: Same format with 🗺️ emoji
7. **USPs grid**: 2x2 grid — Made for Couples (Heart), Price Transparency (Eye), No Tourist Traps (Shield), 24/7 Support (Headphones)
8. **Traveller moments**: Portrait photo thumbnails (130x180px) horizontal scroll with location caption overlay
9. **Reviews**: Google 4.6/5 badge + 3 testimonial cards with left coral border
10. **CTA banner**: Gradient coral-to-maroon card with "Ready to plan?" + "Plan My Trip" white button

### Itinerary Cards (Full-bleed style, used everywhere):
- 258x272px, border-radius 16px
- 100% image background with gradient overlay (transparent top → 88% black bottom)
- **Top-right**: Moon icon + "7N" badge (dark pill with blur)
- **Top-left**: "🌱 Veg" green badge (only if veg-friendly)
- **Bottom overlay**: Destination name (22px bold white), vibe chip (colored per vibe), horizontally scrollable city chips ("2N · Ubud" format), price "From ₹62,498/pp" + "View >" button
- **NO description text line** (no "Spa, Rice Terraces & Yoga" etc.)
- Maldives cards show resort name in coral color (★ Anantara Veli)

---

## Screen 2: DESTINATION PAGE (/destination/:name)

Opens when tapping a destination circle. **Only Bali is fully functional** — other destinations show itinerary carousels only.

### Content order:
1. **Hero**: Full-bleed image (270px height), back arrow, flag emoji + destination name (26px), "From ₹48,998/person" — NO itinerary count
2. **Relaxed carousel** (if itineraries exist for this vibe)
3. **Explorer carousel**
4. **Offbeat carousel**
5. **Where to Stay** (Bali only): Horizontal scroll of area cards — Ubud (🌿), Seminyak (🌞), Nusa Penida (🌊), Canggu (🏄), Sanur (☀️). Each card: emoji + name + description + ✓ pros (green) + ✗ cons (orange)
6. **Top activities** (Bali only): Portrait thumbnails (138x195px) with play button overlay + name. Items: Tegallalang Rice Terrace, Mount Batur Sunrise, Uluwatu Temple, Tirta Empul, Nusa Penida Beach, Monkey Forest
7. **Offbeat activities** (Bali only): Same format. Items: Hidden Waterfall Trek, Village Cooking Class, Sunrise Fishing, Secret Beach Snorkel, Rice Field Cycling, Night Market Walk
8. **Key Facts** (Bali only): Icon cards — Visa (free 30-day VOA, passport 6+ months), Direct Flights (3/week Delhi, 2/week Mumbai), Ideal Duration (7-10 nights)
9. **Traveller moments**: Portrait photos
10. **Reviews**: Same as home
11. **Other destinations**: Compact cards (155x120px, 2 visible at a time). Content: image + flag + destination name + "From ₹XX,XXX" — NO nights
12. **Sticky CTA**: "Plan my Bali trip" coral button at bottom

**NO bottom personalisation drawer on this page.**

---

## Screen 3: LISTING PAGE (/listing)

Opens when tapping "View all" on any vibe section from Home.

### Layout:
- Header: Back arrow + "Bali Itineraries" (or destination name) + count
- Vertical scroll of listing-style cards (image top 185px + info below)
- **Bottom sheet** (personalisation drawer): Slides up on first open. Contains: Travel dates, Pace (Relaxed / Cover all), Crowds (Popular / Offbeat). Skip + Apply buttons. Dismissible.
- **Floating filter bar** at bottom: Filter icon + pills (Relaxed, Explorer, Offbeat, 🌱 Veg). Tappable toggles.

---

## Screen 4: DETAIL PAGE (/detail/:id)

Opens when tapping any itinerary card.

### Layout:
1. **Hero** (240px): Back arrow, flag + destination name, moon icon + nights, resort name if Maldives
2. **Itinerary at a glance**: Timeline with dots — "Day 1: Ubud" with "Sightseeing · Local experiences" subtitle + "2N" right-aligned
3. **Trip overview**: Pace (Unhurried/Balanced), Crowds (Low/Mixed), Veg food (High/Medium) — colored badges
4. **Pricing card**: Gradient background, "Starting from ₹62,498" + "Incl. GST & TCS"
5. **Floating CTA**: "Plan My Trip" coral button

---

## Screen 5: WIZARD (/plan) — Lead Capture

6-step flow with progress bar at top (animated fill).

1. **Phone**: "Let's plan your getaway" + +91 input field with validation (10 digits)
2. **OTP**: 4-digit input boxes with auto-focus
3. **Name**: "How should we call you?" + text input
4. **Destination**: "Where to, {name}?" + 2-column grid of destination buttons with circle images (auto-selects from context, multi-select)
5. **Travelers**: Adults (default 2, min 1) + Children (default 0) with stepper buttons
6. **Confirmation**: Green checkmark, "You're all set, {name}!", summary table, "Explore Itineraries" button

---

## Sample Data — 24 Itineraries

### Bali (9):
| ID | Vibe | Nights | Price | Route | Veg |
|----|------|--------|-------|-------|-----|
| 1 | Relaxed | 7 | 62,498 | 2N Ubud → 2N Seminyak → 3N Sanur | Yes |
| 2 | Relaxed | 5 | 78,998 | 2N Seminyak → 3N Nusa Dua | No |
| 3 | Relaxed | 7 | 72,498 | 3N Ubud → 2N Kintamani → 2N Sanur | Yes |
| 4 | Explorer | 7 | 58,498 | 2N Ubud → 2N Kintamani → 3N Canggu | No |
| 5 | Explorer | 10 | 82,998 | 3N Ubud → 3N Amed → 2N Nusa Penida → 2N Seminyak | Yes |
| 6 | Explorer | 5 | 48,998 | 2N Seminyak → 1N Uluwatu → 2N Nusa Penida | No |
| 7 | Offbeat | 7 | 55,998 | 3N Sidemen → 2N Munduk → 2N Amed | No |
| 8 | Offbeat | 5 | 48,998 | 2N Sidemen → 3N Munduk | Yes |
| 9 | Offbeat | 7 | 62,498 | 2N Munduk → 3N Pemuteran → 2N Lovina | No |

### Vietnam (3):
| 10 | Explorer | 7 | 65,098 | 2N Hanoi → 2N Ha Long → 3N HCMC | No |
| 11 | Relaxed | 7 | 72,498 | 3N Da Nang → 2N Hoi An → 2N Phu Quoc | Yes |
| 12 | Offbeat | 7 | 68,498 | 2N Ninh Binh → 3N Phong Nha → 2N Hoi An | Yes |

### Thailand (3):
| 13 | Explorer | 7 | 62,498 | 3N Bangkok → 2N Chiang Mai → 2N Krabi | No |
| 14 | Relaxed | 7 | 68,998 | 2N Bangkok → 3N Phuket → 2N Koh Samui | No |
| 15 | Offbeat | 7 | 55,998 | 3N Chiang Mai → 2N Chiang Rai → 2N Pai | Yes |

### Maldives (3):
| 16 | Relaxed | 5 | 89,998 | 2N Malé → 3N Addu (★ Anantara Veli) | Yes |
| 17 | Relaxed | 4 | 1,12,998 | 1N Malé → 3N Baa Atoll (★ Soneva Fushi) | No |
| 18 | Explorer | 7 | 95,498 | 2N Malé → 3N S.Ari → 2N Fuvahmulah (★ Centara Grand) | No |

### Sri Lanka (3):
| 19 | Relaxed | 7 | 54,998 | 2N Kandy → 2N Ella → 3N Mirissa | No |
| 20 | Explorer | 7 | 58,498 | 2N Colombo → 2N Sigiriya → 3N Galle | No |
| 21 | Offbeat | 7 | 54,998 | 2N Sigiriya → 3N Trincomalee → 2N Yala | No |

### New Zealand (3):
| 22 | Explorer | 10 | 1,85,098 | 2N Auckland → 4N Queenstown → 4N Rotorua | No |
| 23 | Relaxed | 7 | 1,65,098 | 2N Auckland → 3N Rotorua → 2N Waiheke | No |
| 24 | Offbeat | 10 | 1,95,098 | 3N Christchurch → 4N Milford → 3N Wanaka | No |

### Destination Starting Prices:
Bali: ₹48,998 | Vietnam: ₹65,098 | Thailand: ₹55,998 | Maldives: ₹89,998 | Sri Lanka: ₹54,998 | New Zealand: ₹1,65,098 | Dubai: ₹62,998

### Flag Emojis:
Bali: 🇮🇩 | Vietnam: 🇻🇳 | Thailand: 🇹🇭 | Maldives: 🇲🇻 | Sri Lanka: 🇱🇰 | New Zealand: 🇳🇿 | Dubai: 🇦🇪

---

## Images
Use picsum.photos with fixed seeds for consistency:
- Card images: `https://picsum.photos/seed/{destination}1/500/300`
- Circle icons: `https://picsum.photos/seed/{destination}1/150/150`
- Small cards: `https://picsum.photos/seed/{destination}1/300/200`
- Activity portraits: `https://picsum.photos/seed/bact{index}/300/400`

---

## Reviews Data:
1. Nishant & Priya — "Their offbeat Bali itinerary was a revelation!" (Bali)
2. Rohit & Sneha — "Vietnam was perfectly paced for us." (Vietnam)
3. Aakash & Meera — "Maldives felt designed just for us two." (Maldives)

## Brand Voice:
- Warm, romantic, couples-focused
- "Curated for couples", "No tourist traps", "Your trip, your way"
- Never say "package deal", "cheap", or "standard itinerary"

---

## Technical Notes:
- Pure frontend, no backend, no API calls
- All data hardcoded in a data.js file
- Use React Router for navigation
- Use Tailwind CSS for styling
- Use lucide-react for icons
- Mobile-first design rendered inside phone frame on desktop
- State management with React useState only

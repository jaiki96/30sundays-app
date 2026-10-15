import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import {
  ArrowLeft, ArrowRight, Check, X as XIcon, Star, MapPin, Clock, Images,
  Plane, Car, TrainFront, TramFront, Ship, Footprints, Bike, Bus,
  BedDouble, ChevronDown, ChevronUp, Sparkles, Hotel,
  Map as MapIcon, Maximize2, Plus, Minus,
} from "lucide-react";
import { C, customerPhotos } from "../data";
import { regionDetail } from "../data/regionData";
import { buildActivityDetail } from "../data/activityData";
import { regionFaq } from "../data/regionFaq";
import { regionReach } from "../data/regionReach";
import { cityCoords } from "../data/buildData";
import { sightCoords } from "../data/sightCoords";
import { areaCoords } from "../data/areaCoords";
import { regionsFor } from "../data/discoverData";
import { tripsThroughCity } from "../data/bookedTrips";
import { generateHotelsForCity } from "../data/hotelData";
import { SKY_WORD } from "../data/weatherData";
import { KIND_TONE } from "../data/activityKind";
import { FOOD_TAG, sortTags } from "../data/regionFood";
import { SKY_STYLE } from "../components/skyStyle";
import { SEASON_COLOR, SEASON_TINT } from "../components/seasonStyle";
import { R, SHADOW, T, WELL, A } from "../components/hotel_refined/tokens";
import BookedCard from "../components/booked_lab/BookedCard";
import { ActivityScreen } from "./DayDetailLab";
import { roomNote } from "../data/roomNotes";
import HotelV3 from "../components/hotel_v3/HotelV3";
import { detailFromHotel } from "../data/hotelDetailAdapter";
import SourceLogo from "../components/hotel_detail/SourceLogo";

// ─── One region, in full ───
//
// A couple choosing between Hanoi and Hoi An is working through a list of
// questions nobody had answered in one place. This page is that list, in the
// order they ask it: what is there to do, how do we get there, what is the
// weather like, how do we move around, where do we stay, is it worth it, and
// who has already been.
//
// The shape is the day detail screen's. Each region is a card in a deck you
// push sideways, with the next region peeking in at the edge so the gesture is
// visible rather than guessed at. Scrolling a card lifts its sheet over the
// footage and the card grows out to the full screen as it goes, which is how
// the same surface is both a thing you browse and a thing you read.

const PAD = 16;

// ─── One region, on one page ───
//
// This screen used to be a deck of regions you pushed sideways, with a name and
// two arrows in the header to step between them. Both are gone. The photographs
// at the top are a reel you swipe now, and two horizontal gestures on one
// surface cannot both win: swiping a picture is what people expect, and
// stepping between regions already has two better doors, the destination
// screen and Pair with at the foot of this page.

const MODE_ICON = {
  flight: Plane, car: Car, train: TrainFront, metro: TramFront,
  boat: Ship, walk: Footprints,
};
const MODE_WELL = {
  flight: WELL.ocean, car: WELL.brand, train: WELL.lagoon, metro: WELL.lagoon,
  boat: WELL.ocean, walk: WELL.neutral,
};

// Which picture goes with a way of getting around. Matching on the label beats
// a fixed order: "Scooter hire" should never come up with a train.
const TRANSPORT_RULES = [
  [/scooter|bike|cycl|motorbike/i, Bike],
  [/train|metro|rail|skytrain|tram/i, TrainFront],
  [/bus|shuttle|coach|songthaew/i, Bus],
  [/boat|ferry|speedboat|dhoni|tender|gondola/i, Ship],
  [/walk|foot/i, Footprints],
];
const transportIcon = (label = "") =>
  (TRANSPORT_RULES.find(([re]) => re.test(label)) || [])[1] || Car;

const clamp = (lines) => ({
  display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical", overflow: "hidden",
});

// ─── Three lines, then the rest ───
//
// The lead and the description are one block, capped at three lines together,
// with the rest behind a link. One block rather than two because a couple reads
// it as one paragraph, and capping only the second half leaves a bold line
// floating above a truncated one.
//
// The link measures before it offers itself and only appears when the text
// really is longer, because a "Read more" that reveals nothing is worse than no
// link at all. The descriptions are short today and will grow; the cap is what
// keeps that growth from pushing the whole page below the fold.
function ReadMore({ lead, sub, children, lines = 3 }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [over, setOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setOver(el.scrollHeight - el.clientHeight > 2);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [lead, sub, children, lines]);

  return (
    <>
      <div ref={ref} style={{ margin: "7px 0 0", ...(open ? {} : clamp(lines)) }}>
        {lead && <span style={{ ...T.lead, lineHeight: 1.45 }}>{lead} </span>}
        {sub && <span style={{ ...T.body, lineHeight: 1.45 }}>{sub} </span>}
        {children && <span style={{ ...T.body, lineHeight: 1.45 }}>{children}</span>}
      </div>
      {(over || open) && (
        <button onClick={() => setOpen((v) => !v)} style={{
          margin: "5px 0 0", padding: 0, border: "none", background: "none", cursor: "pointer",
          fontFamily: "inherit", fontSize: 12.5, fontWeight: 700, color: C.p600,
        }}>{open ? "Read less" : "Read more"}</button>
      )}
    </>
  );
}

// ─── Where in the country this is ───
//
// A region page that never shows a map asks a couple to know, from the name
// alone, whether Ubud is next to Seminyak or a day away from it. Everything
// pinned here has real coordinates behind it: the regions come from the route
// builder's own table and the sights from their own, and the distances are
// measured off those rather than written down.
const mapPin = (colour, big = false) => L.divIcon({
  className: "",
  html: `<div style="width:${big ? 16 : 11}px;height:${big ? 16 : 11}px;border-radius:50%;
      background:${colour};border:3px solid #fff;
      box-shadow:0 2px 7px rgba(0,0,0,0.32)"></div>`,
  iconSize: [big ? 16 : 11, big ? 16 : 11],
  iconAnchor: [big ? 8 : 5.5, big ? 8 : 5.5],
});

// ─── A pin you can tell apart ───
//
// Seven identical dots on an island is a puzzle, not a map. Each sight carries
// its number, counted outwards from the centre, and the same number is on its
// card, so a pin and a card can be matched by looking rather than by tapping
// everything in turn. The selected one grows and goes brand colour.
const numberPin = (n, on) => {
  const d = on ? 30 : 24;
  return L.divIcon({
    className: "",
    html: `<div style="width:${d}px;height:${d}px;border-radius:50%;
        background:${on ? C.p600 : WELL.gold.fg};border:2.5px solid #fff;
        box-shadow:0 2px 8px rgba(0,0,0,0.34);
        display:flex;align-items:center;justify-content:center;
        font-family:Figtree,sans-serif;font-size:${on ? 13 : 12}px;font-weight:800;color:#fff">${n}</div>`,
    iconSize: [d, d],
    iconAnchor: [d / 2, d / 2],
  });
};

// The town itself, named on the map rather than left as one more dot. This is
// the honest way to answer "where is Ubud": we hold a centre point for every
// region and no boundary for any of them, so the page marks the point it has
// instead of drawing an outline it would be inventing.
// The label hangs below the dot rather than beside it. The sights nearest the
// centre are the ones a couple cares about most, and they sit on top of it: a
// label stretching sideways covered two or three of them every time.
const centrePin = (label) => L.divIcon({
  className: "",
  html: `<div style="display:flex;flex-direction:column;align-items:center;gap:3px;transform:translate(-50%,-11px)">
      <div style="width:18px;height:18px;border-radius:50%;background:${C.p600};
          border:4px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.34)"></div>
      <div style="background:#fff;border-radius:999px;padding:3px 9px;
          box-shadow:0 2px 8px rgba(0,0,0,0.22);white-space:nowrap;
          font-family:Figtree,sans-serif;font-size:11.5px;font-weight:800;color:#181D27">${label}</div>
    </div>`,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

// Straight-line distance, which is the only one we can honestly state: we hold
// coordinates, not road times. So a sight is "4 km from the centre", never
// "15 minutes away", and two regions are a distance "apart", never "away".
function kmApart(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

const kmLabel = (km) => (km < 1 ? "In the centre" : `${km < 10 ? km.toFixed(1) : Math.round(km)} km from the centre`);

// ─── A sight is only pinned if we know where it is ───
//
// Two filters, and the second one is the important one. Most of the catalogue
// is things like "Beach day" and "Spa afternoon", which are real things to do
// that are not anywhere in particular, so they have no entry and get no pin.
//
// The distance check is the safety net: the coordinates are keyed by the
// activity's name, and a handful of names repeat across countries ("Fish market
// tour" is in both Malé and Auckland). Anything that lands implausibly far from
// the region it is supposed to belong to is dropped rather than drawn in the
// wrong ocean. Day trips are legitimately far (Hobbiton is eighty kilometres
// from Rotorua, Milford Sound nearly three hundred from Queenstown), so the
// limit is generous; it only has to catch the wrong continent.
const SAME_REGION_KM = 350;

function pinnedSights(acts, here) {
  if (!here) return [];
  return acts
    .map((a) => {
      const c = sightCoords(a.name);
      if (!c) return null;
      const km = kmApart(here, c);
      return km > SAME_REGION_KM ? null : { ...a, lat: c.lat, lng: c.lng, km };
    })
    .filter(Boolean)
    .sort((x, y) => x.km - y.km);
}

// ─── Getting closer ───
//
// The view opens on the whole destination, which is the point: it answers where
// the region sits. The cost is that the sights inside the town itself stack up
// at that zoom, so these are here to get in. Pinch does the same thing, but not
// everybody pinches and nobody pinches on a laptop.
function Zoom() {
  const map = useMap();
  const btn = {
    width: 34, height: 34, border: "none", background: C.white, cursor: "pointer",
    display: "grid", placeItems: "center", padding: 0,
  };
  return (
    <div style={{
      position: "absolute", right: 12, zIndex: 600,
      top: "calc(104px + env(safe-area-inset-top, 0px))",
      borderRadius: R.well, overflow: "hidden", boxShadow: SHADOW.float,
    }}>
      <button onClick={() => map.zoomIn()} aria-label="Zoom in" style={{ ...btn, borderBottom: `1px solid ${C.div}` }}>
        <Plus size={16} color={C.head} />
      </button>
      <button onClick={() => map.zoomOut()} aria-label="Zoom out" style={btn}>
        <Minus size={16} color={C.head} />
      </button>
    </div>
  );
}

// ─── The card that rises off a pin ───
//
// Tapping a pin brings up one card from the bottom of the screen, the way a
// listing does on a map you have used before. One card, not a rail of them: the
// pin you pressed is the thing you asked about, and a rail puts six answers
// under a question about one.
//
// The whole card is the way in. There is no separate button, because a card
// that appears when you press a pin and does nothing when you press it is a
// card that has taught you not to press it.
function PinCard({ n, img, title, meta, tag, rating, onOpen, onClose }) {
  return (
    <div style={{
      position: "absolute", left: 12, right: 12, bottom: 16, zIndex: 650,
      animation: "sheetSlideUp 0.22s cubic-bezier(0.22,0.61,0.36,1)",
    }}>
      <div style={{
        position: "relative", background: C.white, borderRadius: R.card,
        boxShadow: SHADOW.float, overflow: "hidden",
      }}>
        <button onClick={onOpen} style={{
          display: "flex", gap: 12, alignItems: "center", width: "100%", textAlign: "left",
          background: "none", border: "none", padding: 11, cursor: "pointer", fontFamily: "inherit",
        }}>
          <span style={{ position: "relative", flexShrink: 0 }}>
            <img src={img} alt="" style={{ width: 64, height: 64, borderRadius: R.well, objectFit: "cover", display: "block", background: A.photoBg }} />
            {n != null && (
              <span style={{
                position: "absolute", top: -5, left: -5, width: 21, height: 21, borderRadius: "50%",
                background: C.p600, color: "#fff", fontSize: 11.5, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid #fff",
              }}>{n}</span>
            )}
          </span>
          <span style={{ flex: 1, minWidth: 0, paddingRight: 22 }}>
            <span style={{ ...T.h3, fontSize: 14.5, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
            <span style={{ ...T.micro, display: "block", marginTop: 3 }}>{meta}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 7 }}>
              {tag && (
                <span style={{
                  padding: "3px 8px", borderRadius: R.pill,
                  background: tag.bg, color: tag.fg, fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap",
                }}>{tag.label}</span>
              )}
              {/* The same score the activity page opens with, off the same
                  generator, so the card cannot disagree with the page it
                  leads to. */}
              {rating && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                  <Star size={11} color={A.star} fill={A.star} strokeWidth={0} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: C.head }}>{rating.score}</span>
                  <span style={{ ...T.micro }}>({rating.count})</span>
                </span>
              )}
            </span>
          </span>
        </button>

        <button onClick={onClose} aria-label="Close" style={{
          position: "absolute", top: 8, right: 8, width: 24, height: 24, borderRadius: "50%",
          border: "none", background: C.bg, display: "grid", placeItems: "center", cursor: "pointer",
        }}><XIcon size={13} color={C.sub} /></button>
      </div>
    </div>
  );
}

// ─── The map ───
//
// The destination, the town marked and named on it, and the things to do around
// the town numbered outwards from it. Tapping a pin raises its card; tapping the
// card opens the activity. So the map is a way into the page rather than a
// picture of it.
//
// It used to carry the other regions on a second tab and a count of how many
// sights it could place. Both are gone: the regions have their own section at
// the foot of the page, and a badge reading "7 of 9 mapped" was the page
// talking about its own data rather than about Ubud.
function RegionMapScreen({ dest, city, acts, onOpenAct, onClose }) {
  const here = cityCoords[city];
  const sights = useMemo(() => pinnedSights(acts || [], here), [acts, here]);
  const [pick, setPick] = useState(null);

  const span = useMemo(() => {
    // ─── Every pin, deliberately ───
    //
    // The view opens on the whole destination with the region placed on it,
    // because that is the question the map is being asked: where is Ubud in
    // Bali. The cost is that one far day trip widens it, and that the pins in
    // the town itself stack up at that zoom. Milford Sound is three hundred
    // kilometres from Queenstown and pulls the view out to half the South
    // Island. The zoom buttons are the answer to both; dropping the far pin
    // from the fit is the other answer, and a tighter opening view is the
    // trade it costs.
    const all = [here, ...sights.map((x) => ({ lat: x.lat, lng: x.lng }))];
    const lat = all.map((c) => c.lat);
    const lng = all.map((c) => c.lng);
    // A single pin would otherwise fit a zero-sized box and land on a roof.
    const pad = Math.max(0.035, (Math.max(...lat) - Math.min(...lat)) * 0.3);
    return [
      [Math.min(...lat) - pad, Math.min(...lng) - pad],
      [Math.max(...lat) + pad, Math.max(...lng) + pad],
    ];
  }, [sights, here]);

  const chosen = sights.find((x) => x.id === pick);
  // The score the activity page will open with, read off the same builder, so
  // the card and the page can never show two different numbers.
  const rating = useMemo(() => {
    if (!chosen) return null;
    const d = buildActivityDetail({ name: chosen.name }, { city, country: dest });
    return { score: d.rating, count: Number(d.reviewCount).toLocaleString("en-IN") };
  }, [chosen, city, dest]);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 300, background: C.white }}>
      <MapContainer
        bounds={span}
        style={{ height: "100%", width: "100%", background: "#AADAFF" }}
        attributionControl={false}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Zoom />

        {/* The town, named, and deliberately underneath everything else. The
            numbered pins are what you came to press, and the ones nearest the
            centre land right on top of this one. */}
        <Marker position={[here.lat, here.lng]} icon={centrePin(city)} zIndexOffset={-500} />

        {sights.map((x, n) => (
          <Marker
            key={x.id}
            position={[x.lat, x.lng]}
            icon={numberPin(n + 1, pick === x.id)}
            zIndexOffset={pick === x.id ? 1000 : 0}
            eventHandlers={{ click: () => setPick(x.id) }}
          />
        ))}
      </MapContainer>

      <div style={{
        position: "absolute", left: 12, right: 12, zIndex: 600,
        top: "calc(12px + env(safe-area-inset-top, 0px))",
        display: "flex", alignItems: "center", gap: 9, pointerEvents: "none",
      }}>
        <button onClick={onClose} aria-label="Close map" style={{
          pointerEvents: "auto", width: 36, height: 36, borderRadius: "50%", border: "none",
          background: C.white, boxShadow: SHADOW.float, display: "grid", placeItems: "center",
          cursor: "pointer", flexShrink: 0,
        }}><XIcon size={18} color={C.head} /></button>
        <span style={{
          pointerEvents: "auto", background: C.white, borderRadius: R.pill, padding: "9px 14px",
          boxShadow: SHADOW.float, fontSize: 12.5, fontWeight: 700, color: C.head,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{city} in {dest}</span>
      </div>

      {/* With nothing chosen the map is just the map, so one line says what to
          do with it rather than leaving a blank screen of dots. */}
      {!chosen && (
        <span style={{
          position: "absolute", left: 0, right: 0, bottom: 20, zIndex: 600,
          textAlign: "center", pointerEvents: "none",
        }}>
          <span style={{
            background: "rgba(17,17,17,0.78)", backdropFilter: "blur(10px)", color: "#fff",
            borderRadius: R.pill, padding: "8px 14px", fontSize: 12, fontWeight: 600,
          }}>Tap a pin to see what it is</span>
        </span>
      )}

      {chosen && (
        <PinCard
          n={sights.indexOf(chosen) + 1}
          img={chosen.img}
          title={chosen.name}
          meta={kmLabel(chosen.km)}
          tag={{
            label: chosen.kind,
            bg: (KIND_TONE[chosen.kind] || KIND_TONE.Culture).bg,
            fg: (KIND_TONE[chosen.kind] || KIND_TONE.Culture).fg,
          }}
          rating={rating}
          onOpen={() => onOpenAct(chosen)}
          onClose={() => setPick(null)}
        />
      )}
    </div>
  );
}

// ─── The gallery ───
// One grid, not two tabs. Splitting the region's own photographs from the ones
// customers sent made a couple choose which half of the pictures to look at
// before they had seen any of them, and the answer was always "both".
function GalleryScreen({ r, onClose }) {
  const items = useMemo(() => {
    const mine = (customerPhotos[r.dest] || [])
      .map((p) => p?.img || p)
      .filter((x) => typeof x === "string");
    return [...new Set([...r.photos, ...r.acts.map((a) => a.img), ...mine].filter(Boolean))];
  }, [r]);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 260, background: C.white, display: "flex", flexDirection: "column" }}>
      <div style={{
        flexShrink: 0, padding: "12px 14px 10px", borderBottom: `1px solid ${C.div}`,
        paddingTop: "calc(12px + env(safe-area-inset-top, 0px))",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <button onClick={onClose} aria-label="Back" style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.div}`, background: C.white, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
          <ArrowLeft size={17} color={C.head} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, ...T.h3 }}>{r.city}</p>
          <p style={{ margin: "1px 0 0", ...T.micro }}>{items.length} photos and videos</p>
        </div>
      </div>

      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "12px 14px 24px" }}>
        {items.length === 0 ? (
          <p style={{ margin: "30px 0 0", ...T.body, textAlign: "center" }}>Nothing here yet.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridAutoFlow: "dense", gap: 4 }}>
            {items.map((src, i) => {
              const big = i % 3 === 0;
              const leftSide = Math.floor(i / 3) % 2 === 0;
              return (
                <div key={i} style={{
                  gridColumn: big ? (leftSide ? "1 / span 2" : "2 / span 2") : "auto",
                  gridRow: big ? "span 2" : "auto",
                  aspectRatio: "1 / 1", borderRadius: 8, overflow: "hidden", background: A.photoBg,
                }}>
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Every trip through here, in one scroll ───
function AllTripsSheet({ trips, onClose }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 250, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(24,29,39,0.45)" }} />
      <div style={{
        position: "relative", background: C.bg, borderRadius: "20px 20px 0 0",
        height: "86%", display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ background: C.white, padding: "10px 0 0", flexShrink: 0, borderBottom: `1px solid ${C.div}` }}>
          <div style={{ width: 44, height: 4, borderRadius: 2, background: C.div, margin: "0 auto 12px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: `0 ${PAD}px 12px` }}>
            <p style={{ margin: 0, flex: 1, ...T.h2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Real traveller itineraries
            </p>
            <button onClick={onClose} aria-label="Close" style={{
              width: 30, height: 30, borderRadius: "50%", border: "none", background: C.bg,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}><XIcon size={16} color={C.head} /></button>
          </div>
        </div>
        <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: `14px ${PAD}px 24px` }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {trips.map((t) => <BookedCard key={t.key} t={t} wide />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section furniture ───

function Sec({ title, action, children, flush }) {
  return (
    <div style={{ marginTop: 26 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: `0 ${PAD}px`, marginBottom: 12 }}>
        <h2 style={{ margin: 0, ...T.h2, flex: 1 }}>{title}</h2>
        {/* A title that wraps still has one first line, and that is the line
            the action belongs on. */}
        {action && <span style={{ flexShrink: 0, paddingTop: 2 }}>{action}</span>}
      </div>
      <div style={flush ? undefined : { padding: `0 ${PAD}px` }}>{children}</div>
    </div>
  );
}

function Well({ Icon, tone = WELL.neutral, size = 34 }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: R.well, flexShrink: 0, background: tone.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}><Icon size={Math.round(size * 0.47)} color={tone.fg} /></span>
  );
}

function Card({ children, pad = 14 }) {
  return (
    <div style={{ background: C.white, borderRadius: R.card, boxShadow: SHADOW.card, padding: pad }}>
      {children}
    </div>
  );
}

// Every rail on this page caps at five or six and puts the rest behind this.
// One link, written one way, so "there is more of this" never looks like three
// different promises.
function ViewAll({ onClick }) {
  return (
    <button onClick={onClick} style={{
      flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 4,
      border: "none", background: "none", padding: 0, cursor: "pointer", fontFamily: "inherit",
      fontSize: 12.5, fontWeight: 700, color: C.p600,
    }}>View all <ArrowRight size={13} /></button>
  );
}

// And one sheet behind it, for whatever the rail was holding.
//
// Portalled into the phone shell, the way every other overlay in the app is.
// A sheet rendered where it is written would position itself against the
// scrolling page inside the card and open somewhere above the fold.
function ListSheet({ open, title, count, children, onClose }) {
  const [frame, setFrame] = useState(null);
  useEffect(() => { setFrame(document.getElementById("phone-frame")); }, []);
  if (!open || !frame) return null;
  return createPortal(
    <div style={{ position: "absolute", inset: 0, zIndex: 250, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(24,29,39,0.45)" }} />
      <div style={{
        position: "relative", background: C.bg, borderRadius: "20px 20px 0 0",
        height: "86%", display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ background: C.white, padding: "10px 0 0", flexShrink: 0, borderBottom: `1px solid ${C.div}` }}>
          <div style={{ width: 44, height: 4, borderRadius: 2, background: C.div, margin: "0 auto 12px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: `0 ${PAD}px 12px` }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, ...T.h2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</p>
              {count != null && <p style={{ margin: "1px 0 0", ...T.micro }}>{count} in all</p>}
            </div>
            <button onClick={onClose} aria-label="Close" style={{
              width: 30, height: 30, borderRadius: "50%", border: "none", background: C.bg,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}><XIcon size={16} color={C.head} /></button>
          </div>
        </div>
        <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: `14px ${PAD}px 24px` }}>
          {children}
        </div>
      </div>
    </div>,
    frame
  );
}

// ─── Top things to do ───
//
// Five on the rail, then a door. Nine cards is nine swipes to the end of a list
// nobody asked to be exhaustive, and the ones at the back may as well not be
// there.
//
// The door is always on the section, even where the rail happens to be holding
// everything there is. A View all that comes and goes depending on how many
// trips pass through a particular town reads as a bug, and a couple who has
// learned the link is there should find it there.
const SHOWN_ACTS = 5;
// Eleven itineraries on a rail is eleven swipes. Same cap, same door.
const SHOWN_TRIPS = 6;

// ─── The pictures on a card ───
//
// Its own reel, swiped inside the card, because one photograph of a waterfall
// is a waterfall and three of them are a morning. Snapping is CSS and the dots
// read the scroll rather than drive it, so a flick and a drag land on the same
// frame.
//
// Scrolling is not tapping, so the reel can live inside a card that opens the
// activity: a swipe moves the picture and a tap goes through to the page.
function CardReel({ imgs, alt, height }) {
  const [i, setI] = useState(0);
  const onScroll = (e) => {
    const el = e.currentTarget;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next !== i) setI(next);
  };

  return (
    <div style={{ position: "relative", height, flexShrink: 0, background: A.photoBg }}>
      <div
        className="hide-scrollbar"
        onScroll={onScroll}
        style={{
          display: "flex", height: "100%", overflowX: "auto", overflowY: "hidden",
          scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch",
        }}
      >
        {imgs.map((src, n) => (
          <div key={n} style={{ flex: "0 0 100%", width: "100%", height: "100%", scrollSnapAlign: "start" }}>
            <img src={src} alt={n === 0 ? alt : ""} loading={n === 0 ? "eager" : "lazy"}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        ))}
      </div>

      {imgs.length > 1 && (
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 8,
          display: "flex", justifyContent: "center", gap: 4, pointerEvents: "none",
        }}>
          {imgs.map((_, n) => (
            <span key={n} style={{
              width: n === i ? 6 : 4.5, height: n === i ? 6 : 4.5, borderRadius: "50%",
              background: n === i ? "#fff" : "rgba(255,255,255,0.55)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── One thing to do ───
//
// The badge used to say "Recommended" on a screen where everything is already
// recommended, so it says why instead: "Best at sunrise" tells a couple
// something, "Recommended" does not.
//
// It sits back on the photograph, not in the card. In the card it was a row
// that only some cards had, and because a rail stretches every card to the
// same height, the ones without it carried the gap where it would have been.
// On the photograph it costs no height at all, so every card reads the same.
function ActCard({ a, onOpen, width = 255, imgH = 165 }) {
  const tone = KIND_TONE[a.kind] || KIND_TONE.Culture;
  const imgs = a.imgs?.length ? a.imgs : [a.img].filter(Boolean);

  return (
    <div
      onClick={() => onOpen(a)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(a); } }}
      style={{
        flexShrink: 0, width, background: C.white, borderRadius: R.card,
        overflow: "hidden", boxShadow: SHADOW.card, display: "flex", flexDirection: "column",
        cursor: "pointer", textAlign: "left",
      }}
    >
      <div style={{ position: "relative" }}>
        <CardReel imgs={imgs} alt={a.name} height={imgH} />
        {a.pick && (
          <span style={{
            position: "absolute", left: 9, top: 9, zIndex: 1,
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "4px 9px", borderRadius: R.pill,
            background: "rgba(255,244,224,0.95)", color: WELL.gold.fg,
            border: "1px solid rgba(240,213,168,0.9)", backdropFilter: "blur(6px)",
            boxShadow: "0 1px 6px rgba(16,24,40,0.18)",
            fontSize: 10.5, fontWeight: 800, whiteSpace: "nowrap",
          }}><Sparkles size={10} /> {a.pick}</span>
        )}
      </div>

      <div style={{ padding: "11px 12px 13px", flex: 1, display: "flex", flexDirection: "column" }}>
        <p style={{ margin: 0, ...T.h3, ...clamp(1) }}>{a.name}</p>
        {/* Two lines kept whether the line needs them or not. A rail stretches
            every card to the tallest one, so a one-line summary used to leave
            its missing second line as a gap above the tags. Reserving it puts
            the tags on the same line across the whole rail. */}
        {a.summary && (
          <p style={{
            margin: "5px 0 0", ...T.meta, lineHeight: 1.45, minHeight: 35, ...clamp(2),
          }}>{a.summary}</p>
        )}
        <span style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
          <span style={{
            padding: "4px 9px", borderRadius: R.pill,
            background: tone.bg, color: tone.fg,
            fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap",
          }}>{a.kind}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, ...T.micro, color: C.sub }}>
            <Clock size={11} /> {a.hours}
          </span>
        </div>
      </div>
    </div>
  );
}

function ThingsToDo({ acts, city, onOpen }) {
  const [all, setAll] = useState(false);

  return (
    <>
      <Sec
        title="Top things to do"
        action={acts.length > 0 && <ViewAll onClick={() => setAll(true)} />}
        flush
      >
        <div className="hs" style={{ gap: 12, paddingLeft: PAD, paddingRight: PAD, alignItems: "stretch" }}>
          {acts.slice(0, SHOWN_ACTS).map((a) => (
            <ActCard key={a.id} a={a} onOpen={onOpen} />
          ))}
        </div>
      </Sec>

      <ListSheet open={all} title={`Things to do in ${city}`} count={acts.length} onClose={() => setAll(false)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {acts.map((a) => (
            <ActCard key={a.id} a={a} width="100%" imgH={200} onOpen={(x) => { setAll(false); onOpen(x); }} />
          ))}
        </div>
      </ListSheet>
    </>
  );
}

// ─── How to reach ───
//
// Three cities, and under the one you pick, the ways of making that journey.
// Not one route drawn leg by leg: a couple deciding between Hoi An and Ha Long
// wants to know that one is a cab and the other is a flight, and the leg-by-leg
// version buried that under three rows of place names and dotted lines.
//
// So each way is one row: the modes as icons, what it is in two or three words,
// and roughly how long. Quickest first.
function Way({ w, best }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
      borderTop: best ? "none" : `1px solid ${C.div}`,
    }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
        {w.modes.map((m, i) => {
          const Icon = MODE_ICON[m] || Car;
          const tone = MODE_WELL[m] || WELL.neutral;
          return (
            <span key={m} style={{
              width: 26, height: 26, borderRadius: 8, background: tone.bg,
              display: "grid", placeItems: "center",
              marginLeft: i ? -8 : 0, border: i ? "1.5px solid #fff" : "none",
            }}><Icon size={13} color={tone.fg} /></span>
          );
        })}
      </span>

      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", ...T.lead, fontSize: 13.5 }}>{w.label}</span>
        {w.hint && <span style={{ display: "block", ...T.micro, marginTop: 2 }}>{w.hint}</span>}
      </span>

      <span style={{ flexShrink: 0, textAlign: "right" }}>
        <span style={{ display: "block", fontSize: 13, fontWeight: 800, color: C.head }}>{w.time}</span>
        {best && <span style={{ display: "block", ...T.micro, color: A.green, fontWeight: 700 }}>Quickest</span>}
      </span>
    </div>
  );
}

function HowToReach({ origins, city }) {
  const [pick, setPick] = useState(origins[0]?.id);
  const from = origins.find((o) => o.id === pick) || origins[0];
  if (!from) return null;

  return (
    <Sec title={`How to reach ${city}`} flush>
      {/* Where from. The city the trip into the country lands at comes first. */}
      <div className="hide-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", padding: `0 ${PAD}px 2px` }}>
        {origins.map((o) => {
          const on = o.id === from.id;
          return (
            <button key={o.id} onClick={() => setPick(o.id)} style={{
              flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 5,
              borderRadius: R.pill, padding: "7px 13px", cursor: "pointer", fontFamily: "inherit",
              fontSize: 12.5, fontWeight: on ? 700 : 600, whiteSpace: "nowrap",
              border: `1px solid ${on ? A.pink : C.div}`,
              background: on ? A.pinkSoft : C.white,
              color: on ? "#C00840" : C.sub,
              boxShadow: on ? "none" : SHADOW.card,
            }}>
              {o.label}
              {o.km != null && o.km >= 5 && (
                <span style={{ opacity: 0.6, fontWeight: 600 }}>{Math.round(o.km)} km</span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ padding: `12px ${PAD}px 0` }}>
        <Card>
          {from.ways.map((w, i) => <Way key={w.label} w={w} best={i === 0} />)}
          {/* The one line somebody wrote about this journey, where there is
              one. It belongs to the arrival city, not to every chip. */}
          {from.note && (
            <p style={{
              margin: "10px 0 0", paddingTop: 10, borderTop: `1px solid ${C.div}`,
              ...T.meta, lineHeight: 1.5,
            }}>{from.note}</p>
          )}
        </Card>
        <p style={{ margin: "8px 0 0", ...T.micro }}>
          Door to door and approximate, airport time counted in. Your consultant
          confirms the exact transfer when you book.
        </p>
      </div>
    </Sec>
  );
}

// ─── When to go ───
//
// A strip of months you can actually press. Picking one answers the question
// the page is really being asked, which is not "how many degrees" but "should
// we come then": a verdict, then the numbers behind it, then what the crowds
// will be like. The climate is the country's and the note says so. We hold one
// set of averages per destination, not one per town.
const VERDICT = {
  sunny: { label: "Great time to go", bg: A.greenBg, fg: A.green },
  cloudy: { label: "Good time to go", bg: A.greenBg, fg: A.green },
  rainy: { label: "Fine, but expect rain", bg: "#FFF4E0", fg: "#B54708" },
  heavy: { label: "Not the best time", bg: "#FEF3F2", fg: "#B42318" },
};
const CROWD_WORD = { peak: "Busiest", shoulder: "Fewer people, cheaper", off: "Quietest, cheapest" };
const SEASON_WORD = { peak: "Peak season", shoulder: "Shoulder", off: "Off-season" };

function WhenToGo({ r }) {
  const now = new Date().getMonth();
  const [pick, setPick] = useState(now);
  // The next twelve months from this one. Nobody planning in October is
  // deciding about last February.
  const run = Array.from({ length: 12 }, (_, k) => r.months[(now + k) % 12]);
  const mo = r.months[pick];
  const Sky = SKY_STYLE[mo.sky] || SKY_STYLE.cloudy;
  const v = VERDICT[mo.sky] || VERDICT.cloudy;
  const days = mo.rain == null ? null : Math.min(28, Math.round(mo.rain / 11));

  return (
    <Sec title="When to go" flush>
      <div className="hs" style={{ gap: 8, paddingLeft: PAD, paddingRight: PAD }}>
        {run.map((x) => {
          const on = x.m === pick;
          const S = SKY_STYLE[x.sky] || SKY_STYLE.cloudy;
          return (
            <button key={x.m} onClick={() => setPick(x.m)} style={{
              flexShrink: 0, minWidth: 82, padding: "10px 12px 11px", borderRadius: 13,
              textAlign: "center", cursor: "pointer", fontFamily: "inherit",
              border: `1px solid ${on ? C.p300 : C.div}`,
              background: on ? C.p100 : C.white,
            }}>
              <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: on ? C.p600 : C.head }}>
                {x.name.slice(0, 3)}
              </span>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, margin: "7px 0 5px" }}>
                <S.Icon size={14} color={S.color} />
                <span style={{ fontSize: 11, fontWeight: 600, color: C.sub, whiteSpace: "nowrap" }}>
                  {SKY_WORD[x.sky] || "Mixed"}
                </span>
              </span>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: C.head, whiteSpace: "nowrap" }}>
                {x.low}° / {x.high}°
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ padding: `12px ${PAD}px 0` }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <p style={{ margin: 0, ...T.lead }}>{mo.name}</p>
            <span style={{
              flexShrink: 0, padding: "4px 11px", borderRadius: R.pill,
              background: v.bg, color: v.fg, fontSize: 11.5, fontWeight: 700,
            }}>{v.label}</span>
          </div>
          <p style={{ margin: "7px 0 0", ...T.body }}>
            {SKY_WORD[mo.sky] || "Mixed"} days{mo.rainWord ? ` and ${mo.rainWord}` : ""}, {mo.low}° at night and {mo.high}° by afternoon.
          </p>
          {/* One line. The three facts are read together, and wrapping them
              turned a glance into a paragraph. */}
          <div className="hide-scrollbar" style={{
            display: "flex", alignItems: "center", gap: 7, marginTop: 11, paddingTop: 11,
            borderTop: `1px solid ${C.div}`, overflowX: "auto",
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, ...T.micro, color: C.sub, whiteSpace: "nowrap", flexShrink: 0 }}>
              <Sky.Icon size={13} color={Sky.color} />
              {days != null ? `${days} rain days` : "rain not recorded"}
            </span>
            {[SEASON_WORD[mo.rating], CROWD_WORD[mo.rating]].map((t) => (
              <span key={t} style={{
                flexShrink: 0, padding: "3px 9px", borderRadius: R.pill,
                background: SEASON_TINT[mo.rating], color: SEASON_COLOR[mo.rating],
                fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
              }}>{t}</span>
            ))}
          </div>
        </Card>
        <p style={{ margin: "10px 2px 0", ...T.micro, lineHeight: "16px" }}>
          Averages across {r.dest}, indicative rather than a forecast.
        </p>
      </div>
    </Sec>
  );
}

// ─── Transport modes ───
//
// Plain pointers were honest and grey. These are the same four facts with the
// picture back on them: one card, a row per mode, each in its own colour so
// the list is something you scan rather than read.
const TONE_CYCLE = [WELL.lagoon, WELL.ocean, WELL.brand, WELL.gold, WELL.neutral];

function TransportModes({ items }) {
  return (
    <Sec title="Transport modes">
      <Card pad={0}>
        {items.map((t, i) => {
          const Icon = transportIcon(t.label);
          return (
            <div key={t.label} style={{
              display: "flex", gap: 12, alignItems: "flex-start", padding: "13px 14px",
              borderTop: i === 0 ? "none" : `1px solid ${C.div}`,
            }}>
              <Well Icon={Icon} tone={TONE_CYCLE[i % TONE_CYCLE.length]} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, ...T.h3 }}>{t.label}</p>
                <p style={{ margin: "3px 0 0", ...T.meta, lineHeight: 1.5 }}>{t.note}</p>
              </div>
            </div>
          );
        })}
      </Card>
    </Sec>
  );
}

// ─── Where the restaurants are ───
//
// The centre of town pinned and named, and every restaurant we can place
// pinned around it, numbered so a pin and a card match by looking. Tapping one
// raises its card from the bottom, the same way the things-to-do map does.
//
// What we hold per restaurant is the neighbourhood and the distance from the
// centre, not a street address, so a pin sits on the neighbourhood and is
// honest to a few hundred metres. Places whose area is not a location at all,
// which is a good third of these lists ("on your island", "any warung"), get no
// pin, and the badge says how many of them that is rather than quietly showing
// four of seven.
function foodPins(list, city) {
  return list
    .map((f) => {
      const c = areaCoords(city, f.area);
      return c ? { ...f, lat: c.lat, lng: c.lng } : null;
    })
    .filter(Boolean)
    .sort((a, b) => (a.km ?? 0) - (b.km ?? 0));
}

function FoodMapScreen({ city, list, onClose }) {
  const here = cityCoords[city];
  const pins = useMemo(() => foodPins(list, city), [list, city]);
  const [pick, setPick] = useState(null);

  const span = useMemo(() => {
    const all = [here, ...pins.map((x) => ({ lat: x.lat, lng: x.lng }))];
    const lat = all.map((c) => c.lat);
    const lng = all.map((c) => c.lng);
    const pad = Math.max(0.012, (Math.max(...lat) - Math.min(...lat)) * 0.35);
    return [
      [Math.min(...lat) - pad, Math.min(...lng) - pad],
      [Math.max(...lat) + pad, Math.max(...lng) + pad],
    ];
  }, [here, pins]);

  const chosen = pins.find((x) => x.name === pick);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 300, background: C.white }}>
      <MapContainer
        bounds={span}
        style={{ height: "100%", width: "100%", background: "#AADAFF" }}
        attributionControl={false}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Zoom />
        <Marker position={[here.lat, here.lng]} icon={centrePin(city)} zIndexOffset={-500} />
        {pins.map((x, n) => (
          <Marker
            key={x.name}
            position={[x.lat, x.lng]}
            icon={numberPin(n + 1, pick === x.name)}
            zIndexOffset={pick === x.name ? 1000 : 0}
            eventHandlers={{ click: () => setPick(x.name) }}
          />
        ))}
      </MapContainer>

      <div style={{
        position: "absolute", left: 12, right: 12, zIndex: 600,
        top: "calc(12px + env(safe-area-inset-top, 0px))",
        display: "flex", alignItems: "center", gap: 9, pointerEvents: "none",
      }}>
        <button onClick={onClose} aria-label="Close map" style={{
          pointerEvents: "auto", width: 36, height: 36, borderRadius: "50%", border: "none",
          background: C.white, boxShadow: SHADOW.float, display: "grid", placeItems: "center",
          cursor: "pointer", flexShrink: 0,
        }}><XIcon size={18} color={C.head} /></button>
        <span style={{
          pointerEvents: "auto", background: C.white, borderRadius: R.pill, padding: "9px 14px",
          boxShadow: SHADOW.float, fontSize: 12.5, fontWeight: 700, color: C.head,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>Where to eat in {city}</span>
      </div>

      {list.length > pins.length && (
        <span style={{
          position: "absolute", right: 12, zIndex: 600,
          top: "calc(58px + env(safe-area-inset-top, 0px))",
          background: C.white, borderRadius: R.pill, padding: "7px 11px",
          boxShadow: SHADOW.float, ...T.micro, fontWeight: 600, color: C.sub,
        }}>{pins.length} of {list.length} mapped</span>
      )}

      {!chosen && (
        <span style={{
          position: "absolute", left: 0, right: 0, bottom: 20, zIndex: 600,
          textAlign: "center", pointerEvents: "none",
        }}>
          <span style={{
            background: "rgba(17,17,17,0.78)", backdropFilter: "blur(10px)", color: "#fff",
            borderRadius: R.pill, padding: "8px 14px", fontSize: 12, fontWeight: 600,
          }}>Tap a pin to see the place</span>
        </span>
      )}

      {chosen && (
        <div style={{
          position: "absolute", left: 12, right: 12, bottom: 16, zIndex: 650,
          animation: "sheetSlideUp 0.22s cubic-bezier(0.22,0.61,0.36,1)",
        }}>
          <div style={{ position: "relative", background: C.white, borderRadius: R.card, boxShadow: SHADOW.float, padding: 11 }}>
            <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
              <span style={{ position: "relative", flexShrink: 0 }}>
                <img src={chosen.img} alt="" style={{ width: 56, height: 56, borderRadius: R.well, objectFit: "cover", display: "block", background: A.photoBg }} />
                <span style={{
                  position: "absolute", top: -5, left: -5, width: 21, height: 21, borderRadius: "50%",
                  background: C.p600, color: "#fff", fontSize: 11.5, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff",
                }}>{pins.indexOf(chosen) + 1}</span>
              </span>
              <div style={{ flex: 1, minWidth: 0, paddingRight: 20 }}>
                <p style={{ margin: 0, ...T.h3, fontSize: 14.5, ...clamp(1) }}>{chosen.name}</p>
                <p style={{ margin: "3px 0 0", ...T.micro, ...clamp(1) }}>
                  {chosen.area}{chosen.km != null ? ` · ${chosen.km} km from the centre` : ""}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>
                  {sortTags(chosen.tags).map((tag) => {
                    const tone = FOOD_TAG[tag];
                    return (
                      <span key={tag} style={{
                        padding: "3px 8px", borderRadius: R.pill,
                        background: tone ? tone.bg : C.bg,
                        color: tone ? tone.fg : C.sub,
                        fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap",
                      }}>{tag}</span>
                    );
                  })}
                </div>
              </div>
            </div>
            <button onClick={() => setPick(null)} aria-label="Close" style={{
              position: "absolute", top: 8, right: 8, width: 24, height: 24, borderRadius: "50%",
              border: "none", background: C.bg, display: "grid", placeItems: "center", cursor: "pointer",
            }}><XIcon size={13} color={C.sub} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Where to eat ───
//
// Was a rail of big photo cards, which is the wrong shape twice over: a
// photograph of a plate tells you nothing about whether the kitchen is Indian,
// and a rail hides most of the list behind a swipe. This is the hotel page's
// nearby block instead, which answers the same question in the same way: filter
// by what kind of place you want, read four rows, open the rest.
//
// The tags lead, because for most of the couples we sell to "Indian food" or
// "Veg only" decides the answer and the rest is detail.
const FOOD_FILTERS = ["Indian food", "Veg only", "Local food"];
const SHOWN_FOOD = 4;

function FoodRow({ f }) {
  return (
    <div style={{
      display: "flex", gap: 11, alignItems: "center", width: "100%",
      background: C.white, borderRadius: R.card, padding: 9, boxShadow: SHADOW.card,
    }}>
      <img src={f.img} alt="" style={{
        width: 58, height: 58, borderRadius: R.well, objectFit: "cover",
        flexShrink: 0, background: A.photoBg,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, ...T.lead, fontSize: 13.5, ...clamp(1) }}>{f.name}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 4, margin: "4px 0 0" }}>
          <MapPin size={11} color={C.inact} style={{ flexShrink: 0 }} />
          <span style={{ ...T.micro, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {f.area}{f.km != null ? ` · ${f.km} km from the centre` : ""}
          </span>
        </div>
        <p style={{ margin: "4px 0 0", ...T.meta, lineHeight: 1.4, ...clamp(1) }}>{f.note}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>
          {sortTags(f.tags).map((tag) => {
            const tone = FOOD_TAG[tag];
            return (
              <span key={tag} style={{
                padding: "3px 8px", borderRadius: R.pill,
                background: tone ? tone.bg : C.bg,
                color: tone ? tone.fg : C.sub,
                fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap",
              }}>{tag}</span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Restaurants({ list, city, onMap }) {
  // No map where nothing on the list is anywhere. Every place to eat near a
  // Maldives resort is "on your island", which is true and unpinnable, and an
  // empty map is a worse answer than no map.
  const mappable = useMemo(() => foodPins(list, city).length > 0, [list, city]);
  // Only the filters that would actually match something here. A chip that
  // always returns nothing is a chip that teaches a couple not to press them.
  const filters = useMemo(() => {
    const live = FOOD_FILTERS.filter((k) => list.some((f) => (f.tags || []).includes(k)));
    return ["All", ...live];
  }, [list]);
  const [pick, setPick] = useState("All");
  const [all, setAll] = useState(false);

  const shown = pick === "All" ? list : list.filter((f) => (f.tags || []).includes(pick));

  return (
    <>
      <Sec
        title={`Where to eat in ${city}`}
        action={list.length > 0 && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            {/* The map first, because it is the thing you tap to see where any
                of this is in relation to anything else. */}
            {mappable && (
              <button onClick={onMap} aria-label="See these on a map" style={{
                width: 28, height: 28, borderRadius: "50%", border: `1px solid ${C.div}`,
                background: C.white, display: "grid", placeItems: "center",
                cursor: "pointer", padding: 0, flexShrink: 0,
              }}><MapIcon size={14} color={C.head} /></button>
            )}
            <ViewAll onClick={() => setAll(true)} />
          </span>
        )}
        flush
      >
        {filters.length > 1 && (
          <div className="hide-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", padding: `0 ${PAD}px 2px` }}>
            {filters.map((k) => {
              const on = pick === k;
              const n = k === "All" ? list.length : list.filter((f) => (f.tags || []).includes(k)).length;
              return (
                <button key={k} onClick={() => setPick(k)} style={{
                  flexShrink: 0, borderRadius: R.pill, padding: "7px 13px", cursor: "pointer",
                  fontFamily: "inherit", fontSize: 12.5, fontWeight: on ? 700 : 600, whiteSpace: "nowrap",
                  border: `1px solid ${on ? A.pink : C.div}`,
                  background: on ? A.pinkSoft : C.white,
                  color: on ? "#C00840" : C.sub,
                  boxShadow: on ? "none" : SHADOW.card,
                }}>
                  {k}<span style={{ marginLeft: 5, fontWeight: 600, opacity: 0.65 }}>{n}</span>
                </button>
              );
            })}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: `12px ${PAD}px 0` }}>
          {shown.slice(0, SHOWN_FOOD).map((f) => <FoodRow key={f.name} f={f} />)}
          {shown.length === 0 && (
            <p style={{ margin: "4px 0", ...T.body }}>Nothing on our list for that here yet.</p>
          )}
        </div>

      </Sec>

      <ListSheet open={all} title={`Where to eat in ${city}`} count={list.length} onClose={() => setAll(false)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {list.map((f) => <FoodRow key={f.name} f={f} />)}
        </div>
      </ListSheet>
    </>
  );
}

// ─── The honest read, posted ───
// The same lines, on a postcard. The hotel page already writes its honest bit
// this way, and the form carries the meaning: a card from someone who went,
// not a disclaimer at the foot of a sales page.
const PAPER = "#FCF6E7";
const PAPER_EDGE = "#E6DCC4";
const RULE = "#D3C8AE";
const PAPER_INK = "#181D27";
const TICK = "#027A48";
const CROSS = "#B45309";

function Postcard({ city, pros, cons }) {
  const lines = [
    ...pros.slice(0, 3).map((t) => ({ good: true, t })),
    ...cons.slice(0, 3).map((t) => ({ good: false, t })),
  ];
  return (
    <div style={{
      background: PAPER, border: `1px solid ${PAPER_EDGE}`, borderRadius: 5,
      boxShadow: "0 6px 14px rgba(24,29,39,0.09)", padding: "11px 14px 12px",
      display: "flex", flexDirection: "column", gap: 9,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
          <span style={{ fontFamily: "Caveat, cursive", fontSize: 24, lineHeight: "25px", fontWeight: 700, color: PAPER_INK }}>
            {city}, honestly
          </span>
          <span style={{ width: 88, height: 1, background: RULE }} />
        </div>
        <img src="/stamp-honest.png" alt="" style={{ width: 50, height: 50, flexShrink: 0, objectFit: "contain", transform: "rotate(2deg)" }} />
      </div>

      <span style={{ height: 1, background: RULE }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ display: "flex", gap: 8 }}>
            <span style={{ marginTop: 1, display: "flex" }}>
              {l.good
                ? <Check size={13} color={TICK} strokeWidth={3} style={{ flexShrink: 0 }} />
                : <XIcon size={13} color={CROSS} strokeWidth={3} style={{ flexShrink: 0 }} />}
            </span>
            <span style={{ fontSize: 12.5, lineHeight: "17px", fontWeight: 500, color: PAPER_INK }}>{l.t}</span>
          </div>
        ))}
      </div>

      <span style={{
        fontFamily: "Caveat, cursive", fontSize: 15, lineHeight: "16px", fontWeight: 600,
        color: "#8A7F66", alignSelf: "flex-end",
      }}>Happy travels, with love. 30 Sundays</span>
    </div>
  );
}

// ─── Where to stay ───
//
// Two questions, and neither of them is which part of town. The page answers
// that everywhere else: the map says where the region is, Pair with says what
// is next to it, and the honest bit says whether the beach is any good. What a
// couple genuinely cannot work out for themselves is what kind of place to book
// here and which room in it is worth paying up for, so that is what this says.
//
// The advice and the hotels are one answer, so they sit in one tinted block
// again rather than a white card with a rail underneath it. Two surfaces read
// as two sections, and "what kind of hotel" followed by "here are the hotels"
// is plainly a single thought.
function WhereToStay({ stay, hotels, city, onOpenHotel }) {
  return (
    <Sec title="Where to stay" flush>
      <div style={{
        margin: `0 ${PAD}px`, borderRadius: R.hero, padding: "14px 14px 16px",
        background: "linear-gradient(160deg, #FFF0F4 0%, #FEF6E9 100%)",
        border: "1px solid #F8D8E1",
      }}>
        {stay && (
          <>
            <div style={{ display: "flex", gap: 12 }}>
              <Well Icon={Hotel} tone={WELL.brand} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, ...T.eyebrow, color: C.p900 }}>What kind of hotel</p>
                <p style={{ margin: "4px 0 0", ...T.lead }}>{stay.headline}</p>
                <p style={{ margin: "5px 0 0", ...T.body }}>{stay.note}</p>
              </div>
            </div>

            {/* A list of three room names says what exists, not which to take.
                The line under each one is the reason. */}
            <div style={{ display: "flex", gap: 12, marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(201,160,170,0.35)" }}>
              <Well Icon={BedDouble} tone={WELL.gold} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, ...T.eyebrow, color: C.p900 }}>Which room to ask for</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 9 }}>
                  {stay.rooms.slice(0, 3).map((room) => (
                    <div key={room} style={{
                      background: "rgba(255,255,255,0.8)", border: "1px solid rgba(201,160,170,0.4)",
                      borderRadius: R.well, padding: "9px 11px 10px",
                    }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.head, lineHeight: 1.3 }}>{room}</p>
                      {roomNote(room, city) && (
                        <p style={{ margin: "3px 0 0", fontSize: 11.5, lineHeight: "16px", color: C.sub }}>{roomNote(room, city)}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {hotels.length > 0 && (
          <>
            <p style={{ margin: `${stay ? 16 : 0}px 0 10px`, ...T.h3 }}>Recommended hotels</p>
            <div className="hs" style={{ gap: 12, margin: "0 -14px", paddingLeft: 14, paddingRight: 14, alignItems: "stretch" }}>
              {hotels.map((h) => (
                <button key={h.id} onClick={() => onOpenHotel(h)} style={{
                  flexShrink: 0, width: 255, background: C.white, borderRadius: R.card,
                  overflow: "hidden", boxShadow: SHADOW.card,
                  display: "flex", flexDirection: "column",
                  border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                }}>
                  {/* A rail stretches every card to the tallest, and a hotel
                      with two tags instead of three used to leave the slack as
                      white at the bottom. The photograph takes it instead.
                      Absolute, because a plain `height: 100%` inside a flexible
                      box cannot resolve: the image fell back to its own aspect
                      ratio and set the height of every card in the rail. */}
                  <div style={{ position: "relative", flex: 1, minHeight: 128, background: A.photoBg }}>
                    <img src={h.images?.[0]?.url} alt={h.name} style={{
                      position: "absolute", inset: 0,
                      width: "100%", height: "100%", objectFit: "cover", display: "block",
                    }} />
                  </div>
                  <div style={{ padding: "10px 12px 13px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, ...T.micro, fontWeight: 600, color: C.sub }}>
                        <Star size={11} fill={A.star} color={A.star} strokeWidth={0} /> {h.stars} star
                      </span>
                      {/* Whose score it is, said with the mark rather than a
                          word. A number on its own is not a rating. */}
                      <span style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <SourceLogo source="booking" size={13} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: C.head }}>
                          {Number(h.bookingScore).toFixed(1)} rated
                        </span>
                      </span>
                    </div>
                    <p style={{ margin: "7px 0 0", ...T.h3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.name}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, margin: "3px 0 0" }}>
                      <MapPin size={11} color={C.inact} style={{ flexShrink: 0 }} />
                      <span style={{ ...T.micro, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {h.neighbourhood} · {h.distanceFromCenter} km from the centre
                      </span>
                    </div>
                    {/* The star count and the score are on the row above, so the
                        tags that only repeat them are dropped. */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 9 }}>
                      {[h.mealPlan, ...(h.viewTags || []), ...(h.amenities || [])]
                        .filter((x) => x && !/star$|rated$/.test(x))
                        // "Breakfast included" and "Breakfast" are one fact, and
                        // the card had room for three, not two and a repeat.
                        .filter((x, i, all) => all.findIndex((y) =>
                          y.toLowerCase().includes(x.toLowerCase()) ||
                          x.toLowerCase().includes(y.toLowerCase())) === i)
                        .slice(0, 3)
                        .map((x) => (
                          <span key={x} style={{
                            padding: "3px 8px", borderRadius: R.pill, background: C.bg,
                            fontSize: 10.5, fontWeight: 600, color: C.sub, whiteSpace: "nowrap",
                          }}>{x}</span>
                        ))}
                    </div>
                    {/* No price. Nothing on this page is a quote, the nightly
                        rate here is not the one that ends up in a package, and
                        a number a consultant has to walk back on the call is
                        worse than no number at all. */}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </Sec>
  );
}

// ─── Where it is ───
//
// A still map with the region pinned, and the whole thing opens the full map.
// It answers the one question the name cannot: is this the next town over or
// the other end of the country.
function WhereItIs({ dest, city, onOpen }) {
  const here = cityCoords[city];
  if (!here) return null;
  return (
    <Sec title="Where it is">
      <div
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter") onOpen(); }}
        style={{
          position: "relative", zIndex: 0, height: 158, borderRadius: R.card,
          overflow: "hidden", border: `1px solid ${C.div}`, boxShadow: SHADOW.card, cursor: "pointer",
        }}
      >
        <MapContainer
          center={[here.lat, here.lng]}
          zoom={9}
          style={{ height: "100%", width: "100%", background: "#AADAFF" }}
          attributionControl={false}
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          touchZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[here.lat, here.lng]} icon={mapPin(C.p600, true)} />
        </MapContainer>
        <span aria-hidden style={{
          position: "absolute", top: 10, right: 10, zIndex: 500,
          width: 34, height: 34, borderRadius: R.well, background: C.white,
          boxShadow: SHADOW.float, display: "grid", placeItems: "center",
        }}><Maximize2 size={15} color={C.head} /></span>
        <span style={{
          position: "absolute", left: 10, bottom: 10, zIndex: 500,
          background: C.white, borderRadius: R.pill, padding: "6px 11px",
          boxShadow: SHADOW.float, fontSize: 11.5, fontWeight: 700, color: C.head,
        }}>See {city} in {dest}</span>
      </div>
    </Sec>
  );
}

// ─── Pair with ───
//
// Nobody books one region. A couple reading about Ubud is already wondering
// what goes with it, and the answer was a swipe away with no sign that it
// existed. The distance is measured off the real coordinates, in a straight
// line, which is why it says "apart" rather than a number of hours we do not
// hold.
function PairWith({ city, others, onPick }) {
  const here = cityCoords[city];
  if (!others.length) return null;
  return (
    <Sec title={`Travellers pair ${city} with`} flush>
      <div className="hs" style={{ gap: 12, paddingLeft: PAD, paddingRight: PAD, alignItems: "stretch" }}>
        {others.map((o) => {
          const there = cityCoords[o.city];
          return (
            <button key={o.city} onClick={() => onPick(o.city)} style={{
              flexShrink: 0, width: 150, background: C.white, borderRadius: R.card,
              overflow: "hidden", boxShadow: SHADOW.card, display: "block",
              border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
            }}>
              <img src={o.img} alt="" style={{ width: "100%", height: 92, objectFit: "cover", display: "block", background: A.photoBg }} />
              <div style={{ padding: "9px 11px 11px" }}>
                <p style={{ margin: 0, ...T.h3, fontSize: 14, ...clamp(1) }}>{o.emoji} {o.city}</p>
                <p style={{ margin: "3px 0 0", ...T.micro }}>
                  {o.dayTrip ? "Day trip" : `${o.n} ${o.n === 1 ? "night" : "nights"}`}
                  {here && there ? ` · ${Math.round(kmApart(here, there))} km apart` : ""}
                </p>
                <p style={{ margin: "5px 0 0", ...T.meta, lineHeight: 1.4, ...clamp(2) }}>{o.blurb}</p>
              </div>
            </button>
          );
        })}
      </div>
    </Sec>
  );
}

// ─── Common questions ───
//
// At the foot of the page, where a couple lands once they have read everything
// above and are still holding one doubt. Every answer is read off this region's
// own data rather than written out again, so it cannot drift from the sections
// it is summarising.
//
// Written the way the hotel page writes its questions: no box, a hairline
// between the rows, chevron up and down. A card round them made the answers
// look like a different kind of thing from the rest of the page.
function Faq({ items }) {
  const [open, setOpen] = useState(null);
  if (!items.length) return null;
  return (
    <Sec title="Common questions">
      {items.map((f, i) => {
        const on = open === i;
        return (
          <div key={f.q} style={{ borderTop: i > 0 ? `1px solid ${C.div}` : "none" }}>
            <button
              onClick={() => setOpen(on ? null : i)}
              aria-expanded={on}
              style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%",
                padding: "14px 0", border: "none", background: "none", cursor: "pointer",
                fontFamily: "inherit", textAlign: "left",
              }}
            >
              <span style={{ ...T.lead, flex: 1, lineHeight: 1.4 }}>{f.q}</span>
              {on
                ? <ChevronUp size={18} color={C.sub} style={{ flexShrink: 0 }} />
                : <ChevronDown size={18} color={C.sub} style={{ flexShrink: 0 }} />}
            </button>
            {on && (
              <p style={{ ...T.body, margin: "0 0 15px", fontSize: 13 }}>{f.a}</p>
            )}
          </div>
        );
      })}
    </Sec>
  );
}

// ─── The photographs at the top ───
//
// A full-width reel you swipe, with dots under it and the count in the corner,
// which is the shape a couple already knows from every listing app they have
// ever booked anything on. The sheet of facts starts underneath it and scrolls
// over it, so the page opens on a picture and answers questions immediately
// below.
//
// Snapping is CSS, and the dots read the scroll position rather than driving
// it, so a flick, a drag and a trackpad all land on the same frame.
function RegionHero({ photos, city, count, hasMap, onBack, onMap, onGallery, height }) {
  const rail = useRef(null);
  const [i, setI] = useState(0);

  const onScroll = (e) => {
    const el = e.currentTarget;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next !== i) setI(next);
  };

  const round = {
    width: 36, height: 36, borderRadius: "50%", border: "none",
    background: "rgba(255,255,255,0.96)", boxShadow: SHADOW.float,
    display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0,
    backdropFilter: "blur(8px)",
  };

  return (
    <div style={{ position: "relative", height, background: "#15172A" }}>
      <div
        ref={rail}
        className="hide-scrollbar"
        onScroll={onScroll}
        style={{
          display: "flex", height: "100%", overflowX: "auto", overflowY: "hidden",
          scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch",
        }}
      >
        {photos.map((src, n) => (
          <div key={n} style={{ flex: "0 0 100%", width: "100%", height: "100%", scrollSnapAlign: "start", background: A.photoBg }}>
            <img
              src={src}
              alt={n === 0 ? city : ""}
              // The first one is the page opening; the rest can wait until the
              // swipe that asks for them.
              loading={n === 0 ? "eager" : "lazy"}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        ))}
      </div>

      {/* The top row sits over the photograph, clear of the status bar. */}
      <div style={{
        position: "absolute", left: 14, right: 14, zIndex: 2,
        top: "calc(14px + env(safe-area-inset-top, 0px))",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <button onClick={onBack} aria-label="Back" style={round}>
          <ArrowLeft size={18} color={C.head} />
        </button>
        <span style={{ flex: 1 }} />
        {hasMap && (
          <button onClick={onMap} aria-label="Map" style={round}>
            <MapIcon size={16} color={C.head} />
          </button>
        )}
      </div>

      {/* Dots under the photograph, and the gallery beside them. */}
      {photos.length > 1 && (
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 29, zIndex: 2,
          display: "flex", justifyContent: "center", gap: 5, pointerEvents: "none",
        }}>
          {photos.map((_, n) => (
            <span key={n} style={{
              width: n === i ? 7 : 5, height: n === i ? 7 : 5, borderRadius: "50%",
              background: n === i ? "#fff" : "rgba(255,255,255,0.55)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              transition: "width 0.15s ease, height 0.15s ease",
            }} />
          ))}
        </div>
      )}

      <button
        onClick={onGallery}
        style={{
          position: "absolute", right: 14, bottom: 24, zIndex: 2,
          display: "inline-flex", alignItems: "center", gap: 7,
          border: "none", borderRadius: R.pill, padding: "8px 14px", cursor: "pointer",
          fontFamily: "inherit", fontSize: 12.5, fontWeight: 700, color: "#fff",
          background: "rgba(17,17,17,0.78)", backdropFilter: "blur(10px)",
          boxShadow: SHADOW.float,
        }}
      >
        <Images size={14} color="#fff" />
        View gallery
        <span style={{ opacity: 0.65, fontWeight: 600 }}>{count}</span>
      </button>
    </div>
  );
}

// ─── The bar that takes over from the photograph ───
//
// Once the pictures have scrolled away there is nothing on the screen saying
// which region you are reading about, and on a page this long that matters more
// than it sounds. So the name arrives in a plain bar exactly as the photograph
// leaves, carrying the same two buttons it was carrying before.
function StickyBar({ city, show, hasMap, onBack, onMap }) {
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, zIndex: 6,
      background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)",
      borderBottom: `1px solid ${C.div}`,
      padding: "8px 12px", paddingTop: "calc(8px + env(safe-area-inset-top, 0px))",
      display: "flex", alignItems: "center", gap: 8,
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0)" : "translateY(-100%)",
      pointerEvents: show ? "auto" : "none",
      transition: "opacity 0.18s ease, transform 0.18s ease",
    }}>
      <button onClick={onBack} aria-label="Back" style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.div}`, background: C.white, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
        <ArrowLeft size={17} color={C.head} />
      </button>
      <p style={{ margin: 0, flex: 1, minWidth: 0, ...T.h3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {city}
      </p>
      {hasMap && (
        <button onClick={onMap} aria-label="Map" style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.div}`, background: C.white, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
          <MapIcon size={15} color={C.head} />
        </button>
      )}
    </div>
  );
}

// ─── One region ───
export default function RegionDetail({ dest: destProp, city: cityProp, onClose }) {
  const { name, city } = useParams();
  const navigate = useNavigate();
  const embedded = !!destProp;
  const dest = embedded ? destProp : decodeURIComponent(name || "");
  const [localCity, setLocalCity] = useState(cityProp || "");
  const town = embedded ? localCity : decodeURIComponent(city || "");

  const [H, setH] = useState(760);
  const [scrolled, setScrolled] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [map, setMap] = useState(false);
  const [allTrips, setAllTrips] = useState(null);
  const [activity, setActivity] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [eateries, setEateries] = useState(false);

  const box = useRef(null);
  const scroller = useRef(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const read = () => setH(el.getBoundingClientRect().height);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const r = useMemo(() => regionDetail(dest, town), [dest, town]);
  const regions = useMemo(() => regionsFor(dest) || [], [dest]);
  const hotels = useMemo(() => {
    if (!r) return [];
    return generateHotelsForCity(town, dest, "2026-11-10", "2026-11-17", 7)
      .filter((h) => Number(h.bookingScore) >= 8)
      .slice(0, 6);
  }, [r, town, dest]);
  const trips = useMemo(() => (r ? tripsThroughCity(dest, town) : []), [r, dest, town]);
  const faq = useMemo(() => regionFaq(r), [r]);
  const reach = useMemo(() => (r ? regionReach(dest, town) : []), [r, dest, town]);

  // Going to another region starts that page at the top, the way opening any
  // page does. Without this you land halfway down somebody else's FAQ.
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = 0;
    setScrolled(false);
  }, [town]);

  const goRegion = (c) => {
    if (!c || c === town) return;
    if (embedded) { setLocalCity(c); return; }
    navigate(`/destination/${encodeURIComponent(dest)}/region/${encodeURIComponent(c)}`);
  };
  const back = () => (embedded ? onClose?.() : navigate(-1));

  // The photographs take a little under half the screen, which is where every
  // listing app puts them, and leaves the first section of facts visible at
  // the bottom rather than a strip of nothing.
  const heroH = Math.round(H * 0.42);

  const onScroll = useCallback((e) => {
    // The bar arrives as the last of the photograph leaves.
    setScrolled(e.currentTarget.scrollTop > heroH - 70);
  }, [heroH]);

  if (!regions.length || !regions.some((x) => x.city === town) || !r) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p style={{ ...T.body }}>We don&apos;t have a page for {town} yet.</p>
        <button onClick={back} style={{ marginTop: 14, border: "none", background: C.p600, color: "#fff", borderRadius: R.pill, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Go back</button>
      </div>
    );
  }

  const g = r.guide;
  const hasMap = !!cityCoords[town];
  const mediaCount = new Set([
    ...r.photos,
    ...r.acts.map((a) => a.img),
    ...(customerPhotos[r.dest] || []).map((x) => x?.img || x).filter((x) => typeof x === "string"),
  ].filter(Boolean)).size;

  return (
    <div ref={box} style={{ position: "absolute", inset: 0, overflow: "hidden", background: C.bg }}>
      <div ref={scroller} className="hide-scrollbar" onScroll={onScroll}
        style={{ position: "absolute", inset: 0, overflowY: "auto" }}>
        <RegionHero
          photos={r.photos.slice(0, 8)}
          city={r.city}
          count={mediaCount}
          height={heroH}
          hasMap={hasMap}
          onBack={back}
          onMap={() => setMap(true)}
          onGallery={() => setGallery(true)}
        />

        {/* The facts, lifted over the bottom of the photographs. */}
        <div style={{
          position: "relative", marginTop: -18, background: C.bg,
          borderRadius: "20px 20px 0 0", minHeight: "60%",
        }}>
          <div style={{ display: "flex", justifyContent: "center", padding: "9px 0 2px" }}>
            <span style={{ width: 38, height: 4, borderRadius: 99, background: C.div }} />
          </div>

          <div style={{ padding: `8px ${PAD}px 0` }}>
            <p style={{ margin: 0, ...T.eyebrow, color: C.inact }}>
              {r.dest}{g?.area ? ` · ${g.area}` : ""}
            </p>
            <h1 style={{ margin: "5px 0 0", fontSize: 26, fontWeight: 800, color: C.head, letterSpacing: "-0.7px", lineHeight: "31px" }}>
              {r.city}
            </h1>
            {/* Lead and description are one block, capped at three lines, so
                the page opens on a picture and a paragraph rather than a page
                of prose. */}
            <ReadMore lead={g?.lead || r.blurb} sub={g?.sub}>{g?.about}</ReadMore>
          </div>

          {r.acts.length > 0 && <ThingsToDo acts={r.acts} city={r.city} onOpen={setActivity} />}
          <WhereItIs dest={r.dest} city={r.city} onOpen={() => setMap(true)} />
          {(r.pros.length > 0 || r.cons.length > 0) && (
            <Sec title="The honest bit">
              <Postcard city={r.city} pros={r.pros} cons={r.cons} />
            </Sec>
          )}
          {reach.length > 0 && <HowToReach origins={reach} city={r.city} />}
          <WhenToGo r={r} />
          {trips.length > 0 && (
            <Sec
              title="Real traveller itineraries"
              action={<ViewAll onClick={() => setAllTrips(trips)} />}
              flush
            >
              <div className="hs" style={{ gap: 12, paddingLeft: PAD, paddingRight: PAD, alignItems: "stretch" }}>
                {trips.slice(0, SHOWN_TRIPS).map((t) => <BookedCard key={t.key} t={t} />)}
              </div>
            </Sec>
          )}
          {g?.transport?.length > 0 && <TransportModes items={g.transport} />}
          {(g?.stay || hotels.length > 0) && <WhereToStay stay={g?.stay} hotels={hotels} city={r.city} onOpenHotel={setHotel} />}
          {r.food?.length > 0 && (
            <Restaurants list={r.food} city={r.city} onMap={() => setEateries(true)} />
          )}
          <PairWith city={r.city} others={r.paired} onPick={goRegion} />
          <Faq items={faq} />
          <div style={{ height: 40 }} />
        </div>
      </div>

      <StickyBar city={r.city} show={scrolled} hasMap={hasMap} onBack={back} onMap={() => setMap(true)} />

      {eateries && hasMap && r.food?.length > 0 && (
        <FoodMapScreen city={r.city} list={r.food} onClose={() => setEateries(false)} />
      )}

      {gallery && <GalleryScreen r={r} onClose={() => setGallery(false)} />}
      {allTrips && <AllTripsSheet trips={allTrips} onClose={() => setAllTrips(null)} />}
      {map && hasMap && (
        <RegionMapScreen
          dest={dest}
          city={r.city}
          acts={r.acts}
          onOpenAct={(a) => { setMap(false); setActivity(a); }}
          onClose={() => setMap(false)}
        />
      )}

      {/* The hotel page, read-only: from here there is no stay to price and
          nothing to swap, so it opens the same way a saved hotel does. */}
      {hotel && (
        <div style={{ position: "absolute", inset: 0, zIndex: 200, background: C.white }}>
          <HotelV3 hotel={detailFromHotel(hotel)} onBack={() => setHotel(null)} readOnly />
        </div>
      )}

      {activity && (
        <ActivityScreen
          // The hand-written line goes through as the summary, so the page
          // opens with the same sentence the card promised rather than the
          // builder's generic one. The pictures go through for the same reason:
          // the card and the page it opens should show the same place.
          activity={{
            name: activity.name,
            img: activity.img,
            photos: activity.imgs,
            editorialSummary: activity.summary,
          }}
          city={r.city}
          country={dest}
          isBooked={false}
          onClose={() => setActivity(null)}
        />
      )}
    </div>
  );
}

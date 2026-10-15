import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Heart, Check, X as XIcon, Star, MapPin, Clock, Images,
  Volume2, VolumeX, Plane, Car, TrainFront, Ship, Footprints, Bike, Bus,
  BedDouble, ChevronLeft, ChevronRight, ChevronDown, Sparkles, UtensilsCrossed,
  Route as RouteIcon,
} from "lucide-react";
import { C, customerPhotos } from "../data";
import { useSaves } from "../data/saves";
import { regionDetail } from "../data/regionData";
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
const DECK_MPC = 0.045;   // card margin each side, 4.5% of the screen
const DECK_GAP = 8;
const CARD_R = 22;
const PARALLAX = 0.42;    // how far the footage travels per pixel scrolled
const SHEET_LIFT = 18;    // how far the sheet overlaps the footage
const PAD_TOP = 10;
const PAD_BOT = 12;
const MEDIA = { ratio: 1.22, maxVh: 0.56 };

const glass = {
  background: "rgba(16,18,32,0.44)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.18)",
};

const MODE_ICON = { flight: Plane, car: Car, train: TrainFront, boat: Ship, walk: Footprints };
const MODE_WELL = { flight: WELL.ocean, car: WELL.brand, train: WELL.lagoon, boat: WELL.ocean, walk: WELL.neutral };

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

// Codes for the cities a leg starts from. The arriving airport is already
// written into the leg title, so only the departure side needs this.
const AIRPORT = {
  Delhi: "DEL", Mumbai: "BOM", Bengaluru: "BLR", Bangkok: "BKK",
  Denpasar: "DPS", Colombo: "CMB", Auckland: "AKL", Hanoi: "HAN",
  Saigon: "SGN", "Da Nang": "DAD", "Malé": "MLE", Queenstown: "ZQN",
  Christchurch: "CHC",
};

// A leg written as "Delhi to Da Nang (DAD)" is two places and a code, and it
// reads far better drawn than it does as a sentence. Anything that is not
// plainly one place to another ("Seaplane or domestic flight") is left alone.
const NOT_A_PLACE = /^(tender|seaplane|transfer|ferry|boat)$/i;
function parseLeg(title = "") {
  const m = title.match(/^(.+?)\s+to\s+(.+)$/);
  if (!m) return null;
  const from = m[1].trim();
  if (NOT_A_PLACE.test(from)) return null;
  let to = m[2].trim().replace(/\s+by\s+\w+$/i, "");
  let toCode = null;
  const c = to.match(/^(.*?)\s*\(([A-Z]{3})\)$/);
  if (c) { to = c[1].trim(); toCode = c[2]; }
  if (to.split(/\s+/).length > 4) return null;
  return { from, to, fromCode: AIRPORT[from] || null, toCode: toCode || AIRPORT[to] || null };
}

const clamp = (lines) => ({
  display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical", overflow: "hidden",
});

// ─── Footage ───
// Muted and looping, because a video that starts with sound on a screen you
// scrolled into is hostile. Only the card you are on plays: the deck holds
// every region at once, and without this a nine-region country would have nine
// videos decoding behind one another.
function HeroVideo({ src, poster, active, muted, onFail }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const go = () => {
      v.muted = muted;
      if (active) v.play().catch(() => {});
      else { v.pause(); v.currentTime = 0; }
    };
    go();
    // A tab that goes to the background pauses its video and does not start it
    // again on the way back, which leaves a still frame where the footage was.
    document.addEventListener("visibilitychange", go);
    return () => document.removeEventListener("visibilitychange", go);
  }, [muted, src, active]);
  return (
    <video
      ref={ref} src={src} poster={poster}
      autoPlay={active} muted loop playsInline
      preload={active ? "auto" : "metadata"} onError={onFail}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", background: "#15172A" }}
    />
  );
}

function RoundBtn({ children, onClick, label, size = 34 }) {
  return (
    <button onClick={onClick} aria-label={label} style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0, padding: 0,
      ...glass, cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>{children}</button>
  );
}

// ─── Stepping between regions ───
// The day screen puts the day you are on in the bar with an arrow either side.
// A region is the same kind of thing: you are comparing Ubud against Seminyak,
// and going back to the list to do it loses your place every time. The name
// itself opens the full list, for the jump the arrows make slow.
function RegionSwitch({ city, dest, onPrev, onNext, hasPrev, hasNext, onOpen, onFrame = true }) {
  const arrow = (on) => ({
    width: 24, height: 24, borderRadius: "50%", border: "none", padding: 0,
    background: onFrame ? "rgba(255,255,255,0.2)" : C.bg,
    cursor: on ? "pointer" : "default", opacity: on ? 1 : 0.35, flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
  });
  const ink = onFrame ? "#fff" : C.head;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0,
      padding: onFrame ? "5px 7px" : 0, borderRadius: R.pill,
      ...(onFrame ? glass : {}),
    }}>
      <button onClick={onPrev} aria-label="Previous region" style={arrow(hasPrev)}>
        <ChevronLeft size={14} color={ink} />
      </button>
      <button onClick={onOpen} style={{
        display: "inline-flex", alignItems: "center", gap: 3, minWidth: 0,
        background: "none", border: "none", padding: "0 2px", cursor: "pointer", fontFamily: "inherit",
      }}>
        <span style={{
          fontSize: 13.5, fontWeight: 700, color: ink, whiteSpace: "nowrap",
          overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150,
        }}>{city}{onFrame ? "" : ` · ${dest}`}</span>
        <ChevronDown size={13} color={onFrame ? "rgba(255,255,255,0.75)" : C.inact} style={{ flexShrink: 0 }} />
      </button>
      <button onClick={onNext} aria-label="Next region" style={arrow(hasNext)}>
        <ChevronRight size={14} color={ink} />
      </button>
    </div>
  );
}

function RegionPicker({ dest, regions, current, onPick, onClose }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 250 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(16,24,40,0.45)" }} />
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, maxHeight: "72%",
        background: C.white, borderRadius: "20px 20px 0 0", display: "flex", flexDirection: "column",
      }}>
        <div style={{ flexShrink: 0, padding: "12px 16px 10px" }}>
          <div style={{ width: 42, height: 4, borderRadius: 2, background: C.div, margin: "0 auto 12px" }} />
          <p style={{ margin: 0, ...T.h2 }}>Regions in {dest}</p>
        </div>
        <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
          {regions.map((p) => {
            const on = p.city === current;
            return (
              <button key={p.city} onClick={() => onPick(p.city)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                padding: "9px 10px", marginBottom: 6, borderRadius: R.card, cursor: "pointer",
                fontFamily: "inherit", background: on ? C.p100 : C.white,
                border: `1px solid ${on ? C.p300 : C.div}`,
              }}>
                <img src={p.img} alt="" style={{ width: 52, height: 52, borderRadius: R.well, objectFit: "cover", flexShrink: 0, background: A.photoBg }} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", ...T.h3, color: on ? C.p900 : C.head }}>{p.emoji} {p.city}</span>
                  <span style={{ display: "block", margin: "2px 0 0", ...T.micro }}>
                    {p.dayTrip ? "Day trip" : `${p.n} nights`} · {p.crowd} crowds
                  </span>
                </span>
                {on
                  ? <Check size={16} color={C.p600} strokeWidth={2.6} />
                  : <ChevronRight size={16} color={C.inact} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── The gallery ───
// Two tabs, the same split the day screen uses: what the place looks like, and
// what the people who went there photographed.
function GalleryScreen({ r, onClose }) {
  const [tab, setTab] = useState("region");
  const regionMedia = useMemo(
    () => [...new Set([...r.photos, ...r.acts.map((a) => a.img)].filter(Boolean))],
    [r]
  );
  const customerMedia = useMemo(
    () => (customerPhotos[r.dest] || []).map((p) => p?.img || p).filter((x) => typeof x === "string"),
    [r.dest]
  );
  const items = tab === "region" ? regionMedia : customerMedia;

  const tabBtn = (on) => ({
    flex: 1, padding: "8px 10px", borderRadius: 8, border: "none",
    background: on ? C.white : "transparent",
    boxShadow: on ? "0 1px 4px rgba(16,24,40,0.12)" : "none",
    fontFamily: "inherit", fontSize: 13, fontWeight: on ? 700 : 500,
    color: on ? C.head : C.sub, cursor: "pointer",
  });

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 260, background: C.white, display: "flex", flexDirection: "column" }}>
      <div style={{ flexShrink: 0, padding: "12px 14px 10px", borderBottom: `1px solid ${C.div}`, display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onClose} aria-label="Back" style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.div}`, background: C.white, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
          <ArrowLeft size={17} color={C.head} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, ...T.h3 }}>{r.city}</p>
          <p style={{ margin: "1px 0 0", ...T.micro }}>{items.length} photos and videos</p>
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: "10px 14px" }}>
        <div style={{ display: "flex", gap: 6, background: C.bg, borderRadius: 10, padding: 3 }}>
          <button onClick={() => setTab("region")} style={tabBtn(tab === "region")}>Region media</button>
          <button onClick={() => setTab("customer")} style={tabBtn(tab === "customer")}>Customer media</button>
        </div>
      </div>

      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "2px 14px 24px" }}>
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

// ─── Top things to do ───
// The photo is small and the words do the work, because a photograph never
// said whether a thing was a temple, a market or a boat. The ones we build a
// day around carry a tag.
function ThingsToDo({ acts, onOpen }) {
  return (
    <Sec title="Top things to do" flush>
      <div className="hs" style={{ gap: 12, paddingLeft: PAD, paddingRight: PAD, alignItems: "stretch" }}>
        {acts.slice(0, 9).map((a) => (
          <button key={a.id} onClick={() => onOpen(a)} style={{
            flexShrink: 0, width: 250, background: C.white, borderRadius: R.card,
            overflow: "hidden", boxShadow: SHADOW.card, display: "flex", flexDirection: "column",
            border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
          }}>
            <div style={{ position: "relative", height: 104, background: A.photoBg, flexShrink: 0 }}>
              <img src={a.img} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              {a.recommended && (
                <span style={{
                  position: "absolute", left: 9, top: 9, display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "4px 9px", borderRadius: R.pill, background: C.p600,
                  fontSize: 10, fontWeight: 800, color: "#fff", letterSpacing: "0.2px",
                }}><Sparkles size={10} /> Recommended</span>
              )}
            </div>
            <div style={{ padding: "11px 12px 13px", flex: 1, display: "flex", flexDirection: "column" }}>
              <p style={{ margin: 0, ...T.h3, ...clamp(1) }}>{a.name}</p>
              {a.summary && (
                <p style={{ margin: "5px 0 0", ...T.meta, lineHeight: 1.45, ...clamp(2) }}>{a.summary}</p>
              )}
              <span style={{ flex: 1 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
                <span style={{
                  padding: "4px 9px", borderRadius: R.pill,
                  background: (KIND_TONE[a.kind] || KIND_TONE.Culture).bg,
                  color: (KIND_TONE[a.kind] || KIND_TONE.Culture).fg,
                  fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap",
                }}>{a.kind}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, ...T.micro, color: C.sub }}>
                  <Clock size={11} /> {a.hours}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Sec>
  );
}

// ─── How to reach ───
//
// Drawn rather than written, and totalled. "Delhi to Da Nang, about 8h with
// the change, then 45 minutes down the coast" is three facts a couple has to
// hold in their head and add up. The strip at the top does the adding, then
// the legs sit on a rail underneath so the journey reads as one thing.

// Pull the hours and minutes back out of "About 8h with the change" so the
// legs can be totalled. If any leg will not parse we show no total at all,
// rather than one that quietly leaves a flight out.
function legMinutes(time = "") {
  const h = time.match(/(\d+)\s*h/i);
  const m = time.match(/(\d+)\s*m(?!i)/i);
  if (!h && !m) return null;
  return (h ? +h[1] * 60 : 0) + (m ? +m[1] : 0);
}
const asHours = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (!h) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
};

function HowToReach({ legs, city }) {
  const mins = legs.map((l) => legMinutes(l.time));
  const total = mins.every((x) => x != null) ? mins.reduce((a, b) => a + b, 0) : null;

  return (
    <Sec title="How to reach">
      <div style={{ borderRadius: R.card, overflow: "hidden", boxShadow: SHADOW.card, background: C.white }}>
        {total != null && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
            background: "linear-gradient(135deg, #FFF0F4 0%, #FEF6E9 100%)",
            borderBottom: `1px solid ${C.div}`,
          }}>
            <Well Icon={RouteIcon} tone={WELL.brand} size={32} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, ...T.lead }}>About {asHours(total)} from Delhi</p>
              <p style={{ margin: "2px 0 0", ...T.micro, color: C.sub }}>
                {legs.length} {legs.length === 1 ? "leg" : "legs"} to {city}, travel time only
              </p>
            </div>
          </div>
        )}

        <div style={{ padding: "4px 0 6px" }}>
          {legs.map((step, i) => {
            const Icon = MODE_ICON[step.mode] || Car;
            const tone = MODE_WELL[step.mode] || WELL.neutral;
            const leg = parseLeg(step.title);
            const last = i === legs.length - 1;
            return (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 14px 0" }}>
                {/* The rail: the icon, and a line carrying on to the next leg */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <Well Icon={Icon} tone={tone} />
                  {!last && <span style={{ flex: 1, width: 0, minHeight: 18, borderLeft: `2px dotted ${C.icon}`, marginTop: 4 }} />}
                </div>

                <div style={{ flex: 1, minWidth: 0, paddingBottom: last ? 8 : 14 }}>
                  {leg ? (
                    <>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                        <span style={{ minWidth: 0 }}>
                          <span style={{ display: "block", fontSize: 15, fontWeight: 800, color: C.head, lineHeight: 1.2 }}>{leg.from}</span>
                          <span style={{ display: "block", ...T.micro, letterSpacing: "0.5px" }}>{leg.fromCode || "\u00a0"}</span>
                        </span>
                        <span style={{ flex: 1, minWidth: 14, paddingBottom: 6, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                          <span style={{ ...T.micro, color: C.sub, fontWeight: 700, whiteSpace: "nowrap" }}>{step.time?.replace(/^About\s+/i, "")}</span>
                          <span style={{
                            width: "100%", height: 1,
                            background: `repeating-linear-gradient(90deg, ${C.icon} 0 3px, transparent 3px 7px)`,
                          }} />
                        </span>
                        <span style={{ minWidth: 0, textAlign: "right" }}>
                          <span style={{ display: "block", fontSize: 15, fontWeight: 800, color: C.head, lineHeight: 1.2 }}>{leg.to}</span>
                          <span style={{ display: "block", ...T.micro, letterSpacing: "0.5px" }}>{leg.toCode || "\u00a0"}</span>
                        </span>
                      </div>
                      <p style={{ margin: "7px 0 0", ...T.meta, lineHeight: 1.5 }}>{step.detail}</p>
                    </>
                  ) : (
                    <>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <p style={{ margin: 0, ...T.h3, flex: 1 }}>{step.title}</p>
                        <span style={{ ...T.micro, flexShrink: 0, color: C.sub, fontWeight: 700 }}>{step.time}</span>
                      </div>
                      <p style={{ margin: "5px 0 0", ...T.meta, lineHeight: 1.5 }}>{step.detail}</p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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

// ─── Top restaurants ───
//
// Indian and Veg only come first on every card and are the only tags drawn in
// colour, because for most of the couples we sell to they decide the answer
// and everything else is detail.
function Restaurants({ list }) {
  return (
    <Sec title="Top restaurants" flush>
      <div className="hs" style={{ gap: 12, paddingLeft: PAD, paddingRight: PAD, alignItems: "stretch" }}>
        {list.map((f) => (
          <div key={f.name} style={{
            flexShrink: 0, width: 252, background: C.white, borderRadius: R.card,
            overflow: "hidden", boxShadow: SHADOW.card, display: "flex", flexDirection: "column",
          }}>
            <div style={{ height: 112, background: A.photoBg, flexShrink: 0 }}>
              <img src={f.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ padding: "11px 12px 13px", flex: 1, display: "flex", flexDirection: "column" }}>
              <p style={{ margin: 0, ...T.h3, ...clamp(1) }}>{f.name}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, margin: "3px 0 0" }}>
                <MapPin size={11} color={C.inact} style={{ flexShrink: 0 }} />
                <span style={{ ...T.micro, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {f.area}{f.km != null ? ` · ${f.km} km from the centre` : ""}
                </span>
              </div>
              <p style={{ margin: "6px 0 0", ...T.meta, lineHeight: 1.45, ...clamp(2) }}>{f.note}</p>
              <span style={{ flex: 1 }} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
                {sortTags(f.tags).map((tag) => {
                  const tone = FOOD_TAG[tag];
                  return (
                    <span key={tag} style={{
                      padding: "3px 9px", borderRadius: R.pill,
                      background: tone ? tone.bg : C.bg,
                      color: tone ? tone.fg : C.sub,
                      fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap",
                    }}>{tag}</span>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Sec>
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
// Where in the region to base yourself, what kind of room is worth paying for
// here, and then the hotels that are it. These were two sections and they are
// one question, so they sit inside one tinted block: everything between the
// top of it and the bottom is the answer to "where do we sleep".
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
              <Well Icon={MapPin} tone={WELL.brand} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, ...T.eyebrow, color: C.p900 }}>Where to keep your hotel</p>
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
                      {roomNote(room) && (
                        <p style={{ margin: "3px 0 0", fontSize: 11.5, lineHeight: "16px", color: C.sub }}>{roomNote(room)}</p>
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
                  flexShrink: 0, width: 246, background: C.white, borderRadius: R.card,
                  overflow: "hidden", boxShadow: SHADOW.card, display: "block",
                  border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                }}>
                  <img src={h.images?.[0]?.url} alt={h.name} style={{ width: "100%", height: 118, objectFit: "cover", display: "block", background: A.photoBg }} />
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
                    <p style={{ margin: "10px 0 0", ...T.lead }}>
                      ₹{Number(h.pricePerNight).toLocaleString("en-IN")} <span style={{ ...T.micro }}>a night, taxes in</span>
                    </p>
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

// ─── One region card ───
function RegionCard({
  dest, city, width, radius, mediaH, active, near, p, muted,
  onMute, onProgress, shapeIdx, onBack, onPrev, onNext, hasPrev, hasNext,
  onOpenPicker, onGallery, onAllTrips,
}) {
  const { forDest, toggleRegion } = useSaves();
  const [videoFailed, setVideoFailed] = useState(false);
  const [activity, setActivity] = useState(null);
  const [hotel, setHotel] = useState(null);
  const scroller = useRef(null);

  const r = useMemo(() => regionDetail(dest, city), [dest, city]);
  const hotels = useMemo(() => {
    if (!near || !r) return [];
    return generateHotelsForCity(city, dest, "2026-11-10", "2026-11-17", 7)
      .filter((h) => Number(h.bookingScore) >= 8)
      .slice(0, 6);
  }, [near, r, city, dest]);
  const trips = useMemo(() => (near ? tripsThroughCity(dest, city) : []), [near, dest, city]);

  const onScroll = useCallback((e) => {
    onProgress(shapeIdx, Math.max(0, Math.min(1, e.currentTarget.scrollTop / mediaH)));
  }, [shapeIdx, onProgress, mediaH]);

  if (!r) return <div style={{ width, minWidth: width, flexShrink: 0 }} />;

  const g = r.guide;
  const saved = (forDest(dest).regions || []).includes(city);
  const mediaCount = new Set([...r.photos, ...r.acts.map((a) => a.img)].filter(Boolean)).size;

  const compact = p > 0.6;
  const mediaY = -p * mediaH * PARALLAX;
  const mediaFade = 1 - Math.max(0, (p - 0.55) / 0.45);
  const chromeFade = 1 - Math.max(0, (p - 0.28) / 0.3);

  return (
    <div style={{
      width, minWidth: width, height: "100%", flexShrink: 0,
      position: "relative", overflow: "hidden", borderRadius: radius, background: "#15172A",
    }}>
      {/* 1 · footage */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: mediaH, zIndex: 1,
        transform: `translateY(${mediaY}px)`, opacity: mediaFade,
      }}>
        {videoFailed || !r.video
          ? <img src={r.hero} alt={r.city} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          : <HeroVideo src={r.video} poster={r.hero} active={active} muted={muted} onFail={() => setVideoFailed(true)} />}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(8,10,18,0.5) 0%, transparent 26%, transparent 62%, rgba(8,10,18,0.5) 100%)",
        }} />
      </div>

      {/* 2 · the sheet, scrolling over the footage */}
      <div ref={scroller} className="hide-scrollbar" onScroll={onScroll}
        style={{ position: "absolute", inset: 0, overflowY: "auto", zIndex: 2 }}>
        <div style={{ height: mediaH - SHEET_LIFT }} />
        <div style={{ position: "relative", background: C.bg, borderRadius: "20px 20px 0 0", minHeight: "100%" }}>
          <div style={{ display: "flex", justifyContent: "center", padding: "9px 0 2px" }}>
            <span style={{ width: 38, height: 4, borderRadius: 99, background: C.div }} />
          </div>

          {/* The name lives here, on paper, rather than over moving footage
              where it goes legible and illegible twice a second. */}
          <div style={{ padding: `8px ${PAD}px 0` }}>
            <p style={{ margin: 0, ...T.eyebrow, color: C.inact }}>
              {r.dest}{g?.area ? ` · ${g.area}` : ""}
            </p>
            <h1 style={{ margin: "5px 0 0", fontSize: 26, fontWeight: 800, color: C.head, letterSpacing: "-0.7px", lineHeight: "31px" }}>
              {r.city}
            </h1>
            <p style={{ margin: "7px 0 0", ...T.lead, lineHeight: 1.4 }}>{g?.lead || r.blurb}</p>
            {g?.sub && <p style={{ margin: "4px 0 0", ...T.body }}>{g.sub}</p>}
          </div>

          {near && (
            <>
              {r.acts.length > 0 && <ThingsToDo acts={r.acts} onOpen={setActivity} />}
              {(r.pros.length > 0 || r.cons.length > 0) && (
                <Sec title="The honest bit">
                  <Postcard city={r.city} pros={r.pros} cons={r.cons} />
                </Sec>
              )}
              {g?.reach?.length > 0 && <HowToReach legs={g.reach} city={r.city} />}
              <WhenToGo r={r} />
              {trips.length > 0 && (
                <Sec
                  title="Real traveller itineraries"
                  action={trips.length > 1 && (
                    <button onClick={() => onAllTrips(trips)} style={{
                      flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 4,
                      border: "none", background: "none", padding: 0, cursor: "pointer", fontFamily: "inherit",
                      fontSize: 12.5, fontWeight: 700, color: C.p600,
                    }}>View all <ArrowRight size={13} /></button>
                  )}
                  flush
                >
                  <div className="hs" style={{ gap: 12, paddingLeft: PAD, paddingRight: PAD, alignItems: "stretch" }}>
                    {trips.map((t) => <BookedCard key={t.key} t={t} />)}
                  </div>
                </Sec>
              )}
              {g?.transport?.length > 0 && <TransportModes items={g.transport} />}
              {(g?.stay || hotels.length > 0) && <WhereToStay stay={g?.stay} hotels={hotels} city={r.city} onOpenHotel={setHotel} />}
              {r.food?.length > 0 && <Restaurants list={r.food} />}
            </>
          )}
          <div style={{ height: 40 }} />
        </div>
      </div>

      {/* 3 · footage controls: above the sheet so they take taps, clipped by
             the sheet's rising edge so they vanish under it, not over it */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 3,
        height: Math.max(0, mediaH - SHEET_LIFT - p * mediaH),
        overflow: "hidden", pointerEvents: "none",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: mediaH,
          transform: `translateY(${mediaY}px)`, opacity: mediaFade,
        }}>
          {r.video && !videoFailed && (
            <div style={{ position: "absolute", left: 12, bottom: 24, pointerEvents: "auto" }}>
              <RoundBtn size={32} onClick={onMute} label={muted ? "Unmute" : "Mute"}>
                {muted ? <VolumeX size={15} color="#fff" /> : <Volume2 size={15} color="#fff" />}
              </RoundBtn>
            </div>
          )}
          <button onClick={() => onGallery(r)} style={{
            position: "absolute", right: 12, bottom: 24, pointerEvents: "auto",
            display: "inline-flex", alignItems: "center", gap: 6, borderRadius: R.pill,
            padding: "8px 14px 8px 12px", cursor: "pointer", fontFamily: "inherit", ...glass,
          }}>
            <Images size={13} color="#fff" />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#fff" }}>
              View gallery<span style={{ color: "rgba(255,255,255,0.6)" }}> · {mediaCount}</span>
            </span>
          </button>
        </div>
      </div>

      {/* 4 · back, the switcher and save, on the footage */}
      {!compact && (
        <div style={{
          position: "absolute", top: 14, left: 12, right: 12, zIndex: 4,
          display: "flex", alignItems: "center", gap: 8,
          opacity: chromeFade, pointerEvents: p > 0.5 ? "none" : "auto",
        }}>
          <RoundBtn onClick={onBack} label="Back"><ArrowLeft size={17} color="#fff" /></RoundBtn>
          <div style={{ flex: 1, display: "flex", justifyContent: "center", minWidth: 0 }}>
            <RegionSwitch city={r.city} dest={dest} onPrev={onPrev} onNext={onNext} hasPrev={hasPrev} hasNext={hasNext} onOpen={onOpenPicker} />
          </div>
          <RoundBtn onClick={() => toggleRegion(dest, city)} label={saved ? "Saved" : "Save"}>
            <Heart size={15} color="#fff" fill={saved ? C.p600 : "transparent"} />
          </RoundBtn>
        </div>
      )}

      {/* 5 · the bar once the footage has gone */}
      {compact && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 5,
          background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${C.div}`, padding: "8px 12px",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <button onClick={onBack} aria-label="Back" style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.div}`, background: C.white, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
            <ArrowLeft size={17} color={C.head} />
          </button>
          <div style={{ flex: 1, display: "flex", justifyContent: "center", minWidth: 0 }}>
            <RegionSwitch city={r.city} dest={dest} onFrame={false} onPrev={onPrev} onNext={onNext} hasPrev={hasPrev} hasNext={hasNext} onOpen={onOpenPicker} />
          </div>
          <button onClick={() => toggleRegion(dest, city)} aria-label={saved ? "Saved" : "Save"} style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.div}`, background: C.white, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
            <Heart size={15} color={saved ? C.p600 : C.head} fill={saved ? C.p600 : "transparent"} />
          </button>
        </div>
      )}

      {/* The activity page, over the card it was opened from. Browsing, not
          booked, so it opens without the guide video a day in your own
          itinerary gets. */}
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
          // builder's generic one.
          activity={{ name: activity.name, img: activity.img, editorialSummary: activity.summary }}
          city={city}
          country={dest}
          isBooked={false}
          onClose={() => setActivity(null)}
        />
      )}
    </div>
  );
}

// ─── The deck ───
function RegionPager({ dest, regions, idx, setIdx, onBack }) {
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [prog, setProg] = useState(() => regions.map(() => 0));
  const [muted, setMuted] = useState(true);
  const [W, setW] = useState(390);
  const [H, setH] = useState(760);
  const [picker, setPicker] = useState(false);
  const [gallery, setGallery] = useState(null);
  const [allTrips, setAllTrips] = useState(null);

  const box = useRef(null);
  const start = useRef(null);
  const axis = useRef(null);
  const offset = useRef(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const read = () => { const r = el.getBoundingClientRect(); setW(r.width); setH(r.height); };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const M = Math.round(W * DECK_MPC);
  const restW = Math.max(160, W - M * 2);
  const step = restW + DECK_GAP;
  const mediaH = Math.min(Math.round(restW * MEDIA.ratio), Math.round(H * MEDIA.maxVh));
  const p = prog[idx] || 0;
  // The card you are reading grows out to the whole screen as the sheet rises.
  const grow = Math.min(1, p * 3);

  const go = (i) => setIdx(Math.max(0, Math.min(regions.length - 1, i)));
  const setOffset = (v) => { offset.current = v; setDx(v); };
  const onProgress = useCallback((i, v) => {
    setProg((a) => (Math.abs((a[i] || 0) - v) > 0.01 ? a.map((x, j) => (j === i ? v : x)) : a));
  }, []);

  const down = (e) => { start.current = { x: e.clientX, y: e.clientY }; axis.current = null; };
  const move = (e) => {
    if (!start.current) return;
    const ddx = e.clientX - start.current.x;
    const ddy = e.clientY - start.current.y;
    if (!axis.current) {
      if (Math.abs(ddx) < 8 && Math.abs(ddy) < 8) return;
      axis.current = Math.abs(ddx) > Math.abs(ddy) ? "x" : "y";
      if (axis.current === "x") setDragging(true);
    }
    if (axis.current !== "x") return;
    const atEnd = (ddx > 0 && idx === 0) || (ddx < 0 && idx === regions.length - 1);
    setOffset(atEnd ? ddx * 0.28 : ddx);
  };
  const up = () => {
    if (axis.current === "x") {
      const threshold = Math.max(52, W * 0.16);
      if (offset.current <= -threshold) go(idx + 1);
      else if (offset.current >= threshold) go(idx - 1);
    }
    start.current = null; axis.current = null;
    setDragging(false); setOffset(0);
  };

  const ease = "transform 0.3s cubic-bezier(0.22,0.61,0.36,1)";
  const deckX = -idx * step - M * grow + dx;

  return (
    <div
      ref={box}
      style={{
        position: "absolute", inset: 0, overflow: "hidden",
        background: "#0E1020", touchAction: "pan-y",
        paddingTop: PAD_TOP * (1 - grow), paddingBottom: PAD_BOT * (1 - grow),
        boxSizing: "border-box",
      }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onPointerLeave={() => start.current && up()}
    >
      <div style={{
        display: "flex", gap: DECK_GAP, height: "100%", paddingLeft: M,
        transform: `translate3d(${deckX}px, 0, 0)`,
        transition: dragging ? "none" : ease,
      }}>
        {regions.map((reg, i) => (
          <RegionCard
            key={reg.city}
            dest={dest}
            city={reg.city}
            shapeIdx={i}
            width={i === idx ? restW + M * 2 * grow : restW}
            radius={i === idx ? CARD_R * (1 - grow) : CARD_R}
            mediaH={mediaH}
            active={i === idx}
            near={Math.abs(i - idx) <= 1}
            p={i === idx ? p : 0}
            muted={muted}
            onMute={() => setMuted((m) => !m)}
            onProgress={onProgress}
            onBack={onBack}
            onPrev={() => go(i - 1)}
            onNext={() => go(i + 1)}
            hasPrev={i > 0}
            hasNext={i < regions.length - 1}
            onOpenPicker={() => setPicker(true)}
            onGallery={(r) => setGallery(r)}
            onAllTrips={(trips) => setAllTrips({ trips })}
          />
        ))}
      </div>

      {picker && (
        <RegionPicker
          dest={dest}
          regions={regions}
          current={regions[idx]?.city}
          onPick={(c) => { setPicker(false); go(regions.findIndex((x) => x.city === c)); }}
          onClose={() => setPicker(false)}
        />
      )}
      {allTrips && (
        <AllTripsSheet trips={allTrips.trips} onClose={() => setAllTrips(null)} />
      )}
      {gallery && <GalleryScreen r={gallery} onClose={() => setGallery(null)} />}
    </div>
  );
}

// ─── The screen, and the same screen inside something else ───
//
// Opened from a destination it is a route of its own, and the URL follows
// whichever card you swipe to. Opened from the wizard it has to be an overlay
// instead: a couple halfway through planning cannot be navigated away and
// handed back a wizard that has forgotten everything. So it takes the region
// as props when it is embedded, keeps the card in local state, and hands Back
// to whoever opened it.
export default function RegionDetail({ dest: destProp, city: cityProp, onClose }) {
  const { name, city } = useParams();
  const navigate = useNavigate();
  const embedded = !!destProp;
  const dest = embedded ? destProp : decodeURIComponent(name || "");
  const [localCity, setLocalCity] = useState(cityProp || "");
  const town = embedded ? localCity : decodeURIComponent(city || "");

  const regions = useMemo(() => regionsFor(dest) || [], [dest]);
  const idx = Math.max(0, regions.findIndex((x) => x.city === town));

  const setIdx = (i) => {
    const next = regions[i];
    if (!next || next.city === town) return;
    if (embedded) { setLocalCity(next.city); return; }
    navigate(`/destination/${encodeURIComponent(dest)}/region/${encodeURIComponent(next.city)}`, { replace: true });
  };
  const back = () => (embedded ? onClose?.() : navigate(-1));

  if (!regions.length || !regions.some((x) => x.city === town)) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p style={{ ...T.body }}>We don&apos;t have a page for {town} yet.</p>
        <button onClick={back} style={{ marginTop: 14, border: "none", background: C.p600, color: "#fff", borderRadius: R.pill, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Go back</button>
      </div>
    );
  }

  return <RegionPager dest={dest} regions={regions} idx={idx} setIdx={setIdx} onBack={back} />;
}

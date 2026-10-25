import { useMemo, useState } from "react";
import { X as XIcon, Check, ArrowRight, ArrowLeft, Headphones } from "lucide-react";
import { C } from "../../data";
import { destAreas } from "../../data/buildData";
import { cityPhotos } from "../../data/cityTags";
import { routeOptions } from "../../data/routeOptions";
import RoutePicker from "../wizard/RoutePicker";
import BuildingScreen from "../BuildingScreen";

// ─── Choosing a route, not building one ───
//
// The wizard already decides where a trip goes: cities in, order and nights
// out, and most couples take it as given. This screen is for the ones who
// want to see the alternatives. It does not ask them to drag anything or to
// start from nothing. It lists the routes this destination can be done in at
// this length, and they pick one.
//
// What a route card says, and what it deliberately leaves out:
//
//   arrows, not dots    a route is an order, and an arrow is the only mark
//                       that says so. Hanoi then Ha Long then Hoi An, in
//                       that direction
//   pictures of the
//   places              one photo per stop, swipeable, so the route can be
//                       seen as well as read. The same reel the wizard's
//                       city cards carry
//   one earned label    Recommended, Most booked, Trending, Affordable,
//                       Relaxed. Each one belongs to a single route, so the
//                       list reads as distinct answers rather than six
//                       routes all claiming to be the best
//   no travel times     hours between cities is the route editor's business.
//                       Here it is noise on every card
//
// Which cities are in play is a question of its own, behind "Change cities",
// and it is the wizard's own question asked the wizard's own way. Asking it
// first and showing routes second was the old flow's mistake.
//
// Everything offered comes from the same engine as the route editor, so a
// route in this list is a route that can be flown and booked.

const TONE = {
  pink: { bg: "#FFF1F4", fg: C.p600 },
  green: { bg: "#ECFDF3", fg: "#027A48" },
  blue: { bg: "#EFF4FF", fg: "#1F78FF" },
  amber: { bg: "#FFFAEB", fg: "#B54708" },
};

function Tag({ tag }) {
  const t = TONE[tag.tone] || TONE.pink;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: 999,
      background: t.bg, color: t.fg, fontSize: 10.5, fontWeight: 800, letterSpacing: "0.2px",
      whiteSpace: "nowrap",
    }}>{tag.text}</span>
  );
}

// The wizard's tick, at the wizard's size: quiet, always there, filled when
// answered. It is the whole card that takes the press; this only says so.
function Tick({ on }) {
  return (
    <span aria-hidden style={{
      width: 18, height: 18, borderRadius: "50%", flexShrink: 0, marginTop: 1,
      display: "grid", placeItems: "center",
      background: on ? C.p600 : C.white,
      border: on ? "none" : `1.5px solid ${C.icon}`,
      boxSizing: "border-box",
      transition: "background .15s, border-color .15s",
    }}>
      {on && <Check size={11} strokeWidth={3.6} color="#fff" />}
    </span>
  );
}

// ─── The reel down the left of a card ───
// The wizard's city card carries its photographs in a column flush to the
// left edge, full height, swipeable, with dots. Both cards here use the same
// one so the two screens are visibly the same family: on a city it is that
// city's pictures, on a route it is one frame per stop in visiting order.
function Reel({ shots, label }) {
  const [shot, setShot] = useState(0);
  return (
    <div style={{
      position: "relative", width: 104, alignSelf: "stretch",
      flexShrink: 0, overflow: "hidden", background: "#F4F2F0",
    }}>
      <div
        className="hide-scrollbar"
        onScroll={(e) => {
          const el = e.currentTarget;
          const n = Math.round(el.scrollLeft / (el.clientWidth || 1));
          if (n !== shot) setShot(n);
        }}
        style={{
          position: "absolute", inset: 0, display: "flex",
          overflowX: "auto", overflowY: "hidden",
          scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch",
        }}
      >
        {shots.map((s, n) => (
          <div key={s.key} style={{ position: "relative", flex: "0 0 100%", width: "100%", height: "100%", scrollSnapAlign: "start" }}>
            <img
              src={s.src}
              alt={n === 0 ? (label || "") : ""}
              loading={n === 0 ? "eager" : "lazy"}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        ))}
      </div>
      {shots.length > 1 && (
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 7,
          display: "flex", justifyContent: "center", gap: 3.5, pointerEvents: "none",
        }}>
          {shots.map((s, n) => (
            <span key={s.key} style={{
              width: n === shot ? 5 : 4, height: n === shot ? 5 : 4, borderRadius: "50%",
              background: n === shot ? "#fff" : "rgba(255,255,255,0.55)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

const CARD = (on) => ({
  display: "flex", cursor: "pointer", overflow: "hidden", borderRadius: 16, background: C.white,
  border: `${on ? 1.5 : 1}px solid ${on ? C.p600 : C.div}`,
  boxShadow: "0 1px 3px rgba(24,29,39,0.05)", transition: "border-color .15s",
});

// Every card is this tall, whatever the route. A list where the cards grow
// with the number of cities reads as a ranking by size, and scanning it means
// re-finding the tick on every row.
// Tall enough for the longest route this list can produce, its line and its
// labels. Every card takes it, so the list does not read as a ranking by
// size and the tick never moves down the page as you scan.
const ROUTE_CARD_H = 128;

function RouteCard({ dest, opt, chosen, current, onPick }) {
  const shots = useMemo(
    () => opt.route.map((r) => ({ key: r.city, src: cityPhotos(dest, r.city)[0] })),
    [dest, opt.route]
  );
  return (
    <div
      data-testid={`route-option-${opt.id}`}
      onClick={onPick}
      role="button"
      aria-pressed={chosen}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(); } }}
      style={{ ...CARD(chosen), height: ROUTE_CARD_H }}
    >
      <Reel shots={shots} label={opt.cities.join(" to ")} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", padding: "11px 12px 11px 13px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          {/* ─── The order, as an order ───
              Arrows, because a route is a sequence and a middot is not.
              Nothing in it is bold: every city on the line matters the same
              amount, and bolding all of them is the same as bolding none. */}
          <p style={{
            flex: 1, minWidth: 0, margin: 0,
            fontSize: 12, fontWeight: 600, color: C.head, lineHeight: "17px", letterSpacing: "-0.1px",
            overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
          }}>
            {opt.route.map((r, i) => (
              <span key={r.city} style={{ whiteSpace: "nowrap" }}>
                {/* inline-block on purpose: the app sets svg { display: block }
                    globally, which turns every arrow into its own line. */}
                {i > 0 && <ArrowRight size={11} color={C.icon} style={{ display: "inline-block", margin: "0 4px", verticalAlign: "middle" }} />}
                {r.city}
                <span style={{ color: C.sub }}> {r.n}N</span>
              </span>
            ))}
          </p>
          <Tick on={chosen} />
        </div>

        {/* What this route is, in one line. The labels say which one it is
            best at; this says what that means for the holiday. */}
        {(current || opt.line) && (
          <p style={{
            margin: "4px 0 0", fontSize: 11.5, color: C.sub, lineHeight: "16px",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {current ? "What your trip is built on now." : opt.line}
          </p>
        )}

        {(current || !!opt.tags.length) && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: "auto", paddingTop: 8, minWidth: 0 }}>
            {current && (
              <span style={{
                padding: "4px 10px", borderRadius: 999, background: C.bg, color: C.sub,
                fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
              }}>Current</span>
            )}
            {opt.tags.slice(0, current ? 1 : 2).map((t) => {
              const tone = TONE[t.tone] || TONE.pink;
              return (
                <span key={t.key} style={{
                  padding: "4px 10px", borderRadius: 999, background: tone.bg, color: tone.fg,
                  fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                }}>{t.text}</span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Which cities are in play ───
//
// The wizard's own city step, the component itself rather than a copy of it:
// the map, the sheet that pulls up over it, the cards with their photo reels
// and ticks, the chips of what is chosen, the region page behind "View
// details". One screen, two places, no chance of the two drifting apart.
//
// What it does not carry here is the wizard's five-step timeline, because
// this is not step three of anything, and its line about the order being
// ours, because on this flow the next screen hands the order back.
function CityPicker({ dest, nights, value, onSave, onClose, frame }) {
  const areas = useMemo(() => destAreas[dest] || [], [dest]);
  const suggested = useMemo(
    () => Object.fromEntries(areas.map((a) => [a.city, a.n])),
    [areas]
  );
  // RoutePicker thinks in routes, this screen thinks in cities, so the nights
  // here are only a carrier. The real split is worked out per route on the
  // screen behind this one.
  const [draft, setDraft] = useState(
    () => value.map((c) => ({ city: c, n: suggested[c] || 2 }))
  );
  const ready = draft.length >= 2;

  const shell = frame ? { ...frame, zIndex: 190 } : { position: "absolute", inset: 0, zIndex: 190 };

  return (
    <div data-testid="city-picker" style={{ ...shell, background: C.white, display: "flex", flexDirection: "column" }}>
      {/* The wizard's own header minus its timeline: a way back and nothing
          else. The title belongs to the picker, which keeps it stuck to the
          top of the scroll the way it does on step three. */}
      <div style={{
        flexShrink: 0, background: C.white, borderBottom: `1px solid ${C.div}`,
        padding: "calc(12px + env(safe-area-inset-top)) 14px 10px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <button onClick={onClose} aria-label="Back" style={{
            width: 34, height: 34, borderRadius: "50%", border: `1px solid ${C.div}`, background: C.white,
            display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0,
          }}><ArrowLeft size={17} color={C.head} /></button>
          <h1 style={{ margin: 0, flex: 1, minWidth: 0, fontSize: 19, fontWeight: 800, color: C.head, letterSpacing: "-0.4px", lineHeight: "24px" }}>
            Choose the cities you want to visit
          </h1>
        </div>
      </div>

      {/* No padding on the scroller. The picker lays out its own map, sheet
          and cards against it, and a wrapper with padding was what had the
          map inset and the sheet's stops measured against the wrong box. */}
      <div className="hide-scrollbar" style={{ flex: 1, minHeight: 0, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        <RoutePicker
          dest={dest}
          nights={nights}
          route={draft}
          setRoute={setDraft}
          showFit={false}
          // The heading lives in the bar above, beside the way back, so the
          // picker does not print a second one over the map.
          title=""
          nightsNote="Pick the places. The next screen shows every route they can be done in."
        />
      </div>

      <div style={{
        flexShrink: 0, borderTop: `1px solid ${C.div}`, background: C.white,
        padding: "10px 16px calc(12px + env(safe-area-inset-bottom))",
      }}>
        {!ready && (
          <p style={{ margin: "0 0 8px", fontSize: 12, color: C.sub, textAlign: "center" }}>
            Pick at least two cities so there is a route to choose from.
          </p>
        )}
        <button
          data-testid="city-picker-save"
          onClick={() => onSave(draft.map((r) => r.city))}
          disabled={!ready}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
            background: ready ? C.p600 : C.div, color: ready ? "#fff" : C.inact,
            fontSize: 15, fontWeight: 700, cursor: ready ? "pointer" : "not-allowed", fontFamily: "inherit",
          }}
        >Show routes</button>
      </div>
    </div>
  );
}

export default function RouteChooser({
  dest,
  route: current,
  nights,
  onSave,
  onClose,
  onSupport,
  // Opened from the itinerary's route pencil, the question is which cities,
  // and the routes follow from the answer. Opened on its own, the routes are
  // the point and the cities are a step back from them.
  startOnCities = false,
  buildOnSave = true,
  frame,
}) {
  const total = nights || current?.reduce((s, r) => s + r.n, 0) || 0;
  const allCities = useMemo(() => (destAreas[dest] || []).map((a) => a.city), [dest]);

  // Every city is in play until somebody says otherwise, so the first thing
  // on screen is the whole list of routes rather than a question.
  const [pool, setPool] = useState(allCities);
  const [citiesOpen, setCitiesOpen] = useState(startOnCities);
  const [building, setBuilding] = useState(false);

  const currentId = (current || []).map((r) => r.city).join(">");

  // The trip they are on always appears, at the top, whether or not the
  // generator would have produced that exact order. A list of alternatives
  // that leaves out the thing being compared against is a list of strangers.
  const options = useMemo(() => {
    const list = routeOptions(dest, total, { only: pool });
    // Nothing came back, so there is nothing to choose between. Pinning the
    // trip they already have on top of an empty list would read as an answer
    // when the answer is that we have none.
    if (!list.length) return [];
    if (!currentId || list.some((o) => o.id === currentId)) return list;
    const mine = {
      id: currentId,
      route: current.map((r) => ({ ...r })),
      cities: current.map((r) => r.city),
      tags: [],
    };
    return [mine, ...list];
  }, [dest, total, pool, currentId, current]);

  const [pickedId, setPickedId] = useState(currentId);
  const picked = options.find((o) => o.id === pickedId) || null;
  const changed = pickedId !== currentId;
  const narrowed = pool.length < allCities.length;

  const save = () => {
    if (!picked) return;
    if (buildOnSave) setBuilding(true);
    else onSave(picked.route);
  };

  const shell = frame ? { ...frame, zIndex: 180 } : { position: "absolute", inset: 0, zIndex: 180 };

  if (building) {
    return (
      <BuildingScreen
        frame={frame}
        dest={dest}
        cities={picked.cities}
        reason="route"
        summary={`${picked.cities.join(" · ")} · ${total} nights`}
        onDone={() => { setBuilding(false); onSave(picked.route); }}
      />
    );
  }

  if (citiesOpen) {
    return (
      <CityPicker
        dest={dest}
        nights={total}
        value={pool}
        frame={frame}
        // Nothing behind it on the way in, so back out of the cities is
        // back out of the whole thing.
        onClose={() => (startOnCities && pool === allCities ? onClose() : setCitiesOpen(false))}
        onSave={(next) => { setPool(next); setCitiesOpen(false); }}
      />
    );
  }

  return (
    <div data-testid="route-chooser" style={{ ...shell, background: C.white, display: "flex", flexDirection: "column" }}>
      <div style={{
        flexShrink: 0, background: C.white, borderBottom: `1px solid ${C.div}`,
        padding: "calc(10px + env(safe-area-inset-top)) 14px 11px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <button onClick={onClose} aria-label="Close" style={{
          width: 32, height: 32, borderRadius: "50%", border: "none", background: "transparent",
          display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0, marginLeft: -6,
        }}><XIcon size={19} color={C.head} /></button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: C.head, letterSpacing: "-0.3px" }}>Change your route</p>
          <p data-testid="chooser-summary" style={{ margin: "1px 0 0", fontSize: 12, color: C.sub }}>
            {options.length} route{options.length === 1 ? "" : "s"} to choose from
          </p>
        </div>
        <button
          data-testid="chooser-cities"
          onClick={() => setCitiesOpen(true)}
          style={{
            flexShrink: 0, padding: "8px 14px", borderRadius: 999, cursor: "pointer", fontFamily: "inherit",
            border: `1.5px solid ${C.p600}`, background: C.white, color: C.p600,
            fontSize: 12.5, fontWeight: 800, whiteSpace: "nowrap",
          }}
        >
          Change cities{narrowed ? ` (${pool.length})` : ""}
        </button>
      </div>

      <div className="hide-scrollbar" style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "12px 14px 16px" }}>
        {options.length === 0 ? (
          <div data-testid="chooser-empty" style={{ padding: "40px 20px", textAlign: "center" }}>
            <span style={{ width: 46, height: 46, borderRadius: "50%", background: C.bg, display: "inline-grid", placeItems: "center" }}>
              <Headphones size={20} color={C.sub} />
            </span>
            <p style={{ margin: "12px 0 0", fontSize: 15, fontWeight: 700, color: C.head }}>No route out of those cities</p>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: C.sub, lineHeight: "19px" }}>
              Nothing we can fly links them on a trip of {total} nights. Change the cities, or talk to our team and they will work something out with you.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 16 }}>
              <button
                onClick={() => setCitiesOpen(true)}
                style={{
                  padding: "12px 0", borderRadius: 12, border: "none",
                  background: C.p600, color: "#fff", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >Change cities</button>
              <button
                data-testid="chooser-support"
                onClick={() => onSupport?.()}
                style={{
                  padding: "12px 0", borderRadius: 12, border: `1.5px solid ${C.div}`,
                  background: C.white, color: C.head, fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
                }}
              >
                <Headphones size={15} color={C.p600} />
                Talk to our team
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            <p style={{ margin: "0 0 1px 2px", fontSize: 12, color: C.sub, lineHeight: "17px" }}>
              Same cities, same {total} nights. What changes is the order and how long you stay in each.
            </p>
            {options.map((opt) => (
              <RouteCard
                key={opt.id}
                dest={dest}
                opt={opt}
                chosen={opt.id === pickedId}
                current={opt.id === currentId}
                onPick={() => setPickedId(opt.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{
        flexShrink: 0, borderTop: `1px solid ${C.div}`, background: C.white,
        padding: "10px 16px calc(12px + env(safe-area-inset-bottom))",
      }}>
        <button
          data-testid="chooser-save"
          onClick={save}
          disabled={!changed || !picked}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
            background: changed && picked ? C.p600 : C.div,
            color: changed && picked ? "#fff" : C.inact,
            fontSize: 15, fontWeight: 700, cursor: changed && picked ? "pointer" : "not-allowed", fontFamily: "inherit",
          }}
        >Change route</button>
      </div>
    </div>
  );
}

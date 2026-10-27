import { useEffect, useMemo, useState } from "react";
import { X as XIcon, Check, ArrowRight, ArrowLeft, Headphones } from "lucide-react";
import { C } from "../../data";
import { destAreas } from "../../data/buildData";
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
//   no pictures         the photographs belong to the cities, so every
//                       route out of a destination carried the same few.
//                       A column of them slowed the list down and settled
//                       nothing
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

// ─── The labels, with the pink taken out ───
//
// Pink is the app's "press this": the buttons, the save, the chosen card.
// On a label it was telling somebody a route was urgent, which no route is.
// So the recommendation goes purple, the booking counts go slate (they are
// facts about other people, not advice about this trip), and the rest keep
// the three quiet tones they already had.
const TONE = {
  green: { fg: "#027A48", dot: "#17B26A" },
  blue: { fg: "#1849A9", dot: "#2E90FA" },
  amber: { fg: "#B54708", dot: "#F79009" },
  purple: { fg: "#5925DC", dot: "#7A5AF8" },
  slate: { fg: "#475467", dot: "#98A2B3" },
};

const KEY_TONE = {
  pick: "purple", value: "green", relaxed: "blue", offbeat: "purple",
  wide: "amber", sold: "slate", trending: "amber", popular: "blue",
  classic: "amber", easy: "green",
};

// A dot and a word, not a pill. A pill is a container, and these are
// adjectives: the dot carries the colour, the word carries the meaning, and
// the row costs half the height it did as a line of capsules.
function Tag({ tag }) {
  const t = TONE[KEY_TONE[tag.key]] || TONE.slate;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11, fontWeight: 700, color: t.fg, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.dot, flexShrink: 0 }} />
      {tag.text}
    </span>
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

// ─── The card ───
//
// A route is a line of text. It was a line of text beside a photo reel for a
// while, and the reel was the same four beaches on every card: the pictures
// belong to the cities, not to the order they are visited in, so every route
// out of a destination showed more or less the same ones. A column of them
// made the list slower to read and told nobody anything.
//
// So: the route, a tick, and its labels. Nothing else. The labels are the
// only commentary, which is as much as a list of eight needs.
const CARD = (on) => ({
  display: "block", width: "100%", textAlign: "left", cursor: "pointer",
  overflow: "hidden", borderRadius: 14, fontFamily: "inherit",
  // ─── Chosen, and obviously so ───
  // An outline alone is a hairline somebody has to go looking for. The one
  // that is picked gets the pink edge, a tinted ground and a shadow in the
  // brand colour, which is three signals rather than one and reads at a
  // glance from the top of the list.
  background: on ? "#FFF6F8" : C.white,
  // The edge stays one pixel and the second one is drawn inside it. A border
  // that grows when a card is picked makes that card two pixels taller than
  // the rest, and the whole list below it steps down as you choose.
  border: `1px solid ${on ? C.p600 : C.div}`,
  boxShadow: on
    ? `inset 0 0 0 1px ${C.p600}, 0 2px 10px rgba(227,27,83,0.13)`
    : "0 1px 3px rgba(24,29,39,0.05)",
  transition: "border-color .15s, background .15s, box-shadow .15s",
});

// ─── How tall the route line is, for all of them ───
//
// Every card is the same height, because a list whose cards grow with the
// number of cities reads as a ranking by size and the tick moves down the
// page as you scan it. But fixing that height at two lines when nothing in
// the list wraps leaves a band of nothing under every route.
//
// So it is measured: one canvas pass over the whole list, and if a single
// route needs a second line they all get one. Same heights, no dead space,
// and the answer changes with the destination rather than being guessed
// once for all of them.
const ROUTE_FONT = '600 12.5px Figtree, system-ui, sans-serif';
const LINE_H = 17;
const ARROW_W = 19; // the glyph and its two margins

function routeLines(options, width) {
  if (!width) return 1;
  const cv = routeLines.cv || (routeLines.cv = document.createElement("canvas"));
  const ctx = cv.getContext("2d");
  ctx.font = ROUTE_FONT;
  const fits = options.every((o) => {
    const w = o.route.reduce((sum, r, i) => sum + ctx.measureText(`${r.city} ${r.n}N`).width + (i ? ARROW_W : 0), 0);
    return w <= width;
  });
  return fits ? 1 : 2;
}

function RouteCard({ opt, chosen, current, onPick, lines = 2 }) {
  return (
    <button
      type="button"
      data-testid={`route-option-${opt.id}`}
      onClick={onPick}
      aria-pressed={chosen}
      // The current card trades its label row for the kicker, which is the
      // shorter of the two by six pixels. The six go back on underneath, so
      // every card in the list is the same height whichever one you are on.
      style={{ ...CARD(chosen), padding: current ? "9px 11px 15px" : "9px 11px" }}
    >
      <div>
        {/* ─── Which one you are on ───
            Said in words, over the route, the way a heading sits over a
            section. It was a filled pink tab, which read as a warning
            rather than a statement, and pink on this screen now means one
            thing only: the card you have picked. */}
        {current && (
          <span style={{
            display: "block", fontSize: 9.5, fontWeight: 800, color: C.sub,
            letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 3,
          }}>Your current route</span>
        )}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          {/* ─── The order, as an order ───
              Arrows, because a route is a sequence and a middot is not.
              Nothing in it is bold: every city on the line matters the same
              amount, and bolding all of them is the same as bolding none. */}
          <p style={{
            flex: 1, minWidth: 0, margin: 0,
            fontSize: 12.5, fontWeight: 600, color: C.head, lineHeight: `${LINE_H}px`, letterSpacing: "-0.1px",
            // Held at the list's height, so every card's labels start on the
            // same line whether this route wrapped or not.
            height: lines * LINE_H,
            overflow: "hidden", display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical",
          }}>
            {opt.route.map((r, i) => (
              <span key={r.city} style={{ whiteSpace: "nowrap" }}>
                {/* inline-block on purpose: the app sets svg { display: block }
                    globally, which turns every arrow into its own line. */}
                {/* Mid-grey at a heavier stroke. At C.icon on white it was
                    a suggestion of an arrow rather than an arrow. */}
                {i > 0 && <ArrowRight size={11} color="#667085" strokeWidth={2.5} style={{ display: "inline-block", margin: "0 5px", verticalAlign: "middle" }} />}
                {r.city}
                <span style={{ color: C.sub, fontWeight: 500 }}> {r.n}N</span>
              </span>
            ))}
          </p>
          <Tick on={chosen} />
        </div>

        {/* What the route is good at, and nothing else. Both labels fit on
            every card now that they are not capsules. */}
        {/* Collapsed when there is nothing to say. The route you are on
            carries its kicker instead, and an empty row under it is just a
            gap at the bottom of the first card. */}
        {!!opt.tags.length && (
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginTop: 6, minWidth: 0 }}>
            {opt.tags.slice(0, 2).map((t) => <Tag key={t.key} tag={t} />)}
          </div>
        )}
      </div>
    </button>
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
  // The width a route has on a card: the list, less the card's padding, the
  // gap and the tick. Measured off the real element rather than assumed, so
  // it holds on whatever the phone frame turns out to be.
  const [listEl, setListEl] = useState(null);
  const [listW, setListW] = useState(0);
  useEffect(() => {
    if (!listEl) return undefined;
    const read = () => setListW(listEl.clientWidth);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(listEl);
    document.fonts?.ready.then(read).catch(() => {});
    return () => ro.disconnect();
  }, [listEl]);
  const lines = useMemo(
    () => (listW ? routeLines(options, listW - 26 - 10 - 18) : 2),
    [options, listW]
  );
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
          <div ref={setListEl} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {options.map((opt) => (
              <RouteCard
                key={opt.id}
                opt={opt}
                lines={lines}
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

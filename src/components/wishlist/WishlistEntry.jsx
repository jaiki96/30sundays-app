import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Heart, Plus, X as XIcon } from "lucide-react";
import { C, destinations as ALL_DESTS } from "../../data";
import { useWishlist } from "../../data/wishlist";
import { regionsFor, regionByCity, activitiesFor, activityById } from "../../data/discoverData";
import { regionFood } from "../../data/regionFood";
import { generateHotelsForCity } from "../../data/hotelData";
import { KindDisc } from "../../data/wishlistKinds";
import SaveHeart from "../SaveHeart";

// ─── The wishlist, as a way in ───
//
// Chosen on the wishlist canvas: E1 on home (under Why we're the perfect
// match), E4 on the destination page (under the vibes), each with an empty
// state, and both opening "Choose what you like", a deck of regions, things to
// do, stays and places to eat that you swipe right to wishlist or left to skip.

const TINT = "#FFF1F3";
const KINDS = ["region", "hotel", "activity", "restaurant"];
const WORDS = {
  region: ["region", "regions"], hotel: ["stay", "stays"], activity: ["thing to do", "things to do"], restaurant: ["place to eat", "places to eat"],
};
const NOUN = { region: "Region", hotel: "Stay", activity: "Thing to do", restaurant: "Place to eat" };

// A saved item's photo: what was kept when it was saved, else the live data.
function imgOf(it) {
  if (it.img) return it.img;
  if (it.kind === "region") return regionByCity(it.dest, it.id)?.img || null;
  if (it.kind === "activity") return activityById(it.dest, it.id)?.img || null;
  if (it.kind === "restaurant" && it.city) return regionFood(it.dest, it.city).find((f) => f.name === it.name)?.img || null;
  return null;
}

function useDestSaves(dest) {
  const { forDest } = useWishlist();
  return useMemo(() => {
    const items = forDest(dest).filter((it) => KINDS.includes(it.kind)).sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
    const counts = Object.fromEntries(KINDS.map((k) => [k, items.filter((it) => it.kind === k).length]));
    const photos = items.map(imgOf).filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
    return { items, counts, photos, total: items.length };
  }, [forDest, dest]);
}

// "5 regions · 2 stays", each with its kind's coloured disc. Kinds with
// nothing saved are left out rather than shown as zero.
function KindCounts({ counts, size = 20 }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 14px" }}>
      {KINDS.filter((k) => counts[k] > 0).map((k) => (
        <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: C.head }}>
          <KindDisc kind={k} size={size} />
          {counts[k]} {WORDS[k][counts[k] === 1 ? 0 : 1]}
        </span>
      ))}
    </div>
  );
}

const outlineBtn = {
  height: 46, borderRadius: 12, border: `1.5px solid ${C.p600}`, background: C.white, color: C.p600,
  fontSize: 14.5, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%",
};

function DestChip({ name, count, on, onClick }) {
  return (
    <button onClick={onClick} aria-pressed={on} style={{
      flexShrink: 0, height: 36, padding: "0 13px", borderRadius: 18, cursor: "pointer", fontFamily: "inherit",
      border: `1.5px solid ${on ? C.p600 : C.div}`, background: on ? TINT : C.white,
      display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: C.head, whiteSpace: "nowrap",
    }}>
      {name}
      {count > 0 && <span style={{ fontWeight: 600, color: on ? C.p600 : C.sub }}>{count}</span>}
    </button>
  );
}

// Three photos, one large and two stacked, from what was saved last.
function Collage({ photos }) {
  const [a, b, c] = photos;
  const img = { width: "100%", objectFit: "cover", display: "block", background: C.bg };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gridTemplateRows: "74px 74px", gap: 4, borderRadius: 14, overflow: "hidden" }}>
      <img src={a} alt="" style={{ ...img, gridRow: "span 2", height: 152 }} />
      {b ? <img src={b} alt="" style={{ ...img, height: 74 }} /> : <span style={{ background: C.bg }} />}
      {c ? <img src={c} alt="" style={{ ...img, height: 74 }} /> : <span style={{ background: C.bg }} />}
    </div>
  );
}

// ─── One card, on home and on a destination page ───
// Home (E1) adds the destination chips; the destination page (E4) is the same
// card for its own destination, without them. With nothing saved it peeks at
// three picks you can heart right there, and its button says what comes next:
// glimpses of the place, in a deck you swipe.
function WishlistCard({ testid, style, title, seeAll, chips, dest, empty }) {
  const navigate = useNavigate();
  const s = useDestSaves(dest);
  const [choosing, setChoosing] = useState(false);
  return (
    // A pale pink ground and a solid heart by the title, so it reads as the
    // wishlist at a glance and not as one more white card on the page.
    <div data-testid={testid} style={{ padding: 16, borderRadius: 18, background: TINT, border: `1px solid ${C.p100}`, display: "flex", flexDirection: "column", gap: 12, ...style }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#181E4C", letterSpacing: "-0.2px", display: "flex", alignItems: "center", gap: 8 }}>
          <Heart size={20} color={C.p600} fill={C.p600} style={{ flexShrink: 0 }} />{title}
        </h2>
        {!empty && (
          <button onClick={() => navigate(seeAll)} style={{ border: "none", background: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700, color: C.p600, flexShrink: 0 }}>See all</button>
        )}
      </div>
      {chips}
      {empty ? (
        <DeckPreview key={dest} dest={dest} onOpen={() => setChoosing(true)} />
      ) : (
        <button onClick={() => navigate(`/saved/board/${encodeURIComponent(dest)}`)} style={{ border: "none", background: "none", padding: 0, cursor: "pointer", textAlign: "left", fontFamily: "inherit", display: "flex", flexDirection: "column", gap: 12 }}>
          <Collage photos={s.photos} />
          <KindCounts counts={s.counts} />
        </button>
      )}
      <button onClick={() => setChoosing(true)} style={outlineBtn}>
        {empty ? <>Glimpses of {dest}<ChevronRight size={17} /></> : <><Plus size={16} />Shortlist more in {dest}</>}
      </button>
      {choosing && <ChooseSheet dest={dest} onClose={() => setChoosing(false)} />}
    </div>
  );
}

// ─── Home (E1) ───
export function HomeWishlistCard({ forceEmpty = false }) {
  const { destinations, forDest } = useWishlist();
  const saved = forceEmpty ? [] : destinations.filter((d) => forDest(d).some((it) => KINDS.includes(it.kind)));
  const [pick, setPick] = useState(null);
  const empty = saved.length === 0;
  const dest = pick || (empty ? ALL_DESTS[0]?.name : saved[0]);
  const names = empty ? ALL_DESTS.map((d) => d.name) : saved;
  return (
    <WishlistCard
      key={dest}
      testid="home-wishlist"
      style={{ margin: "28px 18px 0" }}
      title={empty ? "Start your wishlist" : "Your wishlist"}
      seeAll="/saved"
      dest={dest}
      empty={empty}
      chips={(
        <div className="hide-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", margin: "0 -16px", padding: "0 16px" }}>
          {names.map((d) => (
            <DestChip key={d} name={d} count={empty ? 0 : forDest(d).filter((it) => KINDS.includes(it.kind)).length} on={d === dest} onClick={() => setPick(d)} />
          ))}
        </div>
      )}
    />
  );
}

// ─── Destination page (E4) ───
export function DestWishlistBand({ dest, forceEmpty = false }) {
  const s = useDestSaves(dest);
  const empty = forceEmpty || s.total === 0;
  return (
    <WishlistCard
      testid="dest-wishlist"
      style={{ margin: "18px 0 0" }}
      title={empty ? `Start your ${dest} wishlist` : `Your ${dest} wishlist`}
      seeAll={`/saved/board/${encodeURIComponent(dest)}`}
      dest={dest}
      empty={empty}
    />
  );
}

// The empty state's peek: three picks not yet saved, each with its heart
// beside the name so it can be saved there and then. A photo opens the deck.
function DeckPreview({ dest, onOpen }) {
  const { isSaved, toggle } = useWishlist();
  const deck = useDeck(dest).slice(0, 3);
  return (
    <div className="hide-scrollbar" style={{ display: "flex", gap: 10, overflowX: "auto", margin: "0 -16px", padding: "0 16px" }}>
      {deck.map((c) => (
        <div key={c.key} style={{ flex: "0 0 132px", display: "flex", flexDirection: "column", gap: 6 }}>
          <button onClick={onOpen} aria-label={`See ${c.name}`} style={{ position: "relative", display: "block", height: 112, padding: 0, border: "none", background: "none", cursor: "pointer" }}>
            <img src={c.img} alt="" style={{ width: 132, height: 112, borderRadius: 12, objectFit: "cover", display: "block", background: C.bg }} />
            <span style={{ position: "absolute", left: 7, bottom: 7 }}><KindDisc kind={c.kind} size={22} /></span>
          </button>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 4 }}>
            <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 700, color: C.head, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.name}</span>
            <SaveHeart saved={isSaved(c.kind, dest, c.id)} onToggle={() => toggle(c.kind, dest, c.id, c.meta)} size={26} style={{ margin: "-5px -5px -5px 0" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── The deck ───
// Regions, things to do, a stay per base and a place to eat per base, taken
// in turn so the kinds mix, leaving out anything already saved.
function useDeck(dest, includeSaved = false) {
  const { isSaved } = useWishlist();
  // Built once per destination, so a card does not vanish from under a swipe
  // the moment it is saved.
  const [deck] = useState(() => buildDeck(dest));
  return useMemo(
    () => (includeSaved ? deck : deck.filter((c) => !isSaved(c.kind, dest, c.id))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deck, includeSaved],
  );
}

function buildDeck(dest) {
  const regions = regionsFor(dest);
  const bases = regions.filter((r) => !r.dayTrip).slice(0, 4);
  const lists = {
    region: regions.map((r) => ({
      kind: "region", id: r.city, name: r.city, img: r.img, line: r.blurb,
      meta: { name: r.city, img: r.img, sub: r.blurb, city: r.city },
    })),
    activity: activitiesFor(dest, 16).map((a) => ({
      kind: "activity", id: a.id, name: a.name, img: a.img, line: a.city,
      meta: { name: a.name, img: a.img, sub: a.city, city: a.city },
    })),
    hotel: bases.flatMap((r) => {
      const h = generateHotelsForCity(r.city, dest, "2026-11-10", "2026-11-17", 7)
        .slice().sort((x, y) => (y.bookingScore || 0) - (x.bookingScore || 0))[0];
      const img = h?.images?.[0]?.url;
      return h && img ? [{
        kind: "hotel", id: h.name, name: h.name, img, line: `${r.city} · ${h.stars} star · ${h.bookingScore} rated`,
        meta: { name: h.name, city: r.city, sub: `${r.city} · ${h.stars}-star`, img, stars: h.stars, score: h.bookingScore },
      }] : [];
    }),
    restaurant: bases.flatMap((r) => regionFood(dest, r.city).slice(0, 1).map((f) => ({
      kind: "restaurant", id: `${r.city}::${f.name}`, name: f.name, img: f.img, line: `${r.city} · ${f.note}`,
      meta: { name: f.name, img: f.img, city: r.city, sub: [f.tags?.[0], f.area].filter(Boolean).join(" · ") },
    }))),
  };
  const order = ["region", "activity", "hotel", "activity", "restaurant", "region", "activity"];
  const at = Object.fromEntries(KINDS.map((k) => [k, 0]));
  const out = [];
  for (let guard = 0; guard < 80 && out.length < 24; guard++) {
    const k = order[guard % order.length];
    const c = lists[k][at[k]++];
    if (c && c.img) out.push({ ...c, key: `${c.kind}:${c.id}` });
    if (KINDS.every((kk) => at[kk] >= lists[kk].length)) break;
  }
  return out;
}

// ─── Choose what you like ───
const NUDGE_KEY = "30s_swipe_nudged_v1";
const FLY = 420;

export function ChooseSheet({ dest, onClose }) {
  const navigate = useNavigate();
  const { save, loginFor, isSaved } = useWishlist();
  const deck = useDeck(dest);
  const [at, setAt] = useState(0);
  const [drag, setDrag] = useState(0);
  const [leaving, setLeaving] = useState(null); // "left" | "right"
  const [nudge, setNudge] = useState(() => { try { return !localStorage.getItem(NUDGE_KEY); } catch { return true; } });
  const start = useRef(null);
  const card = deck[at];
  // Counted off the wishlist itself, so a save that waited for a login counts.
  const saved = deck.slice(0, at + (leaving ? 1 : 0)).filter((c) => isSaved(c.kind, dest, c.id)).length;
  const next = deck[at + 1];

  const hideNudge = () => {
    if (!nudge) return;
    setNudge(false);
    try { localStorage.setItem(NUDGE_KEY, "1"); } catch { /* ignore */ }
  };
  const decide = (dir) => {
    if (!card || leaving) return;
    hideNudge();
    setLeaving(dir);
    if (dir === "right") {
      save(card.kind, dest, card.id, card.meta, { silent: true });
    }
    setTimeout(() => { setAt((i) => i + 1); setLeaving(null); setDrag(0); }, 260);
  };

  const onDown = (e) => { if (leaving) return; start.current = e.clientX; e.currentTarget.setPointerCapture?.(e.pointerId); };
  const onMove = (e) => { if (start.current != null) setDrag(e.clientX - start.current); };
  const onUp = () => {
    if (start.current == null) return;
    start.current = null;
    if (Math.abs(drag) > 90) decide(drag > 0 ? "right" : "left");
    else setDrag(0);
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const x = leaving ? (leaving === "right" ? FLY : -FLY) : drag;
  const lean = Math.max(-1, Math.min(1, x / 140));

  const content = (
    // Stepped aside while the login asked for by a first save is up, and back
    // with that save made once it is done.
    <div data-testid="choose-sheet" style={{ position: "absolute", inset: 0, zIndex: 1500, display: loginFor ? "none" : "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <style>{`@keyframes wl-wiggle{0%,100%{transform:translateX(0) rotate(0)}20%{transform:translateX(26px) rotate(3deg)}45%{transform:translateX(-22px) rotate(-3deg)}65%{transform:translateX(0) rotate(0)}}`}</style>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(24,30,76,0.4)" }} />
      <div style={{ position: "relative", height: "92%", background: C.white, borderRadius: "22px 22px 0 0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "#D5D7DA", margin: "8px auto 0", flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px 4px", flexShrink: 0 }}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.head }}>Choose what you like</p>
          <button onClick={onClose} aria-label="Close" style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: C.bg, display: "grid", placeItems: "center", cursor: "pointer" }}>
            <XIcon size={18} color={C.head} />
          </button>
        </div>
        {saved > 0 && (
          <p style={{ margin: "0 16px", fontSize: 13, color: C.sub, flexShrink: 0 }}>
            <span style={{ fontWeight: 700, color: C.p600 }}>{saved} added</span> to your {dest} wishlist
          </p>
        )}

        <div style={{ position: "relative", flex: 1, margin: "16px 16px 0", minHeight: 0 }}>
          {!card ? (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, textAlign: "center", padding: "0 24px" }}>
              <Heart size={34} color={C.p600} fill={C.p600} />
              <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: C.head }}>That is everything for now</p>
              <button onClick={() => { onClose(); navigate(`/saved/board/${encodeURIComponent(dest)}`); }} style={{ ...outlineBtn, width: "auto", padding: "0 20px" }}>See your {dest} wishlist</button>
            </div>
          ) : (
            <>
              {next && <DeckCard c={next} style={{ transform: "scale(0.95) translateY(10px)", opacity: 0.9 }} />}
              <DeckCard
                key={card.key}
                c={card}
                stamp={lean}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
                style={{
                  transform: `translateX(${x}px) rotate(${lean * 8}deg)`,
                  transition: start.current != null ? "none" : "transform 260ms ease",
                  animation: nudge && !leaving && drag === 0 ? "wl-wiggle 1.6s ease-in-out 0.5s 2" : undefined,
                  cursor: "grab", touchAction: "pan-y",
                }}
              />
              {nudge && (
                <div style={{ position: "absolute", left: 0, right: 0, top: 14, display: "flex", justifyContent: "center", pointerEvents: "none", zIndex: 3 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(12,16,40,0.78)", color: "#fff", fontSize: 12.5, fontWeight: 700 }}>
                    Swipe right to wishlist, left to skip
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, padding: "16px 16px calc(20px + env(safe-area-inset-bottom))", flexShrink: 0 }}>
          <button data-testid="choose-skip" disabled={!card} onClick={() => decide("left")} style={{ flex: 1, height: 52, borderRadius: 14, border: `1.5px solid ${C.div}`, background: C.white, color: C.head, fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, opacity: card ? 1 : 0.4 }}>
            <XIcon size={18} color={C.sub} strokeWidth={2.4} />Not for me
          </button>
          <button data-testid="choose-save" disabled={!card} onClick={() => decide("right")} style={{ flex: 1, height: 52, borderRadius: 14, border: "none", background: C.p600, color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, opacity: card ? 1 : 0.4 }}>
            <Heart size={18} color="#fff" strokeWidth={2.4} />Wishlist
          </button>
        </div>
      </div>
    </div>
  );
  const frame = typeof document !== "undefined" ? document.getElementById("phone-frame") : null;
  return frame ? createPortal(content, frame) : content;
}

function DeckCard({ c, stamp = 0, style, ...handlers }) {
  return (
    <div {...handlers} style={{ position: "absolute", inset: 0, borderRadius: 22, overflow: "hidden", boxShadow: "0 10px 28px rgba(24,30,76,0.22)", background: C.bg, userSelect: "none", ...style }}>
      <img src={c.img} alt={c.name} draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "70px 18px 18px", background: "linear-gradient(180deg, rgba(12,16,40,0) 0%, rgba(12,16,40,0.82) 100%)", display: "flex", flexDirection: "column", gap: 6, pointerEvents: "none" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <KindDisc kind={c.kind} size={22} />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#fff" }}>{NOUN[c.kind]}</span>
        </span>
        <span style={{ fontSize: 24, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{c.name}</span>
        {c.line && <span style={{ fontSize: 13.5, color: "#fff", opacity: 0.92, lineHeight: "19px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.line}</span>}
      </div>
      {stamp > 0.25 && (
        <span style={{ position: "absolute", left: 18, top: 22, padding: "6px 12px", borderRadius: 10, border: `3px solid ${C.p600}`, color: C.p600, background: "rgba(255,255,255,0.9)", fontSize: 16, fontWeight: 800, transform: "rotate(-10deg)", opacity: Math.min(1, stamp * 1.5) }}>WISHLIST</span>
      )}
      {stamp < -0.25 && (
        <span style={{ position: "absolute", right: 18, top: 22, padding: "6px 12px", borderRadius: 10, border: `3px solid ${C.sub}`, color: C.sub, background: "rgba(255,255,255,0.9)", fontSize: 16, fontWeight: 800, transform: "rotate(10deg)", opacity: Math.min(1, -stamp * 1.5) }}>NOT FOR ME</span>
      )}
    </div>
  );
}

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Bookmark } from "lucide-react";
import { C, allItineraries } from "../data";
import { useDeals } from "../data/deals";
import { useWishlist } from "../data/wishlist";
import { POI_CATEGORIES, CATEGORY_LABELS } from "../data/wishlistData";

const destFlags = { Thailand: "🇹🇭", Vietnam: "🇻🇳", Bali: "🇮🇩", Maldives: "🇲🇻", "Sri Lanka": "🇱🇰", "New Zealand": "🇳🇿", Mauritius: "🇲🇺" };

const PAD = 16;

// Small round heart used to remove something from the wishlist.
function RemoveHeart({ onRemove, light }) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
      aria-label="Remove from wishlist"
      style={{ width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: light ? "rgba(255,255,255,0.92)" : "transparent", boxShadow: light ? "0 1px 4px rgba(0,0,0,0.18)" : "none" }}
    >
      <Heart size={17} color={C.p600} fill={C.p600} />
    </button>
  );
}

// A saved row: itinerary, hotel, activity, restaurant or shopping place.
// Same tile everywhere so the whole screen reads as one clean list.
function SavedTile({ item, onRemove, onOpen }) {
  return (
    <div onClick={onOpen} style={{ display: "flex", alignItems: "center", gap: 12, background: C.white, border: `1px solid ${C.div}`, borderRadius: 14, padding: 10, cursor: onOpen ? "pointer" : "default" }}>
      <img src={item.img} alt="" style={{ width: 66, height: 66, borderRadius: 11, objectFit: "cover", flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.head, lineHeight: "18px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: C.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.sub}</p>
        <p style={{ margin: "2px 0 0", fontSize: 11.5, color: C.inact }}>{item.meta}</p>
      </div>
      <RemoveHeart onRemove={onRemove} />
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "56px 24px", textAlign: "center" }}>
      <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.p100, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Bookmark size={22} color={C.p600} />
      </div>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.head }}>No {label.toLowerCase()} saved yet</p>
      <p style={{ margin: 0, fontSize: 12.5, color: C.sub, maxWidth: 240 }}>Tap the heart on anything you like and it will show up here.</p>
    </div>
  );
}

export default function SavedWishlist() {
  const navigate = useNavigate();
  const { deals, wished, toggleWish } = useDeals();
  const { savedItems, toggle, counts } = useWishlist();

  // Resolve the plan versions a user hearted in My Plans into itinerary cards.
  const savedItineraries = useMemo(() => {
    const out = [];
    const all = [];
    deals.forEach((d) => {
      (d.versions || []).forEach((v) => all.push({ deal: d, v }));
      (d.properties || []).forEach((p) => (p.versions || []).forEach((v) => all.push({ deal: d, v })));
    });
    all.forEach(({ deal, v }) => {
      if (!wished[v.id]) return;
      const it = allItineraries.find((i) => i.id === (v.itineraryId ?? deal.itineraryId));
      if (!it) return;
      const route = (it.route || []).map((r) => `${r.n}N ${r.city}`).join(" · ");
      out.push({
        versionId: v.id, itId: it.id,
        item: {
          id: v.id,
          name: `${destFlags[it.dest] || ""} ${it.dest} · ${it.nights}N`.trim(),
          img: it.img,
          sub: route || it.name,
          meta: `From ₹${it.price}/pp`,
        },
      });
    });
    return out;
  }, [deals, wished]);

  const tabs = [
    { key: "itineraries", label: CATEGORY_LABELS.itineraries, count: savedItineraries.length },
    ...POI_CATEGORIES.map((c) => ({ key: c, label: CATEGORY_LABELS[c], count: counts[c] })),
  ];
  const [tab, setTab] = useState("itineraries");

  const poiItems = tab !== "itineraries" ? savedItems(tab) : [];

  // Removing is confirmed first, so a stray tap does not lose a save.
  const [pendingRemove, setPendingRemove] = useState(null); // { name, run }
  const askRemove = (name, run) => setPendingRemove({ name, run });
  const confirmRemove = () => { pendingRemove?.run(); setPendingRemove(null); };

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: C.bg }}>
      {/* Header */}
      <div style={{ flexShrink: 0, background: C.white, borderBottom: `1px solid ${C.div}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: `12px ${PAD}px 10px` }}>
          <button onClick={() => navigate(-1)} aria-label="Back" style={{ width: 34, height: 34, borderRadius: "50%", background: C.bg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <ArrowLeft size={18} color={C.head} />
          </button>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: C.head, margin: 0 }}>Saved & Wishlist</h1>
        </div>
        {/* Category tabs */}
        <div className="hide-scrollbar" style={{ display: "flex", gap: 8, padding: `0 ${PAD}px 12px`, overflowX: "auto" }}>
          {tabs.map((t) => {
            const on = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 999, border: `1px solid ${on ? C.p600 : C.div}`, background: on ? C.p600 : C.white, cursor: "pointer", fontFamily: "inherit" }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: on ? "#fff" : C.head }}>{t.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: on ? "#fff" : C.sub }}>{t.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: `14px ${PAD}px 20px` }}>
        {tab === "itineraries" ? (
          savedItineraries.length === 0 ? (
            <EmptyState label="Itineraries" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {savedItineraries.map(({ versionId, itId, item }) => (
                <SavedTile key={versionId} item={item} onRemove={() => askRemove(item.name, () => toggleWish(versionId))} onOpen={() => navigate(`/itinerary/${itId}`)} />
              ))}
            </div>
          )
        ) : (
          poiItems.length === 0 ? (
            <EmptyState label={CATEGORY_LABELS[tab]} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {poiItems.map((item) => (
                <SavedTile key={item.id} item={item}
                  onOpen={tab === "hotels" ? () => navigate(`/saved/hotel/${item.id}`)
                    : tab === "activities" ? () => navigate(`/saved/activity/${item.id}`) : undefined}
                  onRemove={() => askRemove(item.name, () => toggle(tab, item.id))} />
              ))}
            </div>
          )
        )}
      </div>

      {/* Remove confirmation */}
      {pendingRemove && (
        <div style={{ position: "absolute", inset: 0, zIndex: 70, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={() => setPendingRemove(null)} style={{ position: "absolute", inset: 0, background: "rgba(24,29,39,0.45)" }} />
          <div style={{ position: "relative", width: "100%", background: C.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: `20px ${PAD}px calc(20px + env(safe-area-inset-bottom))`, boxShadow: "0 -8px 28px rgba(0,0,0,0.2)" }}>
            <p style={{ fontSize: 17, fontWeight: 800, color: C.head, margin: "0 0 6px" }}>Remove from wishlist?</p>
            <p style={{ fontSize: 13.5, color: C.sub, margin: "0 0 18px", lineHeight: "19px" }}>
              {pendingRemove.name} will be taken out of your saved items. You can always save it again later.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setPendingRemove(null)} style={{ flex: 1, minHeight: 46, borderRadius: 12, border: `1.5px solid ${C.div}`, background: C.white, color: C.head, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Keep it
              </button>
              <button onClick={confirmRemove} style={{ flex: 1, minHeight: 46, borderRadius: 12, border: "none", background: C.p600, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

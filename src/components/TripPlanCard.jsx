import { useState } from "react";
import { ChevronDown, ArrowRight, Download, User, Baby } from "lucide-react";
import { C, allItineraries } from "../data";

const destFlags = { Thailand: "🇹🇭", Vietnam: "🇻🇳", Bali: "🇮🇩", Maldives: "🇲🇻", "Sri Lanka": "🇱🇰", "New Zealand": "🇳🇿" };

// A version (or a Maldives property quote) is a DRAFT (editable) or a QUOTE
// (a generated PDF, locked). Draft → continue editing; quote → view the PDF.
const isQuote = (v) => v.status === "quote";
const travellersOf = (v) => v.customizations?.travelDates?.travelers ?? 2;
const ppPrice = (v) => v.livePrice ?? v.indicativePrice ?? 0;
const fmt = (n) => `₹${Math.round(n || 0).toLocaleString("en-IN")}`;
const total = (perPerson, t) => (perPerson || 0) * t;
const shortDate = (ts) => ts ? new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : null;

// Status pill (Draft / Quote / Expired).
function StatusChip({ kind }) {
  const map = {
    draft: { label: "Draft", fg: C.p600, bg: C.p100 },
    quote: { label: "Quote", fg: C.sText, bg: C.sBg },
    expired: { label: "Expired", fg: C.inact, bg: C.bg },
  };
  const s = map[kind] || map.draft;
  return <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: s.bg, color: s.fg, flexShrink: 0 }}>{s.label}</span>;
}

// The one action affordance per item: quote → View PDF, draft → Continue editing.
function ActionLink({ quote }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: C.p600, whiteSpace: "nowrap" }}>
      {quote ? <><Download size={13} /> PDF</> : <>Continue editing <ArrowRight size={14} /></>}
    </span>
  );
}

// ONE card template per deal. Header (destination, version, status) + the
// itinerary facts (route with nights, dates, travellers, generated-on) + the
// price(s) with their action. Maldives shows one priced row per property.
export default function TripPlanCard({ deal, onOpen, onStartNew }) {
  const [open, setOpen] = useState(false);
  const lost = deal.status === "lost";
  const sorted = [...deal.versions].sort((a, b) => b.num - a.num);
  const latest = sorted[0];
  const draftV = sorted.find(v => !isQuote(v));
  const quoteV = sorted.find(isQuote);

  // Lead with the open draft if any, else the latest quote.
  const primary = lost ? (quoteV ?? latest) : (draftV ?? quoteV ?? latest);
  const primaryIsQuote = isQuote(primary);
  const stateKind = lost ? "expired" : (primaryIsQuote ? "quote" : "draft");

  const dest = primary.destination ?? deal.dest;
  const itin = allItineraries.find(i => i.id === (primary.itineraryId ?? deal.itineraryId));
  const td = primary.customizations?.travelDates;
  const t = travellersOf(primary);
  const nights = td?.nights ?? itin?.nights;
  const route = itin?.route?.length
    ? itin.route.map(r => `${r.city} ${r.n}N`).join(" · ")
    : (primary.title ?? deal.title);
  const kids = td?.kids || 0;
  const adults = Math.max(1, t - kids);
  const dateStr = shortDate(td?.fromDate);
  const generatedOn = shortDate(primaryIsQuote ? primary.pricedAt : primary.createdAt);

  // Maldives cards are per-property: title = resort, with the destination + route
  // on the line below. (Same property's quotes are its versions.)
  const property = deal.property;
  const titleText = property ? property : `${destFlags[dest] || ""} ${dest}${nights ? ` · ${nights}N` : ""}`;
  const routeText = property ? `${destFlags[dest] || ""} ${dest} · ${route}` : route;
  const earlier = sorted.filter(v => v.id !== primary.id);

  const Header = (
    <div onClick={() => onOpen(primary)} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 12px 11px", cursor: "pointer" }}>
      <img src={deal.img} alt="" style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover", flexShrink: 0, filter: lost ? "grayscale(0.6)" : "none" }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.head, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {titleText}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 6, background: C.bg, color: C.sub, letterSpacing: ".3px" }}>V{primary.num}</span>
            <StatusChip kind={stateKind} />
          </div>
        </div>
        <p style={{ margin: "3px 0 0", fontSize: 12.5, color: C.head, opacity: 0.85, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{routeText}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "2px 0 0", fontSize: 11.5, color: C.sub }}>
          {dateStr && <span>{dateStr}</span>}
          {dateStr && <span>·</span>}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>{adults}<User size={12} /></span>
          {kids > 0 && <><span>·</span><span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>{kids}<Baby size={12} /></span></>}
        </div>
        {generatedOn && <p style={{ margin: "1px 0 0", fontSize: 11, color: C.inact }}>Generated {generatedOn}</p>}
      </div>
    </div>
  );

  // Lost / expired → muted summary in the "older plans" accordion.
  if (lost) {
    return (
      <div style={{ border: `1px solid ${C.div}`, borderRadius: 14, overflow: "hidden", background: C.white, opacity: 0.62 }}>
        {Header}
        <div onClick={() => onStartNew?.()} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "11px 12px", borderTop: `1px solid ${C.bg}`, cursor: "pointer" }}>
          <span style={{ fontSize: 12.5, color: C.sub }}>This vacation is closed</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.p600 }}>Start again →</span>
        </div>
      </div>
    );
  }

  const priceCaption = <span style={{ fontSize: 11, fontWeight: 500, color: C.sub }}> incl. taxes</span>;

  return (
    <div style={{ border: `1px solid ${C.div}`, borderRadius: 14, overflow: "hidden", background: C.white }}>
      {Header}

      {/* One final price + one action */}
      <div onClick={() => onOpen(primary)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 12px", borderTop: `1px solid ${C.bg}`, cursor: "pointer" }}>
        <span style={{ flex: 1, fontSize: 16, fontWeight: 700, color: C.head }}>{fmt(total(ppPrice(primary), t))}{priceCaption}</span>
        <ActionLink quote={primaryIsQuote} />
      </div>

      {/* Quiet expander — earlier versions (V1, V2 …) */}
      {earlier.length > 0 && (
        <>
          <button onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "9px 12px", borderTop: `1px solid ${C.bg}`, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.sub }}>{earlier.length} earlier version{earlier.length !== 1 ? "s" : ""}</span>
            <ChevronDown size={15} color={C.sub} style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }} />
          </button>
          {open && earlier.map(v => (
            <div key={v.id} onClick={() => onOpen(v)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px 9px 18px", borderTop: `1px solid ${C.bg}`, cursor: "pointer" }}>
              <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 6, background: C.bg, color: C.sub, flexShrink: 0 }}>V{v.num}</span>
              <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: C.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {isQuote(v) ? "Quote" : "Draft"} · {fmt(total(ppPrice(v), travellersOf(v)))} · {shortDate(isQuote(v) ? v.pricedAt : v.createdAt)}
              </span>
              <ArrowRight size={13} color={C.inact} />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

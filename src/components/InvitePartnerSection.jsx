import { useState, useEffect } from "react";
import { UserPlus, X as XIcon, MessageCircle, Send, Check, ChevronRight, Trash2, Contact } from "lucide-react";
import { C } from "../data";

const APP_LINK = "https://30sundays.club/get-app";

// Sample contacts used as a fallback when the device Contact Picker API isn't
// available (e.g. desktop browsers). On a real phone the OS picker is used.
const MOCK_CONTACTS = [
  { name: "Priya Sharma", tel: "+91 98200 11223" },
  { name: "Rohan Mehta", tel: "+91 99876 54321" },
  { name: "Ananya Iyer", tel: "+91 98765 12345" },
  { name: "Karan Patel", tel: "+91 90040 55667" },
  { name: "Neha Gupta", tel: "+91 98330 99881" },
  { name: "Arjun Rao", tel: "+91 97411 22334" },
];

// Normalize an Indian mobile to its parts: 10-digit national, +91 display, and
// the bare 91XXXXXXXXXX that wa.me expects.
function normalizeMobile(raw) {
  let d = (raw || "").replace(/\D/g, "");
  if (d.startsWith("91") && d.length === 12) d = d.slice(2);
  const national = d.slice(-10);
  const valid = national.length === 10;
  const display = valid ? `+91 ${national.slice(0, 5)} ${national.slice(5)}` : `+91 ${national}`;
  return { national, valid, display, wa: valid ? `91${national}` : "" };
}

// Planner's WhatsApp invite. Greeting falls back to "Hey!" if the name is blank.
// The number line is generic when we don't have the contact's number yet.
function buildInviteMessage({ name, numberDisplay, destination }) {
  const greet = name && name.trim() ? `Hey ${name.trim()}!` : "Hey!";
  const numberLine = numberDisplay
    ? `Log in with your number ${numberDisplay} (that's how we'll be connected on the trip)`
    : `Log in with your mobile number (that's how we'll be connected on the trip)`;
  return (
    `${greet} I've started planning our ${destination} trip on 30 Sundays ❤️ and I want you in on it.\n` +
    `Download the app: ${APP_LINK}\n` +
    `${numberLine} and you'll see the full itinerary I've put together. Let's plan the rest together!`
  );
}

// Open WhatsApp with the message prefilled. When we know the contact's number we
// pre-select them (wa.me/91…); otherwise wa.me/?text shows WhatsApp's chat picker
// so the planner chooses the contact themselves.
function openWhatsApp(partner, destination) {
  const msg = buildInviteMessage({ name: partner?.name, numberDisplay: partner?.display, destination });
  const base = partner?.wa ? `https://wa.me/${partner.wa}` : "https://wa.me/";
  window.open(`${base}?text=${encodeURIComponent(msg)}`, "_blank");
}

// Try the native Contact Picker. Returns an array of {name, tel}, [] if cancelled,
// or null if the API isn't supported (caller should fall back to the mock list).
async function pickNativeContacts() {
  if (typeof navigator !== "undefined" && navigator.contacts && navigator.contacts.select) {
    try {
      const sel = await navigator.contacts.select(["name", "tel"], { multiple: true });
      return sel.map((c) => ({ name: (c.name && c.name[0]) || "", tel: (c.tel && c.tel[0]) || "" }));
    } catch {
      return [];
    }
  }
  return null;
}

function Avatar({ name, size = 42, ring = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: C.p100, color: C.p600,
      display: "grid", placeItems: "center", fontSize: size * 0.38, fontWeight: 700, flexShrink: 0,
      border: ring ? "2px solid #fff" : "none",
    }}>
      {(name?.[0] || "?").toUpperCase()}
    </div>
  );
}

function StatusChip({ joined }) {
  const c = joined
    ? { fg: "#2E7D52", bg: "#E6F4EC", bd: "#BBE3CA", label: "Joined" }
    : { fg: "#A66B00", bg: "#FEF5E5", bd: "#F5D98B", label: "Invited" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: c.fg, background: c.bg, border: `1px solid ${c.bd}`, padding: "3px 8px", borderRadius: 8, flexShrink: 0 }}>
      {joined && <Check size={12} strokeWidth={3} />} {c.label}
    </span>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

const sheetFrame = (isMobile) => isMobile
  ? { position: "fixed", inset: 0 }
  : { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 390, height: 844, borderRadius: 44, overflow: "hidden" };

const WhatsAppBtn = ({ onClick, label, solid }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%", padding: "12px 0", borderRadius: 12,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      border: solid ? "none" : `1.5px solid #25D366`,
      background: solid ? "#25D366" : C.white, color: solid ? "#fff" : "#1FA855",
      fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
    }}
  >
    <MessageCircle size={18} fill={solid ? "#fff" : "none"} color={solid ? "#25D366" : "#1FA855"} /> {label}
  </button>
);

const ContactsBtn = ({ onClick, label }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%", padding: "12px 0", borderRadius: 12, border: `1.5px solid ${C.p600}`,
      background: C.white, color: C.p600, fontSize: 14, fontWeight: 700, cursor: "pointer",
      fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    }}
  >
    <Contact size={17} /> {label}
  </button>
);

// ── Mock contact picker (fallback) ──
function MockContactsSheet({ onClose, onAdd }) {
  const isMobile = useIsMobile();
  const [picked, setPicked] = useState([]);
  const toggle = (tel) => setPicked((p) => (p.includes(tel) ? p.filter((t) => t !== tel) : [...p, tel]));

  return (
    <div style={{ ...sheetFrame(isMobile), zIndex: 186, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", animation: "fadeInBg 0.2s ease-out" }} />
      <div style={{ position: "relative", background: C.white, borderRadius: "16px 16px 0 0", padding: "16px 20px 28px", maxHeight: "82%", overflowY: "auto", animation: "sheetSlideUp 0.25s ease-out" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E0E2EB", margin: "0 auto 14px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <h4 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: 0 }}>Choose from contacts</h4>
          <button onClick={onClose} aria-label="Close" style={{ border: "none", background: "none", cursor: "pointer", padding: 4, marginRight: -4 }}><XIcon size={20} color={C.sub} /></button>
        </div>
        <p style={{ fontSize: 13, color: C.sub, margin: "0 0 12px", lineHeight: "18px" }}>Pick the people you're travelling with.</p>

        {MOCK_CONTACTS.map((ct) => {
          const on = picked.includes(ct.tel);
          return (
            <button key={ct.tel} onClick={() => toggle(ct.tel)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 0", background: "none", border: "none", borderTop: `1px solid ${C.div}`, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
              <Avatar name={ct.name} size={38} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.head, margin: 0 }}>{ct.name}</p>
                <p style={{ fontSize: 12.5, color: C.sub, margin: "1px 0 0" }}>{ct.tel}</p>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, border: `1.5px solid ${on ? C.p600 : C.inact}`, background: on ? C.p600 : "transparent", display: "grid", placeItems: "center" }}>
                {on && <Check size={13} color="#fff" strokeWidth={3} />}
              </div>
            </button>
          );
        })}

        <button
          onClick={() => { onAdd(MOCK_CONTACTS.filter((c) => picked.includes(c.tel))); onClose(); }}
          disabled={picked.length === 0}
          style={{
            marginTop: 16, width: "100%", padding: "13px 0", borderRadius: 12, border: "none",
            background: picked.length ? C.p600 : C.div, color: picked.length ? "#fff" : C.inact,
            fontSize: 15, fontWeight: 700, cursor: picked.length ? "pointer" : "default", fontFamily: "inherit",
          }}
        >
          {picked.length ? `Add ${picked.length} ${picked.length > 1 ? "people" : "person"}` : "Select contacts"}
        </button>
      </div>
    </div>
  );
}

// ── Invite + manage sheet: empty state shows the two methods; once people are
//    added it also lists them. This is the single place the methods live. ──
function ManageSheet({ partners, destination, onClose, onWhatsApp, onContacts, onRemove }) {
  const isMobile = useIsMobile();
  const has = partners.length > 0;
  return (
    <div style={{ ...sheetFrame(isMobile), zIndex: 180, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", animation: "fadeInBg 0.2s ease-out" }} />
      <div style={{ position: "relative", background: C.white, borderRadius: "16px 16px 0 0", padding: "16px 20px 28px", maxHeight: "82%", overflowY: "auto", animation: "sheetSlideUp 0.25s ease-out" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E0E2EB", margin: "0 auto 14px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <h4 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: 0 }}>{has ? "Your co-travelers" : "Invite your partner"}</h4>
          <button onClick={onClose} aria-label="Close" style={{ border: "none", background: "none", cursor: "pointer", padding: 4, marginRight: -4 }}><XIcon size={20} color={C.sub} /></button>
        </div>
        <p style={{ fontSize: 13, color: C.sub, margin: "0 0 14px", lineHeight: "18px" }}>
          {has ? `Everyone here can plan this ${destination} trip with you.` : `Add the people travelling with you so you can plan this ${destination} trip together.`}
        </p>

        {partners.map((p, i) => (
          <div key={i} style={{ borderTop: i === 0 ? "none" : `1px solid ${C.div}`, padding: "12px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar name={p.name} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.head, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name || "Your partner"}</p>
                <p style={{ fontSize: 12.5, color: C.sub, margin: "2px 0 0" }}>{p.display}</p>
              </div>
              <StatusChip joined={p.joined} />
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 8, paddingLeft: 54 }}>
              <button onClick={() => openWhatsApp(p, destination)} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, color: "#1FA855" }}>
                <MessageCircle size={14} /> Send on WhatsApp
              </button>
              <button onClick={() => onRemove(i)} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, color: C.inact, marginLeft: "auto" }}>
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        ))}

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
          <ContactsBtn onClick={onContacts} label="Add from contacts" />
          <WhatsAppBtn onClick={onWhatsApp} label="Invite via WhatsApp" />
        </div>
      </div>
    </div>
  );
}

export default function InvitePartnerSection({ destination }) {
  const [partners, setPartners] = useState([]);
  const [view, setView] = useState(null); // 'list' | 'contacts'

  const joinedCount = partners.filter((p) => p.joined).length;

  const addContacts = (list) => {
    const mapped = list
      .map((c) => {
        const m = normalizeMobile(c.tel);
        return m.valid ? { name: (c.name || "").trim(), national: m.national, display: m.display, wa: m.wa, joined: false } : null;
      })
      .filter(Boolean);
    setPartners((prev) => {
      const seen = new Set(prev.map((p) => p.national));
      return [...prev, ...mapped.filter((p) => !seen.has(p.national))];
    });
  };

  const handleContacts = async () => {
    const native = await pickNativeContacts();
    if (native === null) { setView("contacts"); return; } // unsupported → mock picker
    if (native.length) addContacts(native);
  };

  const inviteViaWhatsApp = () => openWhatsApp(null, destination); // generic; planner picks contact in WA
  const remove = (i) => setPartners((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div style={{ padding: "0 16px" }}>
      <p style={{ fontSize: 17, fontWeight: 700, color: C.head, marginBottom: 12 }}>Plan together</p>

      {/* One compact, tappable row — the method choice happens in the sheet */}
      <button
        onClick={() => setView("list")}
        aria-label={partners.length ? "View travel companions" : "Invite your travel partner"}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, border: `1px solid ${C.div}`, background: C.white, boxShadow: "0 1px 4px rgba(24,30,76,0.04)", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
      >
        {partners.length === 0 ? (
          <>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.p100, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <UserPlus size={19} color={C.p600} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.head, margin: 0 }}>Invite your travel partner</p>
              <p style={{ fontSize: 12.5, color: C.sub, margin: "2px 0 0", lineHeight: "17px" }}>Plan this {destination} trip together</p>
            </div>
            <span style={{ flexShrink: 0, fontSize: 13, fontWeight: 700, color: "#fff", background: C.p600, padding: "7px 16px", borderRadius: 999 }}>Invite</span>
          </>
        ) : (
          <>
            <div style={{ display: "flex" }}>
              {partners.slice(0, 3).map((p, i) => (
                <div key={i} style={{ marginLeft: i ? -12 : 0 }}><Avatar name={p.name} size={36} ring /></div>
              ))}
              {partners.length > 3 && (
                <div style={{ marginLeft: -12, width: 36, height: 36, borderRadius: "50%", background: C.bg, color: C.sub, border: "2px solid #fff", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700 }}>+{partners.length - 3}</div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.head, margin: 0 }}>
                {partners.length} {partners.length > 1 ? "co-travelers" : "co-traveler"} added
              </p>
              <p style={{ fontSize: 12.5, color: C.sub, margin: "2px 0 0" }}>
                {joinedCount > 0 ? `${joinedCount} joined so far` : "Tap to manage & send invites"}
              </p>
            </div>
            <ChevronRight size={18} color={C.sub} style={{ flexShrink: 0 }} />
          </>
        )}
      </button>

      {view === "list" && (
        <ManageSheet
          partners={partners}
          destination={destination}
          onClose={() => setView(null)}
          onWhatsApp={inviteViaWhatsApp}
          onContacts={handleContacts}
          onRemove={remove}
        />
      )}
      {view === "contacts" && (
        <MockContactsSheet onClose={() => setView(partners.length ? "list" : null)} onAdd={addContacts} />
      )}
    </div>
  );
}

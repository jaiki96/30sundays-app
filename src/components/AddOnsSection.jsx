import { useState } from "react";
import { IdCard, Wallet, ShieldCheck, X as XIcon, Check, FileText } from "lucide-react";
import { C } from "../data";

const ADD_ONS = [
  { key: "visa", label: "Visa", Icon: IdCard },
  { key: "forex", label: "Forex Card", Icon: Wallet },
  { key: "insurance", label: "Insurance", Icon: ShieldCheck },
];

// ─── Tile ───
function AddOnTile({ label, Icon, purchased, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "relative", flex: 1, background: purchased ? C.sBg : C.white,
        border: `${purchased ? 1.5 : 1}px solid ${purchased ? C.sBorder : C.div}`,
        borderRadius: 12, padding: "16px 10px", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
        fontFamily: "inherit", minHeight: 90,
      }}
    >
      {purchased && (
        <div style={{
          position: "absolute", top: 6, right: 6, width: 18, height: 18,
          borderRadius: "50%", background: C.sText, display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>
          <Check size={11} color="#fff" strokeWidth={3} />
        </div>
      )}
      <Icon size={28} color={C.p600} />
      <span style={{ fontSize: 13, fontWeight: 500, color: C.head, textAlign: "center" }}>{label}</span>
    </button>
  );
}

// ─── Sheet shell ───
function Sheet({ title, onClose, children, footer }) {
  const [closing, setClosing] = useState(false);
  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 220);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
    }}>
      <div
        onClick={handleClose}
        style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)",
          animation: closing ? "fadeOutBg 0.22s ease-out forwards" : "fadeInBg 0.2s ease-out",
        }}
      />
      <div style={{
        position: "relative", background: C.white, borderRadius: "16px 16px 0 0",
        maxHeight: "85vh", display: "flex", flexDirection: "column",
        animation: closing ? "sheetSlideDown 0.22s ease-out forwards" : "sheetSlideUp 0.25s ease-out",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px 20px 8px",
        }}>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: C.head, margin: 0 }}>{title}</h3>
          <button onClick={handleClose} style={{ width: 32, height: 32, borderRadius: "50%", background: C.bg, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <XIcon size={16} color={C.sub} />
          </button>
        </div>
        <div style={{ overflowY: "auto", padding: "0 20px 12px" }}>{children}</div>
        {footer && (
          <div style={{ padding: "12px 20px 24px", borderTop: `1px solid ${C.div}`, background: C.white }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Purchased footer ───
function IncludedPill({ label = "Included in your trip" }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      padding: "14px 16px", borderRadius: 999, background: C.sBg,
      border: `1px solid ${C.sBorder}`,
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%", background: C.sText,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Check size={12} color="#fff" strokeWidth={3} />
      </div>
      <span style={{ fontSize: 15, fontWeight: 600, color: C.sText }}>{label}</span>
    </div>
  );
}

// ─── Document row (purchased state) ───
function DocumentRow({ available, label, url }) {
  if (available) {
    return (
      <a href={url || "#"} target="_blank" rel="noreferrer" style={{
        display: "flex", alignItems: "center", gap: 12, padding: 14,
        background: C.white, border: `1px solid ${C.div}`, borderRadius: 12,
        textDecoration: "none", marginTop: 16,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, background: C.p100,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <FileText size={18} color={C.p600} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.head, margin: 0 }}>{label}</p>
          <p style={{ fontSize: 12, color: C.p600, margin: "2px 0 0", fontWeight: 500 }}>Tap to view</p>
        </div>
      </a>
    );
  }
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: 14,
      background: C.bg, borderRadius: 12, marginTop: 16,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, background: C.white,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <FileText size={18} color={C.inact} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: C.head, margin: 0 }}>{label}</p>
        <p style={{ fontSize: 12, color: C.sub, margin: "2px 0 0" }}>Available soon — we'll notify you.</p>
      </div>
    </div>
  );
}

// ─── Visa content ───
function VisaSheet({ state, onClose }) {
  const purchased = state?.purchased;
  return (
    <Sheet
      title="Visa"
      onClose={onClose}
      footer={purchased ? <IncludedPill label="Visa included" /> : (
        <button style={{
          width: "100%", padding: "14px 16px", borderRadius: 999, background: C.p600,
          color: "#fff", fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer",
          fontFamily: "inherit",
        }}>Get visa</button>
      )}
    >
      <div style={{
        background: C.p100, borderRadius: 16, height: 180, display: "flex",
        alignItems: "center", justifyContent: "center", margin: "8px 0 16px",
        fontSize: 48,
      }}>📄</div>

      <div style={{ background: C.bg, borderRadius: 14, padding: 16 }}>
        <h4 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: "0 0 10px" }}>Description</h4>
        <p style={{ fontSize: 14, color: C.head, margin: "0 0 12px", lineHeight: "21px" }}>
          We can guarantee your <b>Bali Tourist e-Visa</b> before you fly.
        </p>
        {!purchased && (
          <p style={{ fontSize: 14, color: C.head, margin: "0 0 12px" }}>
            Cost: <b>INR 3675 (inc TCS)</b>
          </p>
        )}
        <p style={{ fontSize: 14, color: C.head, margin: "0 0 10px" }}>Why it's worth it?</p>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: C.head, lineHeight: "22px" }}>
          <li><b>One-day processing</b> — paperwork sorted while you pack</li>
          <li><b>30-day stay</b> — perfect for your trip duration</li>
          <li>Official single-entry e-Visa issued by Indonesian Immigration</li>
          <li>No airport payment or currency hassles — everything's prepaid in INR</li>
        </ul>
      </div>

      {purchased && (
        <DocumentRow
          available={Boolean(state?.documentUrl)}
          url={state?.documentUrl}
          label="Your visa document"
        />
      )}
    </Sheet>
  );
}

// ─── Insurance content ───
function InsuranceSheet({ state, onClose }) {
  const purchased = state?.purchased;
  return (
    <Sheet
      title="Insurance"
      onClose={onClose}
      footer={purchased ? <IncludedPill label="Insurance included" /> : (
        <button style={{
          width: "100%", padding: "14px 16px", borderRadius: 999, background: C.p600,
          color: "#fff", fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer",
          fontFamily: "inherit",
        }}>Get insurance</button>
      )}
    >
      <div style={{
        background: C.p100, borderRadius: 16, height: 180, display: "flex",
        alignItems: "center", justifyContent: "center", margin: "8px 0 16px",
        fontSize: 48,
      }}>🛡️</div>

      <div style={{ background: C.bg, borderRadius: 14, padding: 16 }}>
        <h4 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: "0 0 10px" }}>
          Travel with confidence knowing you're covered
        </h4>
        <p style={{ fontSize: 14, color: C.head, margin: "0 0 14px", lineHeight: "21px" }}>
          Here are our comprehensive plans, offering enhanced protection and adventure-ready coverage for ultimate peace of mind. Valid for your trips to Indonesia, Thailand, Vietnam, Maldives, and Dubai.
        </p>
        <p style={{ fontSize: 13, fontWeight: 700, color: C.sub, margin: "0 0 8px", letterSpacing: 0.4 }}>
          30 SUNDAYS TRAVEL ONE
        </p>
        <ul style={{ margin: "0 0 10px", paddingLeft: 18, fontSize: 14, color: C.head, lineHeight: "22px" }}>
          <li>Medical Expenses: $50,000</li>
          <li>Trip Cancellation: $800</li>
          <li>Baggage Loss: $500</li>
        </ul>
        <p style={{ fontSize: 13, color: C.sub, margin: 0 }}>
          Details:{" "}
          <a href="https://t.ly/travel_one_insurance" target="_blank" rel="noreferrer" style={{ color: C.p600, fontWeight: 500 }}>
            https://t.ly/travel_one_insurance
          </a>
        </p>
      </div>

      {purchased && (
        <DocumentRow
          available={Boolean(state?.documentUrl)}
          url={state?.documentUrl}
          label="Your insurance policy"
        />
      )}
    </Sheet>
  );
}

// ─── Forex content (info-only) ───
function ForexSheet({ onClose }) {
  return (
    <Sheet title="Forex Card" onClose={onClose}>
      <div style={{
        background: C.p100, borderRadius: 16, height: 180, display: "flex",
        alignItems: "center", justifyContent: "center", margin: "8px 0 16px",
        fontSize: 48,
      }}>💱</div>
      <div style={{ background: C.bg, borderRadius: 14, padding: 16, marginBottom: 16 }}>
        <h4 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: "0 0 10px" }}>Spend smarter abroad</h4>
        <p style={{ fontSize: 14, color: C.head, margin: "0 0 12px", lineHeight: "21px" }}>
          Load multiple currencies on a single card and avoid messy conversions at your destination. Your travel consultant can help you set one up before you fly.
        </p>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: C.head, lineHeight: "22px" }}>
          <li>Zero markup on forex conversions</li>
          <li>Works at POS + ATMs worldwide</li>
          <li>Lock rates ahead of your trip</li>
          <li>Reload or refund unused balance anytime</li>
        </ul>
      </div>
    </Sheet>
  );
}

// ─── Main Section ───
export default function AddOnsSection({ addOns }) {
  const [openKey, setOpenKey] = useState(null);

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 18, fontWeight: 600, color: C.head, margin: "0 0 12px" }}>Add Ons</h4>
        <div style={{ display: "flex", gap: 10 }}>
          {ADD_ONS.map(({ key, label, Icon }) => {
            const purchased = key !== "forex" && addOns?.[key]?.purchased;
            return (
              <AddOnTile
                key={key}
                label={label}
                Icon={Icon}
                purchased={purchased}
                onClick={() => setOpenKey(key)}
              />
            );
          })}
        </div>
      </div>

      {openKey === "visa" && <VisaSheet state={addOns?.visa} onClose={() => setOpenKey(null)} />}
      {openKey === "insurance" && <InsuranceSheet state={addOns?.insurance} onClose={() => setOpenKey(null)} />}
      {openKey === "forex" && <ForexSheet onClose={() => setOpenKey(null)} />}
    </>
  );
}

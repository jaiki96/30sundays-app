import { useNavigate } from "react-router-dom";
import { ChevronRight, Wallet, HelpCircle, FileText, LogOut, User, Heart } from "lucide-react";
import { C } from "../data";

const settingsItems = [
  { icon: Wallet, label: "Wallet", color: C.p600, bg: C.p100 },
  { icon: HelpCircle, label: "Contact Support", color: C.p600, bg: C.p100 },
  { icon: FileText, label: "Terms & Conditions", color: C.p600, bg: C.p100 },
];

export default function Account({ userState, leadData, setUserState, setLeadData }) {
  const navigate = useNavigate();
  const isLoggedIn = userState !== "new";

  const handleLogout = () => {
    setUserState("new");
    setLeadData(null);
    navigate("/");
  };

  const formatPhone = (data) => {
    if (!data) return "";
    const p = data.phone;
    // Format as XXXXX XXXXX for 10-digit
    if (p.length === 10) return `${data.countryCode} ${p.slice(0, 5)} ${p.slice(5)}`;
    return `${data.countryCode} ${p}`;
  };

  return (
    <div style={{ minHeight: "100%", background: `linear-gradient(180deg, ${C.p100}55 0%, ${C.bg} 12%)` }}>
      {/* Header */}
      <div style={{ padding: "12px 16px 16px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: C.head }}>My Account</h2>
      </div>

      {/* Profile card or Login CTA */}
      <div style={{ padding: "0 16px 20px" }}>
        {isLoggedIn && leadData ? (
          <div style={{
            display: "flex", alignItems: "center", gap: 14, padding: "18px 16px",
            borderRadius: 16, background: C.white,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            border: `1px solid ${C.div}`,
          }}>
            {/* Avatar */}
            <div style={{
              width: 52, height: 52, borderRadius: "50%", background: C.p100,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              border: `2px solid ${C.p300}`,
            }}>
              <User size={24} color={C.p600} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 17, fontWeight: 600, color: C.head, margin: 0 }}>{leadData.name}</p>
              <p style={{ fontSize: 13, color: C.sub, margin: "2px 0 0" }}>{formatPhone(leadData)}</p>
            </div>
            <ChevronRight size={18} color={C.inact} />
          </div>
        ) : (
          <div style={{
            padding: "24px 20px", borderRadius: 16, background: C.white,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            border: `1px solid ${C.div}`, textAlign: "center",
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%", background: C.p100,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px", border: `2px solid ${C.p300}`,
            }}>
              <User size={26} color={C.p600} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.head, margin: "0 0 4px" }}>
              Welcome to 30 Sundays
            </h3>
            <p style={{ fontSize: 13, color: C.sub, margin: "0 0 16px", lineHeight: "18px" }}>
              Log in to access your trips, saved itineraries & more
            </p>
            <button
              onClick={() => navigate("/plan?return=account")}
              style={{
                width: "100%", padding: "13px 0", borderRadius: 12, border: "none",
                background: C.p600, color: "#fff", fontSize: 15, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 16px rgba(227,27,83,0.3)",
              }}
            >
              Log in / Sign up
            </button>
          </div>
        )}
      </div>

      {/* Settings */}
      <div style={{ padding: "0 16px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.head, marginBottom: 12 }}>Settings</h3>
        <div style={{
          borderRadius: 16, background: C.white, overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          border: `1px solid ${C.div}`,
        }}>
          {settingsItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                style={{
                  display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "16px",
                  background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                  borderBottom: i < settingsItems.length - 1 ? `1px solid ${C.div}` : "none",
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12, background: item.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon size={18} color={item.color} />
                </div>
                <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: C.head, textAlign: "left" }}>{item.label}</span>
                <ChevronRight size={16} color={C.inact} />
              </button>
            );
          })}

          {/* Logout — only when logged in */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              style={{
                display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "16px",
                background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                borderTop: `1px solid ${C.div}`,
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12, background: C.p100,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <LogOut size={18} color={C.p600} />
              </div>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: C.head, textAlign: "left" }}>Logout</span>
              <ChevronRight size={16} color={C.inact} />
            </button>
          )}
        </div>
      </div>

      {/* Made with love footer */}
      <div style={{ textAlign: "center", padding: "32px 0 100px" }}>
        <p style={{ fontSize: 11, color: C.inact, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          Made with <Heart size={10} color={C.p600} fill={C.p600} /> for couples who love to travel
        </p>
      </div>
    </div>
  );
}

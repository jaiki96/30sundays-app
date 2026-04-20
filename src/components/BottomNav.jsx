import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Compass, Map, Briefcase, User } from "lucide-react";
import { C } from "../data";

const tabs = [
  { to: "/", label: "Explore", icon: Compass },
  { to: "/plan", label: "My Plans", icon: Map },
  { to: "/trips", label: "My Trips", icon: Briefcase },
  { to: "/account", label: "Account", icon: User },
];

// Top-level paths that always show the nav
const showOn = new Set(["/", "/trips", "/account"]);

export default function BottomNav({ userState }) {
  const { pathname } = useLocation();

  // Show nav on main tabs + Plan page for lead users (showing itineraries)
  const visible = showOn.has(pathname) || (pathname === "/plan" && userState === "lead");
  if (!visible) return null;

  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: C.white, borderTop: `1px solid ${C.div}`, display: "flex", paddingTop: 6, paddingBottom: 26, zIndex: 20 }}>
      {tabs.map(tab => {
        const Icon = tab.icon;
        const on = tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, textDecoration: "none", padding: "4px 0", position: "relative" }}
          >
            {on && <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", width: 18, height: 3, borderRadius: 2, background: C.p600 }} />}
            <Icon size={20} color={on ? C.p600 : C.inact} strokeWidth={on ? 2.2 : 1.8} />
            <span style={{ fontSize: 12, fontWeight: on ? 600 : 500, color: on ? C.p600 : C.inact }}>{tab.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
}

import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { C } from "../data";

export default function SectionHeader({ emoji, title, sub, linkTo, linkLabel = "View all" }) {
  return (
    <div style={{ padding: "0 16px", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {emoji && <span style={{ fontSize: 18 }}>{emoji}</span>}
          <span style={{ fontSize: 18, fontWeight: 700, color: C.head }}>{title}</span>
          <ChevronRight size={18} color={C.inact} style={{ marginLeft: -2 }} />
        </div>
        {linkTo && (
          <Link to={linkTo} style={{ fontSize: 14, fontWeight: 600, color: C.p600, textDecoration: "none", display: "flex", alignItems: "center", gap: 2 }}>
            {linkLabel} <ChevronRight size={15} color={C.p600} />
          </Link>
        )}
      </div>
      {sub && <p style={{ fontSize: 14, color: C.sub, marginTop: 3 }}>{sub}</p>}
    </div>
  );
}

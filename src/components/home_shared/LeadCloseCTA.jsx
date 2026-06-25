import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { C } from "../../data";
import { SERIF } from "./sharedStyle";

// Closing lead-generation band. Routes to /build (the wizard that captures
// destination, dates and party). Mirrors the live home's "Plan My Trip" CTA.
export default function LeadCloseCTA({ tone = "clean", pad = 16 }) {
  if (tone === "editorial") {
    return (
      <div style={{ padding: `4px ${pad}px 8px` }}>
        <div style={{ borderTop: `1px solid ${C.head}`, paddingTop: 20, textAlign: "center" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: C.head, margin: "0 0 6px", letterSpacing: "-0.3px" }}>
            Ready to plan your getaway?
          </h2>
          <p style={{ fontSize: 13.5, color: C.sub, margin: "0 0 18px" }}>Tell us where you'd love to go. We'll craft it for two.</p>
          <Link to="/build" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.head, color: "#fff", borderRadius: 999, padding: "14px 26px", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
            Plan my trip <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div style={{ padding: `0 ${pad}px` }}>
      <div style={{ background: C.p100, borderRadius: 18, padding: "24px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: 19, fontWeight: 800, color: C.head, margin: "0 0 5px", letterSpacing: "-0.3px" }}>
          Ready to plan your getaway?
        </h2>
        <p style={{ fontSize: 13, color: C.sub, margin: "0 0 16px" }}>Tell us where you'd love to go. We'll craft it for two.</p>
        <Link to="/build" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.p600, color: "#fff", borderRadius: 12, padding: "13px 26px", fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 18px rgba(227,27,83,0.3)" }}>
          Plan my trip <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

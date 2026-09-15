import { useParams, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { C } from "../data";
import { GUIDELINES, getDest } from "../data/communityData";
import { Screen, Body, TopBar } from "../components/Gift/GiftUI";
import { PAD, CARD } from "../components/Community/CommunityUI";

// Pinned and locked. Five rules, no reply action anywhere on the screen.

export default function CommunityGuidelines() {
  const { dest = "bali" } = useParams();
  const navigate = useNavigate();
  const d = getDest(dest);

  return (
    <Screen>
      <TopBar title="Community guidelines" onBack={() => navigate(`/community/${dest}`)} />
      <Body>
        <div style={{ padding: `12px ${PAD}px 40px` }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 11px",
            borderRadius: 999, background: C.bg, marginBottom: 14,
          }}>
            <Lock size={13} color={C.inact} />
            <span style={{ fontSize: 12, fontWeight: 600, color: C.sub }}>Pinned by our team</span>
          </div>

          <p style={{ fontSize: 14.5, color: C.head, margin: "0 0 18px", lineHeight: "22px" }}>
            This is a room full of couples planning the same trip as you two. Five things
            keep it useful for everyone.
          </p>

          <div style={{ ...CARD, overflow: "hidden" }}>
            {GUIDELINES.map(([title, body], i) => (
              <div key={title} style={{
                display: "flex", gap: 14, padding: 16,
                borderTop: i ? `1px solid ${C.div}` : "none",
              }}>
                <span style={{
                  width: 26, height: 26, borderRadius: "50%", background: C.p100, flexShrink: 0,
                  display: "grid", placeItems: "center", fontSize: 12.5, fontWeight: 800, color: C.p600,
                }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: C.head, margin: 0 }}>{title}</p>
                  <p style={{ fontSize: 13.5, color: C.sub, margin: "4px 0 0", lineHeight: "20px" }}>{body}</p>
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12.5, color: C.inact, margin: "16px 2px 0", lineHeight: "18px" }}>
            Our team reads {d.name} every day. If something here does not sit right with you
            both, tell your consultant and they will pass it on.
          </p>
        </div>
      </Body>
    </Screen>
  );
}

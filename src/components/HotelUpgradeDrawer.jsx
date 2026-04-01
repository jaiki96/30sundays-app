import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Star, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { C } from "../data";

/* ── rating badge (booking.com style) ── */
const RatingBadge = ({ score }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
    <span style={{
      background: "#003580", color: "#fff", borderRadius: "6px 6px 6px 0",
      padding: "2px 6px", fontWeight: 700, fontSize: 12, lineHeight: "16px",
    }}>{score}</span>
  </span>
);

/**
 * HotelUpgradeDrawer — bottom drawer overlay for hotel upgrades.
 *
 * Props:
 *   upgrades — array from getUpgradeInfo().upgrades
 *   totalAdditional — total additional cost
 *   onClose — close handler
 */
export default function HotelUpgradeDrawer({ upgrades, totalAdditional, onClose }) {
  const [expanded, setExpanded] = useState(null);

  const phoneFrame = document.getElementById("phone-frame");

  if (!upgrades || upgrades.length === 0) return null;

  const drawerContent = (
    <>
      {/* keyframes — injected once */}
      <style>{`
        @keyframes huSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes huFadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{
        position: "absolute", inset: 0, zIndex: 100,
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
      }}>
        {/* scrim */}
        <div onClick={onClose} style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)",
        }} />

        {/* drawer */}
        <div style={{
          position: "relative", background: "#FAFAFA", borderRadius: "20px 20px 0 0",
          maxHeight: "82vh", overflowY: "auto",
          animation: "huSlideUp 0.35s ease both",
        }}>
          {/* handle */}
          <div style={{ padding: "12px 0 4px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: C.div }} />
          </div>

          {/* header — white bg, light grey border */}
          <div style={{
            padding: "16px 20px 18px", background: C.white,
            borderBottom: `1px solid ${C.div}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: C.p600,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(227,27,83,0.25)",
              }}>
                <Sparkles size={15} color="#fff" strokeWidth={2.5} />
              </div>
              <div>
                <h3 style={{
                  fontSize: 18, fontWeight: 700, color: C.head, lineHeight: "22px",
                  letterSpacing: "-0.2px", display: "flex", alignItems: "center", gap: 3,
                }}>
                  Upgrade to 5<Star size={12} fill="#F5A623" stroke="#F5A623" strokeWidth={1.5} /> Hotels
                </h3>
                <p style={{ fontSize: 12, color: C.sub, lineHeight: "16px", marginTop: 2 }}>
                  {upgrades.length === 1
                    ? "1 hotel in your itinerary can be upgraded"
                    : `${upgrades.length} hotels in your itinerary can be upgraded`}
                </p>
              </div>
            </div>
          </div>

          {/* accordions */}
          <div style={{ padding: "16px 20px 8px" }}>
            {upgrades.map((u, idx) => {
              const isOpen = expanded === idx;
              const up = u.upgrade;
              return (
                <div key={idx} style={{
                  border: `1px solid ${isOpen ? C.p300 : "#EBEBEB"}`,
                  borderRadius: 14, marginBottom: 14, overflow: "hidden",
                  background: C.white,
                  boxShadow: isOpen ? "0 4px 16px rgba(227,27,83,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
                  transition: "all 0.25s ease",
                }}>
                  {/* collapsed: current hotel info */}
                  <div
                    onClick={() => setExpanded(isOpen ? null : idx)}
                    style={{ padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}
                  >
                    <img src={u.current.img} alt="" style={{
                      width: 52, height: 52, borderRadius: 10, objectFit: "cover",
                      border: `1px solid ${C.div}`, flexShrink: 0,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: C.head, lineHeight: "18px" }}>
                        {u.current.name}{" "}
                        <span style={{ fontSize: 11, color: C.sub, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 1 }}>
                          {u.current.stars}<Star size={8} fill="#F5A623" stroke="#F5A623" strokeWidth={1.5} />
                        </span>
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                        <span style={{ fontSize: 11, color: C.sub, lineHeight: "14px" }}>{u.current.type}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <RatingBadge score={u.current.rating} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.p600 }}>
                          +₹{u.totalDelta.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp size={18} color={C.inact} style={{ marginTop: 4 }} />
                    ) : (
                      <ChevronDown size={18} color={C.inact} style={{ marginTop: 4 }} />
                    )}
                  </div>

                  {/* expanded: upgrade hotel */}
                  {isOpen && (
                    <div style={{ padding: "0 14px 14px", animation: "huFadeUp 0.3s ease both" }}>
                      <div style={{ height: 1, background: C.div, marginBottom: 12 }} />
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: C.p600,
                        textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8,
                      }}>Upgrade to</span>
                      <div style={{
                        display: "flex", gap: 12, padding: 12, borderRadius: 12,
                        border: `1.5px solid ${C.p300}`, background: "#FAFAFA",
                      }}>
                        <img src={up.img} alt="" style={{
                          width: 80, height: 80, borderRadius: 10, objectFit: "cover", flexShrink: 0,
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: C.p600, lineHeight: "18px" }}>
                            {up.name}{" "}
                            <span style={{ fontSize: 11, color: C.sub, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 1 }}>
                              5<Star size={8} fill="#F5A623" stroke="#F5A623" strokeWidth={1.5} />
                            </span>
                          </p>
                          <p style={{ fontSize: 11, color: C.sub, marginTop: 2, lineHeight: "14px" }}>{up.type}</p>
                          <div style={{ marginTop: 4 }}>
                            <RatingBadge score={up.rating} />
                          </div>
                        </div>
                      </div>
                      <div style={{
                        marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "10px 12px", background: C.bg, borderRadius: 8, border: `1px solid ${C.div}`,
                      }}>
                        <span style={{ fontSize: 12, color: C.sub, fontWeight: 500 }}>
                          Total additional cost ({u.nights}N)
                        </span>
                        <span style={{ fontSize: 16, fontWeight: 700, color: C.p600 }}>
                          +₹{u.totalDelta.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* combined cost footer (2+ upgrades) */}
          {upgrades.length >= 2 && (
            <div style={{
              margin: "0 20px 8px", padding: "14px 16px",
              background: C.p100, borderRadius: 12, border: `1px solid ${C.p300}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <span style={{
                  fontSize: 13, fontWeight: 600, color: C.head,
                  display: "flex", alignItems: "center", gap: 2, lineHeight: "18px",
                }}>
                  Upgrade all {upgrades.length} hotels to 5<Star size={10} fill="#F5A623" stroke="#F5A623" strokeWidth={1.5} />
                </span>
                <span style={{ fontSize: 11, color: C.sub, display: "block", marginTop: 2 }}>
                  Total additional cost
                </span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: C.p600, lineHeight: "22px" }}>
                +₹{totalAdditional.toLocaleString("en-IN")}
              </span>
            </div>
          )}

          {/* footer */}
          <div style={{ padding: "16px 20px 32px", textAlign: "center" }}>
            <p style={{ fontSize: 12, color: C.sub, lineHeight: "18px", fontWeight: 500 }}>
              Interested? Discuss these upgrades with your travel expert on your next call.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  // Portal into phone-frame so overlay is contained within the device mockup
  return phoneFrame ? createPortal(drawerContent, phoneFrame) : drawerContent;
}

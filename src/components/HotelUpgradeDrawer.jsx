import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Star, Sparkles, ChevronDown, ChevronUp, Check } from "lucide-react";
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
 * HotelUpgradeDrawer, bottom drawer overlay for hotel upgrades.
 *
 * Props:
 *   upgrades, array from getUpgradeInfo().upgrades
 *   totalAdditional, total additional cost
 *   onClose, close handler
 */
export default function HotelUpgradeDrawer({ upgrades, totalAdditional, onClose }) {
  const [expanded, setExpanded] = useState(0);
  const [upgraded, setUpgraded] = useState(() => new Set()); // set of cityIndex that user upgraded

  const phoneFrame = document.getElementById("phone-frame");

  if (!upgrades || upgrades.length === 0) return null;

  const isUpgraded = (u) => upgraded.has(u.cityIndex);
  const remaining = upgrades.filter(u => !isUpgraded(u));
  const remainingTotal = remaining.reduce((s, u) => s + u.totalDelta, 0);
  const doneCount = upgrades.length - remaining.length;
  const allUpgraded = remaining.length === 0;

  const upgradeOne = (u) => {
    setUpgraded(prev => new Set(prev).add(u.cityIndex));
    setExpanded(null);
  };
  const undoOne = (u) => setUpgraded(prev => { const n = new Set(prev); n.delete(u.cityIndex); return n; });
  const upgradeAll = () => setUpgraded(new Set(upgrades.map(u => u.cityIndex)));

  const drawerContent = (
    <>
      {/* keyframes, injected once */}
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

          {/* header, white bg, light grey border */}
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
                  {allUpgraded
                    ? `All ${upgrades.length} hotels upgraded to 5★`
                    : doneCount > 0
                      ? `${doneCount} of ${upgrades.length} upgraded`
                      : upgrades.length === 1
                        ? "1 hotel in your itinerary can be upgraded"
                        : `${upgrades.length} hotels in your itinerary can be upgraded`}
                </p>
              </div>
            </div>
          </div>

          {/* accordions */}
          <div style={{ padding: "16px 20px 8px" }}>
            {upgrades.map((u, idx) => {
              const done = isUpgraded(u);
              const isOpen = expanded === idx && !done;
              const up = u.upgrade;

              // ── Upgraded confirmation card ──
              if (done) {
                return (
                  <div key={idx} style={{
                    border: "1px solid #ABEFC6", borderRadius: 14, marginBottom: 14,
                    background: "#F6FEF9", padding: "12px 14px",
                    display: "flex", alignItems: "center", gap: 12,
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%", background: "#16A34A", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Check size={18} color="#fff" strokeWidth={3} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#067647", lineHeight: "16px" }}>
                        Upgraded to {up.name}
                      </p>
                      <p style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>
                        5★ · {up.type} · +₹{u.totalDelta.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <button onClick={() => undoOne(u)} style={{
                      background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                      fontSize: 12, fontWeight: 600, color: C.sub, flexShrink: 0, padding: 4,
                    }}>Undo</button>
                  </div>
                );
              }

              // ── Upgradeable accordion ──
              return (
                <div key={idx} style={{
                  border: `1px solid ${isOpen ? C.p300 : "#EBEBEB"}`,
                  borderRadius: 14, marginBottom: 14, overflow: "hidden",
                  background: C.white,
                  boxShadow: isOpen ? "0 4px 16px rgba(227,27,83,0.10)" : "0 1px 4px rgba(0,0,0,0.04)",
                  transition: "all 0.25s ease",
                }}>
                  {/* collapsed: current hotel info, tap to see details */}
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
                          Upgrade +₹{u.totalDelta.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp size={18} color={C.inact} style={{ marginTop: 4 }} />
                    ) : (
                      <ChevronDown size={18} color={C.inact} style={{ marginTop: 4 }} />
                    )}
                  </div>

                  {/* expanded: upgrade hotel details + action */}
                  {isOpen && (
                    <div style={{ padding: "0 14px 14px", animation: "huFadeUp 0.3s ease both" }}>
                      <div style={{ height: 1, background: C.div, marginBottom: 12 }} />
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: C.p600,
                        textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8,
                      }}>Upgrade to</span>
                      <div style={{
                        padding: 12, borderRadius: 12,
                        border: `1.5px solid ${C.p300}`, background: "linear-gradient(135deg, #FFF7F9 0%, #FFEBF1 100%)",
                        boxShadow: "0 2px 10px rgba(227,27,83,0.10)",
                      }}>
                        <div style={{ display: "flex", gap: 12 }}>
                          <img src={up.img} alt="" style={{
                            width: 80, height: 80, borderRadius: 10, objectFit: "cover", flexShrink: 0,
                          }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 14, fontWeight: 700, color: C.head, lineHeight: "18px" }}>
                              {up.name}{" "}
                              <span style={{ fontSize: 11, color: C.sub, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 1 }}>
                                5<Star size={8} fill="#F5A623" stroke="#F5A623" strokeWidth={1.5} />
                              </span>
                            </p>
                            <p style={{ fontSize: 11, color: C.sub, marginTop: 2, lineHeight: "14px" }}>{up.type}</p>
                            <div style={{ marginTop: 6 }}>
                              <RatingBadge score={up.rating} />
                            </div>
                            <div style={{ marginTop: 6, display: "flex", alignItems: "baseline", gap: 6 }}>
                              <span style={{ fontSize: 15, fontWeight: 700, color: C.p600 }}>
                                +₹{u.totalDelta.toLocaleString("en-IN")}
                              </span>
                              <span style={{ fontSize: 10, color: C.sub }}>for {u.nights} nights</span>
                            </div>
                          </div>
                        </div>

                        {/* perks — the "details" revealed on tap */}
                        {up.perks?.length > 0 && (
                          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                            {up.perks.map((p, pi) => (
                              <div key={pi} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <Check size={13} color="#16A34A" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                                <span style={{ fontSize: 12, color: C.head, lineHeight: "16px" }}>{p}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* upgrade action */}
                        <button onClick={() => upgradeOne(u)} style={{
                          width: "100%", marginTop: 12, padding: "11px 0", borderRadius: 10, border: "none",
                          background: C.p600, color: "#fff", fontSize: 14, fontWeight: 700,
                          cursor: "pointer", fontFamily: "inherit",
                        }}>
                          Upgrade · +₹{u.totalDelta.toLocaleString("en-IN")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* sticky bottom action */}
          <div style={{ padding: "8px 20px 28px" }}>
            {allUpgraded ? (
              <div style={{
                padding: "14px 16px", borderRadius: 12, border: "1px solid #ABEFC6", background: "#F6FEF9",
                display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", background: "#16A34A", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Check size={18} color="#fff" strokeWidth={3} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#067647", lineHeight: "16px" }}>
                    All hotels upgraded to 5★
                  </p>
                  <p style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>
                    Added +₹{totalAdditional.toLocaleString("en-IN")} to your trip total
                  </p>
                </div>
              </div>
            ) : (
              upgrades.length >= 2 && remaining.length >= 2 && (
                <button onClick={upgradeAll} style={{
                  width: "100%", padding: "14px 16px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg, #E0A815 0%, #B8860B 100%)", color: "#fff",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(184,134,11,0.3)",
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                    Upgrade all {remaining.length} hotels to 5<Star size={11} fill="#fff" stroke="#fff" strokeWidth={1.5} />
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>+₹{remainingTotal.toLocaleString("en-IN")}</span>
                </button>
              )
            )}
            <button onClick={onClose} style={{
              width: "100%", marginTop: 10, padding: "12px 0", borderRadius: 12,
              border: `1px solid ${C.div}`, background: C.white, color: C.head,
              fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>
              {doneCount > 0 ? "Done" : "Maybe later"}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Portal into phone-frame so overlay is contained within the device mockup
  return phoneFrame ? createPortal(drawerContent, phoneFrame) : drawerContent;
}

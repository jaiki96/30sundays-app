import { useState, useRef, useEffect } from "react";
import { X as XIcon, Check } from "lucide-react";
import { C } from "../data";

const paceLabels = { relaxed: "Relaxed", balanced: "Balanced", active: "Active" };
const paceIcons = { relaxed: "🧘", balanced: "⚖️", active: "🏃" };
const crowdLabels = { low: "Low crowds", moderate: "Moderate", high: "Busy" };
const crowdIcons = { low: "👥", moderate: "👥", high: "👥" };

export default function ChangeDaySheet({ dayData, onSelect, onClose }) {
  const [closing, setClosing] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const carouselRef = useRef(null);

  if (!dayData) return null;

  const { dayNumber, city, contextLine, options, fixedElements } = dayData;

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 280);
  };

  const handleSelect = (option) => {
    if (option.isCurrent) return;
    setClosing(true);
    setTimeout(() => onSelect(option), 280);
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const cardWidth = 264; // 248 + 16 gap
    const idx = Math.round(scrollLeft / cardWidth);
    setActiveCard(Math.min(idx, options.length - 1));
  };

  // Show any price delta?
  const hasAnyPriceDelta = options.some(o => o.priceDelta !== 0);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 390, height: 844, borderRadius: 44,
          background: "rgba(0,0,0,0.45)",
          zIndex: 100,
          animation: closing ? "fadeOutBg 0.28s ease-out forwards" : "fadeInBg 0.28s ease-out forwards",
        }}
      />

      {/* Bottom Sheet */}
      <div
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          width: 390,
          height: 844,
          transform: "translate(-50%, -50%)",
          zIndex: 101,
          pointerEvents: "none",
          borderRadius: 44,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            maxHeight: "75%",
            background: C.white,
            borderRadius: "24px 24px 0 0",
            display: "flex",
            flexDirection: "column",
            pointerEvents: "auto",
            animation: closing ? "sheetSlideDown 0.28s ease-in forwards" : "sheetSlideUp 0.32s ease-out forwards",
          }}
        >
          {/* Drag indicator */}
          <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 0" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: C.div }} />
          </div>

          {/* Header */}
          <div style={{ padding: "12px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: C.head, margin: 0 }}>
                Change Day {dayNumber} — {city}
              </p>
              <p style={{ fontSize: 13, color: C.sub, margin: "4px 0 0", lineHeight: "17px" }}>
                {contextLine}
              </p>
            </div>
            <button
              onClick={handleClose}
              style={{
                width: 32, height: 32, borderRadius: "50%", border: "none",
                background: C.bg, display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer", flexShrink: 0, marginLeft: 8,
              }}
            >
              <XIcon size={16} color={C.sub} />
            </button>
          </div>

          {/* Carousel */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="hs hide-scrollbar"
            style={{
              gap: 14, padding: "14px 16px 6px", scrollSnapType: "x mandatory",
              overflowX: "auto", overflowY: "hidden", flexShrink: 0,
            }}
          >
            {options.map((opt, i) => (
              <div
                key={opt.id}
                style={{
                  width: 248, minWidth: 248, flexShrink: 0,
                  borderRadius: 14,
                  border: `1.5px solid ${opt.isCurrent ? C.p300 : C.div}`,
                  overflow: "hidden",
                  background: C.white,
                  scrollSnapAlign: "start",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Hero image */}
                <div style={{ position: "relative", height: 140, overflow: "hidden" }}>
                  <img
                    src={opt.heroImage}
                    alt={opt.vibeLabel}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
                    padding: "20px 10px 8px",
                  }}>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                      Option {i + 1} of {options.length}
                    </span>
                  </div>
                  {opt.isCurrent && (
                    <div style={{
                      position: "absolute", top: 8, right: 8,
                      background: C.p600, borderRadius: 10, padding: "3px 8px",
                      fontSize: 10, fontWeight: 600, color: "#fff",
                    }}>
                      Current
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div style={{ padding: "10px 12px 12px", flex: 1, display: "flex", flexDirection: "column" }}>
                  {/* Vibe label */}
                  <p style={{ fontSize: 13, fontWeight: 700, color: C.head, margin: "0 0 6px" }}>
                    {opt.vibeLabel}
                  </p>

                  {/* Activities */}
                  <div style={{ marginBottom: 8 }}>
                    {opt.activities.slice(0, 4).map((act, j) => (
                      <p key={j} style={{ fontSize: 12, color: C.sub, margin: "0 0 2px", lineHeight: "16px" }}>
                        • {act}
                      </p>
                    ))}
                    {opt.activities.length > 4 && (
                      <p style={{ fontSize: 11, color: C.p600, fontWeight: 600, margin: "2px 0 0" }}>
                        +{opt.activities.length - 4} more
                      </p>
                    )}
                  </div>

                  {/* Scoring row */}
                  <div style={{
                    display: "flex", flexWrap: "wrap", gap: "4px 10px",
                    padding: "6px 0", borderTop: `1px solid ${C.div}`, borderBottom: `1px solid ${C.div}`,
                    marginBottom: 8,
                  }}>
                    <span style={{ fontSize: 11, color: C.sub }}>
                      {paceIcons[opt.scoring.pace]} {paceLabels[opt.scoring.pace]}
                    </span>
                    <span style={{ fontSize: 11, color: C.sub }}>
                      ⏱ {opt.scoring.activityHours} Hrs
                    </span>
                    <span style={{ fontSize: 11, color: C.sub }}>
                      {crowdIcons[opt.scoring.crowdLevel]} {crowdLabels[opt.scoring.crowdLevel]}
                    </span>
                    <span style={{ fontSize: 11, color: C.sub }}>
                      🚗 {opt.scoring.travelHours} Hr{opt.scoring.travelHours !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Price delta */}
                  {hasAnyPriceDelta && (
                    <p style={{
                      fontSize: 13, fontWeight: 600, margin: "0 0 8px",
                      color: opt.priceDelta > 0 ? "#D92D20" : opt.priceDelta < 0 ? "#039855" : C.sub,
                    }}>
                      {opt.priceDelta === 0
                        ? "Same price"
                        : opt.priceDelta > 0
                          ? `+₹${opt.priceDelta.toLocaleString("en-IN")}`
                          : `−₹${Math.abs(opt.priceDelta).toLocaleString("en-IN")}`
                      }
                    </p>
                  )}

                  {/* CTA */}
                  <div style={{ marginTop: "auto" }}>
                    {opt.isCurrent ? (
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        padding: "10px 0", borderRadius: 10,
                        border: `1.5px solid ${C.p600}`, background: C.white,
                        fontSize: 13, fontWeight: 600, color: C.p600,
                      }}>
                        <Check size={14} color={C.p600} />
                        Currently Selected
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSelect(opt)}
                        style={{
                          width: "100%", padding: "10px 0", borderRadius: 10, border: "none",
                          background: C.p600, color: "#fff",
                          fontSize: 13, fontWeight: 600, cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Choose This Day
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 5, padding: "4px 0 8px" }}>
            {options.map((_, i) => (
              <div key={i} style={{
                width: activeCard === i ? 16 : 6, height: 6,
                borderRadius: 3, background: activeCard === i ? C.p600 : C.div,
                transition: "all 0.2s ease",
              }} />
            ))}
          </div>

          {/* Fixed elements */}
          {fixedElements.length > 0 && (
            <div style={{
              margin: "0 16px 16px", padding: 12, borderRadius: 12,
              background: C.bg,
            }}>
              <p style={{
                fontSize: 11, fontWeight: 700, color: C.sub,
                textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px",
              }}>
                Stays the same
              </p>
              {fixedElements.map((el, i) => (
                <p key={i} style={{ fontSize: 13, color: C.head, margin: "0 0 2px" }}>
                  {el.icon} {el.text}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

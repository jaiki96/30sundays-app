import { useState } from "react";
import { ChevronDown, ChevronUp, Edit3, Minus, Plus, Calendar } from "lucide-react";
import { C } from "../data";

export default function FilterBar({ filters, setFilters }) {
  const [expanded, setExpanded] = useState(false);
  const hasFilters = filters.nights || filters.dates || filters.travelers !== 2;

  const nightOptions = [3, 4];
  const monthOptions = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const handleNightSelect = (n) => {
    setFilters(prev => ({ ...prev, nights: prev.nights === n ? null : n }));
  };

  const handleMonthSelect = (m) => {
    setFilters(prev => ({ ...prev, dates: prev.dates === m ? null : m, dateType: "flexible" }));
  };

  const handleTravelers = (delta) => {
    setFilters(prev => ({ ...prev, travelers: Math.max(1, Math.min(6, prev.travelers + delta)) }));
  };

  const handleApply = () => {
    setExpanded(false);
  };

  const handleClear = () => {
    setFilters({ nights: null, dates: null, dateType: null, travelers: 2 });
    setExpanded(false);
  };

  // Collapsed summary
  if (hasFilters && !expanded) {
    return (
      <div style={{
        margin: "0 16px", padding: "10px 14px", borderRadius: 12,
        background: C.white, border: `1px solid ${C.div}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Calendar size={14} color={C.p600} />
          <span style={{ fontSize: 13, fontWeight: 600, color: C.head }}>
            {filters.nights ? `${filters.nights}N` : ""}
            {filters.dates ? ` · ${filters.dates}` : ""}
            {` · ${filters.travelers} Adult${filters.travelers > 1 ? "s" : ""}`}
          </span>
        </div>
        <button onClick={() => setExpanded(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <Edit3 size={15} color={C.p600} />
        </button>
      </div>
    );
  }

  // Collapsed prompt
  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        style={{
          margin: "0 16px", padding: "12px 14px", borderRadius: 12, width: "calc(100% - 32px)",
          background: C.white, border: `1px solid ${C.div}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: 13, color: C.sub, fontWeight: 500 }}>
          Select nights & dates to see personalized options
        </span>
        <ChevronDown size={16} color={C.inact} />
      </button>
    );
  }

  // Expanded state
  return (
    <div style={{
      margin: "0 16px", padding: "14px", borderRadius: 14,
      background: C.white, border: `1px solid ${C.div}`,
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.head }}>Customize your search</span>
        <button onClick={() => setExpanded(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
          <ChevronUp size={16} color={C.inact} />
        </button>
      </div>

      {/* Nights */}
      <div style={{ marginBottom: 14 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 8, display: "block" }}>Nights</span>
        <div style={{ display: "flex", gap: 8 }}>
          {nightOptions.map(n => (
            <button
              key={n}
              onClick={() => handleNightSelect(n)}
              style={{
                padding: "6px 20px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                border: filters.nights === n ? `1.5px solid ${C.p600}` : `1px solid ${C.div}`,
                background: filters.nights === n ? C.p100 : C.white,
                color: filters.nights === n ? C.p600 : C.sub,
                cursor: "pointer",
              }}
            >
              {n}N
            </button>
          ))}
        </div>
      </div>

      {/* Dates, Flexible month selector */}
      <div style={{ marginBottom: 14 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 8, display: "block" }}>Flexible dates</span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {monthOptions.map(m => (
            <button
              key={m}
              onClick={() => handleMonthSelect(m)}
              style={{
                padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                border: filters.dates === m ? `1.5px solid ${C.p600}` : `1px solid ${C.div}`,
                background: filters.dates === m ? C.p100 : C.white,
                color: filters.dates === m ? C.p600 : C.sub,
                cursor: "pointer",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Travelers */}
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 8, display: "block" }}>Travelers</span>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={() => handleTravelers(-1)}
            disabled={filters.travelers <= 1}
            style={{
              width: 32, height: 32, borderRadius: 16, border: `1px solid ${C.div}`,
              background: C.white, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: filters.travelers <= 1 ? "not-allowed" : "pointer", opacity: filters.travelers <= 1 ? 0.4 : 1,
            }}
          >
            <Minus size={14} color={C.sub} />
          </button>
          <span style={{ fontSize: 15, fontWeight: 600, color: C.head, minWidth: 60, textAlign: "center" }}>
            {filters.travelers} Adult{filters.travelers > 1 ? "s" : ""}
          </span>
          <button
            onClick={() => handleTravelers(1)}
            disabled={filters.travelers >= 6}
            style={{
              width: 32, height: 32, borderRadius: 16, border: `1px solid ${C.div}`,
              background: C.white, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: filters.travelers >= 6 ? "not-allowed" : "pointer", opacity: filters.travelers >= 6 ? 0.4 : 1,
            }}
          >
            <Plus size={14} color={C.sub} />
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={handleClear}
          style={{
            flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 13, fontWeight: 600,
            border: `1px solid ${C.div}`, background: C.white, color: C.sub, cursor: "pointer",
          }}
        >
          Clear
        </button>
        <button
          onClick={handleApply}
          style={{
            flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 13, fontWeight: 600,
            border: "none", background: C.p600, color: C.white, cursor: "pointer",
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

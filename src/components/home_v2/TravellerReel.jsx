import { Play } from "lucide-react";
import { C } from "../../data";

// Single traveller reel tile - portrait, image or video, with name/country/activity overlay.
export default function TravellerReel({ item, width = 160 }) {
  return (
    <div style={{
      width, aspectRatio: "9 / 16",
      borderRadius: 14, overflow: "hidden",
      position: "relative", flexShrink: 0,
      boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
      cursor: "pointer", background: "#000",
    }}>
      <img src={item.poster} alt={item.activity} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.78) 100%)" }} />

      {item.type === "video" && (
        <div style={{
          position: "absolute", top: 10, right: 10,
          width: 28, height: 28, borderRadius: "50%",
          background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Play size={12} color="#fff" fill="#fff" />
        </div>
      )}

      <div style={{ position: "absolute", bottom: 10, left: 10, right: 10, color: "#fff" }}>
        <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, letterSpacing: "0.2px" }}>{item.country}</div>
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2, margin: "2px 0" }}>{item.name}</div>
        <div style={{ fontSize: 11, opacity: 0.9, lineHeight: 1.25 }}>{item.activity}</div>
      </div>
    </div>
  );
}

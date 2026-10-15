import { Utensils, Footprints, Heart, Sparkles, Leaf, Languages, Plug } from "lucide-react";
import { C } from "../../data";
import { Section, RowCard, WellIcon } from "./kit";
import { T } from "./tokens";

// ─── Why Indian couples pick this stay, turned down ───
//
// The warm gradient and the pink border made this the loudest block on a page
// where the loudest block should be the rooms. Worse, it looked like a
// promotion, and a promotion is exactly what these six lines are not: they are
// answers to practical questions about food, language and plug sockets.
// Wrapping a factual answer in a highlight makes the reader discount it.
//
// So the surface is now the same white card with the same soft lift as the
// facilities list and the policies list. The only thing carrying brand is the
// well behind each icon, in the pink used everywhere else for "this is ours".
// It reads as part of the page instead of an insert bought on it.

const ICONS = {
  leaf: Leaf, utensils: Utensils, footprints: Footprints,
  languages: Languages, plug: Plug, heart: Heart,
};

export default function WhyIndiansQuiet({ hotel }) {
  return (
    <Section title="Why Indian couples pick this stay">
      <RowCard>
        {hotel.whyIndians.map((w, i) => {
          const Ico = ICONS[w.icon] || Sparkles;
          return (
            <div
              key={i}
              style={{
                display: "flex", gap: 12, alignItems: "center", padding: "12px 13px",
                borderBottom: i === hotel.whyIndians.length - 1 ? "none" : `1px solid ${C.div}`,
              }}
            >
              <WellIcon Ico={Ico} tone="brand" />
              <span style={{ ...T.body, fontSize: 13, color: C.head, lineHeight: 1.45 }}>
                {w.text}
              </span>
            </div>
          );
        })}
      </RowCard>
    </Section>
  );
}

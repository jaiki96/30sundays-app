import { useMemo } from "react";
import rawSvg from "../assets/logo-anim.svg?raw";

// Static 30 Sundays brand logo, derived from the animated splash SVG.
// The paths in logo-anim.svg are authored at their final composed positions; only
// the <style> block animates them. We strip that block (keeping just the four brand
// fills) and crop to a tight viewBox, so the lockup renders still and on-brand.
//
// Props:
//   variant: "lockup" (icon + "30 sundays" wordmark) | "mark" (icon only)
//   height:  rendered height in px (width scales from the viewBox)
//   mono:    optional single color — paints every shape one color (for over-photo use)

const BRAND = ["#fb034f", "#09a696", "#254342", "#fba005"];
// Tight crops of the composed lockup / icon within the 1062×1003 source viewBox.
const VIEWBOX = {
  lockup: "132 358 800 278",
  mark: "132 378 232 214",
};

function buildSvg({ variant, mono }) {
  const fills = mono ? [mono, mono, mono, mono] : BRAND;
  const style = `.cls-1{fill:${fills[0]}}.cls-2{fill:${fills[1]}}.cls-3{fill:${fills[2]}}.cls-4{fill:${fills[3]}}`;

  let svg = rawSvg
    // Replace the animated <defs><style>…</style></defs> with just the brand fills.
    .replace(/<defs>[\s\S]*?<\/defs>/, `<defs><style>${style}</style></defs>`)
    // Retarget the viewBox to a tight crop.
    .replace(/viewBox="[^"]*"/, `viewBox="${VIEWBOX[variant] || VIEWBOX.lockup}"`);

  // Icon-only: drop the wordmark group (it has no nested <g>, so the first </g> closes it).
  if (variant === "mark") {
    svg = svg.replace(/<g class="wordmark-grp">[\s\S]*?<\/g>/, "");
  }

  // Size the <svg> tag itself; clear width/height so height drives the box.
  svg = svg.replace(/<svg /, `<svg preserveAspectRatio="xMidYMid meet" `);
  return svg;
}

export default function Logo({ variant = "lockup", height = 26, mono, style, ...rest }) {
  const html = useMemo(() => buildSvg({ variant, mono }), [variant, mono]);
  return (
    <span
      {...rest}
      style={{ display: "inline-flex", height, lineHeight: 0, ...style }}
      // The injected <svg> has no width/height; force it to fill the span height.
      ref={(el) => {
        if (el) {
          const s = el.querySelector("svg");
          if (s) { s.style.height = "100%"; s.style.width = "auto"; s.style.display = "block"; }
        }
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

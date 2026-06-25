// Shared tone tokens for the home-variant closing sections.
// "clean" = rounded, sans (v3/v4/v5). "editorial" = squared, serif (v6).
export const SERIF = "'Hoefler Text', 'Iowan Old Style', Garamond, Georgia, serif";

export const tones = {
  clean: { radius: 14, cardRadius: 14, head: { fontWeight: 700, letterSpacing: "-0.3px" } },
  editorial: { radius: 4, cardRadius: 6, head: { fontFamily: SERIF, fontWeight: 600, letterSpacing: "-0.2px" } },
};

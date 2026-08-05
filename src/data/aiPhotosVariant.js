// True only on the AI Couple Photos deployment, which is served from its own
// ai-photos subdomain. Reading the hostname keeps the two deployments building
// from one branch with no per-environment config. VITE_APP_VARIANT overrides it
// when running locally.
//
// Its own module so screens shared with the main app (Account) can read it
// without importing App.
export const AI_PHOTOS_VARIANT =
  import.meta.env.VITE_APP_VARIANT === "aiphotos" ||
  (typeof window !== "undefined" && window.location.hostname.includes("ai-photos"));

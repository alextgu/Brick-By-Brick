export const PIPELINE_STACK = [
  { role: "Ingest", tool: "FastAPI" },
  { role: "Index", tool: "12 Labs" },
  { role: "Analyse", tool: "Gemini" },
  { role: "Match", tool: "Rebrickable" },
  { role: "Deliver", tool: "Backboard" },
] as const;

/** Replace hrefs with each teammate's LinkedIn profile URL. */
export const TEAM_LINKEDIN = [
  { name: "Alexander Gu", href: "https://www.linkedin.com/in/alextgu" },
  { name: "Gabriel Andrus", href: "https://www.linkedin.com/in/gabriel-andrus-69bbab326/" },
  { name: "James Sheng", href: "https://www.linkedin.com/in/james-sheng/" },
  { name: "Matthew Kong", href: "https://www.linkedin.com/in/matthew--kong/" },
] as const;

/** Logo-matched: charcoal wordmark, brick + orange icon accents */
export const C = {
  bg: "#FAFAF9",
  surface: "#FFFFFF",
  surface2: "#F3F2F0",
  border: "rgba(74, 74, 74, 0.1)",
  border2: "rgba(74, 74, 74, 0.16)",
  text: "#4A4A4A",
  muted: "rgba(74, 74, 74, 0.68)",
  muted2: "rgba(74, 74, 74, 0.52)",
  muted3: "rgba(74, 74, 74, 0.38)",
  accent: "#F16E2E",
  accentHover: "#FF7A3D",
  accentDim: "rgba(241, 110, 46, 0.14)",
  brick: "#9B231D",
  brickHover: "#B32E27",
  brickDim: "rgba(155, 35, 29, 0.1)",
  onAccent: "#ffffff",
  /** Primary actions: brick -> orange (logo icon colours) */
  ctaGradient: "linear-gradient(135deg, #9B231D 0%, #F16E2E 100%)",
  ctaGradientHover: "linear-gradient(135deg, #B32E27 0%, #FF7A3D 100%)",
} as const;

export const FONT_UI = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

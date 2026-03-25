import type { MouseEvent } from "react";

/** Shared timing for buttons, nav pills, and modal controls */
export const INTERACTIVE_TRANSITION =
  "transform 0.2s ease, filter 0.2s ease, background 0.2s ease, background-image 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease";

export const HOVER_LIFT = "translateY(-1px)";
export const HOVER_LIFT_RESET = "translateY(0)";
export const HOVER_BRIGHT = "brightness(1.02)";
export const HOVER_FILTER_NONE = "none";

type HElem = HTMLElement;

/** Filled / gradient CTAs */
export function hoverLiftBrighten(e: MouseEvent<HElem>) {
  e.currentTarget.style.transform = HOVER_LIFT;
  e.currentTarget.style.filter = HOVER_BRIGHT;
}

export function hoverReset(e: MouseEvent<HElem>) {
  e.currentTarget.style.transform = HOVER_LIFT_RESET;
  e.currentTarget.style.filter = HOVER_FILTER_NONE;
}

/** Outline / ghost controls (nav chips, icon closes) */
export function hoverLiftOnly(e: MouseEvent<HElem>) {
  e.currentTarget.style.transform = HOVER_LIFT;
  e.currentTarget.style.filter = HOVER_FILTER_NONE;
}

export function hoverLiftReset(e: MouseEvent<HElem>) {
  e.currentTarget.style.transform = HOVER_LIFT_RESET;
  e.currentTarget.style.filter = HOVER_FILTER_NONE;
}

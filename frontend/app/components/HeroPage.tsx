"use client";

import { useState, Fragment } from "react";
import type { CSSProperties, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  hoverLiftBrighten,
  hoverLiftOnly,
  hoverLiftReset,
  hoverReset,
  INTERACTIVE_TRANSITION,
} from "@/lib/buttonMotion";
import { BRICK_STACK_ANIMATION_ID, BRICK_STACK_LOTTIE_SRC } from "@/lib/lottieAssets";
import { C, FONT_UI, PIPELINE_STACK, TEAM_LINKEDIN } from "@/lib/heroConfig";

/** Set `NEXT_PUBLIC_DEVPOST_URL` in `.env.local` for the navbar link. */
const DEVPOST_URL = process.env.NEXT_PUBLIC_DEVPOST_URL ?? "https://devpost.com/software/lego-6928rf";

function makeNavHover(defaultStyle: Partial<CSSProperties>) {
  return {
    onMouseEnter(e: MouseEvent<HTMLElement>) {
      e.currentTarget.style.background = C.surface;
      e.currentTarget.style.borderColor = C.brickHover;
      e.currentTarget.style.color = C.brickHover;
      e.currentTarget.style.boxShadow = "none";
      hoverLiftOnly(e);
    },
    onMouseLeave(e: MouseEvent<HTMLElement>) {
      Object.assign(e.currentTarget.style, defaultStyle);
      hoverLiftReset(e);
    },
  };
}

function ModalClose({ onClose }: { onClose: () => void }) {
  const hover = makeNavHover({
    background: C.surface2,
    borderColor: C.border,
    color: C.muted2,
    boxShadow: "none",
  });
  return (
    <button
      type="button"
      onClick={onClose}
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        width: 28,
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: 5,
        fontSize: "0.75rem",
        color: C.muted2,
        cursor: "pointer",
        fontFamily: FONT_UI,
        transition: INTERACTIVE_TRANSITION,
      }}
      onMouseEnter={hover.onMouseEnter}
      onMouseLeave={hover.onMouseLeave}
    >
      ✕
    </button>
  );
}

export default function HeroPage() {
  const [byokOpen, setByokOpen] = useState(false);
  const [stackOpen, setStackOpen] = useState(false);

  const navBtnStyle: CSSProperties = {
    fontSize: "0.72rem",
    fontWeight: 600,
    color: C.muted2,
    background: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: 6,
    padding: "6px 14px",
    fontFamily: FONT_UI,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: INTERACTIVE_TRANSITION,
  };

  const navBrickStyle: CSSProperties = {
    ...navBtnStyle,
    border: `1px solid ${C.brick}`,
    background: C.brickDim,
    color: C.brick,
  };
  const navOrangeStyle: CSSProperties = {
    ...navBtnStyle,
    border: `1px solid ${C.accent}`,
    background: C.accentDim,
    color: C.accent,
  };
  const navDevpostStyle: CSSProperties = {
    ...navBtnStyle,
    background: `linear-gradient(135deg, ${C.brickDim} 0%, ${C.accentDim} 100%)`,
    border: "1px solid rgba(200, 90, 50, 0.35)",
    color: C.brick,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
  };

  const navBrickHover = makeNavHover({
    color: C.brick,
    borderColor: C.brick,
    background: C.brickDim,
    boxShadow: "none",
  });
  const navOrangeHover = makeNavHover({
    color: C.accent,
    borderColor: C.accent,
    background: C.accentDim,
    boxShadow: "none",
  });
  const navDevpostHover = makeNavHover({
    color: C.brick,
    borderColor: "rgba(200, 90, 50, 0.35)",
    background: `linear-gradient(135deg, ${C.brickDim} 0%, ${C.accentDim} 100%)`,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn  { from { transform:scale(0.97) translateY(8px); opacity:0; } to { transform:scale(1) translateY(0); opacity:1; } }
        @keyframes bgIn   { from { opacity:0; } to { opacity:1; } }
        input::placeholder { color: rgba(74,74,74,0.38); }
        input:focus { outline: none; }
      `}</style>

      {/* Grain */}
      <div style={{ pointerEvents:"none", position:"fixed", inset:0, zIndex:9, opacity:0.04, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      {/* ══════════════ HERO PAGE ══════════════ */}
      <div style={{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily: FONT_UI, display:"flex", flexDirection:"column" }}>

        {/* Nav */}
        <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 40px", borderBottom:`1px solid ${C.border}`, background:C.bg }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <Image
              src="/logo.png"
              alt=""
              width={160}
              height={48}
              priority
              style={{ height: 44, width: "auto", objectFit: "contain" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              onClick={() => setStackOpen(true)}
              style={navBrickStyle}
              onMouseEnter={navBrickHover.onMouseEnter}
              onMouseLeave={navBrickHover.onMouseLeave}
            >
              Tech stack
            </button>
            <a
              href={DEVPOST_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={navDevpostStyle}
              onMouseEnter={navDevpostHover.onMouseEnter}
              onMouseLeave={navDevpostHover.onMouseLeave}
            >
              View on Devpost
            </a>
            <button
              type="button"
              onClick={() => setByokOpen(true)}
              style={navOrangeStyle}
              onMouseEnter={navOrangeHover.onMouseEnter}
              onMouseLeave={navOrangeHover.onMouseLeave}
            >
              Try it out yourself →
            </button>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 24px", textAlign:"center", position:"relative" }}>

          {/* Ambient glow */}
          <div style={{ pointerEvents:"none", position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:600, height:400, background:"radial-gradient(ellipse, rgba(241,110,46,0.12) 0%, rgba(155,35,29,0.04) 40%, transparent 65%)" }} />

          {/* UofT Hacks + context */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              marginBottom: 28,
              animation: "fadeUp 0.5s ease both 0.1s",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "6px 14px",
                borderRadius: 999,
                border: `1px solid ${C.border2}`,
                background: C.surface2,
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.01em",
                color: C.muted2,
              }}
            >
              UofT Hacks 13
            </div>
            <div
              style={{
                maxWidth: 800,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "0.78rem", fontWeight: 400, color: C.muted, lineHeight: 1.55, margin: 0 }}>
                UofT Hacks 13 · TwelveLabs: Build The Future of Video Understanding — 2nd place & Best use of Solona.
              </p>
              <p style={{ fontSize: "0.78rem", fontWeight: 400, color: C.muted, lineHeight: 1.6, margin: 0 }}>
                {TEAM_LINKEDIN.map((member, i) => (
                  <span key={member.href}>
                    {i > 0 && <span style={{ color: C.muted3 }}> · </span>}
                    <a
                      href={member.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: C.brick,
                        fontWeight: 600,
                        textDecoration: "none",
                        borderBottom: `1px solid ${C.accent}`,
                        paddingBottom: 1,
                        transition: INTERACTIVE_TRANSITION,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = C.brickHover;
                        e.currentTarget.style.borderBottomColor = C.accentHover;
                        hoverLiftOnly(e);
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = C.brick;
                        e.currentTarget.style.borderBottomColor = C.accent;
                        hoverLiftReset(e);
                      }}
                    >
                      {member.name}
                    </a>
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* H1 + lottie accent */}
          <h1 style={{ fontFamily:"'Instrument Serif', serif", fontSize:"clamp(3rem, 6vw, 5.5rem)", lineHeight:1.04, letterSpacing:"-0.03em", fontWeight:400, maxWidth:800, marginBottom:24, animation:"fadeUp 0.55s ease both 0.2s" }}>
            Your memory,{" "}
            <em
              style={{
                fontStyle: "italic",
                background: C.ctaGradient,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              built in bricks.
            </em>
            <span
              style={{
                display: "inline-flex",
                width: "1.32em",
                height: "1.2em",
                marginLeft: "0.1em",
                verticalAlign: "text-bottom",
                opacity: 0.9,
                filter: "saturate(0.88)",
              }}
              aria-hidden
            >
              <DotLottieReact
                src={BRICK_STACK_LOTTIE_SRC}
                animationId={BRICK_STACK_ANIMATION_ID}
                loop
                autoplay
              />
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "1rem",
              fontWeight: 400,
              color: C.muted,
              lineHeight: 1.75,
              maxWidth: "32rem",
              marginBottom: 48,
              animation: "fadeUp 0.55s ease both 0.3s",
            }}
          >
            Transform personal videos into custom LEGO build instructions. Our pipeline orchestrates{" "}
            <a href="https://www.twelvelabs.io/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: C.text, textDecoration: "underline", textDecorationColor: C.accent, textUnderlineOffset: "3px" }}>Twelve Labs</a>{" "}
            for video analysis,{" "}
            <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: C.text, textDecoration: "underline", textDecorationColor: C.accent, textUnderlineOffset: "3px" }}>Gemini</a>{" "}
            for creative direction,{" "}
            <a href="https://rebrickable.com/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: C.text, textDecoration: "underline", textDecorationColor: C.accent, textUnderlineOffset: "3px" }}>Rebrickable</a>{" "}
            for orderable parts, and{" "}
            <a href="https://backboard.io/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: C.text, textDecoration: "underline", textDecorationColor: C.accent, textUnderlineOffset: "3px" }}>Backboard</a>{" "}
            for final delivery.
          </p>

          {/* CTAs */}
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:72, animation:"fadeUp 0.55s ease both 0.4s" }}>
            <Link
              href="/demo"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                padding: "14px 30px",
                backgroundImage: C.ctaGradient,
                color: C.onAccent,
                border: "none",
                borderRadius: 8,
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: FONT_UI,
                transition: INTERACTIVE_TRANSITION,
                letterSpacing: "-0.01em",
                textDecoration: "none",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundImage = C.ctaGradientHover;
                hoverLiftBrighten(e);
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundImage = C.ctaGradient;
                hoverReset(e);
              }}
            >
              Check out the demo
              <span style={{ fontSize:"0.85rem" }}>▶</span>
            </Link>
          </div>
        </div>
      </div>
      <ByokModal open={byokOpen} onClose={() => setByokOpen(false)} />
      <TechStackModal open={stackOpen} onClose={() => setStackOpen(false)} />
    </>
  );
}

function ByokModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [key12Labs, setKey12Labs] = useState("");
  const [keyGemini, setKeyGemini] = useState("");
  const [keyRebrickable, setKeyRebrickable] = useState("");
  if (!open) return null;

  function saveKeys() {
    if (key12Labs) localStorage.setItem("brickmemories_12labs_key", key12Labs);
    if (keyGemini) localStorage.setItem("brickmemories_gemini_key", keyGemini);
    if (keyRebrickable) localStorage.setItem("brickmemories_rebrickable_key", keyRebrickable);
    onClose();
  }

  return (
    <div
      style={{ position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"rgba(74, 74, 74, 0.35)", backdropFilter:"blur(10px)", animation:"bgIn 0.2s ease" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ position:"relative", width:"100%", maxWidth:400, background:C.surface, border:`1px solid ${C.border2}`, borderRadius:16, padding:36, color:C.text, animation:"popIn 0.22s ease", boxShadow:"0 25px 50px -12px rgba(0,0,0,0.12)" }}>
        <ModalClose onClose={onClose} />
        <h3 style={{ fontFamily:"'Instrument Serif', serif", fontSize:"1.35rem", fontWeight:400, marginBottom:6 }}>Want to run it for real?</h3>
        <p style={{ fontSize:"0.74rem", fontWeight:400, color:C.muted, lineHeight:1.6, marginBottom:22 }}>
          The main-page walkthrough is a scripted preview for clarity. To call TwelveLabs, Gemini, and Rebrickable from your browser, enter your API keys below; they are stored only in this device&apos;s localStorage and are not sent to our servers.
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:16 }}>
          {[
            { label:"Twelve Labs API Key", placeholder:"12labs_sk_...", value:key12Labs, setter:setKey12Labs },
            { label:"Gemini API Key", placeholder:"AIzaSy...", value:keyGemini, setter:setKeyGemini },
            { label:"Rebrickable API Key", placeholder:"your_api_key", value:keyRebrickable, setter:setKeyRebrickable },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display:"block", fontSize:"0.6rem", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.muted2, marginBottom:5 }}>{f.label}</label>
              <input
                type="password" placeholder={f.placeholder} value={f.value}
                onChange={e => f.setter(e.target.value)}
                style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:6, padding:"9px 12px", fontSize:"0.78rem", color:C.text, fontFamily: FONT_UI, transition:"border-color 0.2s" }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = C.border2;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${C.brickDim}, 0 0 0 1px rgba(241,110,46,0.35)`;
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = C.border2;
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          ))}
        </div>
        <p style={{ fontSize:"0.65rem", fontWeight:300, color:C.muted3, lineHeight:1.6, marginBottom:18, padding:"8px 10px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:6 }}>
          🔒 We don&apos;t see these on a server — they stay in your browser (localStorage) unless you clear them.
        </p>
        <button
          onClick={saveKeys}
          style={{
            width: "100%",
            padding: "11px",
            backgroundImage: C.ctaGradient,
            color: C.onAccent,
            border: "none",
            borderRadius: 6,
            fontSize: "0.84rem",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: FONT_UI,
            transition: INTERACTIVE_TRANSITION,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundImage = C.ctaGradientHover;
            hoverLiftBrighten(e);
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundImage = C.ctaGradient;
            hoverReset(e);
          }}
        >
          Save keys →
        </button>
      </div>
    </div>
  );
}

function TechStackModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      style={{ position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"rgba(74, 74, 74, 0.35)", backdropFilter:"blur(10px)", animation:"bgIn 0.2s ease" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ position:"relative", width:"100%", maxWidth:920, background:C.surface, border:`1px solid ${C.border2}`, borderRadius:16, padding:"32px 28px 28px", color:C.text, animation:"popIn 0.22s ease", boxShadow:"0 25px 50px -12px rgba(0,0,0,0.12)" }}>
        <ModalClose onClose={onClose} />
        <h3 style={{ fontFamily:"'Instrument Serif', serif", fontSize:"1.35rem", fontWeight:400, marginBottom:6, paddingRight:32 }}>What we plugged in</h3>
        <p style={{ fontSize:"0.74rem", fontWeight:400, color:C.muted, lineHeight:1.6, marginBottom:22 }}>
          Roughly left-to-right how the pipeline goes — same tools we show off in the demo. Nothing fancy, just &ldquo;here&apos;s what we glued together&rdquo; for anyone curious.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "stretch",
            justifyContent: "center",
            gap: 0,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            overflow: "hidden",
            background: C.surface,
          }}
        >
          {PIPELINE_STACK.map((node, i) => (
            <Fragment key={node.tool}>
              {i > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    flexShrink: 0,
                    background: i % 2 === 1 ? C.brickDim : C.accentDim,
                    borderLeft: `1px solid ${C.border}`,
                    borderRight: `1px solid ${C.border}`,
                    color: i % 2 === 1 ? C.brick : C.accent,
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                  aria-hidden
                >
                  →
                </div>
              )}
              <div
                style={{
                  padding: "16px 18px",
                  flex: "1 1 100px",
                  minWidth: 96,
                  maxWidth: 180,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: C.text,
                  }}
                >
                  {node.tool}
                </div>
                <div
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: C.muted2,
                  }}
                >
                  {node.role}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

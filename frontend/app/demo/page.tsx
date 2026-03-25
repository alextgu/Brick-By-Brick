"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  hoverLiftBrighten,
  hoverLiftOnly,
  hoverLiftReset,
  hoverReset,
  INTERACTIVE_TRANSITION,
} from "@/lib/buttonMotion";

const VIDEO_OPTIONS = [
  { id: "birthday", label: "birthday_party.mp4", sub: "2:14 · family" },
  { id: "trip", label: "summer_trip.mov", sub: "4:02 · travel" },
  { id: "dinner", label: "dinner_rome.mp4", sub: "1:28 · food" },
  { id: "park", label: "park_walk.mp4", sub: "0:58 · outdoor" },
] as const;

const SCENE_OPTIONS = [
  { id: "s1", title: "Blowing out candles", detail: "Everyone around the table" },
  { id: "s2", title: "Sunset on the bridge", detail: "Golden hour, river in frame" },
  { id: "s3", title: "Clinking glasses", detail: "Toast at the centre of the shot" },
] as const;

/** One entry per step — copy is placeholder; tasks gate the Continue control. */
const STEPS = [
  {
    title: "Choose your video",
    body: "Drag one of the clips into the upload area. That stands in for a real file picker in the app.",
  },
  {
    title: "Pick a moment",
    body: "12 Labs finds key scenes — choose the one your build should capture.",
  },
  {
    title: "Run the indexer",
    body: "Kick off video understanding so Gemini and Rebrickable can run next.",
  },
  {
    title: "Confirm the LEGO match",
    body: "Lock in the suggested set and palette before packaging instructions.",
  },
  {
    title: "Instructions ready",
    body: "Backboard-style output: share link, PDF, or viewer — swap this copy when wired up.",
  },
] as const;

const C = {
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
  accentDim: "rgba(241, 110, 46, 0.12)",
  brick: "#9B231D",
  brickHover: "#B32E27",
  brickDim: "rgba(155, 35, 29, 0.12)",
  onAccent: "#ffffff",
  ctaGradient: "linear-gradient(135deg, #9B231D 0%, #F16E2E 100%)",
  ctaGradientHover: "linear-gradient(135deg, #B32E27 0%, #FF7A3D 100%)",
};

const FONT_UI = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

export default function DemoPage() {
  const last = STEPS.length - 1;
  const [stepIndex, setStepIndex] = useState(0);

  /** Step 0 — drag (or tap) video into drop zone */
  const [droppedVideoId, setDroppedVideoId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  /** Step 1 — pick a scene */
  const [sceneId, setSceneId] = useState<string | null>(null);

  /** Step 2 — fake pipeline run */
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineDone, setPipelineDone] = useState(false);

  /** Step 3 — confirm match */
  const [matchConfirmed, setMatchConfirmed] = useState(false);

  /** Step 4 — acknowledge */
  const [ackFinal, setAckFinal] = useState(false);

  const canProceed = useMemo(() => {
    switch (stepIndex) {
      case 0:
        return droppedVideoId !== null;
      case 1:
        return sceneId !== null;
      case 2:
        return pipelineDone;
      case 3:
        return matchConfirmed;
      case 4:
        return ackFinal;
      default:
        return false;
    }
  }, [stepIndex, droppedVideoId, sceneId, pipelineDone, matchConfirmed, ackFinal]);

  const advance = useCallback(() => {
    if (!canProceed || stepIndex >= last) return;
    setStepIndex(s => s + 1);
  }, [canProceed, stepIndex, last]);

  function onDragStart(e: React.DragEvent, id: string) {
    setDraggingId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  }

  function onDragEnd() {
    setDraggingId(null);
  }

  function onDropZoneDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(true);
  }

  function onDropZoneDragLeave() {
    setDragOver(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const id = e.dataTransfer.getData("text/plain");
    if (VIDEO_OPTIONS.some(v => v.id === id)) setDroppedVideoId(id);
  }

  function pickVideoTap(id: string) {
    setDroppedVideoId(id);
  }

  function runPipeline() {
    if (pipelineRunning || pipelineDone) return;
    setPipelineRunning(true);
    setTimeout(() => {
      setPipelineRunning(false);
      setPipelineDone(true);
    }, 1800);
  }

  const slide = STEPS[stepIndex];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&display=swap');
        @keyframes demoFade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseBar { 0% { transform: translateX(-100%); } 100% { transform: translateX(0%); } }
      `}</style>
      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          color: C.text,
          fontFamily: FONT_UI,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: C.brick,
              textDecoration: "none",
              borderBottom: `2px solid ${C.accent}`,
              paddingBottom: 2,
              transition: INTERACTIVE_TRANSITION,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = C.brickHover;
              hoverLiftOnly(e);
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = C.brick;
              hoverLiftReset(e);
            }}
          >
            ← Back to home
          </Link>
          <span style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.12em", color: C.muted3, textTransform: "uppercase" }}>
            Demo · complete each step
          </span>
        </header>

        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px 24px 24px",
            maxWidth: 720,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div
            key={stepIndex}
            style={{
              width: "100%",
              animation: "demoFade 0.35s ease both",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: C.muted3,
                marginBottom: 12,
              }}
            >
              Step {stepIndex + 1} of {STEPS.length}
            </p>
            <h1
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                marginBottom: 12,
                lineHeight: 1.15,
              }}
            >
              {slide.title}
            </h1>
            <p
              style={{
                fontSize: "0.95rem",
                fontWeight: 400,
                color: C.muted,
                lineHeight: 1.65,
                marginBottom: 24,
              }}
            >
              {slide.body}
            </p>

            {/* ── Step 0: drag video ── */}
            {stepIndex === 0 && (
              <div style={{ marginBottom: 8 }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 600, color: C.muted2, marginBottom: 14 }}>
                  Drag a clip into the box (or tap a card on mobile)
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  {VIDEO_OPTIONS.map(v => {
                    const dim = droppedVideoId !== null && droppedVideoId !== v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        draggable={droppedVideoId === null}
                        onDragStart={e => onDragStart(e, v.id)}
                        onDragEnd={onDragEnd}
                        onClick={() => {
                          if (droppedVideoId === null) pickVideoTap(v.id);
                        }}
                        disabled={droppedVideoId !== null}
                        style={{
                          padding: "12px 12px",
                          borderRadius: 10,
                          border: `1px solid ${draggingId === v.id ? C.brick : C.border2}`,
                          background: dim ? C.surface2 : C.surface,
                          opacity: dim ? 0.45 : 1,
                          cursor: droppedVideoId === null ? "grab" : "default",
                          textAlign: "left",
                          fontFamily: FONT_UI,
                          transition: `${INTERACTIVE_TRANSITION}, opacity 0.2s ease`,
                        }}
                        onMouseEnter={e => {
                          if (droppedVideoId !== null) return;
                          hoverLiftBrighten(e);
                        }}
                        onMouseLeave={e => {
                          if (droppedVideoId !== null) return;
                          hoverReset(e);
                        }}
                      >
                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: C.text, marginBottom: 4 }}>{v.label}</div>
                        <div style={{ fontSize: "0.62rem", color: C.muted2 }}>{v.sub}</div>
                      </button>
                    );
                  })}
                </div>
                <div
                  onDragOver={onDropZoneDragOver}
                  onDragLeave={onDropZoneDragLeave}
                  onDrop={onDrop}
                  style={{
                    minHeight: 140,
                    borderRadius: 12,
                    border: `2px dashed ${dragOver ? C.brick : droppedVideoId ? C.accent : C.border2}`,
                    background: dragOver
                      ? C.brickDim
                      : droppedVideoId
                        ? `linear-gradient(145deg, ${C.brickDim}, ${C.accentDim})`
                        : C.surface2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 20,
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                >
                  {droppedVideoId ? (
                    <>
                      <span style={{ fontSize: "1.5rem", marginBottom: 8, color: C.brick }}>✓</span>
                      <p style={{ fontSize: "0.85rem", fontWeight: 600, color: C.text }}>Uploaded</p>
                      <p style={{ fontSize: "0.75rem", color: C.muted2, marginTop: 4 }}>
                        {VIDEO_OPTIONS.find(v => v.id === droppedVideoId)?.label}
                      </p>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: "0.85rem", fontWeight: 600, color: C.muted2 }}>Drop video here</p>
                      <p style={{ fontSize: "0.72rem", color: C.muted3, marginTop: 6, textAlign: "center" }}>
                        Release to queue ingest
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── Step 1: scene ── */}
            {stepIndex === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {SCENE_OPTIONS.map(s => {
                  const sel = sceneId === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSceneId(s.id)}
                      style={{
                        padding: "14px 16px",
                        borderRadius: 10,
                        border: `2px solid ${sel ? C.brick : C.border2}`,
                        background: sel ? `linear-gradient(180deg, ${C.brickDim}, ${C.accentDim})` : C.surface,
                        boxShadow: sel ? "0 0 0 3px rgba(241, 110, 46, 0.2)" : undefined,
                        textAlign: "left",
                        fontFamily: FONT_UI,
                        cursor: "pointer",
                        transition: INTERACTIVE_TRANSITION,
                      }}
                      onMouseEnter={hoverLiftBrighten}
                      onMouseLeave={hoverReset}
                    >
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: C.text }}>{s.title}</div>
                      <div style={{ fontSize: "0.72rem", color: C.muted, marginTop: 4 }}>{s.detail}</div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── Step 2: run indexer ── */}
            {stepIndex === 2 && (
              <div>
                <button
                  type="button"
                  onClick={runPipeline}
                  disabled={pipelineRunning || pipelineDone}
                  style={{
                    padding: "12px 24px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    fontFamily: FONT_UI,
                    color: pipelineDone ? C.muted3 : C.onAccent,
                    background: pipelineDone ? C.surface2 : pipelineRunning ? C.muted3 : C.brick,
                    border: "none",
                    borderRadius: 8,
                    cursor: pipelineRunning || pipelineDone ? "default" : "pointer",
                    transition: INTERACTIVE_TRANSITION,
                  }}
                  onMouseEnter={e => {
                    if (pipelineRunning || pipelineDone) return;
                    hoverLiftBrighten(e);
                  }}
                  onMouseLeave={e => {
                    if (pipelineRunning || pipelineDone) return;
                    hoverReset(e);
                  }}
                >
                  {pipelineDone ? "Indexing complete" : pipelineRunning ? "Running…" : "Run indexing"}
                </button>
                {pipelineRunning && (
                  <div style={{ marginTop: 16, height: 4, borderRadius: 2, background: C.surface2, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: "40%",
                        background: `linear-gradient(90deg, ${C.brick}, ${C.accent})`,
                        animation: "pulseBar 1.2s ease-in-out infinite",
                      }}
                    />
                  </div>
                )}
                {pipelineDone && (
                  <p style={{ fontSize: "0.78rem", color: C.muted3, marginTop: 12 }}>Mock run — replace with real 12 Labs status.</p>
                )}
              </div>
            )}

            {/* ── Step 3: confirm match ── */}
            {stepIndex === 3 && (
              <div>
                <button
                  type="button"
                  onClick={() => setMatchConfirmed(true)}
                  disabled={matchConfirmed}
                  style={{
                    padding: "12px 24px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    fontFamily: FONT_UI,
                    color: matchConfirmed ? C.muted3 : C.onAccent,
                    background: matchConfirmed ? C.surface2 : C.accent,
                    border: matchConfirmed ? "none" : `2px solid ${C.brick}`,
                    borderRadius: 8,
                    cursor: matchConfirmed ? "default" : "pointer",
                    transition: INTERACTIVE_TRANSITION,
                  }}
                  onMouseEnter={e => {
                    if (matchConfirmed) return;
                    hoverLiftBrighten(e);
                  }}
                  onMouseLeave={e => {
                    if (matchConfirmed) return;
                    hoverReset(e);
                  }}
                >
                  {matchConfirmed ? "Match confirmed" : "Confirm LEGO match"}
                </button>
              </div>
            )}

            {/* ── Step 4: acknowledge ── */}
            {stepIndex === 4 && (
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  marginTop: 4,
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  color: C.muted,
                  lineHeight: 1.5,
                }}
              >
                <input
                  type="checkbox"
                  checked={ackFinal}
                  onChange={e => setAckFinal(e.target.checked)}
                  style={{ marginTop: 3, accentColor: C.brick }}
                />
                <span>I&apos;ve reviewed this step — placeholder until real instructions UI ships.</span>
              </label>
            )}
          </div>

          {/* Progress dots — read-only */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 32,
              marginBottom: 20,
            }}
          >
            {STEPS.map((_, i) => (
              <div
                key={i}
                title={i < stepIndex ? "Done" : i === stepIndex ? "Current" : "Locked"}
                style={{
                  width: i === stepIndex ? 22 : 8,
                  height: 8,
                  borderRadius: 4,
                  background:
                    i === stepIndex
                      ? C.accent
                      : i < stepIndex
                        ? i % 2 === 0
                          ? C.brick
                          : C.accent
                        : C.border2,
                  transition: "all 0.25s ease",
                }}
              />
            ))}
          </div>

          <div style={{ width: "100%", maxWidth: 400, justifyContent: "center", display: "flex" }}>
            {stepIndex < last ? (
              <button
                type="button"
                onClick={advance}
                disabled={!canProceed}
                style={{
                  padding: "12px 28px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  fontFamily: FONT_UI,
                  color: canProceed ? C.onAccent : C.muted3,
                  backgroundColor: canProceed ? undefined : C.surface2,
                  backgroundImage: canProceed ? C.ctaGradient : "none",
                  border: `1px solid ${canProceed ? "transparent" : C.border}`,
                  borderRadius: 8,
                  cursor: canProceed ? "pointer" : "not-allowed",
                  width: "100%",
                  transition: INTERACTIVE_TRANSITION,
                }}
                onMouseEnter={e => {
                  if (!canProceed) return;
                  e.currentTarget.style.backgroundImage = C.ctaGradientHover;
                  hoverLiftBrighten(e);
                }}
                onMouseLeave={e => {
                  if (!canProceed) return;
                  e.currentTarget.style.backgroundImage = C.ctaGradient;
                  hoverReset(e);
                }}
              >
                Continue to next step
              </button>
            ) : (
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: C.muted2, textAlign: "center" }}>
                {ackFinal ? (
                  <Link
                    href="/"
                    style={{
                      color: C.brick,
                      fontWeight: 700,
                      textDecoration: "underline",
                      textDecorationColor: C.accent,
                      textUnderlineOffset: "3px",
                      transition: INTERACTIVE_TRANSITION,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = C.brickHover;
                      hoverLiftOnly(e);
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = C.brick;
                      hoverLiftReset(e);
                    }}
                  >
                    ← Back to home
                  </Link>
                ) : (
                  "Check the box above to finish."
                )}
              </span>
            )}
          </div>

          <p style={{ marginTop: 28, fontSize: "0.72rem", color: C.muted3, textAlign: "center", maxWidth: 420 }}>
            {stepIndex === 0 && !canProceed
              ? "Complete the drag-and-drop to unlock Continue."
              : !canProceed && stepIndex !== last
                ? "Finish the action above to continue."
                : stepIndex === last && !ackFinal
                  ? "Almost there — confirm you’ve reviewed the placeholder."
                  : "No skipping — each step unlocks the next."}
          </p>
        </main>
      </div>
    </>
  );
}

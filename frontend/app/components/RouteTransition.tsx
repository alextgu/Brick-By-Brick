"use client";

import { DotLottieReact, setWasmUrl } from "@lottiefiles/dotlottie-react";
import type { DotLottie } from "@lottiefiles/dotlottie-web";
import { usePathname } from "next/navigation";
import { BRICK_STACK_ANIMATION_ID, BRICK_STACK_LOTTIE_SRC } from "@/lib/lottieAssets";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * DotLottie needs its WASM binary served from a real URL. Next.js does not expose
 * `node_modules` to the browser, so we ship a copy in `/public/dotlottie-player.wasm`.
 */
const WASM_PUBLIC_PATH = "/dotlottie-player.wasm";

const FALLBACK_MS = 4500;

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "playing" | "fadeout">("idle");
  const [transitionId, setTransitionId] = useState(0);
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);

  useLayoutEffect(() => {
    setWasmUrl(new URL(WASM_PUBLIC_PATH, window.location.origin).href);
  }, []);

  const dismiss = useCallback(() => {
    setPhase("fadeout");
    window.setTimeout(() => setPhase("idle"), 260);
  }, []);

  useEffect(() => {
    if (prevPathname.current === null) {
      prevPathname.current = pathname;
      return;
    }
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;
    queueMicrotask(() => {
      setTransitionId(n => n + 1);
      setPhase("playing");
    });
  }, [pathname]);

  useEffect(() => {
    if (phase !== "playing" || !dotLottie) return;

    const onComplete = () => dismiss();
    dotLottie.addEventListener("complete", onComplete);
    const fallback = window.setTimeout(onComplete, FALLBACK_MS);

    return () => {
      dotLottie.removeEventListener("complete", onComplete);
      window.clearTimeout(fallback);
    };
  }, [phase, transitionId, dotLottie, dismiss]);

  const showOverlay = phase === "playing" || phase === "fadeout";

  return (
    <>
      {children}
      {showOverlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(250, 250, 249, 0.94)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            opacity: phase === "fadeout" ? 0 : 1,
            transition: "opacity 0.26s ease",
            pointerEvents: phase === "fadeout" ? "none" : "auto",
          }}
          aria-busy="true"
          aria-live="polite"
        >
          <div style={{ width: 280, height: 280, maxWidth: "min(280px, 70vw)", maxHeight: "min(280px, 50vh)" }}>
            <DotLottieReact
              key={`${pathname}-${transitionId}`}
              src={BRICK_STACK_LOTTIE_SRC}
              animationId={BRICK_STACK_ANIMATION_ID}
              loop={false}
              autoplay
              dotLottieRefCallback={setDotLottie}
            />
          </div>
        </div>
      )}
    </>
  );
}

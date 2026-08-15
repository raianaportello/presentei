"use client";
/**
 * 360° interactive mug viewer.
 * Drag (mouse or touch) to rotate. Momentum on release.
 * Supports text art and image art overlaid on the mug body.
 *
 * All transforms are applied directly to DOM refs — zero React
 * state updates during drag for maximum smoothness.
 */
import { useRef, useEffect, useCallback, useState } from "react";
import { MugCeramic } from "./mug-ceramic";

type Props = {
  initialArt?: string;
  artImageUrl?: string;
  className?: string;
};

export function Mug360({ initialArt = "", artImageUrl, className = "" }: Props) {
  const [art, setArt] = useState(initialArt);

  /* ── Refs (no re-render during drag) ── */
  const containerRef = useRef<HTMLDivElement>(null);
  const rotorRef     = useRef<HTMLDivElement>(null);
  const artRef       = useRef<HTMLDivElement>(null);
  const angleRef     = useRef(-22);
  const isDragging   = useRef(false);
  const lastX        = useRef(0);
  const vel          = useRef(0);
  const rafId        = useRef<number>();

  /* ── Apply transforms directly to DOM ── */
  const applyAngle = useCallback((deg: number) => {
    if (!rotorRef.current) return;
    rotorRef.current.style.transform = `rotateY(${deg}deg)`;

    if (artRef.current) {
      const rad  = (deg * Math.PI) / 180;
      const cosA = Math.cos(rad);
      const opacity = Math.max(0, cosA);
      const scaleX  = Math.max(0.001, Math.abs(cosA));
      artRef.current.style.opacity   = String(opacity);
      artRef.current.style.transform = `scaleX(${scaleX})`;
    }
  }, []);

  const stopMomentum = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
  }, []);

  const startMomentum = useCallback(() => {
    const step = () => {
      vel.current *= 0.93;
      if (Math.abs(vel.current) < 0.12) return;
      angleRef.current += vel.current * 0.42;
      applyAngle(angleRef.current);
      rafId.current = requestAnimationFrame(step);
    };
    rafId.current = requestAnimationFrame(step);
  }, [applyAngle]);

  const onStart = useCallback((x: number) => {
    stopMomentum();
    isDragging.current = true;
    lastX.current      = x;
    vel.current        = 0;
    if (containerRef.current) containerRef.current.style.cursor = "grabbing";
  }, [stopMomentum]);

  const onMove = useCallback((x: number) => {
    if (!isDragging.current) return;
    const delta = x - lastX.current;
    lastX.current     = x;
    vel.current       = delta;
    angleRef.current += delta * 0.48;
    applyAngle(angleRef.current);
  }, [applyAngle]);

  const onEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (containerRef.current) containerRef.current.style.cursor = "grab";
    startMomentum();
  }, [startMomentum]);

  useEffect(() => {
    applyAngle(angleRef.current);
    return stopMomentum;
  }, [applyAngle, stopMomentum]);

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>

      {/* ── 360° viewer ── */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[300px] select-none"
        style={{ cursor: "grab", touchAction: "none" }}
        onMouseDown={(e) => onStart(e.clientX)}
        onMouseMove={(e) => onMove(e.clientX)}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        onTouchStart={(e) => { e.preventDefault(); onStart(e.touches[0].clientX); }}
        onTouchMove={(e)  => { e.preventDefault(); onMove(e.touches[0].clientX); }}
        onTouchEnd={onEnd}
        aria-label="Caneca 360°: arraste para girar"
        role="img"
      >
        <div style={{ perspective: "1000px", perspectiveOrigin: "50% 38%" }}>
          <div ref={rotorRef} style={{ position: "relative", willChange: "transform" }}>

            <MugCeramic idPrefix="mug360" className="w-full" />

            {/* Art overlay – mapped to the mug's printable body area */}
            <div
              ref={artRef}
              aria-hidden
              style={{
                position: "absolute",
                top:    "30%",
                left:   "22%",
                right:  "20%",
                bottom: "16%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                transformOrigin: "center",
                overflow: "hidden",
              }}
            >
              {artImageUrl ? (
                /* Generated image art */
                <img
                  src={artImageUrl}
                  alt="Arte gerada"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "6px",
                    mixBlendMode: "multiply",
                  }}
                />
              ) : art ? (
                /* Text art preview */
                <span
                  className="font-display font-black text-[var(--brand-orange)]"
                  style={{
                    fontSize: "clamp(0.75rem, 4vw, 1.05rem)",
                    lineHeight: 1.25,
                    display: "block",
                    textAlign: "center",
                    wordBreak: "break-word",
                  }}
                >
                  {art}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Drag hint */}
        <div className="mt-3 flex items-center justify-center gap-2 text-[var(--brand-muted-light)]">
          <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <p className="text-[0.72rem] font-bold tracking-wide">Arraste para girar 360°</p>
          <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* ── Art text input (only when no image art) ── */}
      {!artImageUrl && (
        <div className="w-full max-w-sm">
          <label
            htmlFor="art-preview"
            className="mb-2 block text-[0.72rem] font-black uppercase tracking-[0.18em] text-[var(--brand-muted)]"
          >
            Pré-visualize sua ideia na caneca
          </label>
          <div className="relative">
            <input
              id="art-preview"
              type="text"
              value={art}
              onChange={(e) => setArt(e.target.value.slice(0, 40))}
              placeholder="Ex: Minha vovó preferida ☕"
              maxLength={40}
              className={[
                "w-full rounded-[var(--radius-md)] border border-[var(--brand-border)]",
                "bg-white px-4 py-3 text-sm text-[var(--brand-black)]",
                "placeholder:text-[var(--brand-muted-light)]",
                "transition-shadow duration-[var(--dur-fast)]",
                "focus:border-[var(--brand-orange)] focus:outline-none focus:shadow-[0_0_0_3px_var(--brand-orange-glow)]",
              ].join(" ")}
            />
            {art && (
              <button
                type="button"
                onClick={() => setArt("")}
                aria-label="Limpar texto"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brand-muted-light)] transition-colors hover:text-[var(--brand-black)]"
              >
                <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <p className="mt-1.5 text-[0.68rem] text-[var(--brand-muted-light)]">
            {art.length}/40 · Pré-visualização. Use a IA abaixo para gerar arte de verdade.
          </p>
        </div>
      )}
    </div>
  );
}

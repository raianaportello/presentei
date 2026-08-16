"use client";
/**
 * Interactive 360° mug viewer.
 *
 * Turntables on its own until the visitor grabs it, then hands over
 * full orbit control with inertia. The generated art is baked into a
 * canvas strip and wrapped around the body as a real cylindrical print.
 */
import { Suspense, useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { MugMesh } from "./mug-mesh";
import { Studio } from "./studio";
import { buildImageTexture, buildTextTexture, loadImage } from "./art-texture";

type Props = {
  /** Generated artwork — data URI or same-origin URL. */
  artImageUrl?: string;
  /** Live text preview, used when there is no image yet. */
  artText?: string;
  /** Art came from DALL·E 3 and still carries a white background. */
  keyWhite?: boolean;
  className?: string;
  /** Disable interaction and just turntable (hero / cards). */
  showcase?: boolean;
};

export function MugViewer({
  artImageUrl,
  artText,
  keyWhite = false,
  className = "",
  showcase = false,
}: Props) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [interacted, setInteracted] = useState(false);
  const prevTexture = useRef<THREE.Texture | null>(null);

  /* ── Build the print texture whenever the art changes ── */
  useEffect(() => {
    let cancelled = false;

    async function build() {
      let next: THREE.Texture | null = null;
      try {
        if (artImageUrl) {
          const img = await loadImage(artImageUrl);
          if (cancelled) return;
          next = buildImageTexture(img, { keyWhite });
        } else if (artText && artText.trim()) {
          next = buildTextTexture(artText.trim());
        }
      } catch {
        next = null;
      }
      if (cancelled) return;

      prevTexture.current?.dispose();
      prevTexture.current = next;
      setTexture(next);
    }

    build();
    return () => { cancelled = true; };
  }, [artImageUrl, artText, keyWhite]);

  /* ── Release GPU memory on unmount ── */
  useEffect(() => () => { prevTexture.current?.dispose(); }, []);

  return (
    <div className={`relative ${className}`}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 1.85, 7.5], fov: 30 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.28,
        }}
        onCreated={(state) => {
          if (process.env.NODE_ENV !== "production") {
            (window as unknown as Record<string, unknown>).__r3f = state;
          }
        }}
        onPointerDown={() => setInteracted(true)}
        style={{ touchAction: showcase ? "auto" : "none" }}
      >
        <Studio />
        <Suspense fallback={null}>
          <MugMesh artTexture={texture} autoSpin={showcase} />

          {!showcase && (
            <OrbitControls
              makeDefault
              enablePan={false}
              enableZoom={false}
              enableDamping
              dampingFactor={0.075}
              rotateSpeed={0.85}
              autoRotate={!interacted}
              autoRotateSpeed={1.5}
              minPolarAngle={Math.PI * 0.22}
              maxPolarAngle={Math.PI * 0.72}
            />
          )}
        </Suspense>
      </Canvas>

      {/* Drag affordance — fades away once they've discovered it */}
      {!showcase && (
        <div
          aria-hidden
          className={[
            "pointer-events-none absolute inset-x-0 bottom-2 flex items-center justify-center gap-2",
            "transition-opacity duration-500",
            interacted ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
          <span className="flex items-center gap-2 rounded-full bg-[var(--brand-black)]/78 px-3.5 py-1.5 backdrop-blur-sm">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                 stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            <span className="text-[0.68rem] font-black uppercase tracking-[.14em] text-white">
              Arraste para girar
            </span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                 stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
}

"use client";
/**
 * Product-photography lighting for white glazed ceramic.
 *
 * The trick with a white glossy object is restraint: the environment
 * stays mostly dark and the form is described by a few narrow bright
 * strips reflecting off the glaze. Flooding it with light flattens the
 * mug into a featureless white blob.
 */
import { Suspense } from "react";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";

export function Studio() {
  return (
    <>
      {/* Barely any ambient — the shadows need somewhere to live. */}
      <ambientLight intensity={0.17} />

      {/* Key — high, camera-left, casts the grounding shadow */}
      <directionalLight
        position={[3.4, 6.2, 4.6]}
        intensity={1.55}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      {/* Fill — opens the shadow side just enough to keep detail */}
      <directionalLight position={[-4.8, 1.6, 3.0]} intensity={0.30} />
      {/* Kicker — separates the right edge from the background */}
      <directionalLight position={[-2.4, 1.0, -4.2]} intensity={0.35} />

      <Suspense fallback={null}>
        <Environment resolution={512}>
          {/* Dark shell — this is what makes the highlights read at all. */}
          <Lightformer
            form="rect"
            intensity={0.06}
            color="#2a2320"
            position={[0, 0, -8]}
            scale={[24, 24, 1]}
          />

          {/* Narrow tall strip, camera-left — the long specular streak */}
          <Lightformer
            form="rect"
            intensity={2.6}
            position={[-2.9, 0.8, 2.9]}
            rotation={[0, Math.PI / 3.4, 0]}
            scale={[3.2, 7.5, 1]}
          />
          {/* Second strip, tighter — the glaze hotspot on the right */}
          <Lightformer
            form="rect"
            intensity={1.5}
            position={[3.2, 0.6, 2.4]}
            rotation={[0, -Math.PI / 3.4, 0]}
            scale={[2.4, 6.5, 1]}
          />
          {/* Soft overhead — lights the rim and the inside of the cup */}
          <Lightformer
            form="rect"
            intensity={1.35}
            position={[0, 4.5, 1.2]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[5, 5, 1]}
          />
          {/* Warm bounce off the table, brand-tinted */}
          <Lightformer
            form="rect"
            intensity={0.32}
            color="#ffd2ae"
            position={[0, -3.2, 1.8]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[6, 6, 1]}
          />
        </Environment>
      </Suspense>

      {/* Contact shadow — grounds the mug on the surface */}
      <ContactShadows
        position={[0, -1.19, 0]}
        opacity={0.5}
        scale={6.5}
        blur={2.4}
        far={2.6}
        resolution={1024}
        color="#3d1a06"
      />
    </>
  );
}

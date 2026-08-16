"use client";
/**
 * The mug itself: lathed ceramic body, cast handle, and the printed
 * art applied as a thin sleeve sitting just proud of the surface.
 */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createBodyGeometry, createHandleGeometry, MUG } from "./mug-geometry";

/** Glazed ceramic: white, low roughness, heavy clearcoat. */
function useGlaze() {
  return useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#f6f3f1",
        vertexColors: true,
        roughness: 0.24,
        metalness: 0.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.15,
        envMapIntensity: 0.88,
        sheen: 0.18,
        sheenColor: new THREE.Color("#fff4ec"),
        sheenRoughness: 0.6,
      }),
    []
  );
}

type Props = {
  artTexture?: THREE.Texture | null;
  /** Slow idle spin, disabled once the user takes control. */
  autoSpin?: boolean;
};

export function MugMesh({ artTexture, autoSpin = false }: Props) {
  const group = useRef<THREE.Group>(null);

  const bodyGeo = useMemo(() => createBodyGeometry(), []);
  const handleGeo = useMemo(() => createHandleGeometry(), []);
  const glaze = useGlaze();

  // Handle uses the same glaze but without the body's vertex colours.
  const handleMat = useMemo(() => {
    const m = glaze.clone();
    m.vertexColors = false;
    return m;
  }, [glaze]);

  const printHeight = MUG.printTop - MUG.printBottom;
  const printCentre = (MUG.printTop + MUG.printBottom) / 2;

  useFrame((_, delta) => {
    if (autoSpin && group.current) group.current.rotation.y += delta * 0.22;
  });

  return (
    <group ref={group} position={[0, -MUG.height / 2, 0]}>
      {/* Body */}
      <mesh geometry={bodyGeo} material={glaze} castShadow receiveShadow />

      {/* Handle — flattened on Z into an oval cross-section */}
      <mesh
        geometry={handleGeo}
        material={handleMat}
        scale={[1, 1, 0.8]}
        castShadow
        receiveShadow
      />

      {/*
        Printed art, sitting a hair proud of the wall so it never z-fights.
        FrontSide only: the back of the sleeve is occluded by the opaque
        body, which is what keeps the print from ghosting through.
      */}
      {artTexture && (
        <mesh position={[0, printCentre, 0]}>
          <cylinderGeometry
            args={[
              MUG.radius * 1.004,
              MUG.radius * 1.001,
              printHeight,
              192,
              1,
              true,
            ]}
          />
          <meshPhysicalMaterial
            map={artTexture}
            transparent
            roughness={0.26}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0.06}
            envMapIntensity={0.55}
            depthWrite={false}
            side={THREE.FrontSide}
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * Geometry for a standard 11oz sublimation ceramic mug.
 *
 * Proportions taken from real product photography:
 *   height 9.5cm · outer Ø 8.2cm · wall 0.5cm · handle reach 2.8cm
 * Normalised so the body radius = 1.0 unit.
 *
 * The body is a single lathed cross-section — outer wall, rolled rim,
 * inner wall, inner floor — which revolves into a watertight solid,
 * exactly how the real object is thrown.
 */
import * as THREE from "three";

export const MUG = {
  radius: 1.0,
  height: 2.32,
  /** Vertical span of the printable sublimation area. */
  printBottom: 0.42,
  printTop: 1.92,
  /** Fraction of circumference the art wraps around. */
  printArc: 0.62,
} as const;

/**
 * Cross-section of the mug, in (radius, height) pairs.
 * Walks: bottom centre → foot ring → outer wall → rolled rim
 *        → inner wall → inner floor → back to centre.
 */
function profilePoints(): THREE.Vector2[] {
  const p: [number, number][] = [
    // ── recessed underside ──
    [0.0,   0.035],
    [0.62,  0.030],
    [0.845, 0.022],
    // ── unglazed foot ring (the raw ceramic band) ──
    [0.895, 0.0  ],
    [0.952, 0.004],
    [0.981, 0.030],
    // ── outer wall: near-straight, whisper of taper ──
    [0.992, 0.075],
    [0.996, 0.34 ],
    [0.999, 1.10 ],
    [1.0,   1.86 ],
    [1.0,   2.16 ],
    // ── rolled rim, turning over the top ──
    [0.999, 2.246],
    [0.992, 2.292],
    [0.976, 2.316],
    [0.955, 2.320],
    [0.936, 2.302],
    [0.930, 2.268],
    // ── inner wall descending ──
    [0.929, 2.10 ],
    [0.927, 1.20 ],
    [0.925, 0.46 ],
    // ── inner floor fillet ──
    [0.906, 0.294],
    [0.858, 0.216],
    [0.760, 0.180],
    [0.55,  0.172],
    [0.0,   0.170],
  ];
  return p.map(([x, y]) => new THREE.Vector2(x, y));
}

/** Index in the profile where the lip turns from outside to inside. */
const RIM_CREST_INDEX = 14;
/** Index where the foot ring ends and the glazed wall begins. */
const FOOT_END_INDEX = 6;

export function createBodyGeometry(radialSegments = 192): THREE.LatheGeometry {
  const pts = profilePoints();
  const geo = new THREE.LatheGeometry(pts, radialSegments, 0, Math.PI * 2);
  // NOTE: LatheGeometry already emits correct smooth normals for a surface
  // of revolution. Recomputing them averages across the closing seam and
  // leaves visible vertical creases down the body.

  // ── Bake interior shading and the unglazed foot into vertex colours ──
  // The inside of a mug is deeply occluded; without this it reads as a
  // flat white tube. The foot ring gets a warm raw-clay tint.
  const count = geo.attributes.position.count;
  const colors = new Float32Array(count * 3);
  const rows = pts.length;

  for (let i = 0; i < count; i++) {
    // LatheGeometry lays vertices out as (segment, profileIndex) pairs.
    const profileIdx = i % rows;
    const y = geo.attributes.position.getY(i);

    let r = 1, g = 1, b = 1;

    if (profileIdx > RIM_CREST_INDEX) {
      // Interior — darken with depth, cool shadow tone.
      const depth = THREE.MathUtils.clamp(
        (MUG.height - y) / (MUG.height - 0.17), 0, 1
      );
      const shade = THREE.MathUtils.lerp(0.92, 0.36, Math.pow(depth, 0.75));
      r = shade * 0.99;
      g = shade * 0.985;
      b = shade;
    } else if (profileIdx < FOOT_END_INDEX) {
      // Unglazed foot ring — raw ceramic, slightly warm and matte.
      r = 0.93; g = 0.90; b = 0.865;
    }

    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;
  }

  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

/**
 * The handle: a D-curve swept with a tube, then flattened on Z so the
 * cross-section is oval rather than round — matching a real cast handle.
 */
export function createHandleGeometry(): THREE.TubeGeometry {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.905, 1.92, 0),
    new THREE.Vector3(1.30,  1.95, 0),
    new THREE.Vector3(1.56,  1.78, 0),
    new THREE.Vector3(1.63,  1.44, 0),
    new THREE.Vector3(1.60,  1.06, 0),
    new THREE.Vector3(1.40,  0.76, 0),
    new THREE.Vector3(1.02,  0.60, 0),
    new THREE.Vector3(0.885, 0.575, 0),
  ]);
  curve.curveType = "catmullrom";
  curve.tension = 0.5;

  return new THREE.TubeGeometry(curve, 160, 0.122, 32, false);
}

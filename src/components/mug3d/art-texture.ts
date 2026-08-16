/**
 * Builds the sublimation "transfer sheet" — a full 360° strip whose
 * horizontal axis maps 1:1 onto the mug's circumference.
 *
 * The art occupies a centred arc; everything else stays transparent so
 * the bare ceramic shows through, exactly like a real print.
 */
import * as THREE from "three";
import { MUG } from "./mug-geometry";

const STRIP_W = 2560;
const STRIP_H = 1024;

type BuildOpts = {
  /** Rotate the print around the mug, in turns (0..1). */
  offset?: number;
  /** Knock out a flat white background (DALL·E 3 has no alpha). */
  keyWhite?: boolean;
};

/**
 * Turn near-white pixels transparent, feathering the threshold so
 * anti-aliased edges don't leave a hard halo around the artwork.
 */
function keyOutWhite(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const data = ctx.getImageData(x, y, w, h);
  const px = data.data;
  const SOLID = 236; // below this stays fully opaque
  const CLEAR = 250; // above this goes fully transparent

  for (let i = 0; i < px.length; i += 4) {
    const min = Math.min(px[i], px[i + 1], px[i + 2]);
    if (min <= SOLID) continue;
    if (min >= CLEAR) {
      px[i + 3] = 0;
    } else {
      px[i + 3] = Math.round(px[i + 3] * (1 - (min - SOLID) / (CLEAR - SOLID)));
    }
  }
  ctx.putImageData(data, x, y);
}

function newStrip() {
  const canvas = document.createElement("canvas");
  canvas.width = STRIP_W;
  canvas.height = STRIP_H;
  return canvas;
}

/**
 * CylinderGeometry starts its UV wrap at theta=0, which sits on +Z —
 * the face pointing at the camera. The art is authored in the middle of
 * the strip, so it needs a half-turn shift to land on the front.
 */
const FRONT_ALIGN = 0.5;

function finalize(canvas: HTMLCanvasElement, offset = 0): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.offset.x = FRONT_ALIGN + offset;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/** Where the art sits inside the strip, in pixels. */
function artBox() {
  const w = STRIP_W * MUG.printArc;
  return { x: (STRIP_W - w) / 2, w };
}

/**
 * Wrap a generated image around the mug.
 * The image is fitted (contain) inside the print area so nothing crops.
 */
export function buildImageTexture(
  img: HTMLImageElement,
  opts: BuildOpts = {}
): THREE.CanvasTexture {
  const canvas = newStrip();
  const ctx = canvas.getContext("2d")!;
  const { x: boxX, w: boxW } = artBox();

  // Print area occupies the full strip height with a small safety margin.
  const margin = STRIP_H * 0.06;
  const boxH = STRIP_H - margin * 2;

  const scale = Math.min(boxW / img.width, boxH / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = boxX + (boxW - dw) / 2;
  const dy = margin + (boxH - dh) / 2;

  ctx.drawImage(img, dx, dy, dw, dh);

  if (opts.keyWhite) {
    keyOutWhite(ctx, Math.floor(dx), Math.floor(dy), Math.ceil(dw), Math.ceil(dh));
  }

  // Feather the vertical edges so the print fades into the ceramic
  // instead of ending on a hard seam.
  const feather = dw * 0.05;
  ctx.globalCompositeOperation = "destination-in";
  const grad = ctx.createLinearGradient(dx, 0, dx + dw, 0);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(feather / dw, "rgba(0,0,0,1)");
  grad.addColorStop(1 - feather / dw, "rgba(0,0,0,1)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(dx, 0, dw, STRIP_H);
  ctx.globalCompositeOperation = "source-over";

  return finalize(canvas, opts.offset);
}

/** Live text preview, before any AI art exists. */
export function buildTextTexture(
  text: string,
  opts: BuildOpts = {}
): THREE.CanvasTexture {
  const canvas = newStrip();
  const ctx = canvas.getContext("2d")!;
  const { x: boxX, w: boxW } = artBox();

  ctx.fillStyle = "#ff620f";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const cx = boxX + boxW / 2;
  const maxW = boxW * 0.82;

  // Wrap onto at most three lines, shrinking to fit.
  let size = 190;
  let lines: string[] = [];
  for (; size > 48; size -= 6) {
    ctx.font = `900 ${size}px Poppins, Arial, sans-serif`;
    lines = wrapText(ctx, text, maxW);
    if (lines.length <= 3) break;
  }

  const lh = size * 1.14;
  const startY = STRIP_H / 2 - ((lines.length - 1) * lh) / 2;
  lines.forEach((line, i) => ctx.fillText(line, cx, startY + i * lh));

  return finalize(canvas, opts.offset);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxW: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Load an image (data URI or same-origin URL) for texturing. */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Não foi possível carregar a arte."));
    img.src = src;
  });
}

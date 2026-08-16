/**
 * Produces the flat transfer sheet a sublimation shop actually prints:
 * the artwork laid out at physical size and print resolution, ready to
 * be cut and wrapped around the mug.
 */

/**
 * Standard Brazilian 11oz / 325ml sublimation wrap: 210 x 95 mm.
 * Every sheet ships at exactly this size so the print shop never has
 * to rescale — rescaling is where sharpness and colour go to die.
 */
const WRAP_CM = { width: 21.0, height: 9.5 } as const;
const DPI = 300;

const CM_PER_INCH = 2.54;
const px = (cm: number) => Math.round((cm / CM_PER_INCH) * DPI);

export const PRINT_SIZE = {
  width: px(WRAP_CM.width),   // 2362
  height: px(WRAP_CM.height), // 945
  widthCm: WRAP_CM.width,
  heightCm: WRAP_CM.height,
  dpi: DPI,
} as const;

/** Bleed added on every edge so trimming never exposes bare ceramic. */
const BLEED_CM = 0.3;
const BLEED = px(BLEED_CM);

type Options = {
  /** Artwork covers the whole sheet, background included. */
  fullBleed: boolean;
  /** Draw cut/safe-area guides outside the artwork. */
  guides?: boolean;
};

/**
 * Renders the transfer sheet to a canvas.
 *
 * Full-bleed art is scaled to cover the sheet plus bleed. Isolated art
 * is centred on white at a size that keeps it inside the safe area,
 * because anything near the edge disappears under the handle.
 */
export function buildPrintSheet(
  img: HTMLImageElement,
  opts: Options
): HTMLCanvasElement {
  const W = PRINT_SIZE.width + BLEED * 2;
  const H = PRINT_SIZE.height + BLEED * 2;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  if (opts.fullBleed) {
    // Take the composed 2.21:1 band out of the 3:2 render — same crop the
    // 3D preview uses, so the downloaded sheet matches what was approved.
    const targetAspect = W / H;
    let sw = img.width;
    let sh = Math.round(sw / targetAspect);
    if (sh > img.height) {
      sh = img.height;
      sw = Math.round(sh * targetAspect);
    }
    const sx = Math.round((img.width - sw) / 2);
    const sy = Math.round((img.height - sh) / 2);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
  } else {
    // Isolated artwork prints onto white ceramic — the sheet stays white
    // and the art sits within the safe area.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    const safeW = PRINT_SIZE.width * 0.92;
    const safeH = PRINT_SIZE.height * 0.9;
    const scale = Math.min(safeW / img.width, safeH / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
  }

  if (opts.guides) drawGuides(ctx);

  return canvas;
}

/** Trim line marking where the sheet gets cut before wrapping. */
function drawGuides(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.strokeStyle = "rgba(0,0,0,0.55)";
  ctx.lineWidth = 3;
  ctx.setLineDash([18, 12]);
  ctx.strokeRect(BLEED, BLEED, PRINT_SIZE.width, PRINT_SIZE.height);
  ctx.restore();
}

/** Builds the sheet and hands it to the browser as a PNG download. */
export function downloadPrintSheet(
  img: HTMLImageElement,
  filename: string,
  opts: Options
) {
  const canvas = buildPrintSheet(img, opts);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Revoke on the next tick so the download has taken the handle.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/png");
}

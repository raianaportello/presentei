import { NextRequest, NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import { buildArtBrief } from "./prompt-builder";
import { runTournament, type Conceito } from "./concept-tournament";

export const runtime = "nodejs";
export const maxDuration = 300;

let _client: OpenAI | null = null;
function client() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY não configurada.");
  if (!_client) _client = new OpenAI({ apiKey: key });
  return _client;
}

/**
 * The images API returns either b64_json or a short-lived URL depending
 * on the model. Normalise both into a data URI so the browser can push
 * it straight into a WebGL texture without tripping CORS.
 */
async function toDataUri(
  item: { b64_json?: string; url?: string } | undefined
): Promise<string | null> {
  if (item?.b64_json) return `data:image/png;base64,${item.b64_json}`;
  if (item?.url) {
    const res = await fetch(item.url);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:image/png;base64,${buf.toString("base64")}`;
  }
  return null;
}

/** Maps raw OpenAI failures onto something a customer can act on. */
function friendlyError(err: unknown): { message: string; status: number } {
  const raw = err instanceof Error ? err.message : String(err);
  const low = raw.toLowerCase();

  if (
    low.includes("safety") ||
    low.includes("content policy") ||
    low.includes("moderation") ||
    low.includes("rejected")
  ) {
    return {
      status: 422,
      message:
        "Essa ideia foi recusada pela IA. Isso costuma acontecer com personagens de marcas registradas (super-heróis, desenhos, times) — que também não podem ser vendidos legalmente. Tente descrever a pessoa ou o gosto dela: 'fã de quadrinhos, morcegos e cidade à noite' funciona melhor que o nome do personagem.",
    };
  }
  if (low.includes("billing") || low.includes("quota") || low.includes("insufficient")) {
    return {
      status: 402,
      message: "Créditos da OpenAI esgotados. Recarregue a conta para continuar gerando artes.",
    };
  }
  if (low.includes("rate limit") || low.includes("429")) {
    return {
      status: 429,
      message: "Muitos pedidos ao mesmo tempo. Espere alguns segundos e tente de novo.",
    };
  }
  return { status: 500, message: raw };
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY não configurada no ambiente do servidor." },
      { status: 500 }
    );
  }

  let conceito = "";
  let referenceImage: string | undefined;
  try {
    const body = await req.json();
    conceito = String(body?.conceito ?? "").trim().slice(0, 400);
    if (typeof body?.referenceImage === "string" && body.referenceImage.startsWith("data:image/")) {
      referenceImage = body.referenceImage;
    }
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  if (!conceito) {
    return NextResponse.json({ error: "Descreva sua ideia." }, { status: 400 });
  }

  const openai = client();

  // ── 1. Art direction: sketch a spread of concepts, judge them, keep
  //        the winner. Falls back to single-shot expansion if it fails.
  let promptFinal: string;
  let conceitoVencedor: Conceito | undefined;
  let justificativa: string | undefined;
  let totalAvaliados = 0;

  const torneio = await runTournament(openai, conceito).catch(() => null);
  if (torneio) {
    promptFinal = torneio.prompt;
    conceitoVencedor = torneio.conceito;
    justificativa = torneio.justificativa;
    totalAvaliados = torneio.avaliados.length;
  } else {
    promptFinal = (await buildArtBrief(openai, conceito)).prompt;
  }

  const brief = { prompt: promptFinal };

  try {
    // ── 2a. With a reference image: edit it into mug art ──
    if (referenceImage) {
      const base64 = referenceImage.split(",")[1] ?? "";
      const file = await toFile(Buffer.from(base64, "base64"), "referencia.png", {
        type: "image/png",
      });

      const res = await openai.images.edit({
        model: "gpt-image-1",
        image: file,
        prompt: `${brief.prompt} Use the supplied photo only as a likeness and style reference; redraw it as an illustration, do not copy it photographically.`,
        // Landscape: the sublimation band wraps roughly 2:1, so a square
        // render can only ever cover ~40% of it.
        size: "1536x1024",
        quality: "high",
        background: "opaque",
      });

      const imageUrl = await toDataUri(res.data?.[0]);
      if (!imageUrl) throw new Error("Resposta sem imagem.");

      return NextResponse.json({
        imageUrl,
        promptUsado: brief.prompt,
        conceito: conceitoVencedor,
        justificativa,
        totalAvaliados,
        usouReferencia: true,
      });
    }

    // ── 2b. Plain generation ──
    const res = await openai.images.generate({
      model: "gpt-image-1",
      prompt: brief.prompt,
      n: 1,
      size: "1536x1024",
      quality: "high",
      background: "opaque",
      output_format: "png",
    });

    const imageUrl = await toDataUri(res.data?.[0]);
    if (!imageUrl) throw new Error("Resposta sem imagem.");

    return NextResponse.json({
      imageUrl,
      promptUsado: brief.prompt,
      conceito: conceitoVencedor,
      justificativa,
      totalAvaliados,
    });
  } catch (primaryErr) {
    const detail = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
    console.warn("[gerar-arte] gpt-image-1 falhou:", detail);

    // Content-policy refusals are a dead end — the fallback model will
    // refuse the same thing. Report it instead of burning another call.
    const mapped = friendlyError(primaryErr);
    if (mapped.status !== 500) {
      return NextResponse.json({ error: mapped.message }, { status: mapped.status });
    }

    // ── 3. Fallback for accounts without gpt-image-1 access ──
    // NOTE: no `response_format` here — the images API no longer accepts
    // it and returns 400 Unknown parameter. toDataUri handles url or b64.
    try {
      const res = await openai.images.generate({
        model: "dall-e-3",
        prompt: brief.prompt,
        n: 1,
        size: "1792x1024",
        quality: "hd",
      });

      const imageUrl = await toDataUri(res.data?.[0]);
      if (!imageUrl) throw new Error("Resposta sem imagem.");

      return NextResponse.json({
        imageUrl,
        promptUsado: brief.prompt,
        conceito: conceitoVencedor,
        justificativa,
        totalAvaliados,
      });
    } catch (fallbackErr) {
      const mappedFallback = friendlyError(fallbackErr);
      console.error("[gerar-arte]", mappedFallback.message);
      return NextResponse.json(
        { error: mappedFallback.message },
        { status: mappedFallback.status }
      );
    }
  }
}

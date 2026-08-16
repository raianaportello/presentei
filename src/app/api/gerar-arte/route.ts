import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 120;

let _client: OpenAI | null = null;
function client() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY não configurada.");
  if (!_client) _client = new OpenAI({ apiKey: key });
  return _client;
}

function buildPrompt(conceito: string) {
  return [
    "Ilustração para estampar em caneca de cerâmica branca por sublimação.",
    `Tema: ${conceito}.`,
    "Estilo: aquarela delicada com traço fino, elegante e minimalista.",
    "Paleta quente: laranja terracota, coral, âmbar, verde-oliva suave e grafite.",
    "Composição centrada, elementos isolados sobre fundo totalmente transparente.",
    "Sem texto, sem letras, sem moldura, sem sombra projetada, sem fundo.",
    "Traços limpos com boa separação — precisa ficar legível impresso pequeno.",
  ].join(" ");
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "OPENAI_API_KEY não configurada. Adicione a chave em .env.local e reinicie o servidor.",
      },
      { status: 500 }
    );
  }

  let conceito: string;
  try {
    const body = await req.json();
    conceito = String(body?.conceito ?? "").trim().slice(0, 240);
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  if (!conceito) {
    return NextResponse.json({ error: "Descreva sua ideia." }, { status: 400 });
  }

  const prompt = buildPrompt(conceito);

  try {
    // Preferred: gpt-image-1 renders a genuinely transparent PNG, so the
    // art sits on bare ceramic instead of inside a white rectangle.
    const res = await client().images.generate({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "high",
      background: "transparent",
      output_format: "png",
    });

    const b64 = res.data?.[0]?.b64_json;
    if (!b64) throw new Error("Resposta sem imagem.");

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${b64}`,
      model: "gpt-image-1",
    });
  } catch (primaryErr) {
    const detail =
      primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
    console.warn("[gerar-arte] gpt-image-1 indisponível:", detail);

    // Fallback for accounts without gpt-image-1 access. DALL·E 3 cannot do
    // transparency, so we ask for flat white and key it out client-side.
    try {
      const res = await client().images.generate({
        model: "dall-e-3",
        prompt: `${prompt} Fundo branco puro e uniforme (#FFFFFF).`,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        response_format: "b64_json",
      });

      const b64 = res.data?.[0]?.b64_json;
      if (!b64) throw new Error("Resposta sem imagem.");

      return NextResponse.json({
        imageUrl: `data:image/png;base64,${b64}`,
        model: "dall-e-3",
        needsWhiteKeying: true,
      });
    } catch (fallbackErr) {
      const message =
        fallbackErr instanceof Error
          ? fallbackErr.message
          : "Erro ao gerar imagem.";
      console.error("[gerar-arte]", message);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }
}

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY não configurada." },
      { status: 500 }
    );
  }

  let conceito: string;
  try {
    const body = await req.json();
    conceito = String(body?.conceito ?? "").trim().slice(0, 200);
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  if (!conceito) {
    return NextResponse.json({ error: "Informe um conceito." }, { status: 400 });
  }

  try {
    const prompt = [
      `Crie uma ilustração simples, delicada e premium para estampar em uma caneca de cerâmica branca.`,
      `Tema: ${conceito}.`,
      `Estilo: aquarela minimalista, traços suaves, paleta quente (laranjas, terracota, bege, branco).`,
      `Fundo branco puro. Sem textos ou letras. Composição quadrada, centrada.`,
      `Adequado para impressão em caneca personalizada.`,
    ].join(" ");

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url",
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error("Nenhuma imagem gerada.");
    }

    return NextResponse.json({ imageUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao gerar imagem.";
    console.error("[gerar-arte]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

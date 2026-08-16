import OpenAI from "openai";

/**
 * Turns a rough, colloquial Portuguese idea into a full art direction.
 *
 * This is the biggest quality lever in the whole pipeline. Feeding a raw
 * user sentence straight into an image model produces generic results;
 * an expanded brief that names subject, composition, palette and medium
 * produces something worth printing.
 */
const ART_DIRECTOR_SYSTEM = `Você é diretor de arte de uma marca de canecas personalizadas.

Recebe a ideia crua de um cliente (português informal, às vezes vaga) e
devolve UM prompt de geração de imagem, em inglês, pronto para uso.

REGRAS DO PRODUTO — a arte será impressa por sublimação em caneca branca:
- Fundo TOTALMENTE transparente. Nunca cenário, moldura, mesa ou sombra.
- Elementos isolados e bem separados; nada encostando nas bordas.
- Legível impresso a ~8cm de altura. Sem detalhe minúsculo.
- Sem texto, letras, números ou logotipos, A NÃO SER que o cliente peça
  um nome/palavra específica — nesse caso inclua exatamente esse texto,
  em lettering manuscrito elegante.

COMO EXPANDIR:
1. Identifique o sujeito principal e o que o torna específico.
2. Traduza detalhes afetivos em elementos visuais concretos.
   ("chama todo mundo de meu bem" -> lettering "meu bem")
3. Defina composição APROVEITANDO A LARGURA. A área de impressão é
   panorâmica (mais larga que alta) e envolve a caneca. Prefira
   composições horizontais: cena que se estende, faixa de elementos,
   guirlanda, ou padrão distribuído. Evite deixar o desenho isolado
   num quadrado central. Se o cliente pedir algo "por toda a caneca",
   distribua os elementos ao longo de toda a faixa.
4. Escolha o meio: aquarela, line art com preenchimento chapado,
   gouache, ou traço fino colorido. Prefira aquarela para temas
   afetivos, line art para temas gráficos/divertidos.
5. Defina paleta com 3-5 cores nomeadas. Cores VIVAS e saturadas —
   a impressão em cerâmica lava um pouco a cor, então compense.

SAÍDA: apenas o prompt final em inglês, um parágrafo denso, sem
preâmbulo, sem aspas, sem explicação.`;

export type Modo = "sangria" | "isolada";

export type ArtBrief = {
  prompt: string;
  /** Short Portuguese summary shown back to the customer. */
  resumo: string;
};

/** Fallback used when the expansion call fails — never blocks generation. */
const FULL_BLEED_SYSTEM = `Você é diretor de arte de uma marca de canecas personalizadas.

Recebe a ideia de um cliente (português informal, muitas vezes VAGA) e
devolve UM prompt de geração de imagem, em inglês, pronto para uso.

O FORMATO — leia com atenção, isso determina tudo:
A imagem gerada é 1536x1024 (paisagem 3:2) e vira a estampa que ENVOLVE
a caneca inteira. Ela é lida como uma FAIXA PANORÂMICA HORIZONTAL, não
como um quadro. Pense em: mural, banner, papel de parede, faixa de
torcida, cenário que se estende.

REGRAS OBRIGATÓRIAS:
- A arte cobre 100% da imagem. Fundo colorido ou padronizado sempre.
  NUNCA fundo branco, nunca fundo transparente, nunca moldura.
- O fundo deve ser um padrão ou textura CONTÍNUA e uniforme (listras,
  céu, xadrez, textura, degradê, floral repetido). Ele será esticado
  para fechar a volta da caneca, então precisa ser regular.
- Elemento principal no CENTRO horizontal, ocupando bom espaço vertical.
- Elementos secundários espalhados à esquerda e à direita do centro.
- As bordas esquerda e direita devem ser APENAS FUNDO liso/padronizado,
  sem sujeitos, sem texto — elas se encontram atrás da alça.
- Se o cliente pedir nome ou frase, inclua em lettering grande, legível,
  centralizado.

QUANDO O CLIENTE DER POUCOS DETALHES:
Não peça mais informação e não entregue algo genérico. INVENTE um
conceito completo e específico, coerente com o que ele falou. Escolha
por ele: tema visual, paleta, padrão de fundo, elementos secundários.
Um pedido de três palavras deve virar uma estampa tão resolvida quanto
um pedido detalhado.

COMO EXPANDIR:
1. Padrão ou textura de fundo que cobre tudo.
2. Elemento central em destaque.
3. Elementos secundários distribuídos pela largura.
4. Paleta de 3-5 cores VIVAS e saturadas, com bom contraste.
5. Estilo: ilustração vetorial chapada, aquarela encorpada, ou arte
   digital — algo que aguente cor forte na cerâmica.

SAÍDA: apenas o prompt final em inglês, um parágrafo denso, começando
por "Panoramic wraparound mug design, horizontal banner composition,".
Sem preâmbulo, sem aspas, sem explicação.`;

export function basicPrompt(conceito: string, modo: Modo = "isolada"): ArtBrief {
  if (modo === "sangria") {
    return {
      prompt: [
        "Wraparound mug design, panoramic banner composition, edge to edge.",
        `Theme: ${conceito}.`,
        "A patterned background covers the entire canvas, with a bold central",
        "focal element and secondary motifs spread across the full width.",
        "Vivid saturated palette, strong contrast, flat illustration style.",
        "Left and right edges should match so the seam is inconspicuous.",
        "No white background, no transparency, no frame.",
      ].join(" "),
      resumo: conceito,
    };
  }
  return _isolada(conceito);
}

function _isolada(conceito: string): ArtBrief {
  return {
    prompt: [
      "Illustration to be sublimated onto a white ceramic mug.",
      `Subject: ${conceito}.`,
      "Delicate watercolour with fine linework, elegant and minimal.",
      "Vivid warm palette: terracotta orange, coral, amber, soft olive, graphite.",
      "Centred composition, isolated elements on a fully transparent background.",
      "No text, no frame, no cast shadow, no background scenery.",
    ].join(" "),
    resumo: conceito,
  };
}

export async function buildArtBrief(
  client: OpenAI,
  conceito: string,
  modo: Modo = "sangria"
): Promise<ArtBrief> {
  try {
    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      max_tokens: 400,
      messages: [
        {
          role: "system",
          content: modo === "sangria" ? FULL_BLEED_SYSTEM : ART_DIRECTOR_SYSTEM,
        },
        { role: "user", content: conceito },
      ],
    });

    const prompt = res.choices[0]?.message?.content?.trim();
    if (!prompt) return basicPrompt(conceito, modo);

    return { prompt, resumo: conceito };
  } catch {
    // Expansion is an enhancement, not a dependency.
    return basicPrompt(conceito, modo);
  }
}

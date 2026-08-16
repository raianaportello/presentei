import OpenAI from "openai";

/**
 * Art direction by tournament.
 *
 * Instead of turning the customer's sentence straight into one image
 * prompt, we sketch a spread of distinct concepts, score them against
 * explicit criteria, and only render the winner. It is how a studio
 * actually works — thumbnail widely, commit narrowly — and it costs one
 * extra text call rather than ten image renders.
 */

const CONCEPT_COUNT = 10;

export type Conceito = {
  titulo: string;
  descricao: string;
  paleta: string;
  estilo: string;
};

export type Vencedor = {
  /** Final English prompt for the image model. */
  prompt: string;
  /** The winning concept, surfaced back to the customer. */
  conceito: Conceito;
  /** Why it won, in Portuguese. */
  justificativa: string;
  /** Every concept considered, for transparency. */
  avaliados: Conceito[];
};

const SKETCH_SYSTEM = `Você é diretor de arte de uma marca de canecas personalizadas.

Recebe o pedido de um cliente (português informal, frequentemente vago)
e rascunha ${CONCEPT_COUNT} conceitos DISTINTOS de estampa.

O FORMATO de todas elas: estampa que envolve a caneca inteira, impressa
numa lâmina de 210x95mm — uma FAIXA PANORÂMICA bem larga e baixa
(proporção 2,2:1). Pense em mural, banner, faixa de torcida.
Fundo sempre coberto por padrão ou textura contínua.
Nunca fundo branco, nunca moldura, nunca desenho solto no meio.

Os ${CONCEPT_COUNT} conceitos precisam ser GENUINAMENTE diferentes entre si —
variando tema visual, época, meio, ângulo emocional e paleta. Não entregue
dez variações da mesma ideia.

Se o cliente foi vago, INVENTE especificidade. Escolha por ele.

Responda em JSON puro:
{"conceitos":[{"titulo":"...","descricao":"...","paleta":"...","estilo":"..."}]}

- titulo: 2-5 palavras, português
- descricao: 1-2 frases descrevendo a cena e a distribuição na faixa
- paleta: 3-5 cores nomeadas
- estilo: meio/técnica (aquarela, vetorial chapado, gouache, retrô…)`;

const JUDGE_SYSTEM = `Você é o diretor criativo que aprova a arte final.

Recebe o pedido original do cliente e ${CONCEPT_COUNT} conceitos rascunhados.
Avalia cada um com rigor nestes critérios:

1. FIDELIDADE — atende o que o cliente realmente pediu?
2. IMPACTO NA CANECA — funciona como faixa panorâmica de 360°? Tem
   elemento central forte e fundo que se estende bem até as bordas?
3. LEGIBILIDADE — sobrevive impresso a 8cm de altura? Sem detalhe
   minúsculo, com bom contraste?
4. AFETO — tem chance de emocionar quem recebe de presente?
5. PRODUÇÃO — cores fortes o bastante para sublimação em cerâmica?

Escolha UM vencedor e escreva o prompt final de geração de imagem.

Responda em JSON puro:
{
 "vencedor": <índice de 0 a ${CONCEPT_COUNT - 1}>,
 "justificativa": "<1-2 frases em português explicando a escolha>",
 "prompt": "<prompt final EM INGLÊS>"
}

ENQUADRAMENTO — REGRA MAIS IMPORTANTE DO PROMPT:
A imagem sai em 1536x1024, mas só a FAIXA CENTRAL vira a estampa: os
68% centrais da altura. Os 16% de cima e os 16% de baixo são margem e
serão APARADOS fora.

Portanto o prompt final DEVE instruir explicitamente:
- Compor toda a cena dentro de uma faixa horizontal central, larga e
  baixa, como um banner panorâmico de 2,2:1.
- Sujeitos, rostos, texto e qualquer detalhe importante inteiramente
  dentro dessa faixa central, com folga.
- As margens superior e inferior devem conter APENAS continuação do
  fundo (céu, padrão, textura) — nada que faça falta se for cortado.
- Nada de composição vertical, nada de retrato de corpo inteiro, nada
  que precise de altura. É uma faixa deitada.

O prompt final deve começar com "Panoramic wraparound mug wrap design,
ultra-wide horizontal banner composition with a 2.2:1 letterbox layout,
all key elements confined to the central horizontal band, top and bottom
margins containing only background continuation," e conter: padrão de fundo que cobre tudo,
elemento central, elementos secundários distribuídos pela largura, paleta
com cores vivas e saturadas, e o estilo. As bordas esquerda e direita
devem ser apenas fundo, sem sujeitos nem texto, porque se encontram atrás
da alça. Se o cliente pediu nome ou frase, inclua exatamente esse texto em
lettering grande e centralizado.`;

function parseJson<T>(raw: string | null | undefined): T | null {
  if (!raw) return null;
  try {
    // Models occasionally wrap JSON in a fence despite instructions.
    const cleaned = raw.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

export async function runTournament(
  client: OpenAI,
  pedido: string
): Promise<Vencedor | null> {
  // ── Round 1: sketch a spread ──
  const sketchRes = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 1.0,
    max_tokens: 2000,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SKETCH_SYSTEM },
      { role: "user", content: pedido },
    ],
  });

  const sketched = parseJson<{ conceitos: Conceito[] }>(
    sketchRes.choices[0]?.message?.content
  );
  const conceitos = sketched?.conceitos?.filter((c) => c?.titulo && c?.descricao);
  if (!conceitos?.length) return null;

  // ── Round 2: judge and finalise ──
  const dossier = conceitos
    .map(
      (c, i) =>
        `[${i}] ${c.titulo}\n  cena: ${c.descricao}\n  paleta: ${c.paleta}\n  estilo: ${c.estilo}`
    )
    .join("\n\n");

  const judgeRes = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    max_tokens: 900,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: JUDGE_SYSTEM },
      {
        role: "user",
        content: `PEDIDO DO CLIENTE:\n${pedido}\n\nCONCEITOS:\n${dossier}`,
      },
    ],
  });

  const verdict = parseJson<{
    vencedor: number;
    justificativa: string;
    prompt: string;
  }>(judgeRes.choices[0]?.message?.content);

  if (!verdict?.prompt) return null;

  const idx =
    Number.isInteger(verdict.vencedor) &&
    verdict.vencedor >= 0 &&
    verdict.vencedor < conceitos.length
      ? verdict.vencedor
      : 0;

  return {
    prompt: verdict.prompt,
    conceito: conceitos[idx],
    justificativa: verdict.justificativa ?? "",
    avaliados: conceitos,
  };
}

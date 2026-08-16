"use client";
/**
 * The personalizer: describe an idea, watch it print onto a real 3D mug,
 * spin it around, approve it.
 */
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { MugViewer } from "@/components/mug3d/mug-viewer";
import { downloadPrintSheet, PRINT_SIZE } from "@/components/mug3d/print-export";
import { loadImage } from "@/components/mug3d/art-texture";

type Status = "idle" | "loading" | "done" | "error";

type Art = {
  url: string;
  keyWhite: boolean;
  conceito: string;
  /** The expanded brief the art director model produced. */
  promptUsado?: string;
  direcao?: { titulo: string; descricao: string; paleta: string; estilo: string };
  justificativa?: string;
  totalAvaliados?: number;
};

const SUGGESTIONS = [
  "Mãe que ama café e cuidar do jardim",
  "Casal apaixonado por viajar de moto",
  "Professora que adora livros e gatos",
  "Meu cachorro caramelo dormindo",
  "Amigo viciado em games retrô",
  "Vovó que faz o melhor bolo de fubá",
];

/** Rotating status lines so a 30s wait does not feel dead. */
const LOADING_STEPS = [
  "Interpretando sua ideia…",
  "Rascunhando 10 conceitos…",
  "Avaliando cada um…",
  "Desenhando o escolhido…",
  "Ajustando para impressão…",
  "Envolvendo a cerâmica…",
];

const SPECS: [string, string][] = [
  ["Caneca", "Branca 325ml"],
  ["Impressão", "Sublimação HD"],
  ["Preço", "R$ 39,90"],
];

/** Downscale before upload — a 12MP phone photo is pure waste here. */
function readAndShrink(file: File, max = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não consegui ler o arquivo."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Arquivo de imagem inválido."));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function PersonalizerForm() {
  const [conceito, setConceito] = useState("");
  const [art, setArt] = useState<Art | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState(0);
  const [reference, setReference] = useState<string | null>(null);
  const [baixando, setBaixando] = useState(false);

  /* ── Cycle the loading copy ── */
  useEffect(() => {
    if (status !== "loading") return;
    const id = setInterval(
      () => setStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1)),
      4200
    );
    return () => clearInterval(id);
  }, [status]);

  const pickReference = useCallback(async (file: File | undefined) => {
    if (!file) return;
    try {
      setReference(await readAndShrink(file));
      setErrorMsg("");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Falha ao ler a imagem.");
    }
  }, []);

  const generate = useCallback(async () => {
    const texto = conceito.trim();
    if (!texto || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");
    setStep(0);

    try {
      const res = await fetch("/api/gerar-arte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conceito: texto, referenceImage: reference }),
      });

      let data: {
        imageUrl?: string;
        error?: string;
        needsWhiteKeying?: boolean;
        promptUsado?: string;
        conceito?: Art["direcao"];
        justificativa?: string;
        totalAvaliados?: number;
      } = {};
      try {
        data = await res.json();
      } catch {
        /* empty body */
      }

      if (!res.ok || data.error) {
        throw new Error(data.error ?? `Erro ${res.status}. Tente novamente.`);
      }
      if (!data.imageUrl) {
        throw new Error("A IA não devolveu imagem. Tente de novo.");
      }

      setArt({
        url: data.imageUrl,
        keyWhite: Boolean(data.needsWhiteKeying),
        conceito: texto,
        promptUsado: data.promptUsado,
        direcao: data.conceito,
        justificativa: data.justificativa,
        totalAvaliados: data.totalAvaliados,
      });
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Tente novamente.");
      setStatus("error");
    }
  }, [conceito, status, reference]);

  const baixarArteImpressao = useCallback(async () => {
    if (!art) return;
    setBaixando(true);
    try {
      const img = await loadImage(art.url);
      downloadPrintSheet(img, "presentei-arte-impressao.png", {
        fullBleed: true,
        guides: true,
      });
    } catch {
      setErrorMsg("Não consegui montar o arquivo de impressão.");
    } finally {
      setBaixando(false);
    }
  }, [art]);

  const busy = status === "loading";

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

      {/* ══════════ Stage: the mug ══════════ */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div
          className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--brand-border-soft)]"
          style={{
            background:
              "radial-gradient(120% 100% at 50% 12%, #ffffff 0%, #fdf6f0 46%, #f6e9de 100%)",
          }}
        >
          {/* Studio floor sweep */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
            style={{
              background:
                "linear-gradient(to top, rgba(120,60,20,.07), transparent)",
            }}
          />

          <MugViewer
            artImageUrl={art?.url}
            keyWhite={art?.keyWhite}
            fullBleed
            className="h-[440px] w-full sm:h-[540px]"
          />

          {/* Generating overlay */}
          {busy && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-end bg-white/45 pb-10 backdrop-blur-[2px]">
              <div className="flex flex-col items-center gap-3">
                <span className="relative flex h-10 w-10">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[var(--brand-orange)] opacity-25" />
                  <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-orange)]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2l2.2 5.9L20 10l-5.8 2.1L12 18l-2.2-5.9L4 10l5.8-2.1z" />
                    </svg>
                  </span>
                </span>
                <p
                  key={step}
                  className="text-[0.78rem] font-black uppercase tracking-[.16em] text-[var(--brand-black)]"
                  style={{ animation: "fadeSlideUp .4s var(--ease-spring) both" }}
                >
                  {LOADING_STEPS[step]}
                </p>
              </div>
            </div>
          )}

          {/* Result badge */}
          {status === "done" && (
            <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full bg-white/92 px-3.5 py-2 shadow-[var(--shadow-md)] backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-orange)]" />
              <p className="text-[0.66rem] font-black uppercase tracking-[.16em] text-[var(--brand-black)]">
                Arte exclusiva · gerada por IA
              </p>
            </div>
          )}
        </div>

        {/* Spec strip */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {SPECS.map(([label, value]) => (
            <div
              key={label}
              className="rounded-[var(--radius-md)] border border-[var(--brand-border-soft)] bg-white px-3 py-2.5"
            >
              <p className="text-[0.6rem] font-black uppercase tracking-[.14em] text-[var(--brand-muted-light)]">
                {label}
              </p>
              <p className="mt-0.5 text-[0.82rem] font-black text-[var(--brand-black)]">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ Controls ══════════ */}
      <div className="max-w-lg">

        {/* Step 1 */}
        <div className="flex items-center gap-3">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--brand-orange)] text-[0.7rem] font-black text-white">
            1
          </span>
          <p className="text-[0.68rem] font-black uppercase tracking-[.2em] text-[var(--brand-orange-deep)]">
            Conte sua ideia
          </p>
        </div>

        <h2 className="font-display mt-4 text-[clamp(2rem,4vw,2.75rem)] font-black leading-[1.02] tracking-[-.05em]">
          O que essa pessoa<br />ama de verdade?
        </h2>
        <p className="mt-3 text-[0.95rem] leading-7 text-[var(--brand-muted)]">
          Quanto mais específico, mais única fica a arte. Fale de manias,
          hobbies, apelidos — o que só quem convive sabe.
        </p>

        <div className="mt-7">
          <textarea
            id="conceito"
            value={conceito}
            onChange={(e) => setConceito(e.target.value.slice(0, 240))}
            placeholder="Ex: Minha vó rega as rosas laranja dela toda manhã antes do café, e chama todo mundo de meu bem…"
            rows={4}
            maxLength={240}
            disabled={busy}
            className={[
              "w-full resize-none rounded-[var(--radius-md)] border-2 border-[var(--brand-border)]",
              "bg-white px-4 py-3.5 text-[0.95rem] leading-7 text-[var(--brand-black)]",
              "placeholder:text-[var(--brand-muted-light)]",
              "transition-all duration-[var(--dur-fast)]",
              "focus:border-[var(--brand-orange)] focus:outline-none",
              "focus:shadow-[0_0_0_4px_var(--brand-orange-glow)]",
              busy ? "cursor-not-allowed opacity-55" : "",
            ].join(" ")}
          />
          <div className="mt-1.5 flex items-center justify-between">
            <p className="text-[0.7rem] text-[var(--brand-muted-light)]">
              Detalhes concretos rendem artes melhores
            </p>
            <p className="text-[0.7rem] font-bold tabular-nums text-[var(--brand-muted-light)]">
              {conceito.length}/240
            </p>
          </div>
        </div>

        {/* Suggestions */}
        <div className="mt-6">
          <p className="mb-2.5 text-[0.64rem] font-black uppercase tracking-[.16em] text-[var(--brand-muted-light)]">
            Ou comece por aqui
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setConceito(s)}
                disabled={busy}
                className={[
                  "rounded-full border px-3.5 py-2 text-[0.76rem] font-bold",
                  "transition-all duration-[var(--dur-fast)]",
                  conceito === s
                    ? "border-[var(--brand-orange)] bg-[var(--brand-orange-subtle)] text-[var(--brand-orange-deep)]"
                    : "border-[var(--brand-border-soft)] bg-white text-[var(--brand-muted)] hover:border-[var(--brand-orange)] hover:text-[var(--brand-black)]",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                ].join(" ")}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Reference image */}
        <div className="mt-6">
          <p className="mb-2.5 text-[0.64rem] font-black uppercase tracking-[.16em] text-[var(--brand-muted-light)]">
            Imagem de referência <span className="normal-case tracking-normal font-bold">(opcional)</span>
          </p>

          {reference ? (
            <div className="flex items-center gap-4 rounded-[var(--radius-md)] border border-[var(--brand-border-soft)] bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={reference}
                alt="Referência enviada"
                className="h-16 w-16 rounded-[var(--radius-sm)] object-cover"
              />
              <div className="flex-1">
                <p className="text-[0.82rem] font-bold text-[var(--brand-black)]">
                  Referência anexada
                </p>
                <p className="mt-0.5 text-[0.72rem] leading-5 text-[var(--brand-muted)]">
                  A IA vai usar como base e redesenhar no estilo da caneca.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReference(null)}
                disabled={busy}
                aria-label="Remover referência"
                className="shrink-0 rounded-full p-2 text-[var(--brand-muted-light)] transition-colors hover:bg-[var(--brand-surface)] hover:text-[var(--brand-black)] disabled:opacity-40"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <label
              className={[
                "flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)]",
                "border-2 border-dashed border-[var(--brand-border)] bg-white px-4 py-3.5",
                "transition-colors hover:border-[var(--brand-orange)]",
                busy ? "pointer-events-none opacity-50" : "",
              ].join(" ")}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--brand-orange-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span className="text-[0.82rem] font-bold text-[var(--brand-muted)]">
                Enviar foto do pet, do casal, de um desenho…
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={busy}
                onChange={(e) => pickReference(e.target.files?.[0])}
              />
            </label>
          )}
        </div>

        {/* Generate */}
        <button
          type="button"
          onClick={generate}
          disabled={!conceito.trim() || busy}
          className={[
            "mt-8 flex w-full items-center justify-center gap-2.5 rounded-[var(--radius-md)] px-6 py-4",
            "text-[0.86rem] font-black uppercase tracking-[.14em] text-white",
            "bg-[var(--brand-orange)] shadow-[var(--shadow-orange)]",
            "transition-all duration-[var(--dur-base)]",
            "enabled:hover:bg-[var(--brand-orange-deep)] enabled:hover:shadow-[var(--shadow-orange-lg)]",
            "enabled:hover:-translate-y-0.5 enabled:active:translate-y-0",
            "disabled:cursor-not-allowed disabled:opacity-45",
          ].join(" ")}
        >
          {busy ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Criando sua arte
            </>
          ) : status === "done" ? (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M23 4v6h-6M1 20v-6h6M20.5 9A9 9 0 0 0 5.6 5.6L1 10m22 4l-4.6 4.4A9 9 0 0 1 3.5 15" />
              </svg>
              Gerar outra versão
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.2 5.9L20 10l-5.8 2.1L12 18l-2.2-5.9L4 10l5.8-2.1z" />
              </svg>
              Gerar minha arte
            </>
          )}
        </button>

        {status === "error" && (
          <div className="mt-4 flex items-start gap-3 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-red-500" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <p className="text-[0.86rem] leading-6 text-red-700">{errorMsg}</p>
          </div>
        )}

        {/* ── Step 2, revealed after generation ── */}
        {status === "done" && (
          <div
            className="mt-12 border-t border-[var(--brand-border-soft)] pt-10"
            style={{ animation: "fadeSlideUp .55s var(--ease-spring) both" }}
          >
            <div className="flex items-center gap-3">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--brand-black)] text-[0.7rem] font-black text-white">
                2
              </span>
              <p className="text-[0.68rem] font-black uppercase tracking-[.2em] text-[var(--brand-black)]">
                Aprove e finalize
              </p>
            </div>

            <h3 className="font-display mt-4 text-[1.75rem] font-black leading-tight tracking-[-.04em]">
              Gire a caneca e veja de todos os ângulos.
            </h3>
            <p className="mt-2.5 text-[0.92rem] leading-7 text-[var(--brand-muted)]">
              Se não ficou do jeito que imaginou, é só gerar outra versão —
              quantas quiser, sem custo.
            </p>

            <p className="mt-4 text-[0.76rem] leading-6 text-[var(--brand-muted-light)]">
              O arquivo de impressão sai em {PRINT_SIZE.widthCm}×{PRINT_SIZE.heightCm}&nbsp;cm
              a {PRINT_SIZE.dpi}&nbsp;DPI, com sangria e marca de corte — pronto para a sublimadora.
            </p>

            {art?.direcao && (
              <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--brand-border-soft)] bg-white p-4">
                <p className="text-[0.6rem] font-black uppercase tracking-[.16em] text-[var(--brand-orange-deep)]">
                  Conceito escolhido
                  {art.totalAvaliados ? ` · entre ${art.totalAvaliados} avaliados` : ""}
                </p>
                <p className="font-display mt-2 text-[1.15rem] font-black tracking-[-.03em]">
                  {art.direcao.titulo}
                </p>
                <p className="mt-1.5 text-[0.84rem] leading-6 text-[var(--brand-muted)]">
                  {art.direcao.descricao}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                  <p className="text-[0.72rem] text-[var(--brand-muted-light)]">
                    <span className="font-black uppercase tracking-[.1em]">Paleta</span>{" "}
                    {art.direcao.paleta}
                  </p>
                  <p className="text-[0.72rem] text-[var(--brand-muted-light)]">
                    <span className="font-black uppercase tracking-[.1em]">Estilo</span>{" "}
                    {art.direcao.estilo}
                  </p>
                </div>
                {art.justificativa && (
                  <p className="mt-3 border-t border-[var(--brand-border-soft)] pt-3 text-[0.8rem] leading-6 text-[var(--brand-muted)]">
                    {art.justificativa}
                  </p>
                )}
              </div>
            )}

            {art?.promptUsado && (
              <details className="mt-6 rounded-[var(--radius-md)] border border-[var(--brand-border-soft)] bg-[var(--brand-surface)] px-4 py-3">
                <summary className="cursor-pointer text-[0.74rem] font-black uppercase tracking-[.14em] text-[var(--brand-muted)]">
                  Como a IA entendeu sua ideia
                </summary>
                <p className="mt-3 text-[0.82rem] leading-6 text-[var(--brand-muted)]">
                  {art.promptUsado}
                </p>
              </details>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/produtos/caneca-branca"
                className={[
                  "inline-flex items-center gap-2 rounded-[var(--radius-md)] px-6 py-3.5",
                  "bg-[var(--brand-black)] text-[0.84rem] font-black text-white",
                  "shadow-[var(--shadow-md)] transition-all",
                  "hover:bg-[var(--brand-black-rich)] hover:-translate-y-0.5",
                ].join(" ")}
              >
                Quero essa caneca · R$ 39,90
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              {art && (
                <button
                  type="button"
                  onClick={baixarArteImpressao}
                  disabled={baixando}
                  className={[
                    "inline-flex items-center gap-2 rounded-[var(--radius-md)] border-2 px-5 py-3.5",
                    "border-[var(--brand-border)] text-[0.84rem] font-black text-[var(--brand-black)]",
                    "transition-colors hover:border-[var(--brand-black)] disabled:opacity-50",
                  ].join(" ")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  {baixando ? "Montando…" : "Baixar arte para impressão"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

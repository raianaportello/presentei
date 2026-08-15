"use client";
/**
 * Personalizer form with 360° mug viewer and AI art generation.
 * Client component — handles state, API calls and live mug preview.
 */
import { useState, useCallback } from "react";
import { Mug360 } from "./mug-360";

type Status = "idle" | "loading" | "done" | "error";

export function PersonalizerForm() {
  const [conceito, setConceito]   = useState("");
  const [imageUrl, setImageUrl]   = useState<string | undefined>();
  const [status, setStatus]       = useState<Status>("idle");
  const [errorMsg, setErrorMsg]   = useState("");

  const generate = useCallback(async () => {
    if (!conceito.trim() || status === "loading") return;
    setStatus("loading");
    setErrorMsg("");
    setImageUrl(undefined);

    try {
      const res = await fetch("/api/gerar-arte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conceito }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Erro desconhecido.");
      }

      setImageUrl(data.imageUrl);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Tente novamente.");
      setStatus("error");
    }
  }, [conceito, status]);

  const reset = () => {
    setImageUrl(undefined);
    setStatus("idle");
    setErrorMsg("");
  };

  return (
    <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-16">

      {/* ── Left: 360° mug viewer ── */}
      <div className="w-full max-w-sm shrink-0 lg:sticky lg:top-28">
        <Mug360
          artImageUrl={imageUrl}
          className="w-full"
        />

        {/* Art credit badge */}
        {status === "done" && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[var(--brand-orange-subtle)] px-4 py-2">
            <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2.5" strokeLinecap="round" className="text-[var(--brand-orange-deep)]">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <p className="text-[0.72rem] font-black text-[var(--brand-orange-deep)] uppercase tracking-[.16em]">
              Arte gerada por IA
            </p>
          </div>
        )}
      </div>

      {/* ── Right: form ── */}
      <div className="w-full max-w-lg">

        {/* Step header */}
        <div className="mb-8">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-[var(--brand-orange-deep)]">
            Passo 1
          </p>
          <h2 className="font-display mt-2 text-3xl font-black tracking-[-.05em] sm:text-4xl">
            Descreva sua ideia
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">
            Fale sobre a pessoa, memória ou ocasião especial. A IA transforma em arte para a caneca.
          </p>
        </div>

        {/* Conceito input */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="conceito"
              className="mb-2 block text-[0.72rem] font-black uppercase tracking-[0.18em] text-[var(--brand-muted)]"
            >
              O que você quer expressar?
            </label>
            <textarea
              id="conceito"
              value={conceito}
              onChange={(e) => setConceito(e.target.value.slice(0, 200))}
              placeholder="Ex: Minha vó adora jardim e flores, especialmente rosas laranja. Quero algo delicado que lembre ela..."
              rows={4}
              maxLength={200}
              disabled={status === "loading"}
              className={[
                "w-full resize-none rounded-[var(--radius-md)] border border-[var(--brand-border)]",
                "bg-white px-4 py-3 text-sm leading-6 text-[var(--brand-black)]",
                "placeholder:text-[var(--brand-muted-light)]",
                "transition-all duration-[var(--dur-fast)]",
                "focus:border-[var(--brand-orange)] focus:outline-none focus:shadow-[0_0_0_3px_var(--brand-orange-glow)]",
                status === "loading" ? "opacity-60 cursor-not-allowed" : "",
              ].join(" ")}
            />
            <p className="mt-1 text-right text-[0.68rem] text-[var(--brand-muted-light)]">
              {conceito.length}/200
            </p>
          </div>

          {/* Suggestions */}
          <div>
            <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[.14em] text-[var(--brand-muted-light)]">
              Sugestões de ideias
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Mãe que ama café e jardim",
                "Casal apaixonado por viagens",
                "Professor incrível de matemática",
                "Amigo que adora games retrô",
              ].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setConceito(s); reset(); }}
                  disabled={status === "loading"}
                  className={[
                    "rounded-full border border-[var(--brand-border-soft)] bg-white px-3 py-1.5",
                    "text-[0.72rem] font-bold text-[var(--brand-muted)]",
                    "transition-all duration-[var(--dur-fast)]",
                    "hover:border-[var(--brand-orange)] hover:text-[var(--brand-black)]",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                  ].join(" ")}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            type="button"
            onClick={generate}
            disabled={!conceito.trim() || status === "loading"}
            className={[
              "relative w-full overflow-hidden rounded-[var(--radius-md)] px-6 py-4",
              "text-sm font-black uppercase tracking-[.12em] text-white",
              "transition-all duration-[var(--dur-base)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              status !== "loading"
                ? "bg-[var(--brand-orange)] shadow-[var(--shadow-orange)] hover:bg-[var(--brand-orange-deep)] hover:shadow-[var(--shadow-orange-lg)] hover:-translate-y-px active:translate-y-0"
                : "bg-[var(--brand-orange)]",
            ].join(" ")}
          >
            {status === "loading" ? (
              <span className="flex items-center justify-center gap-3">
                {/* Spinner */}
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Gerando arte com IA…
              </span>
            ) : status === "done" ? (
              <span className="flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Arte gerada! Gerar outra versão
              </span>
            ) : (
              "✦ Gerar Arte com IA"
            )}
          </button>

          {/* Error message */}
          {status === "error" && (
            <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3">
              <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-red-500" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
              </svg>
              <p className="text-sm text-red-700">{errorMsg}</p>
            </div>
          )}

          {/* Success tip */}
          {status === "done" && (
            <div className="rounded-[var(--radius-md)] border border-[var(--brand-border-soft)] bg-[var(--brand-orange-subtle)] px-4 py-3">
              <p className="text-sm leading-6 text-[var(--brand-black)]">
                <strong>Gostou da arte?</strong> Gire a caneca acima para ver em 360°.{" "}
                Quando estiver pronto, escolha sua caneca e finalize o pedido.
              </p>
            </div>
          )}
        </div>

        {/* Step 2 preview (after art generated) */}
        {status === "done" && (
          <div className="mt-10 border-t border-[var(--brand-border-soft)] pt-8">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-[var(--brand-orange-deep)]">
              Passo 2
            </p>
            <h3 className="font-display mt-2 text-2xl font-black tracking-[-.04em]">
              Escolha a caneca ideal
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
              Essa arte fica linda em qualquer uma das nossas canecas. Qual é a sua favorita?
            </p>
            <a
              href="/produtos"
              className={[
                "mt-5 inline-flex items-center gap-2.5 rounded-[var(--radius-md)] px-6 py-3.5",
                "bg-[var(--brand-black)] text-sm font-black text-white",
                "transition-all hover:bg-[var(--brand-black-rich)] hover:-translate-y-px",
                "shadow-[var(--shadow-md)]",
              ].join(" ")}
            >
              Ver coleção de canecas
              <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MugCeramic } from "@/components/storefront/mug-ceramic";

const trust = [
  "R$ 39,90 por caneca",
  "Desconto empresarial 20%",
  "Frete calculado no final",
];

export function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <Container className="grid min-h-[min(100svh,840px)] items-stretch lg:grid-cols-[1.1fr_.9fr]">

        {/* ── Left: editorial content ── */}
        <div className="flex flex-col justify-center py-20 lg:py-28 lg:pr-16">

          {/* Overline */}
          <div className="hero-text-1 mb-7 flex items-center gap-2.5">
            <span aria-hidden className="pulse-dot block h-2 w-2 rounded-full bg-[var(--brand-orange)]" />
            <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-[var(--brand-orange-deep)]">
              Presente personalizado desde a primeira ideia
            </p>
          </div>

          {/* Headline */}
          <h1 className="hero-text-2 font-display max-w-[800px] text-[clamp(3.8rem,8.5vw,7.5rem)] font-black leading-[.82] tracking-[-.08em] text-[var(--brand-black)]">
            Uma ideia.<br />
            <span className="text-[var(--brand-orange)]">Um presente</span><br />
            só seu.
          </h1>

          {/* Body */}
          <p className="hero-text-3 mt-8 max-w-lg text-lg leading-8 text-[var(--brand-muted)]">
            Você conta a história. A Presentei transforma em uma caneca feita
            para emocionar, celebrar e ser lembrada.
          </p>

          {/* CTAs */}
          <div className="hero-text-4 mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/personalizar" size="lg">
              Criar meu presente
            </ButtonLink>
            <ButtonLink href="/produtos" variant="secondary" size="lg">
              Ver coleção
            </ButtonLink>
          </div>

          {/* Trust strip */}
          <div className="hero-text-5 mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
            {trust.map((item) => (
              <p
                key={item}
                className="flex items-center gap-2 text-[0.8rem] font-bold text-[var(--brand-muted)]"
              >
                <span
                  aria-hidden
                  className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--brand-orange-soft)] text-[9px] font-black text-[var(--brand-orange-deep)]"
                >
                  ✓
                </span>
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* ── Right: orange panel ── */}
        <div
          className="hero-panel relative min-h-[520px] overflow-hidden bg-[var(--brand-orange)] lg:-mr-[max(1.25rem,calc((100vw-1240px)/2))]"
        >
          {/* Dot-grid texture */}
          <div aria-hidden className="dot-grid absolute inset-0" />

          {/* Decorative rings */}
          <div
            aria-hidden
            className="absolute -right-28 -top-28 h-[520px] w-[520px] rounded-full border-2 border-white/20"
          />
          <div
            aria-hidden
            className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full border border-white/15"
          />

          {/* Background word-mark */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-2 top-8 select-none font-display text-[8.5rem] font-black leading-[.7] tracking-[-.1em] text-white/10 sm:text-[11rem]"
          >
            SUA<br />IDEIA
          </div>

          {/* Mug + price badge, centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
            {/* Ceramic mug */}
            <div
              className="hero-mug-float"
              style={{ filter: "drop-shadow(0 28px 52px rgba(40,12,0,0.48))" }}
            >
              <MugCeramic
                idPrefix="hero"
                className="h-64 w-auto sm:h-72"
              />
            </div>

            {/* Price badge */}
            <div
              className="float-subtle rounded-full bg-white px-5 py-2.5"
              style={{ boxShadow: "var(--shadow-lg)" }}
            >
              <p className="text-sm font-black text-[var(--brand-black)]">
                <span className="text-[var(--brand-orange)]">R$ 39,90</span>
                {" "}· você só confere o frete
              </p>
            </div>
          </div>

          {/* Bottom caption */}
          <p className="absolute bottom-7 left-7 max-w-[15rem] text-sm font-extrabold leading-5 text-white/90">
            Da primeira ideia ao presente pronto, sem complicação.
          </p>
        </div>

      </Container>
    </section>
  );
}

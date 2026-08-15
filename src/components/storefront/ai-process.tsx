import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const steps = [
  {
    title: "Conte",
    copy: "Uma lembrança, uma pessoa, uma piada, uma foto — qualquer ideia serve de começo.",
  },
  {
    title: "Veja",
    copy: "A Presentei cria a arte e mostra na caneca. Você aprova ou pede ajuste.",
  },
  {
    title: "Aprove",
    copy: "Gostou? Confira o frete e finalize. Simples assim.",
  },
];

export function AiProcess() {
  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden py-24 text-white sm:py-32"
      style={{ background: "var(--gradient-dark)" }}
    >
      {/* Dot-grid texture */}
      <div aria-hidden className="dot-grid-dark absolute inset-0" />

      {/* Decorative large circle */}
      <div
        aria-hidden
        className="absolute -right-40 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full border border-white/5"
      />

      <Container className="relative">
        <div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">

          {/* Left: intro */}
          <div className="flex flex-col justify-center">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-[var(--brand-orange)]">
              Criar é fácil
            </p>
            <h2 className="font-display mt-5 text-[clamp(2.8rem,5.5vw,4.5rem)] font-black leading-[.92] tracking-[-.07em]">
              Você imagina.<br />
              <span className="text-[var(--brand-orange)]">A gente dá forma.</span>
            </h2>
            <p className="mt-6 max-w-sm text-[0.96rem] leading-7 text-white/55">
              Nada de telas complicadas ou palavras técnicas. São três momentos simples, do começo ao presente pronto.
            </p>
            <div className="mt-8">
              <ButtonLink href="/personalizar" variant="white">
                Começar minha caneca
              </ButtonLink>
            </div>
          </div>

          {/* Right: steps */}
          <ol className="flex flex-col divide-y divide-white/10">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="group flex gap-6 py-8 transition-colors duration-[var(--dur-base)] hover:bg-white/[0.03] hover:px-4 hover:rounded-[var(--radius-md)] sm:gap-8"
              >
                {/* Step number */}
                <div className="shrink-0">
                  <span className="font-display text-[2.75rem] font-black leading-none tracking-[-.06em] text-[var(--brand-orange)]">
                    0{i + 1}
                  </span>
                </div>

                {/* Step content */}
                <div className="pt-1">
                  <h3 className="font-display text-[1.9rem] font-black tracking-[-.04em] transition-colors duration-[var(--dur-fast)] group-hover:text-[var(--brand-orange-soft)]">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[0.95rem] leading-7 text-white/55">
                    {step.copy}
                  </p>
                </div>
              </li>
            ))}
          </ol>

        </div>
      </Container>
    </section>
  );
}

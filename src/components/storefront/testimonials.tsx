import { Container } from "@/components/ui/container";

const promises = [
  {
    title: "Preço fixo",
    value: "R$ 39,90",
    desc: "Uma caneca, uma ideia, um preço justo. Só o frete varia.",
  },
  {
    title: "Desconto para empresas",
    value: "−20%",
    desc: "A partir de 10 canecas, o desconto é automático. Sem negociação.",
  },
  {
    title: "Feito em Curitiba",
    value: "com carinho",
    desc: "Cada pedido é único e tratado como se fosse o único.",
  },
];

/** Stars SVG — 5 filled */
function Stars() {
  return (
    <span aria-label="5 estrelas" className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          aria-hidden
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-[var(--brand-orange)]"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28" style={{ background: "var(--gradient-surface)" }}>
      <Container>

        {/* Section header */}
        <div className="text-center">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-[var(--brand-orange-deep)]">
            Feito com carinho em Curitiba
          </p>
          <h2 className="font-display mx-auto mt-5 max-w-3xl text-[clamp(2.4rem,4.5vw,3.5rem)] font-black leading-[.95] tracking-[-.06em]">
            A próxima história bonita pode começar na sua caneca.
          </h2>
        </div>

        {/* Brand promise cards */}
        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {promises.map((p) => (
            <div
              key={p.title}
              className="group rounded-[var(--radius-xl)] border border-[var(--brand-border-soft)] bg-white p-8 transition-shadow duration-[var(--dur-base)] hover:shadow-[var(--shadow-md)]"
            >
              <p className="text-[0.7rem] font-black uppercase tracking-[0.18em] text-[var(--brand-muted-light)]">
                {p.title}
              </p>
              <p className="font-display mt-3 text-[2rem] font-black leading-none tracking-[-.05em] text-[var(--brand-orange)]">
                {p.value}
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Honest placeholder for reviews */}
        <div className="mt-10 rounded-[var(--radius-xl)] border border-[var(--brand-border-soft)] bg-white p-10 text-center sm:p-14">
          <Stars />
          <blockquote className="mt-5">
            <p className="font-display mx-auto max-w-2xl text-[1.6rem] font-black leading-[1.1] tracking-[-.04em] text-[var(--brand-black)] sm:text-[2rem]">
              "Avaliações reais estarão aqui antes do lançamento. Sem nomes ou depoimentos inventados."
            </p>
          </blockquote>
          <p className="mt-5 text-sm text-[var(--brand-muted)]">
            A Presentei está em pré-lançamento. Seja uma das primeiras histórias reais.
          </p>
        </div>

      </Container>
    </section>
  );
}

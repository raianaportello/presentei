import { Container } from "@/components/ui/container";

/**
 * The credibility layer. Deliberately factual and unshowy — it is the
 * counterweight to the playful voice everywhere else on the page.
 */
const ITEMS = [
  {
    label: "Preço único",
    value: "R$ 39,90",
    note: "Sem taxa de arte, sem cobrança por revisão.",
    icon: (
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    ),
  },
  {
    label: "Empresas",
    value: "20% off",
    note: "Desconto automático por quantidade no pedido.",
    icon: (
      <>
        <path d="M3 21h18M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-5h6v5" />
      </>
    ),
  },
  {
    label: "Arte por IA",
    value: "Ilimitada",
    note: "Gere quantas versões quiser até aprovar.",
    icon: <path d="M12 2l2.4 6.4L21 11l-6.6 2.6L12 20l-2.4-6.4L3 11l6.6-2.6z" />,
  },
  {
    label: "Aprovação",
    value: "Em 360°",
    note: "Você vê a caneca girando antes de fechar.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
      </>
    ),
  },
];

export function TrustBand() {
  return (
    <section className="border-y border-[var(--brand-border-soft)] bg-[var(--brand-surface)] py-14">
      <Container>
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <div key={item.label} className="flex gap-4">
              <span
                aria-hidden
                className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white ring-1 ring-[var(--brand-border-soft)]"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--brand-orange-deep)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {item.icon}
                </svg>
              </span>

              <div>
                <p className="text-[0.6rem] font-black uppercase tracking-[.18em] text-[var(--brand-muted-light)]">
                  {item.label}
                </p>
                <p className="font-display mt-1 text-[1.35rem] font-black leading-none tracking-[-.04em] text-[var(--brand-black)]">
                  {item.value}
                </p>
                <p className="mt-2 text-[0.82rem] leading-6 text-[var(--brand-muted)]">
                  {item.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

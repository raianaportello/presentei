import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PersonalizerForm } from "@/components/storefront/personalizer-form";

export const metadata: Metadata = {
  title: "Personalizar | Presentei",
  description:
    "Descreva sua ideia e veja a arte gerada por IA aparecer na sua caneca em tempo real. Gire 360° antes de confirmar.",
};

export default function PersonalizarPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="border-b border-[var(--brand-border-soft)] py-16 sm:py-20"
        style={{ background: "var(--gradient-hero)" }}
      >
        <Container>
          <div className="max-w-2xl">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-[var(--brand-orange-deep)]">
              ✦ Personalizador com IA
            </p>
            <h1 className="font-display mt-4 text-[clamp(3rem,6vw,5rem)] font-black leading-[.88] tracking-[-.07em]">
              Descreva.<br />
              <span className="text-[var(--brand-orange)]">A IA cria.</span><br />
              Você aprova.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-[var(--brand-muted)]">
              Fale sobre a pessoa ou ocasião especial. Em segundos, geramos uma arte
              exclusiva para você ver na caneca — e girar em 360° antes de confirmar.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Personalizer ── */}
      <section className="py-16 sm:py-24" style={{ background: "var(--brand-surface)" }}>
        <Container>
          <PersonalizerForm />
        </Container>
      </section>

      {/* ── How it works strip ── */}
      <section className="border-t border-[var(--brand-border-soft)] py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                num: "01",
                title: "Você conta a história",
                desc: "Uma memória, um apelido carinhoso, uma data. Quanto mais detalhe, mais especial fica a arte.",
              },
              {
                num: "02",
                title: "A IA cria a arte",
                desc: "Nossa IA gera uma ilustração exclusiva em estilo aquarela, feita para impressão em cerâmica.",
              },
              {
                num: "03",
                title: "Você aprova em 360°",
                desc: "Gire a caneca para ver a arte de todos os ângulos antes de confirmar o pedido.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="rounded-[var(--radius-xl)] border border-[var(--brand-border-soft)] bg-white p-8"
              >
                <p className="font-display text-[2.5rem] font-black leading-none tracking-[-.08em] text-[var(--brand-orange-soft)]">
                  {step.num}
                </p>
                <h3 className="font-display mt-5 text-xl font-black tracking-[-.03em]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

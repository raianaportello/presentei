import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <section className="overflow-hidden bg-[var(--brand-surface)]">
      <Container className="grid min-h-[690px] items-stretch lg:grid-cols-[1.08fr_.92fr]">
        <div className="flex flex-col justify-center py-16 lg:py-24 lg:pr-14">
          <p className="mb-6 text-xs font-black uppercase tracking-[.2em] text-[var(--brand-orange-deep)]">Transforme afeto em presente</p>
          <h1 className="font-display max-w-[760px] text-[clamp(3.7rem,8vw,7.4rem)] font-black leading-[.82] tracking-[-.075em] text-[var(--brand-black)]">
            Uma ideia.<br /><span className="text-[var(--brand-orange)]">Um presente</span><br />só seu.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--brand-muted)]">Você conta a ideia. A Presentei transforma em uma caneca feita para emocionar, celebrar ou marcar presença.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><ButtonLink href="/personalizar">Criar meu presente</ButtonLink><ButtonLink href="/produtos" variant="secondary">Ver presentes</ButtonLink></div>
          <p className="mt-6 flex items-center gap-2 text-sm font-bold"><span aria-hidden className="grid h-7 w-7 place-items-center rounded-full bg-[var(--brand-orange-soft)]">✓</span> Caneca por R$ 39,90. Você só confere o frete.</p>
        </div>
        <div className="relative min-h-[480px] overflow-hidden bg-[var(--brand-orange)] lg:-mr-[max(1.25rem,calc((100vw-1240px)/2))]">
          <div aria-hidden className="absolute -left-8 top-12 font-display text-[9rem] font-black leading-[.72] tracking-[-.09em] text-white/15 sm:text-[12rem]">SUA<br />IDEIA</div>
          <div className="absolute inset-0 grid place-items-center">
            <div className="hero-mug relative grid h-64 w-52 -rotate-6 place-items-center rounded-b-[4rem] rounded-t-2xl bg-white text-center shadow-[0_32px_55px_rgba(92,29,0,.28)] sm:h-80 sm:w-64">
              <span className="font-display text-3xl font-black leading-[.9] tracking-[-.06em] text-[var(--brand-orange)] sm:text-4xl">FEITO<br />POR VOCÊ</span>
            </div>
          </div>
          <p className="absolute bottom-7 left-7 max-w-[15rem] text-sm font-extrabold leading-5 text-white">Da primeira ideia ao presente pronto, sem complicação.</p>
        </div>
      </Container>
    </section>
  );
}

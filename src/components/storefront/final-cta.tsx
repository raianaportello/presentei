import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function FinalCta() {
  return (
    <section
      className="relative overflow-hidden py-24 text-white sm:py-32"
      style={{ background: "var(--gradient-orange)" }}
    >
      {/* Dot-grid texture */}
      <div aria-hidden className="dot-grid absolute inset-0" />

      {/* Decorative rings */}
      <div
        aria-hidden
        className="absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full border border-white/15"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -right-24 h-[360px] w-[360px] rounded-full border-2 border-white/10"
      />

      <Container className="relative text-center">
        {/* Overline */}
        <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-white/70">
          Tem alguém especial esperando
        </p>

        {/* Headline */}
        <h2 className="font-display mx-auto mt-6 max-w-4xl text-[clamp(3rem,7vw,6rem)] font-black leading-[.88] tracking-[-.08em]">
          Não compre qualquer presente.{" "}
          <span className="block text-white/80">
            Crie o que só você poderia dar.
          </span>
        </h2>

        {/* CTAs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <ButtonLink href="/personalizar" variant="dark" size="lg">
            Criar meu presente
          </ButtonLink>
          <ButtonLink href="/empresas" variant="white" size="lg">
            Pedir para empresa
          </ButtonLink>
        </div>

        {/* Micro trust */}
        <p className="mt-8 text-sm font-bold text-white/60">
          R$ 39,90 · Desconto empresarial · Frete calculado no final
        </p>
      </Container>
    </section>
  );
}

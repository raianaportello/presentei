import Link from "next/link";
import { Container } from "@/components/ui/container";

const paths = [
  {
    number: "01",
    label: "Para pessoas",
    title: "Um presente com história",
    copy: "Datas especiais, família, amigos, amores, pets — tudo que merece virar memória com forma.",
    href: "/personalizar",
    action: "Criar meu presente",
    bg: "bg-[var(--brand-surface)]",
    hover: "hover:bg-[var(--brand-orange-subtle)]",
  },
  {
    number: "02",
    label: "Para empresas",
    title: "Sua marca em boas mãos",
    copy: "Brindes, equipes, eventos e grandes pedidos com atendimento próximo e desconto automático por quantidade.",
    href: "/empresas",
    action: "Montar pedido empresarial",
    bg: "bg-[var(--brand-black)]",
    hover: "",
    dark: true,
  },
];

export function AudiencePaths() {
  return (
    <section
      aria-labelledby="caminhos-heading"
      className="border-y border-[var(--brand-border)] bg-white"
    >
      <Container className="grid px-0 md:grid-cols-2">
        {paths.map((path, index) => (
          <article
            key={path.label}
            className={[
              "group relative overflow-hidden p-10 transition-colors duration-[var(--dur-slow)] sm:p-14 lg:p-16",
              path.bg,
              path.hover,
              index === 0
                ? "md:border-r md:border-[var(--brand-border)]"
                : "border-t border-[var(--brand-border)] md:border-t-0",
            ].join(" ")}
          >
            {/* Editorial number */}
            <span
              aria-hidden
              className={[
                "absolute right-8 top-8 font-display text-8xl font-black leading-none tracking-[-.08em] transition-opacity duration-[var(--dur-slow)]",
                path.dark
                  ? "text-white/10 group-hover:text-white/15"
                  : "text-[var(--brand-black)]/5 group-hover:text-[var(--brand-orange)]/12",
              ].join(" ")}
            >
              {path.number}
            </span>

            {/* Label badge */}
            <p
              className={[
                "inline-flex rounded-full px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[.14em]",
                path.dark
                  ? "bg-white/10 text-white/80"
                  : "bg-[var(--brand-orange-soft)] text-[var(--brand-orange-deep)]",
              ].join(" ")}
            >
              {path.label}
            </p>

            {/* Headline */}
            <h2
              id={index === 0 ? "caminhos-heading" : undefined}
              className={[
                "font-display mt-7 text-[clamp(2.2rem,4vw,3.25rem)] font-black leading-[.95] tracking-[-.05em]",
                path.dark ? "text-white" : "text-[var(--brand-black)]",
              ].join(" ")}
            >
              {path.title}
            </h2>

            {/* Body */}
            <p
              className={[
                "mt-5 max-w-lg text-[0.96rem] leading-7",
                path.dark ? "text-white/60" : "text-[var(--brand-muted)]",
              ].join(" ")}
            >
              {path.copy}
            </p>

            {/* CTA link */}
            <Link
              href={path.href}
              className={[
                "group/link mt-8 inline-flex items-center gap-2 text-sm font-black",
                "transition-colors duration-[var(--dur-fast)]",
                path.dark
                  ? "text-[var(--brand-orange)] hover:text-white"
                  : "text-[var(--brand-orange-deep)] hover:text-[var(--brand-black)]",
              ].join(" ")}
            >
              {path.action}
              <span
                aria-hidden
                className="inline-block transition-transform duration-[var(--dur-base)] ease-[var(--ease-spring)] group-hover/link:translate-x-1"
              >
                →
              </span>
            </Link>
          </article>
        ))}
      </Container>
    </section>
  );
}

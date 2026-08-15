import Link from "next/link";
import { Container } from "@/components/ui/container";

const categories = [
  {
    label: "Com fotos",
    href: "/produtos?categoria=Com+fotos",
    bg: "bg-[var(--brand-orange-subtle)]",
    hoverBg: "hover:bg-[var(--brand-orange-soft)]",
    iconBg: "bg-[var(--brand-orange-soft)]",
    icon: (
      <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    ),
  },
  {
    label: "Para família",
    href: "/produtos?categoria=Para+fam%C3%ADlia",
    bg: "bg-[var(--brand-surface-2)]",
    hoverBg: "hover:bg-[var(--brand-orange-subtle)]",
    iconBg: "bg-[var(--brand-orange-soft)]",
    icon: (
      <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Para quem você ama",
    href: "/produtos?categoria=Para+quem+voc%C3%AA+ama",
    bg: "bg-white",
    hoverBg: "hover:bg-[var(--brand-orange-subtle)]",
    iconBg: "bg-[var(--brand-orange-soft)]",
    icon: (
      <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-[var(--brand-orange)]">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    label: "Para empresas",
    href: "/empresas",
    bg: "bg-[var(--brand-black)]",
    hoverBg: "hover:bg-[var(--brand-black-rich)]",
    iconBg: "bg-white/10",
    dark: true,
    icon: (
      <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
  },
];

export function CategoryGrid() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        {/* Header */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-[var(--brand-orange-deep)]">
              Encontre pelo motivo
            </p>
            <h2 className="font-display mt-4 max-w-xl text-[clamp(2.6rem,5vw,3.75rem)] font-black leading-[.95] tracking-[-.06em]">
              Presentes começam por alguém.
            </h2>
          </div>
          <Link
            href="/produtos"
            className="hidden shrink-0 text-sm font-black text-[var(--brand-muted)] underline underline-offset-4 transition-colors hover:text-[var(--brand-black)] sm:block"
          >
            Ver todos →
          </Link>
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className={[
                "group flex min-h-52 flex-col justify-between rounded-[var(--radius-lg)] p-6",
                "transition-all duration-[var(--dur-base)] ease-[var(--ease-spring)]",
                "hover:-translate-y-1.5 hover:shadow-[var(--shadow-md)]",
                cat.bg,
                cat.hoverBg,
              ].join(" ")}
            >
              {/* Icon */}
              <div
                className={[
                  "grid h-11 w-11 place-items-center rounded-[var(--radius-sm)]",
                  cat.dark ? "text-white/80" : "text-[var(--brand-orange-deep)]",
                  cat.iconBg,
                ].join(" ")}
              >
                {cat.icon}
              </div>

              {/* Label + arrow */}
              <div>
                <p
                  className={[
                    "font-display text-[1.35rem] font-black leading-tight tracking-[-.04em]",
                    "transition-colors duration-[var(--dur-fast)]",
                    cat.dark
                      ? "text-white group-hover:text-[var(--brand-orange-soft)]"
                      : "text-[var(--brand-black)] group-hover:text-[var(--brand-orange-deep)]",
                  ].join(" ")}
                >
                  {cat.label}
                </p>
                <p
                  aria-hidden
                  className={[
                    "mt-1 text-sm font-black transition-transform duration-[var(--dur-base)] ease-[var(--ease-spring)] group-hover:translate-x-1",
                    cat.dark ? "text-white/40" : "text-[var(--brand-muted-light)]",
                  ].join(" ")}
                >
                  →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

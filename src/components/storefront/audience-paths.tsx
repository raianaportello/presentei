import Link from "next/link";
import { Container } from "@/components/ui/container";

const paths = [
  { label: "Para pessoas", title: "Um presente com história", copy: "Datas especiais, família, amigos, amores, pets e tudo que merece virar memória.", href: "/personalizar", action: "Criar meu presente" },
  { label: "Para empresas", title: "Sua marca em boas mãos", copy: "Brindes, equipes, eventos e grandes pedidos com atendimento próximo e desconto por quantidade.", href: "/empresas", action: "Montar pedido empresarial" },
];

export function AudiencePaths() {
  return <section aria-labelledby="caminhos" className="border-y border-[var(--brand-border)] bg-white"><Container className="grid px-0 md:grid-cols-2">{paths.map((path, index) => <article key={path.label} className={`p-8 sm:p-12 lg:p-16 ${index === 0 ? "md:border-r md:border-[var(--brand-border)]" : "border-t border-[var(--brand-border)] md:border-t-0"}`}><p className="inline-flex rounded-full bg-[var(--brand-orange-soft)] px-3 py-2 text-xs font-black uppercase tracking-[.12em] text-[var(--brand-orange-deep)]">{path.label}</p><h2 id={index === 0 ? "caminhos" : undefined} className="font-display mt-6 text-4xl font-black tracking-[-.05em] sm:text-5xl">{path.title}</h2><p className="mt-4 max-w-lg leading-7 text-[var(--brand-muted)]">{path.copy}</p><Link href={path.href} className="mt-7 inline-flex text-sm font-black text-[var(--brand-orange-deep)] underline decoration-2 underline-offset-6 hover:text-[var(--brand-black)]">{path.action} →</Link></article>)}</Container></section>;
}

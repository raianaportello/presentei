import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function PersonalizarPage() { return <Container className="py-20 sm:py-28"><div className="mx-auto max-w-3xl text-center"><p className="text-xs font-black uppercase tracking-[.2em] text-[var(--brand-orange-deep)]">Crie com a Presentei</p><h1 className="font-display mt-5 text-5xl font-black tracking-[-.06em] sm:text-7xl">Escolha. Conte. Aprove.</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[var(--brand-muted)]">O personalizador completo chega na próxima fase. Enquanto isso, conheça as canecas e escolha por onde quer começar.</p><ButtonLink href="/produtos" className="mt-8">Escolher minha caneca</ButtonLink></div></Container>; }

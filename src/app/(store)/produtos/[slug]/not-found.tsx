import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
export default function ProductNotFound() { return <Container className="py-28 text-center"><h1 className="font-display text-5xl font-black">Essa caneca não está por aqui.</h1><p className="mt-5 text-[var(--brand-muted)]">Veja os modelos disponíveis e escolha outro começo.</p><ButtonLink href="/produtos" className="mt-8">Ver canecas</ButtonLink></Container>; }

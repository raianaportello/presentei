import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/storefront/product-card";
import { getProducts } from "@/modules/catalog/get-products";
import { localProductRepository } from "@/modules/catalog/local-products";

export const metadata: Metadata = { title: "Canecas personalizadas", description: "Escolha uma caneca e transforme sua ideia em presente." };

export default async function ProductsPage() { const products = await getProducts(localProductRepository); return <Container className="py-16 sm:py-24"><div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[.2em] text-[var(--brand-orange-deep)]">Todas por R$ 39,90</p><h1 className="font-display mt-5 text-6xl font-black tracking-[-.07em] sm:text-7xl">Escolha sua caneca.</h1><p className="mt-5 text-lg leading-8 text-[var(--brand-muted)]">O formato muda. A parte especial é o que você vai colocar nela.</p></div><nav aria-label="Filtrar produtos" className="mt-10 flex flex-wrap gap-2">{["Todas", "Com fotos", "Para família", "Para empresas"].map((label) => <a key={label} href={label === "Todas" ? "/produtos" : `/produtos?categoria=${encodeURIComponent(label)}`} className="rounded-full border border-[var(--brand-border)] bg-white px-4 py-2 text-sm font-bold hover:border-[var(--brand-orange)]">{label}</a>)}</nav><div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div></Container>; }

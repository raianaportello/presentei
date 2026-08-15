import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/storefront/product-card";
import { getProducts } from "@/modules/catalog/get-products";
import { localProductRepository } from "@/modules/catalog/local-products";

export const metadata: Metadata = {
  title: "Canecas personalizadas",
  description: "Escolha uma caneca e transforme sua ideia em presente.",
};

const filters = ["Todas", "Com fotos", "Para família", "Para quem você ama", "Para empresas"];

export default async function ProductsPage() {
  const products = await getProducts(localProductRepository);

  return (
    <div style={{ background: "var(--gradient-hero)" }}>
      <Container className="py-16 sm:py-24">

        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-[var(--brand-orange-deep)]">
            Todas por R$ 39,90
          </p>
          <h1 className="font-display mt-5 text-[clamp(3.5rem,7vw,6rem)] font-black leading-[.88] tracking-[-.07em]">
            Escolha sua caneca.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--brand-muted)]">
            O formato muda. A parte especial é o que você vai colocar nela.
          </p>
        </div>

        {/* Filter chips */}
        <nav aria-label="Filtrar produtos" className="mt-10 flex flex-wrap gap-2">
          {filters.map((label) => (
            <a
              key={label}
              href={
                label === "Todas"
                  ? "/produtos"
                  : `/produtos?categoria=${encodeURIComponent(label)}`
              }
              className={[
                "rounded-full border px-4 py-2 text-sm font-bold",
                "transition-colors duration-[var(--dur-fast)]",
                label === "Todas"
                  ? "border-[var(--brand-black)] bg-[var(--brand-black)] text-white"
                  : [
                      "border-[var(--brand-border)] bg-white text-[var(--brand-muted)]",
                      "hover:border-[var(--brand-orange)] hover:text-[var(--brand-black)]",
                    ].join(" "),
              ].join(" ")}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </Container>
    </div>
  );
}

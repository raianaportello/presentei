import { Hero } from "@/components/storefront/hero";
import { TrustBand } from "@/components/storefront/trust-band";
import { AudiencePaths } from "@/components/storefront/audience-paths";
import { CategoryGrid } from "@/components/storefront/category-grid";
import { AiProcess } from "@/components/storefront/ai-process";
import { ProductSpotlight } from "@/components/storefront/product-spotlight";
import { Testimonials } from "@/components/storefront/testimonials";
import { FinalCta } from "@/components/storefront/final-cta";
import { getProducts } from "@/modules/catalog/get-products";
import { localProductRepository } from "@/modules/catalog/local-products";

export default async function HomePage() {
  const products = await getProducts(localProductRepository);

  return (
    <>
      <Hero />
      <TrustBand />
      <AudiencePaths />
      <CategoryGrid />
      <AiProcess />
      <ProductSpotlight products={products} />
      <Testimonials />
      <FinalCta />
    </>
  );
}

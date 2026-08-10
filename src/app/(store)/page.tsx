import { Hero } from "@/components/storefront/hero";
import { AudiencePaths } from "@/components/storefront/audience-paths";
import { CategoryGrid } from "@/components/storefront/category-grid";
import { AiProcess } from "@/components/storefront/ai-process";
import { FeaturedProducts } from "@/components/storefront/featured-products";
import { Testimonials } from "@/components/storefront/testimonials";
import { FinalCta } from "@/components/storefront/final-cta";
import { getProducts } from "@/modules/catalog/get-products";
import { localProductRepository } from "@/modules/catalog/local-products";

export default async function HomePage() {
  const products = await getProducts(localProductRepository);
  return <><Hero /><AudiencePaths /><CategoryGrid /><AiProcess /><FeaturedProducts products={products} /><Testimonials /><FinalCta /></>;
}

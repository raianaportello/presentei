import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductPurchasePanel } from "@/components/storefront/product-purchase-panel";
import { getProductBySlug } from "@/modules/catalog/get-products";
import { localProductRepository, products } from "@/modules/catalog/local-products";

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }
export async function generateMetadata({ params }: PageProps<"/produtos/[slug]">): Promise<Metadata> {
  const { slug } = await params; const product = await getProductBySlug(localProductRepository, slug);
  if (!product) return {};
  return { title: product.name, description: product.description, alternates: { canonical: `/produtos/${slug}` }, openGraph: { images: [{ url: product.imageUrl, alt: product.imageAlt }] } };
}
export default async function ProductPage({ params }: PageProps<"/produtos/[slug]">) {
  const { slug } = await params; const product = await getProductBySlug(localProductRepository, slug); if (!product) notFound();
  const jsonLd = { "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.description, image: product.images.map((image) => image.url), brand: { "@type": "Brand", name: "Presentei" }, offers: { "@type": "Offer", priceCurrency: "BRL", price: "39.90", availability: "https://schema.org/InStock", url: `${process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000"}/produtos/${slug}` } };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /><Container className="grid gap-10 py-12 sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:gap-16"><ProductGallery product={product} /><ProductPurchasePanel product={product} /></Container></>;
}

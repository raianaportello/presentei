import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductPurchasePanel } from "@/components/storefront/product-purchase-panel";
import { getProductBySlug } from "@/modules/catalog/get-products";
import { localProductRepository, products } from "@/modules/catalog/local-products";

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }

export async function generateMetadata({ params }: PageProps<"/produtos/[slug]">): Promise<Metadata> { const { slug } = await params; const product = await getProductBySlug(localProductRepository, slug); if (!product) return {}; return { title: product.name, description: product.description }; }

export default async function ProductPage({ params }: PageProps<"/produtos/[slug]">) { const { slug } = await params; const product = await getProductBySlug(localProductRepository, slug); if (!product) notFound(); return <Container className="grid gap-10 py-12 sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:gap-16"><ProductGallery product={product} /><ProductPurchasePanel product={product} /></Container>; }

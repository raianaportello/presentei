import type { MetadataRoute } from "next";
import { products } from "@/modules/catalog/local-products";
const base = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
export default function sitemap(): MetadataRoute.Sitemap {
  const core = ["", "/produtos", "/empresas", "/personalizar"].map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: path === "" ? 1 : .8 }));
  return [...core, ...products.map((product) => ({ url: `${base}/produtos/${product.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: .7 }))];
}

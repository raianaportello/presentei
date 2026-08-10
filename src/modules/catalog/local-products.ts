import type { ProductDetail } from "./types";
import type { ProductRepository } from "./product-repository";

export const products: ProductDetail[] = [
  { id: "mug-white", slug: "caneca-branca", name: "Caneca branca", description: "A clássica que combina com toda ideia.", priceCents: 3990, imageUrl: "/products/caneca-branca.svg", imageAlt: "Caneca branca com arte Presentei", category: "Canecas personalizadas", variants: [{ id: "white-325", name: "Branca 325 ml", color: "Branca" }], images: [{ url: "/products/caneca-branca.svg", alt: "Caneca branca com arte Presentei" }] },
  { id: "mug-black", slug: "caneca-preta", name: "Caneca preta", description: "Contraste marcante para artes cheias de atitude.", priceCents: 3990, imageUrl: "/products/caneca-preta.svg", imageAlt: "Caneca preta personalizada", category: "Canecas personalizadas", variants: [{ id: "black-325", name: "Preta 325 ml", color: "Preta" }], images: [{ url: "/products/caneca-preta.svg", alt: "Caneca preta personalizada" }] },
  { id: "mug-magic", slug: "caneca-magica", name: "Caneca mágica", description: "A arte aparece com a bebida quente e surpreende de verdade.", priceCents: 3990, imageUrl: "/products/caneca-magica.svg", imageAlt: "Caneca mágica revelando uma arte", category: "Canecas personalizadas", variants: [{ id: "magic-325", name: "Mágica 325 ml", color: "Preta" }], images: [{ url: "/products/caneca-magica.svg", alt: "Caneca mágica revelando uma arte" }] },
];

export const localProductRepository: ProductRepository = {
  async listActive() { return products.map(({ category: _category, variants: _variants, images: _images, ...product }) => product); },
  async findActiveBySlug(slug) { return products.find((product) => product.slug === slug) ?? null; },
};

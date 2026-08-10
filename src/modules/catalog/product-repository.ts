import type { ProductCardData, ProductDetail } from "./types";

export interface ProductRepository {
  listActive(): Promise<ProductCardData[]>;
  findActiveBySlug(slug: string): Promise<ProductDetail | null>;
}

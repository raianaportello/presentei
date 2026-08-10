import type { ProductRepository } from "./product-repository";

export function getProducts(repository: ProductRepository) {
  return repository.listActive();
}

export function getProductBySlug(repository: ProductRepository, slug: string) {
  return repository.findActiveBySlug(slug);
}

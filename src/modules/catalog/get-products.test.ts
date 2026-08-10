import { expect, it, vi } from "vitest";
import { getProducts } from "./get-products";

it("retorna somente os produtos ativos fornecidos pelo repositório", async () => {
  const products = [{ id: "p1", slug: "caneca-branca", name: "Caneca branca", description: "Clássica", priceCents: 3990, imageUrl: "/products/caneca-branca.svg", imageAlt: "Caneca branca personalizada" }];
  const repository = { listActive: vi.fn().mockResolvedValue(products), findActiveBySlug: vi.fn() };
  await expect(getProducts(repository)).resolves.toEqual(products);
  expect(repository.listActive).toHaveBeenCalledOnce();
});

import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ProductCard } from "./product-card";

it("mostra preço fixo e personalização", () => {
  render(<ProductCard product={{ id: "p1", slug: "caneca-branca", name: "Caneca branca", description: "Clássica", priceCents: 3990, imageUrl: "/products/caneca-branca.svg", imageAlt: "Caneca branca" }} />);
  expect(screen.getByText("R$ 39,90")).toBeVisible();
  expect(screen.getByRole("link", { name: /personalizar caneca branca/i })).toHaveAttribute("href", "/personalizar?produto=caneca-branca");
});

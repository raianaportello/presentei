import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { AudiencePaths } from "./audience-paths";

it("dá o mesmo peso a pessoas e empresas", () => {
  render(<AudiencePaths />);
  expect(screen.getByRole("link", { name: /criar meu presente/i })).toHaveAttribute("href", "/personalizar");
  expect(screen.getByRole("link", { name: /pedido empresarial/i })).toHaveAttribute("href", "/empresas");
});

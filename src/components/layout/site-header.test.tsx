import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { SiteHeader } from "./site-header";

it("oferece as duas jornadas e a criação", () => {
  render(<SiteHeader />);
  expect(screen.getByRole("link", { name: "Presentes" })).toHaveAttribute("href", "/produtos");
  expect(screen.getByRole("link", { name: "Para empresas" })).toHaveAttribute("href", "/empresas");
  expect(screen.getByRole("link", { name: /criar com ia/i })).toHaveAttribute("href", "/personalizar");
});

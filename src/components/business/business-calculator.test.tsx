import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { BusinessCalculator } from "./business-calculator";

it("explica e aplica o desconto em dez unidades", () => {
  render(<BusinessCalculator />);
  fireEvent.change(
    screen.getByLabelText("Quantidade de canecas", { exact: true }),
    { target: { value: "10" } },
  );
  expect(screen.getByText("R$ 319,20")).toBeVisible();
  expect(screen.getByText(/você economiza R\$ 79,80/i)).toBeVisible();
});

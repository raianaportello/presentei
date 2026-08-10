import { expect, test } from "@playwright/test";
test("desconto empresarial começa em dez canecas", async ({ page }) => {
  await page.goto("/empresas");
  const quantity = page.getByLabel("Quantidade de canecas", { exact: true });
  await quantity.fill("9");
  await expect(page.getByText("R$ 359,10")).toBeVisible();
  await quantity.fill("10");
  await expect(page.getByText("R$ 319,20")).toBeVisible();
  await expect(page.getByText(/economiza R\$ 79,80/i)).toBeVisible();
});

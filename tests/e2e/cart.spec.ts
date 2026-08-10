import { expect, test } from "@playwright/test";
test("carrinho persiste e aplica desconto empresarial", async ({ page }) => {
  await page.goto("/produtos/caneca-branca");
  await page.getByRole("button", { name: "Adicionar ao carrinho" }).click();
  await page.getByRole("link", { name: /ver carrinho/i }).click();
  await page.getByLabel("Quantidade de Caneca branca").fill("10");
  await page.getByLabel("Este pedido é para uma empresa").check();
  await expect(page.getByText("R$ 319,20")).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Quantidade de Caneca branca")).toHaveValue("10");
  await page.getByRole("button", { name: "Remover" }).click();
  await expect(page.getByRole("heading", { name: /carrinho está esperando/i })).toBeVisible();
});

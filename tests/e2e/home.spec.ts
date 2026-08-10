import { expect, test } from "@playwright/test";
test("homepage conduz pessoas e empresas", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /uma ideia.*um presente só seu/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /criar meu presente/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /pedido empresarial/i })).toBeVisible();
});

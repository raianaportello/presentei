import { expect, test } from "@playwright/test";

for (const viewport of [{ name: "mobile", width: 360, height: 800 }, { name: "tablet", width: 768, height: 1024 }, { name: "desktop", width: 1440, height: 900 }]) {
  test(`revisão visual da homepage em ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    await page.screenshot({ path: `test-results/presentei-home-${viewport.name}.png`, fullPage: true });
  });
}

for (const route of [{ name: "catalogo", path: "/produtos" }, { name: "produto", path: "/produtos/caneca-branca" }, { name: "empresas", path: "/empresas" }, { name: "carrinho", path: "/carrinho" }]) {
  test(`revisão visual de ${route.name}`, async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto(route.path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    await page.screenshot({ path: `test-results/presentei-${route.name}.png`, fullPage: true });
  });
}

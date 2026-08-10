# Presentei Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar a fundação comercial navegável da Presentei com identidade própria, homepage, catálogo, produto, jornada empresarial, carrinho, regras de preço e painel administrativo básico.

**Architecture:** Aplicação Next.js em monólito modular. Páginas consomem módulos de domínio; regras monetárias ficam em funções puras testadas; persistência usa PostgreSQL via Prisma; estado temporário do carrinho permanece no cliente e todos os totais são recalculados no servidor antes da compra.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL, Vitest, Testing Library, Playwright, Zod, Auth.js.

## Global Constraints

- Caneca custa exatamente R$ 39,90.
- Pedido empresarial identificado recebe 20% de desconto com 10 ou mais canecas elegíveis.
- Frete nunca recebe desconto.
- Valores monetários são inteiros em centavos nas regras de domínio e `Decimal` na persistência.
- Laranja Presentei `#FF620F`, preto `#171717`, branco `#FFFFFF` e fundo `#FFFAF5` são os tokens iniciais.
- A logo oficial é usada sem redesenho.
- A homepage dá igual importância às jornadas individual e empresarial.
- Interface e microcopy não usam termos técnicos de IA.
- Componentes React não acessam Prisma ou gateways diretamente.
- Mobile é tratado como layout próprio; teclado, contraste AA e movimento reduzido são obrigatórios.
- Dependências só são adicionadas quando usadas por uma tarefa deste plano.

---

## File Map

```text
src/
├── app/
│   ├── (store)/page.tsx                 # homepage
│   ├── (store)/produtos/page.tsx        # catálogo
│   ├── (store)/produtos/[slug]/page.tsx # produto
│   ├── empresas/page.tsx                # jornada empresarial
│   ├── carrinho/page.tsx                # carrinho
│   ├── admin/page.tsx                   # painel básico
│   ├── admin/login/page.tsx             # login administrativo
│   ├── api/auth/[...nextauth]/route.ts   # endpoints Auth.js
│   ├── layout.tsx                        # shell e metadata
│   ├── sitemap.ts                        # sitemap inicial
│   └── robots.ts                         # robots
├── components/
│   ├── ui/                               # primitivas visuais
│   ├── layout/                           # header/footer
│   ├── storefront/                      # hero, categorias, cards
│   ├── business/                        # CTA e calculadora B2B
│   └── cart/                            # drawer e linhas do carrinho
├── modules/
│   ├── catalog/                          # consultas e tipos de produtos
│   ├── pricing/                          # preço e desconto
│   ├── cart/                             # store e validação do carrinho
│   └── auth/                             # sessão e autorização admin
├── database/
│   ├── client.ts                         # cliente Prisma
│   └── seed.ts                           # catálogo inicial
├── config/site.ts                        # marca, contatos e navegação
└── styles/tokens.css                     # tokens da identidade
prisma/schema.prisma                      # modelos da fase 1
public/brand/presentei-logo.jpeg          # logo fornecida
tests/e2e/                                # jornadas críticas
```

---

### Task 1: Scaffold e qualidade básica

**Files:**
- Create: `package.json`
- Create: `src/app/layout.tsx`
- Create: `src/app/(store)/page.tsx`
- Create: `src/app/globals.css`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/test/setup.ts`
- Create: `.env.example`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: nenhuma.
- Produces: scripts `dev`, `build`, `lint`, `typecheck`, `test`, `test:e2e`; alias `@/*`; ambiente `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`.

- [ ] **Step 1: Criar a aplicação Next.js**

Run:

```powershell
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Expected: projeto criado sem substituir `docs/` ou `.gitignore` existentes.

- [ ] **Step 2: Instalar ferramentas de teste**

Run:

```powershell
npm install -D vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom @playwright/test
```

Expected: dependências registradas e auditoria sem erro de instalação.

- [ ] **Step 3: Configurar scripts e Vitest**

Add to `package.json`:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: { provider: "v8" },
  },
});
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Registrar variáveis de ambiente**

Create `.env.example`:

```dotenv
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/presentei
AUTH_SECRET=replace-with-a-long-random-value
ADMIN_EMAIL=admin@presentei.local
ADMIN_PASSWORD_HASH=replace-with-bcrypt-hash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 5: Executar o gate inicial**

Run:

```powershell
npm run lint
npm run typecheck
npm run build
```

Expected: três comandos com exit code 0.

- [ ] **Step 6: Commit**

```powershell
git add package.json package-lock.json src vitest.config.ts playwright.config.ts .env.example .gitignore
git commit -m "chore(app): iniciar aplicação Next.js"
```

---

### Task 2: Design system e shell da marca

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/config/site.ts`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/container.tsx`
- Create: `src/components/layout/site-header.tsx`
- Create: `src/components/layout/site-footer.tsx`
- Create: `src/components/layout/site-header.test.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Create: `public/brand/presentei-logo.jpeg`

**Interfaces:**
- Consumes: alias `@/*` e Tailwind da Task 1.
- Produces: `siteConfig`, `Button`, `Container`, `SiteHeader`, `SiteFooter`.

- [ ] **Step 1: Escrever o teste de navegação**

Create `src/components/layout/site-header.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { SiteHeader } from "./site-header";

it("oferece as duas jornadas e a criação", () => {
  render(<SiteHeader />);
  expect(screen.getByRole("link", { name: /presentes/i })).toHaveAttribute("href", "/produtos");
  expect(screen.getByRole("link", { name: /para empresas/i })).toHaveAttribute("href", "/empresas");
  expect(screen.getByRole("link", { name: /criar com ia/i })).toHaveAttribute("href", "/personalizar");
});
```

- [ ] **Step 2: Verificar a falha**

Run: `npm test -- src/components/layout/site-header.test.tsx`

Expected: FAIL porque `SiteHeader` não existe.

- [ ] **Step 3: Criar tokens e configuração**

Create `src/styles/tokens.css`:

```css
:root {
  --brand-orange: #ff620f;
  --brand-orange-soft: #ffe1ce;
  --brand-black: #171717;
  --brand-white: #ffffff;
  --brand-surface: #fffaf5;
  --brand-muted: #675d56;
  --radius-sm: 0.75rem;
  --radius-md: 1.25rem;
  --radius-pill: 999px;
}
```

Create `src/config/site.ts`:

```ts
export const siteConfig = {
  name: "Presentei",
  description: "Presentes personalizados para pessoas e empresas.",
  priceLabel: "R$ 39,90",
  navigation: [
    { label: "Presentes", href: "/produtos" },
    { label: "Como funciona", href: "/#como-funciona" },
    { label: "Para empresas", href: "/empresas" },
  ],
} as const;
```

- [ ] **Step 4: Implementar shell acessível**

Implement `SiteHeader` with logo image, semantic `nav`, visible focus styles, mobile menu button with `aria-expanded`, and the CTA `/personalizar`. Implement `SiteFooter` with contact, policies, privacy and social placeholders sourced only from `siteConfig`.

- [ ] **Step 5: Verificar teste e qualidade**

Run:

```powershell
npm test -- src/components/layout/site-header.test.tsx
npm run lint
npm run typecheck
```

Expected: PASS and exit code 0.

- [ ] **Step 6: Commit**

```powershell
git add src public/brand/presentei-logo.jpeg
git commit -m "feat(ui): adicionar identidade e navegação da Presentei"
```

---

### Task 3: Regra de preço e desconto empresarial

**Files:**
- Create: `src/modules/pricing/constants.ts`
- Create: `src/modules/pricing/calculate-line-price.ts`
- Create: `src/modules/pricing/calculate-line-price.test.ts`
- Create: `src/modules/pricing/format-money.ts`

**Interfaces:**
- Consumes: nenhuma.
- Produces: `MUG_UNIT_PRICE_CENTS`, `BUSINESS_DISCOUNT_BPS`, `BUSINESS_MIN_QUANTITY`, `calculateLinePrice(input): LinePrice`, `formatMoney(cents): string`.

- [ ] **Step 1: Escrever testes de fronteira**

Create `src/modules/pricing/calculate-line-price.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { calculateLinePrice } from "./calculate-line-price";

describe("calculateLinePrice", () => {
  it("cobra R$ 39,90 por uma caneca", () => {
    expect(calculateLinePrice({ quantity: 1, isBusiness: false })).toEqual({
      unitPriceCents: 3990,
      discountCents: 0,
      subtotalCents: 3990,
    });
  });

  it("não desconta nove canecas empresariais", () => {
    expect(calculateLinePrice({ quantity: 9, isBusiness: true }).subtotalCents).toBe(35910);
  });

  it("desconta vinte por cento a partir de dez", () => {
    expect(calculateLinePrice({ quantity: 10, isBusiness: true })).toEqual({
      unitPriceCents: 3192,
      discountCents: 7980,
      subtotalCents: 31920,
    });
  });

  it("não dá desconto a consumidor individual", () => {
    expect(calculateLinePrice({ quantity: 10, isBusiness: false }).subtotalCents).toBe(39900);
  });

  it("rejeita quantidade inválida", () => {
    expect(() => calculateLinePrice({ quantity: 0, isBusiness: false })).toThrow("Quantidade inválida");
  });
});
```

- [ ] **Step 2: Verificar a falha**

Run: `npm test -- src/modules/pricing/calculate-line-price.test.ts`

Expected: FAIL por módulo ausente.

- [ ] **Step 3: Implementar cálculo inteiro**

Create `src/modules/pricing/constants.ts`:

```ts
export const MUG_UNIT_PRICE_CENTS = 3_990;
export const BUSINESS_DISCOUNT_BPS = 2_000;
export const BUSINESS_MIN_QUANTITY = 10;
```

Create `src/modules/pricing/calculate-line-price.ts`:

```ts
import { BUSINESS_DISCOUNT_BPS, BUSINESS_MIN_QUANTITY, MUG_UNIT_PRICE_CENTS } from "./constants";

export type LinePrice = {
  unitPriceCents: number;
  discountCents: number;
  subtotalCents: number;
};

export function calculateLinePrice(input: { quantity: number; isBusiness: boolean }): LinePrice {
  if (!Number.isInteger(input.quantity) || input.quantity < 1) throw new Error("Quantidade inválida");
  const gross = MUG_UNIT_PRICE_CENTS * input.quantity;
  const eligible = input.isBusiness && input.quantity >= BUSINESS_MIN_QUANTITY;
  const discountCents = eligible ? Math.round((gross * BUSINESS_DISCOUNT_BPS) / 10_000) : 0;
  const subtotalCents = gross - discountCents;
  return { unitPriceCents: subtotalCents / input.quantity, discountCents, subtotalCents };
}
```

- [ ] **Step 4: Verificar testes**

Run: `npm test -- src/modules/pricing/calculate-line-price.test.ts`

Expected: 5 tests PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/modules/pricing
git commit -m "feat(pricing): aplicar preço fixo e desconto empresarial"
```

---

### Task 4: Banco de dados e catálogo inicial

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma.config.ts`
- Create: `src/database/client.ts`
- Create: `src/database/seed.ts`
- Create: `src/modules/catalog/types.ts`
- Create: `src/modules/catalog/product-repository.ts`
- Create: `src/modules/catalog/get-products.ts`
- Create: `src/modules/catalog/get-products.test.ts`

**Interfaces:**
- Consumes: `MUG_UNIT_PRICE_CENTS` da Task 3.
- Produces: `ProductCardData`, `ProductDetail`, `ProductRepository`, `getProducts(repository)`, `getProductBySlug(repository, slug)`.

- [ ] **Step 1: Instalar persistência e validação**

Run:

```powershell
npm install @prisma/client zod
npm install -D prisma
```

- [ ] **Step 2: Escrever teste do caso de uso**

```ts
import { expect, it, vi } from "vitest";
import { getProducts } from "./get-products";

it("retorna somente produtos ativos", async () => {
  const repository = { listActive: vi.fn().mockResolvedValue([{ id: "p1", slug: "caneca-branca", name: "Caneca branca", priceCents: 3990, imageUrl: "/products/caneca-branca.webp" }]) };
  await expect(getProducts(repository)).resolves.toHaveLength(1);
});
```

- [ ] **Step 3: Verificar a falha**

Run: `npm test -- src/modules/catalog/get-products.test.ts`

Expected: FAIL por função ausente.

- [ ] **Step 4: Criar schema mínimo**

Define enums `ProductStatus` and models `Category`, `Product`, `ProductVariant`, `ProductImage`, `AdminUser`, `SiteSetting`. `Product.basePrice` is `Decimal @db.Decimal(10,2)`. Add unique indexes for category and product slugs. Add timestamps to mutable models.

- [ ] **Step 5: Criar seed determinístico**

Seed categories `Canecas personalizadas`, `Com fotos`, `Para família`, `Para empresas`; seed products `Caneca branca`, `Caneca preta`, `Caneca mágica`, each with base price `39.90`, active status, one variant and local image path.

- [ ] **Step 6: Implementar repositório e caso de uso**

The repository interface returns cents, converting Prisma `Decimal` only at the boundary. `getProducts` delegates only to `listActive`; components never import `database/client`.

- [ ] **Step 7: Verificar**

Run:

```powershell
npx prisma validate
npm test -- src/modules/catalog/get-products.test.ts
npm run typecheck
```

Expected: schema valid, test PASS, typecheck exit 0.

- [ ] **Step 8: Commit**

```powershell
git add prisma prisma.config.ts src/database src/modules/catalog package.json package-lock.json
git commit -m "feat(catalog): modelar produtos e catálogo inicial"
```

---

### Task 5: Homepage com duas jornadas

**Files:**
- Create: `src/components/storefront/hero.tsx`
- Create: `src/components/storefront/audience-paths.tsx`
- Create: `src/components/storefront/category-grid.tsx`
- Create: `src/components/storefront/ai-process.tsx`
- Create: `src/components/storefront/featured-products.tsx`
- Create: `src/components/storefront/testimonials.tsx`
- Create: `src/components/storefront/final-cta.tsx`
- Create: `src/components/storefront/audience-paths.test.tsx`
- Modify: `src/app/(store)/page.tsx`

**Interfaces:**
- Consumes: `Container`, `Button`, `getProducts`, `formatMoney`.
- Produces: homepage completa e seções reutilizáveis.

- [ ] **Step 1: Escrever teste das duas entradas**

```tsx
import { render, screen } from "@testing-library/react";
import { AudiencePaths } from "./audience-paths";

it("dá o mesmo peso a pessoas e empresas", () => {
  render(<AudiencePaths />);
  expect(screen.getByRole("link", { name: /criar meu presente/i })).toHaveAttribute("href", "/personalizar");
  expect(screen.getByRole("link", { name: /pedido empresarial/i })).toHaveAttribute("href", "/empresas");
});
```

- [ ] **Step 2: Verificar a falha**

Run: `npm test -- src/components/storefront/audience-paths.test.tsx`

Expected: FAIL por componente ausente.

- [ ] **Step 3: Implementar hero e jornadas**

Use headline `Uma ideia. Um presente só seu.` and supporting copy `Você conta a ideia; a Presentei dá vida a ela.` Primary CTA goes to `/personalizar`; secondary CTA goes to `/produtos`. The signature visual is a large product composition with a single transformation cue, not multiple decorative animations.

- [ ] **Step 4: Implementar seções restantes**

Render editable categories, four-step process, featured products, testimonial placeholders clearly sourced as sample content in code, business CTA and final emotional CTA. Do not invent Instagram posts or customer names.

- [ ] **Step 5: Verificar responsividade e movimento**

Add CSS/Tailwind behavior for single-column mobile, readable 320px viewport, `prefers-reduced-motion`, visible focus and no horizontal scroll.

- [ ] **Step 6: Executar testes e build**

Run:

```powershell
npm test -- src/components/storefront/audience-paths.test.tsx
npm run lint
npm run typecheck
npm run build
```

Expected: all exit 0.

- [ ] **Step 7: Commit**

```powershell
git add src/app src/components/storefront
git commit -m "feat(home): criar homepage para pessoas e empresas"
```

---

### Task 6: Catálogo e página de produto

**Files:**
- Create: `src/components/storefront/product-card.tsx`
- Create: `src/components/storefront/product-gallery.tsx`
- Create: `src/components/storefront/product-purchase-panel.tsx`
- Create: `src/components/storefront/product-card.test.tsx`
- Create: `src/app/(store)/produtos/page.tsx`
- Create: `src/app/(store)/produtos/[slug]/page.tsx`
- Create: `src/app/(store)/produtos/[slug]/not-found.tsx`

**Interfaces:**
- Consumes: `getProducts`, `getProductBySlug`, `ProductCardData`, `formatMoney`.
- Produces: catálogo indexável e detalhe com CTA de personalização.

- [ ] **Step 1: Escrever teste do card**

```tsx
import { render, screen } from "@testing-library/react";
import { ProductCard } from "./product-card";

it("mostra preço fixo e personalização", () => {
  render(<ProductCard product={{ slug: "caneca-branca", name: "Caneca branca", priceCents: 3990, imageUrl: "/products/caneca-branca.webp" }} />);
  expect(screen.getByText("R$ 39,90")).toBeVisible();
  expect(screen.getByRole("link", { name: /personalizar/i })).toHaveAttribute("href", "/personalizar?produto=caneca-branca");
});
```

- [ ] **Step 2: Verificar a falha**

Run: `npm test -- src/components/storefront/product-card.test.tsx`

Expected: FAIL por componente ausente.

- [ ] **Step 3: Implementar catálogo**

Use server component to fetch active products. Cards contain optimized image, name, price and one clear CTA. Category filters are links with query parameters so pages remain indexable.

- [ ] **Step 4: Implementar produto**

Render gallery, model choice, price, delivery calculator placeholder labeled `Calcular frete` and primary CTA `Personalizar esta caneca`. Invalid slug calls `notFound()`.

- [ ] **Step 5: Verificar**

Run:

```powershell
npm test -- src/components/storefront/product-card.test.tsx
npm run build
```

Expected: PASS and static/dynamic routes compile.

- [ ] **Step 6: Commit**

```powershell
git add src/app/'(store)'/produtos src/components/storefront
git commit -m "feat(store): adicionar catálogo e página de produto"
```

---

### Task 7: Jornada empresarial e calculadora

**Files:**
- Create: `src/app/empresas/page.tsx`
- Create: `src/components/business/business-calculator.tsx`
- Create: `src/components/business/business-calculator.test.tsx`
- Create: `src/components/business/business-benefits.tsx`
- Create: `src/components/business/business-lead-form.tsx`
- Create: `src/modules/catalog/business-lead-schema.ts`

**Interfaces:**
- Consumes: `calculateLinePrice`, `formatMoney`, `BUSINESS_MIN_QUANTITY`.
- Produces: `BusinessCalculator`, `businessLeadSchema`.

- [ ] **Step 1: Escrever teste do desconto visível**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { BusinessCalculator } from "./business-calculator";

it("explica e aplica o desconto em dez unidades", () => {
  render(<BusinessCalculator />);
  fireEvent.change(screen.getByLabelText(/quantidade/i), { target: { value: "10" } });
  expect(screen.getByText("R$ 319,20")).toBeVisible();
  expect(screen.getByText(/você economiza R\$ 79,80/i)).toBeVisible();
});
```

- [ ] **Step 2: Verificar a falha**

Run: `npm test -- src/components/business/business-calculator.test.tsx`

Expected: FAIL por componente ausente.

- [ ] **Step 3: Implementar calculadora**

Use an accessible number input with minimum 1. Display unit price, subtotal and savings. At 1–9 show `A partir de 10, sua empresa recebe 20% de desconto.` At 10+ show discounted unit price and savings.

- [ ] **Step 4: Implementar página e formulário**

Page contains value proposition, calculator, use cases and form fields `companyName`, `contactName`, `email`, `phone`, `quantity`, `message`. Validate with Zod; submission persists only after the lead persistence task in Phase 4, so in Phase 1 the button opens WhatsApp with non-sensitive structured text and is labeled accordingly.

- [ ] **Step 5: Verificar**

Run:

```powershell
npm test -- src/components/business/business-calculator.test.tsx
npm run typecheck
```

Expected: PASS and exit 0.

- [ ] **Step 6: Commit**

```powershell
git add src/app/empresas src/components/business src/modules/catalog/business-lead-schema.ts
git commit -m "feat(business): criar jornada de pedidos empresariais"
```

---

### Task 8: Carrinho persistente com recálculo confiável

**Files:**
- Create: `src/modules/cart/types.ts`
- Create: `src/modules/cart/cart-store.ts`
- Create: `src/modules/cart/calculate-cart.ts`
- Create: `src/modules/cart/calculate-cart.test.ts`
- Create: `src/components/cart/cart-provider.tsx`
- Create: `src/components/cart/cart-line.tsx`
- Create: `src/components/cart/cart-summary.tsx`
- Create: `src/app/carrinho/page.tsx`

**Interfaces:**
- Consumes: `calculateLinePrice`, `formatMoney`.
- Produces: `CartItem`, `CartTotals`, `calculateCart(items, context)`, `useCart()`.

- [ ] **Step 1: Escrever teste de carrinho**

```ts
import { expect, it } from "vitest";
import { calculateCart } from "./calculate-cart";

it("mantém o frete fora do desconto", () => {
  const result = calculateCart([{ productId: "p1", variantId: "v1", name: "Caneca", quantity: 10 }], { isBusiness: true, shippingCents: 2500 });
  expect(result).toEqual({ itemsCents: 31920, discountCents: 7980, shippingCents: 2500, totalCents: 34420 });
});
```

- [ ] **Step 2: Verificar a falha**

Run: `npm test -- src/modules/cart/calculate-cart.test.ts`

Expected: FAIL por função ausente.

- [ ] **Step 3: Implementar cálculo agregado**

`calculateCart` sums eligible mug quantities before determining the business threshold, distributes the discount deterministically across lines, then adds shipping unchanged. It rejects negative shipping or empty identifiers.

- [ ] **Step 4: Implementar store local**

Persist only product IDs, variant IDs, quantity and customization reference in `localStorage`. Do not persist authoritative price. Hydrate after mount and expose `addItem`, `updateQuantity`, `removeItem`, `clear`.

- [ ] **Step 5: Implementar página**

Render item image, product, variant, personalization label, quantity, subtotal and summary. An empty cart offers links to products and personalizer. Checkout CTA is disabled until the Phase 4 route exists and says `Finalização disponível em breve` in this phase.

- [ ] **Step 6: Verificar**

Run:

```powershell
npm test -- src/modules/cart/calculate-cart.test.ts
npm run lint
npm run typecheck
```

Expected: PASS and exit 0.

- [ ] **Step 7: Commit**

```powershell
git add src/modules/cart src/components/cart src/app/carrinho
git commit -m "feat(cart): adicionar carrinho persistente e cálculo seguro"
```

---

### Task 9: Autenticação e painel administrativo básico

**Files:**
- Create: `src/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/modules/auth/require-admin.ts`
- Create: `src/modules/auth/require-admin.test.ts`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/components/admin/admin-shell.tsx`
- Create: `src/components/admin/product-table.tsx`
- Modify: `prisma/schema.prisma`

**Interfaces:**
- Consumes: `AdminUser` model and catalog repository.
- Produces: `auth`, `signIn`, `signOut`, `requireAdmin(session)`.

- [ ] **Step 1: Instalar autenticação**

Run:

```powershell
npm install next-auth bcryptjs
npm install -D @types/bcryptjs
```

- [ ] **Step 2: Escrever teste de autorização**

```ts
import { expect, it } from "vitest";
import { requireAdmin } from "./require-admin";

it("bloqueia sessão sem papel administrativo", () => {
  expect(() => requireAdmin({ user: { email: "cliente@example.com", role: "CUSTOMER" } })).toThrow("Acesso administrativo necessário");
});
```

- [ ] **Step 3: Verificar a falha**

Run: `npm test -- src/modules/auth/require-admin.test.ts`

Expected: FAIL por função ausente.

- [ ] **Step 4: Implementar sessão segura**

Configure Auth.js Credentials provider. Lookup admin by normalized email, compare bcrypt hash, return only `id`, `email`, `name`, `role`. Session uses secure, httpOnly cookies in production. Failed login returns generic copy.

- [ ] **Step 5: Implementar painel somente leitura**

Protect `/admin` on the server. Show counts and product table with status, price and stock. Editing remains outside Phase 1; do not render nonfunctional edit/delete buttons.

- [ ] **Step 6: Verificar**

Run:

```powershell
npm test -- src/modules/auth/require-admin.test.ts
npm run typecheck
npm run build
```

Expected: PASS and build exit 0.

- [ ] **Step 7: Commit**

```powershell
git add src/auth.ts src/app/api/auth src/app/admin src/modules/auth src/components/admin prisma/schema.prisma package.json package-lock.json
git commit -m "feat(admin): proteger painel e listar catálogo"
```

---

### Task 10: SEO, analytics interno e acessibilidade

**Files:**
- Create: `src/modules/analytics/events.ts`
- Create: `src/modules/analytics/track.ts`
- Create: `src/modules/analytics/track.test.ts`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/(store)/produtos/[slug]/page.tsx`

**Interfaces:**
- Consumes: `siteConfig`, catalog queries.
- Produces: `AnalyticsEvent`, `track(event)`, metadata, sitemap and Product JSON-LD.

- [ ] **Step 1: Escrever teste da camada de eventos**

```ts
import { expect, it } from "vitest";
import { createAnalyticsEvent } from "./events";

it("remove valores indefinidos e inclui versão", () => {
  expect(createAnalyticsEvent("product_viewed", { productId: "p1", category: undefined })).toEqual({ name: "product_viewed", version: 1, properties: { productId: "p1" } });
});
```

- [ ] **Step 2: Verificar falha e implementar**

Run: `npm test -- src/modules/analytics/track.test.ts`

Expected before implementation: FAIL. Implement a provider-neutral event builder; in Phase 1 `track` logs only in development and does not transmit personal data.

- [ ] **Step 3: Implementar SEO técnico inicial**

Add canonical URL, title template, description, Open Graph, sitemap entries for home, products and business page, robots policy and Product JSON-LD with BRL price `39.90`.

- [ ] **Step 4: Fazer auditoria de acessibilidade manual**

Verify semantic landmarks, one `h1` per page, label associations, keyboard order, skip link, visible focus, alt text, contrast and reduced motion. Record any intentionally deferred issue in the Phase 1 handoff, not as source comments.

- [ ] **Step 5: Verificar**

Run:

```powershell
npm test
npm run lint
npm run typecheck
npm run build
```

Expected: all tests PASS and all commands exit 0.

- [ ] **Step 6: Commit**

```powershell
git add src/modules/analytics src/app
git commit -m "feat(quality): adicionar SEO e eventos internos"
```

---

### Task 11: Jornadas ponta a ponta e revisão visual

**Files:**
- Create: `tests/e2e/home.spec.ts`
- Create: `tests/e2e/business-pricing.spec.ts`
- Create: `tests/e2e/cart.spec.ts`
- Modify: `playwright.config.ts`

**Interfaces:**
- Consumes: rotas e componentes das Tasks 1–10.
- Produces: cobertura das jornadas críticas da Fase 1.

- [ ] **Step 1: Escrever os testes E2E**

Create `tests/e2e/home.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("homepage conduz pessoas e empresas", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /uma ideia/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /criar meu presente/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /pedido empresarial/i })).toBeVisible();
});
```

Create `tests/e2e/business-pricing.spec.ts` asserting 9 units show `R$ 359,10` and 10 show `R$ 319,20`. Create `tests/e2e/cart.spec.ts` asserting add, quantity update, persistence after reload and removal.

- [ ] **Step 2: Executar e corrigir somente falhas reais**

Run: `npm run test:e2e`

Expected: all Phase 1 journeys PASS.

- [ ] **Step 3: Revisar em quatro viewports**

Run Playwright at 360×800, 768×1024, 1366×768 and 1440×900. Capture home, catalog, product, business and cart. Check crop, overflow, typography, touch targets and sticky elements.

- [ ] **Step 4: Executar gate completo**

Run:

```powershell
npm test
npm run test:e2e
npm run lint
npm run typecheck
npm run build
git diff --check
```

Expected: zero failing tests, zero lint/type/build errors and no whitespace errors.

- [ ] **Step 5: Commit**

```powershell
git add tests playwright.config.ts
git commit -m "test(e2e): validar jornadas comerciais da fase um"
```

---

### Task 12: Handoff da Fase 1

**Files:**
- Create: `docs/handoffs/2026-08-10-phase-1.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: resultado verificado das Tasks 1–11.
- Produces: instruções reproduzíveis de setup, estado da Fase 1 e fronteira da Fase 2.

- [ ] **Step 1: Documentar setup**

README must include Node requirement from `package.json`, environment copy command, PostgreSQL setup, Prisma migration/seed, dev server, test and build commands.

- [ ] **Step 2: Documentar entrega**

Create handoff with implemented routes, credentials that must be supplied by environment, exact verification commands and results, known external assets still needed, and the next plan title `Presentei Phase 2 — Personalizador intuitivo`.

- [ ] **Step 3: Verificar documentação e worktree**

Run:

```powershell
rg -n "T[B]D|T[O]DO|implement lat[e]r|fill i[n]" README.md docs/handoffs/2026-08-10-phase-1.md
git status --short
```

Expected: no placeholder matches; only README and handoff are modified before commit.

- [ ] **Step 4: Commit**

```powershell
git add README.md docs/handoffs/2026-08-10-phase-1.md
git commit -m "docs: registrar entrega da fase um"
```

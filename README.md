# Presentei

Fundação comercial da loja de canecas personalizadas Presentei. O site atende pessoas e empresas com um fluxo direto, preço fixo de R$ 39,90 e desconto automático de 20% para pedidos empresariais a partir de 10 canecas. O frete é sempre calculado separadamente.

## Requisitos

- Node.js 20.9 ou superior
- npm
- PostgreSQL para a futura persistência do catálogo e pedidos; a Fase 1 usa um catálogo local para funcionar sem banco

## Executar localmente

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

Abra `http://localhost:3000`. Configure em `.env.local`:

- `NEXT_PUBLIC_SITE_URL`: URL pública do site;
- `AUTH_SECRET`: valor aleatório longo para assinar sessões;
- `ADMIN_EMAIL`: e-mail do administrador;
- `ADMIN_PASSWORD_HASH`: senha administrativa em hash bcrypt;
- `DATABASE_URL`: conexão PostgreSQL preparada para as próximas fases.

Para gerar um hash bcrypt sem registrar a senha no projeto:

```powershell
node -e "require('bcryptjs').hash(process.argv[1], 12).then(console.log)" "SUA-SENHA"
```

O painel protegido fica em `/admin`. Sem as variáveis administrativas corretas, nenhuma credencial é aceita.

## Banco de dados

O schema Prisma pode ser validado agora:

```powershell
npx prisma validate
```

Quando a persistência PostgreSQL for ativada, crie e aplique a primeira migração com `npx prisma migrate dev --name init`. O catálogo visual da Fase 1 permanece em `src/modules/catalog/local-products.ts`; a troca pelo repositório Prisma deve ocorrer antes de produção com gestão de estoque.

## Qualidade

```powershell
npm test
npm run test:e2e
npm run lint
npm run typecheck
npm run build
```

O Playwright usa a porta 3100 para não conflitar com o servidor de desenvolvimento. Caso o Chromium de teste ainda não exista, execute `npx playwright install chromium` uma vez.

## Rotas principais

- `/`: homepage para pessoas e empresas
- `/produtos`: catálogo
- `/produtos/[slug]`: detalhe e adição ao carrinho
- `/empresas`: simulador e contato via WhatsApp
- `/carrinho`: carrinho local persistente e desconto empresarial
- `/personalizar`: introdução ao personalizador da próxima fase
- `/admin`: painel protegido e somente leitura

O checkout, o cálculo real de frete, a geração de arte e a persistência de pedidos pertencem às próximas fases e aparecem na interface como indisponíveis, sem botões enganosos.

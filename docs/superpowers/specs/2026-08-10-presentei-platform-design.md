# Presentei — Plataforma de presentes personalizados

Data: 10 de agosto de 2026
Status: aprovado para planejamento

## 1. Visão do produto

A Presentei será apresentada como uma marca de presentes amigável e uma plataforma moderna de criação. A tecnologia deve desaparecer: o cliente não precisa entender inteligência artificial, impressão ou composição gráfica para chegar a um produto pronto para comprar.

A experiência atende, com igual importância, dois públicos:

- pessoas comprando presentes individuais;
- empresas comprando canecas em quantidade.

As duas jornadas compartilham catálogo, personalização, geração de arte, mockups, clientes e operação de pedidos. A diferença está na conclusão: pessoas seguem para carrinho e checkout; empresas podem solicitar orçamento ou concluir um pedido em quantidade.

## 2. Identidade da marca

### Evidências observadas

As capturas do Instagram e a logo fornecida confirmam:

- laranja, preto e branco como cores institucionais;
- comunicação direta, popular, alegre e acessível;
- destaque para ocasiões, relações e identidades pessoais;
- fotografia próxima do produto;
- linguagem emocional com intenção comercial clara;
- canecas como produto principal;
- atuação com presentes individuais e grandes pedidos.

O azul-marinho, bege e dourado vistos nas publicações são tratados como linguagem de campanha de Dia dos Pais, não como substitutos da identidade institucional.

### Direção aprovada: laranja autoral

A interface evolui a identidade atual sem descaracterizá-la. O laranja é usado nos pontos de energia e ação; preto e branco estruturam legibilidade e confiança. O acabamento premium virá de espaço, hierarquia, fotografia e consistência, sem tornar a marca fria ou elitista.

Paleta inicial:

- Laranja Presentei: `#FF620F`;
- Laranja claro: `#FFE1CE`;
- Preto: `#171717`;
- Branco: `#FFFFFF`;
- Fundo quente: `#FFFAF5`;
- Cinza de texto: `#675D56`.

Os valores serão tokens configuráveis. A logo oficial será utilizada sem redesenho arbitrário.

Princípios visuais:

- produto em primeiro plano;
- tipografia expressiva, legível e amigável;
- bastante respiro;
- formas arredondadas usadas com moderação;
- movimento concentrado na transformação de ideia em produto;
- foco visível para teclado e respeito a movimento reduzido;
- experiência mobile projetada, não apenas reduzida.

## 3. Homepage e navegação

O hero apresenta uma promessa comum aos dois públicos: uma ideia pode virar um presente único. Depois do hero, duas entradas de mesmo peso:

- **Para pessoas:** datas especiais, família, amigos, namorados, pets e memórias;
- **Para empresas:** brindes, equipes, eventos e pedidos em quantidade.

Estrutura da homepage:

1. cabeçalho com catálogo, funcionamento, empresas e criar com IA;
2. hero emocional com produto e CTA;
3. duas jornadas de público;
4. categorias editáveis;
5. demonstração `IDEIA → ARTE → PRODUTO → PRESENTE`;
6. produtos em destaque;
7. como funciona;
8. benefícios para empresas;
9. avaliações;
10. conteúdo social configurável;
11. CTA final;
12. footer institucional.

## 4. Princípios de experiência

Toda decisão seguirá estes critérios, nesta ordem:

1. reduzir esforço cognitivo;
2. deixar clara a próxima ação;
3. revelar opções avançadas somente quando ajudam;
4. preservar o trabalho do cliente automaticamente;
5. evitar termos técnicos;
6. oferecer recuperação simples para erros;
7. manter preço e prazo transparentes.

Não haverá cadastro obrigatório antes da compra. A conta poderá ser criada depois usando o mesmo e-mail.

## 5. Personalizador

O personalizador terá apenas três momentos visíveis:

### 5.1 Escolha

O cliente escolhe produto e variante. A quantidade pode ser ajustada agora ou no carrinho.

### 5.2 Conte

Três entradas são apresentadas:

- tenho uma ideia;
- tenho uma foto;
- quero começar do zero.

Tema, ocasião, estilo, cores e frase são sugestões opcionais. O caminho recomendado aparece primeiro; detalhes avançados ficam sob divulgação progressiva.

### 5.3 Aprove

A interface exibe:

- arte original;
- mockup do produto;
- criar outra versão;
- aprovar;
- adicionar ao carrinho ou solicitar orçamento.

O progresso é salvo automaticamente. A geração continua em tarefa assíncrona e pode ser recuperada se o cliente fechar a página.

## 6. Fluxo da inteligência artificial

```text
Cliente conta a ideia
→ validação e moderação
→ PromptBuilder
→ ImageGenerationService
→ provedor configurado
→ arte original armazenada
→ mockup gerado pelo sistema
→ aprovação do cliente
```

Regras:

- o texto bruto não é enviado diretamente ao gerador;
- `PromptBuilder` reúne intenção, estilo, ocasião, formato e regras de impressão;
- o prompt mestre é versionado e configurável no painel;
- `ImageGenerationService` não depende de um único provedor;
- `OPENAI_API_KEY` existe somente no servidor;
- cada tentativa registra provedor, modelo, prompt, duração, custo estimado e resultado;
- mensagens técnicas nunca são mostradas ao cliente;
- falha técnica não consome geração;
- a geração cria a arte, nunca uma fotografia de caneca.

Regras do prompt de produção:

- composição adequada à área de impressão;
- margem segura;
- alta legibilidade;
- elementos importantes inteiros;
- composição equilibrada;
- sem mockup, caneca, marca-d'água ou elementos aleatórios;
- consistência com a intenção e as referências autorizadas pelo cliente.

## 7. Mockups e arquivos

A arte original e o mockup são entidades distintas.

Cada produto configurável possui:

- uma ou mais imagens-base;
- máscara da área imprimível;
- coordenadas `x`, `y`, `width` e `height`;
- rotação, curvatura e intensidade opcionais;
- ângulos disponíveis.

No MVP, o servidor aplica a arte a templates de imagem. A arquitetura permite adicionar perspectiva, displacement map e 3D posteriormente.

Arte original, uploads e arquivos de produção são privados. Mockups comerciais podem ser públicos ou servidos por URLs temporárias. O pedido preserva referência permanente à arte aprovada e um snapshot de todas as configurações relevantes.

## 8. Regras comerciais

- preço fixo da caneca: **R$ 39,90**;
- frete calculado separadamente pelo CEP;
- empresas recebem **20% de desconto a partir de 10 canecas**;
- o desconto exige pedido no fluxo empresarial com identificação da empresa;
- preço empresarial com desconto: **R$ 31,92 por unidade**;
- dez canecas: **R$ 319,20**, antes do frete;
- desconto aplicado automaticamente, sem cupom;
- frete nunca recebe desconto;
- o limite considera o total combinado de canecas elegíveis do pedido, mesmo com artes ou variantes diferentes;
- valores monetários usam tipo decimal, nunca ponto flutuante.

O frontend exibe cálculos, mas o servidor sempre recalcula e determina preço, desconto e total.

## 9. Carrinho e checkout

Fluxo individual:

```text
Arte aprovada
→ carrinho
→ CEP e opções de frete
→ dados essenciais
→ Pix ou cartão
→ confirmação
→ WhatsApp opcional
```

Cada item mostra produto, variante, mockup, tipo de personalização, quantidade, preço unitário e subtotal.

Fluxo empresarial:

```text
Catálogo ou personalização
→ quantidades e artes
→ identificação da empresa
→ orçamento ou compra
→ aprovação comercial, quando necessária
→ pedido
```

`Quote` é separado de `Order`. Um orçamento aprovado é convertido em pedido sem duplicar produto, arte ou cliente.

## 10. Integrações

### Pagamento

Recomendação inicial: Mercado Pago Checkout Transparente com Orders API, Pix e cartão. Webhooks são autenticados e processados com idempotência. Credenciais ficam exclusivamente no servidor.

### Frete

`ShippingService` define uma interface independente de transportadora. A cotação considera CEP, dimensões, peso e quantidade. A opção escolhida é salva no pedido com preço, prazo e identificador do serviço.

### WhatsApp

No MVP, um link abre mensagem estruturada após o pedido. O número é configurável no painel. Imagens privadas, prompts e dados desnecessários não são transmitidos.

### Armazenamento

Um adaptador compatível com armazenamento de objetos guarda uploads, artes e mockups. A aplicação não dependerá de um fornecedor específico.

### Analytics

Eventos internos são emitidos por uma camada própria e podem ser encaminhados para Google Analytics, Meta Pixel e outras plataformas:

- produto visualizado;
- personalização iniciada;
- foto enviada;
- geração solicitada, concluída ou falha;
- mockup visualizado;
- personalização abandonada;
- item adicionado ao carrinho;
- checkout iniciado;
- compra concluída;
- orçamento solicitado.

## 11. Arquitetura

Será usado um monólito modular: uma aplicação única no MVP, com módulos de domínio isolados e serviços externos abstraídos.

```text
Clientes individuais ─┐
Empresas ─────────────┼→ Next.js → módulos de domínio
Administração ────────┘              │
                                     ├→ PostgreSQL
                                     ├→ armazenamento
                                     ├→ fila de tarefas
                                     └→ provedores externos
```

Módulos:

- catálogo;
- clientes e organizações;
- personalizações;
- gerações;
- mockups;
- carrinho;
- orçamentos;
- pedidos;
- pagamentos;
- frete;
- mensagens;
- administração.

Componentes React não acessam diretamente gateways, banco ou regras comerciais. Interfaces de serviço permitem trocar OpenAI, armazenamento, pagamento, frete e WhatsApp.

## 12. Stack

- Next.js com TypeScript;
- Tailwind CSS e design system próprio;
- PostgreSQL;
- Prisma ORM estável;
- armazenamento de objetos S3-compatible;
- fila durável para IA e mockups;
- autenticação baseada em sessão;
- validação compartilhada no servidor;
- testes unitários, integração e ponta a ponta.

O deploy pode usar Vercel, mas banco, arquivos e serviços permanecem portáveis.

## 13. Estrutura de pastas

```text
src/
├── app/
│   ├── (store)/
│   ├── empresas/
│   ├── personalizar/
│   ├── admin/
│   └── api/
├── components/
│   ├── ui/
│   ├── storefront/
│   ├── business/
│   └── customizer/
├── modules/
│   ├── catalog/
│   ├── customers/
│   ├── customizations/
│   ├── generations/
│   ├── mockups/
│   ├── cart/
│   ├── quotes/
│   ├── orders/
│   └── payments/
├── services/
│   ├── image-generation/
│   ├── storage/
│   ├── shipping/
│   ├── payments/
│   └── whatsapp/
├── database/
├── config/
└── tests/
```

## 14. Banco de dados

Entidades principais:

- `User` e `AdminRole`;
- `Customer` e `Address`;
- `Organization` e contatos;
- `Category`;
- `Product`;
- `ProductVariant`;
- `ProductMockupTemplate`;
- `Customization`;
- `UploadedAsset`;
- `GenerationSession`;
- `AiGeneration`;
- `GeneratedAsset`;
- `MockupRender`;
- `Cart` e `CartItem`;
- `Quote` e `QuoteItem`;
- `Order` e `OrderItem`;
- `Payment`;
- `Shipment`;
- `AuditLog`;
- `SiteSetting` e `AiSetting`.

`Customization` representa o estado editável. `OrderItem` guarda snapshot imutável do produto, preço, desconto, arte, mockup e configurações aprovadas.

## 15. Segurança e privacidade

- validação server-side de inputs e preços;
- autenticação e autorização administrativa;
- trilha de auditoria;
- rate limiting por IP, sessão e usuário;
- limite de tamanho, dimensões e MIME real de uploads;
- nomes de arquivos gerados pelo sistema;
- arquivos privados e URLs temporárias;
- moderação antes da geração;
- proteção contra abuso da IA;
- webhooks autenticados e idempotentes;
- CSP, cookies seguros e proteção CSRF conforme o mecanismo de sessão;
- dados mínimos necessários no WhatsApp e analytics;
- backups e política configurável de retenção;
- segredos apenas em variáveis de ambiente no servidor.

## 16. Tratamento de erros

- falha de geração oferece nova tentativa sem consumir crédito;
- falha de mockup preserva a arte e permite refazer somente o preview;
- falha de pagamento preserva carrinho e personalização;
- timeout de frete permite tentar novamente ou falar com a Presentei;
- tarefas assíncronas são idempotentes e retomáveis;
- mensagens técnicas são registradas internamente, nunca exibidas ao cliente.

## 17. Controle de custos

- uma criação inicial por sessão;
- até duas novas versões gratuitas, total configurável;
- limites combinados por sessão, IP, usuário e período;
- tentativa causada por falha técnica não consome crédito;
- exploração usa qualidade equilibrada;
- arquivo final de produção pode usar qualidade superior após aprovação;
- custos reais são registrados por geração;
- limites e alertas operacionais evitam gasto não previsto.

Custos variáveis esperados:

- geração de imagens;
- aplicação e hospedagem;
- banco de dados;
- armazenamento e tráfego;
- gateway de pagamento;
- automações futuras de WhatsApp;
- eventual serviço de frete.

Valores exatos devem ser revisados antes do lançamento, pois dependem do volume e das tabelas vigentes.

## 18. Performance, SEO e acessibilidade

- imagens responsivas e formatos modernos;
- carregamento progressivo;
- lazy loading fora da primeira dobra;
- fontes otimizadas;
- JavaScript reduzido no catálogo;
- cache com invalidação explícita;
- metadata e Open Graph configuráveis;
- sitemap e robots;
- URLs amigáveis;
- dados estruturados de produto e organização;
- navegação por teclado;
- contraste WCAG AA;
- áreas de toque adequadas;
- estados anunciados por tecnologias assistivas;
- respeito a `prefers-reduced-motion`.

## 19. Testes e critérios de qualidade

Testes unitários obrigatórios:

- uma caneca custa R$ 39,90;
- nove canecas empresariais custam R$ 359,10;
- dez canecas empresariais custam R$ 319,20;
- frete nunca recebe desconto;
- preços são recalculados pelo servidor;
- falha da IA não consome geração;
- limites bloqueiam abuso;
- orçamento aprovado converte corretamente em pedido.

Testes de integração:

- uploads privados;
- geração e persistência de arte;
- renderização de mockup;
- webhooks idempotentes;
- snapshots imutáveis do pedido;
- expiração e retomada de tarefas.

Testes ponta a ponta:

- jornada individual completa;
- jornada empresarial com 9 e 10 unidades;
- Pix aprovado e expirado;
- cartão aprovado e recusado;
- recuperação após fechar o personalizador;
- mobile em aparelho real.

## 20. Fases de implementação

### Fase 1 — Fundação comercial

Identidade, design system, homepage, duas jornadas, catálogo, produto, carrinho, regra de preços, banco e painel básico.

### Fase 2 — Personalizador intuitivo

Três momentos visíveis, upload, sugestões, salvamento automático e mockups simulados.

### Fase 3 — IA e produção

Prompt Builder, OpenAI, limites, armazenamento privado, mockup automático e aprovação.

### Fase 4 — Venda completa

Frete, Mercado Pago, Pix, cartão, pedidos, orçamento empresarial e WhatsApp.

### Fase 5 — Qualidade de lançamento

SEO, analytics, acessibilidade, performance, segurança, abandono e testes ponta a ponta.

## 21. Fontes técnicas consultadas

- OpenAI, geração de imagens: <https://developers.openai.com/api/docs/guides/image-generation>
- OpenAI, preços da API: <https://developers.openai.com/api/docs/pricing>
- Prisma ORM: <https://www.prisma.io/docs/orm>
- Prisma com PostgreSQL: <https://docs.prisma.io/docs/orm/v6/overview/databases/postgresql>
- Mercado Pago Orders API: <https://www.mercadopago.com.br/developers/pt/reference/online-payments/checkout-api/overview>
- Mercado Pago Pix: <https://www.mercadopago.com.br/developers/pt/docs/checkout-api-orders/payment-integration/pix>
- Vercel Storage: <https://vercel.com/docs/storage>

## 22. Decisões adiadas intencionalmente

Estas escolhas serão feitas durante a fase correspondente, após validação de credenciais e condições comerciais:

- transportadora ou agregador de frete definitivo;
- fornecedor de banco gerenciado;
- fornecedor de armazenamento;
- política de parcelamento;
- modelo de imagem e qualidade padrão;
- automação oficial do WhatsApp;
- política fiscal e emissão de nota;
- textos legais finais.

Nenhuma dessas decisões altera os limites arquiteturais descritos neste documento.

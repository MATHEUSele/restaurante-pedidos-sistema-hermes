# Hermes – Sistema de Pedidos 🍽️

![Hero Image](file:///C:/Users/matheuss/.gemini/antigravity-ide/brain/b9665d40-b7a1-45c1-811e-4a1936df87ed/hermes_dashboard_hero_1791559295461.jpg)

> **Um sistema completo, elegante e pronto para produção**

O **Hermes** possibilita a gestão de pedidos e filas (KDS) para restaurantes de fast‑food e lanchonetes, trazendo uma **UX premium** com modo escuro, micro‑animações suaves e um design responsivo que se adapta a desktops, tablets e smartphones.

---

## ✨ Principais Funcionalidades

- **Painel Administrativo (ADM)** – visão geral de vendas, tickets médios, controle de permissões e geração de QR Codes para totens.
- **Painel da Cozinha (KDS)** – lista de pedidos em tempo real com status colorido e animações de transição.
- **Totem/PDV** – interface de auto‑atendimento com catálogo de produtos, filtro por categoria e checkout rápido.
- **Autenticação RBAC** – segurança via `next‑auth` com proteção contra CSRF e cabeçalhos hardening.
- **Tema Dinâmico** – troca instantânea entre modo **claro** e **escuro** usando o componente flutuante abaixo.

![Theme Toggle Demo](file:///C:/Users/matheuss/.gemini/antigravity-ide/brain/b9665d40-b7a1-45c1-811e-4a1936df87ed/theme_toggle_demo_1791559314207.jpg)

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Frontend | **Next.js 14** (App Router) • React 18 • TypeScript • `next‑themes` • `framer‑motion` |
| UI | CSS custom properties (variáveis HSL), micro‑animações, layout Grid/Flex, fonte **Inter** |
| Backend | API Routes do Next.js • Prisma ORM • PostgreSQL |
| Testes | Vitest (unit) • Playwright (E2E) |
| CI/CD | GitHub Actions – matriz Node 18/20 × Ubuntu/Windows, cache de dependências, deploy preview Vercel |
| Monitoramento | Sentry (client & server) • Endpoint `/api/health` |

## 🚀 Como Executar Localmente

```bash
# Clone o repositório
git clone https://github.com/MATHEUSele/restaurante-pedidos-sistema-hermes.git
cd restaurante-pedidos-sistema-hermes

# Instale as dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# edite .env (DATABASE_URL, NEXTAUTH_SECRET, etc.)

# Prepare o banco de dados
npx prisma generate
npx prisma db push
npm run seed   # opcional – insere dados de exemplo

# Inicie a aplicação
npm run dev
```

Acesse `http://localhost:3000` e explore as rotas:
- `/login` – autenticação
- `/adm` – painel administrativo
- `/cozinha` – KDS
- `/atendente` – totem

## 📚 Documentação

- **Guia de Contribuição** – [docs/guia_contribuicao.md](docs/guia_contribuicao.md)
- **Especificação OpenAPI** – [docs/openapi.yaml](docs/openapi.yaml) (visualizado via Swagger UI em `/docs/api`)
- **Swagger UI** – http://localhost:3000/docs/api (disponível após o `npm run dev`)

## 🧪 Testes Automatizados

```bash
# Testes unitários
npm run test

# Testes end‑to‑end (Playwright)
npx playwright test
```

## 🎯 Roadmap Futuro

- Integração com **Sentry** avançada e métricas de performance.
- **Internacionalização** com `next-i18next` (pt‑BR / en‑US).
- Deploy **automático** em Vercel via `vercel-action`.

---

*Este README foi criado com imagens ilustrativas geradas por IA e segue as boas práticas de design premium para garantir a melhor primeira impressão.*

# Sistema Hermes 📦🍽️

O Hermes é um sistema completo e moderno de gestão de pedidos e controle de fila (KDS - Kitchen Display System) projetado para restaurantes de fast-food e lanchonetes.

## 🚀 Funcionalidades Principais

- **Painel Administrativo (ADM)**: Visão geral das vendas diárias, histórico, ticket médio e gerenciamento de permissões da equipe (incluindo geração de QR Codes de acesso rápido para os totens).
- **Painel da Cozinha (KDS)**: Interface auto-atualizável (polling ou WebSockets/SSE no futuro) focada nos pedidos pendentes, permitindo alterar status para "Pronto".
- **Painel do Atendente (Totem/PDV)**: Tela de registro rápido de pedidos em modo quiosque/totem para inserir o nome do cliente, os produtos e confirmar a compra.
- **Autenticação RBAC e Segurança**: Rotas estritamente protegidas por nível de usuário usando Next-Auth com proteção CSRF e headers customizados.
- **Cache e Offline-first (UX Premium)**: Uso de cache persistente via `localStorage` para navegação fluída entre transições de estado, impedindo "telas piscando" (Flicker UI).

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14+ (App Router), React 18, CSS Modules + Variáveis Nativas.
- **Backend/API**: Next.js API Routes.
- **Banco de Dados**: PostgreSQL com Prisma ORM.
- **Segurança**: Next-Auth, Helmet Headers, e Bcrypt.
- **Testes Automáticos**: 
  - Unitários: Vitest + React Testing Library.
  - E2E e API: Playwright.

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18 ou superior.
- Banco PostgreSQL configurado.

### Passos:

1. Clone o repositório:
   ```bash
   git clone <url-do-repo>
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo de variáveis de ambiente:
   ```bash
   cp .env.example .env
   # Preencha a DATABASE_URL e a NEXTAUTH_SECRET (ex: gerada via openssl rand -base64 32)
   ```

4. Prepare o Banco de Dados (Schema e Seeds iniciais):
   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

5. Rode a aplicação em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

O sistema estará disponível em `http://localhost:3000`. Acesse `/login` com as credenciais do admin criadas no seed.

## 🧪 Suíte de Testes

- Para rodar os **Testes Unitários** no terminal:
  ```bash
  npm run test
  ```

- Para os **Testes End-to-End (E2E)** e API no Playwright:
  ```bash
  npx playwright test
  ```

## 📖 Documentação Adicional

- [Guia de Contribuição](docs/guia_contribuicao.md) - Saiba como ajudar no projeto e o padrão de commits.
- [Especificação OpenAPI / Swagger](docs/openapi.yaml) - Acesse o design da API.

## 🔄 Integração Contínua (CI)

O sistema possui uma esteira (Pipeline) estruturada no GitHub Actions (`.github/workflows/ci.yml`). Em cada Push ou Pull Request, o código é validado por uma matriz contendo testes em multiplas versões de SO e Node, TypeScript type-checking, ESLint, testes unitários, e testes E2E do Playwright.

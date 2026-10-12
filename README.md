<div align="center">

# ⚡ Sistema Hermes
### Plataforma Inteligente de Gestão de Pedidos e Atendimento em Tempo Real

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![NextAuth](https://img.shields.io/badge/Auth.js-NextAuth%20v5-purple?style=for-the-badge)](https://authjs.dev/)
[![Docker](https://img.shields.io/badge/Docker-Postgres-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

<br />

<img src="./docs/images/hermes-hero-banner.jpg" alt="Apresentação Sistema Hermes" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />

<br />
<br />

</div>

---

## 📖 O que é o Sistema Hermes?

O **Sistema Hermes** é um ecossistema completo e multi-tenant para automação gastronômica, projetado para extinguir filas de espera, agilizar o preparo na cozinha e conectar o salão à gerência em tempo real.

Diferente de sistemas convencionais monolíticos, o Hermes atua em **4 frentes sincronizadas**:

1. **📱 Totem do Cliente & Cardápio Digital Mobile:** O cliente lê o QR Code da mesa e acessa o cardápio ilustrado em alta resolução, monta o carrinho e envia o pedido sem precisar chamar o garçom.
2. **🧾 Terminal do Atendente (Mobile / Balcão):** Garçons utilizam qualquer celular ou tablet para lançar pedidos no salão, acompanhar comandas e visualizar instantaneamente alertas de pratos prontos para retirada.
3. **🍳 KDS Cozinha (Kitchen Display System):** A cozinha acompanha a esteira de pedidos ao vivo, com separação cromática por tempo de espera (Pendente, Em Preparo, Pronto) e notificações sonoras.
4. **📊 Painel Administrativo:** Gestores visualizam métricas financeiras em tempo real, gerenciam a equipe e emitem **QR Codes de uso único** com expiração automática para autenticar garçons em seus celulares.

---

## 🔄 Fluxo de Operação Integrada

<div align="center">
  <img src="./docs/images/hermes-system-flow.jpg" alt="Fluxo Operacional do Sistema Hermes" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
</div>

```mermaid
flowchart LR
    A["📱 Cliente / QR Mesa"] -->|Envia Pedido| D[("⚡ Hub Central Hermes")]
    B["🧾 Garçom / Celular"] -->|Lança Pedido| D
    D -->|Tempo Real| C["🍳 KDS Cozinha"]
    C -->|Marca como Pronto| D
    D -->|Alerta de Entrega| B
    D -->|Métricas & Vendas| E["📊 Painel ADM"]
```

---

## 🥟 Case de Sucesso Modelado: Pastelaria do Galo

Para validação prática do sistema em ambiente real, o Hermes conta com a **Pastelaria do Galo** como case modelo implementado:

- Mais de 20 opções de pastéis artesanais (Salgados, Especiais, Doces) e bebidas (Caldo de Cana, Sucos, Refrigerantes).
- Fotos profissionais de propaganda para cada produto em alta definição.
- Sincronização entre balcão, totens e fritura.

---

## 🔒 Segurança, Permissões (RBAC) e Tempo de Sessão

O sistema adota autenticação robusta via **Auth.js / NextAuth v5** com controle estrito de rotas por papel:

| Perfil | Destino Principal | Permissões & Movimentação |
| :--- | :--- | :--- |
| **`ADM`** | `/adm` | Acesso total e livre trânsito entre todas as áreas (`/cozinha`, `/atendente`, métricas e QR Codes). |
| **`ATENDENTE`** | `/atendente` | Acesso exclusivo ao terminal de pedidos. Bloqueado de acessar `/adm` e `/cozinha`. |
| **`COZINHA`** | `/cozinha` | Acesso exclusivo ao display KDS de produção. Bloqueado de acessar `/adm`. |
| **`DEV`** | `/dev` | Acesso irrestrito a testes, simuladores de múltiplos estabelecimentos e endpoints. |

### ⏱️ Política de Sessão dos Atendentes
- **Duração do Turno:** Sessão ativa por até **8 horas** (28.800 segundos), expirando automaticamente ao término da jornada de trabalho.
- **Login Instantâneo por QR Code:** O ADM gera um QR Code no painel que expira em 24h ou assim que é escaneado (**Uso Único**). Quando o atendente aponta a câmera do celular na tela de login, o acesso é liberado instantaneamente sem precisar digitar senhas.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Destaques |
| :--- | :--- | :--- |
| **Core** | [Next.js 16](https://nextjs.org/) (Turbopack) | App Router, Server Actions e API Routes de baixa latência |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org/) | Tipagem estrita ponta a ponta |
| **Estilização** | CSS Modules & HSL Design Tokens | Dark mode premium, micro-animações e responsividade total |
| **Banco de Dados** | PostgreSQL via [Prisma ORM](https://www.prisma.io/) | Modelagem relacional, seeds automáticas e migrações |
| **Autenticação** | [NextAuth.js v5](https://authjs.dev/) & Bcrypt | Credenciais criptografadas e tokens dinâmicos de QR Code |
| **Ícones** | [Lucide React](https://lucide.dev/) | Iconografia moderna e leve |

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
- **Node.js** v20+ ou v22+
- **Docker** e **Docker Compose** (para o PostgreSQL)

### 2. Clonar o Repositório
```bash
git clone https://github.com/MATHEUSele/restaurante-pedidos-sistema-hermes.git
cd restaurante-pedidos-sistema-hermes
```

### 3. Instalar Dependências
```bash
npm install
```

### 4. Subir o Banco de Dados com Docker
```bash
docker compose up -d
```
*(O banco PostgreSQL subirá automaticamente na porta configurada `5433`)*

### 5. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com as credenciais:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/hermes_db?schema=public"
NEXTAUTH_SECRET="sua-chave-secreta-hermes-super-segura"
NEXTAUTH_URL="http://localhost:3000"
```

### 6. Rodar Migrações e Seed do Banco
```bash
npx prisma db push
npx tsx scripts/update-product-images.ts
```

### 7. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

Acesse no navegador:
👉 **`http://localhost:3000`**

---

### ⚡ Atalhos Rápidos com Makefile

Se você possui a ferramenta `make` instalada em seu ambiente, pode gerenciar e rodar a aplicação através dos atalhos disponíveis no [`Makefile`](./Makefile):

| Comando | O que faz | Comando interno |
| :--- | :--- | :--- |
| `make dev` | Inicia o servidor local do Next.js em modo de desenvolvimento | `npm run dev` |
| `make docker-up` | Constrói e inicializa os containers Docker em segundo plano | `docker compose up -d --build` |
| `make docker-down` | Para e remove os containers ativos do Docker Compose | `docker compose down` |
| `make docker-logs` | Transmite e acompanha os logs dos containers em tempo real | `docker compose logs -f` |
| `make docker-migrate` | Cria e aplica novas migrações do banco com Prisma ORM | `npx prisma migrate dev --name init` |

---

## 🔑 Credenciais para Demonstração Rápida

| Perfil | E-mail / Usuário | Senha |
| :--- | :--- | :--- |
| **Administrador** | `admin@hermes.com` *(ou `adm@gmail.com`)* | `admin123` *(ou `123`)* |
| **Cozinha** | `cozinha@hermes.com` | `cozinha123` |
| **Atendente** | `atendente@hermes.com` | `atendente123` |
| **Desenvolvedor** | `dev@hermes.com` | `dev123` |

*(Também é possível acessar via **Escanear QR Code** gerado no Painel ADM).*

---

## 📱 Rotas Principais do Sistema

- **`/`** — Landing Page Institucional com Hero animado, CTAs de login/cadastro e vitrine de módulos.
- **`/login`** — Tela de acesso unificada (Credenciais com visualização de senha + Leitor de QR Code).
- **`/atendente`** — Terminal ágil de pedidos para balcão e garçons no celular.
- **`/cozinha`** — Display KDS com esteira de preparação em tempo real.
- **`/adm`** — Painel gerencial com métricas, faturamento e emissão de QR Codes de uso único.
- **`/totem/[slug]`** — Cardápio digital de autoatendimento para mesas e clientes.
- **`/dev`** — Workspace para testes de sandbox e simulação multi-loja.

---

<div align="center">
  <sub>Desenvolvido com excelência visual e arquitetura de tempo real para o Sistema Hermes.</sub>
</div>

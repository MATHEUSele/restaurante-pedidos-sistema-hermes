# 🤖 PLANO_AGENTE.md — Sistema Hermes (Restaurante Pedidos)
> **Arquivo de instruções para agente de IA.**
> Leia este arquivo ANTES de escrever qualquer código neste projeto.
> Atualizado em: 2026-09-21

---

## 📋 Visão Geral do Projeto

**Nome:** Hermes — Sistema de Pedidos para Restaurantes  
**Stack:** Next.js 16.3.5 (App Router, Turbopack), TypeScript, Prisma 5, PostgreSQL 16, Docker, NextAuth v5  
**Ambiente de prod:** Docker Compose (`docker-compose.yml`) — `app` (porta 3000) + `db` (Postgres porta 5432)

### Personas do Sistema
| Persona | Rota | Descrição |
|---------|------|-----------|
| **DEV** | `/dev` | Gerencia restaurantes, paletas de cores, acessa log global |
| **ADM** | `/adm` | Painel ao vivo, histórico, gestão de equipe, gera QR Codes |
| **COZINHA** | `/cozinha` | KDS — recebe pedidos, atualiza status |
| **ATENDENTE** | `/atendente` | Totem para fazer pedidos (desktop/mobile) |
| **TOTEM PÚBLICO** | `/totem/[slug]` | Totem por URL — vinculado via QR Code |

---

## ⚠️ PROBLEMA CRÍTICO ATUAL — Leia Primeiro

### Falta de Persistência Real

**Situação:** Todas as páginas (`/atendente`, `/cozinha`, `/adm`, `/dev`) usam o `PedidoContext` (`app/context/PedidoContext.tsx`), que é um **`useState` em memória no cliente**.

**Consequência direta:** Quando o atendente abre a aba `/atendente` e a cozinha abre `/cozinha`, eles estão em **processos de browser separados** — os pedidos criados em uma aba **nunca aparecem na outra**.

**O banco já existe.** O `schema.prisma` tem o modelo `Pedido` completo com todos os campos. O Prisma está configurado. A infra Docker está rodando. Falta apenas:
1. Criar as **API Routes** (Next.js Route Handlers) que leem/escrevem no banco.
2. Substituir o `PedidoContext` (mock em memória) pelo **fetch real via API**.
3. Adicionar **polling** nas páginas de Cozinha e ADM para se auto-atualizar.

---

## 🗺️ Arquitetura Alvo

```
[Atendente Browser] ──POST /api/pedidos──────────────────────┐
                                                              ▼
                                                    [PostgreSQL via Prisma]
                                                              ▲
[Cozinha Browser] ────GET /api/pedidos?status=PAGO,EM_PREPARO─┘  (polling a cada 5s)
[ADM Browser] ────────GET /api/pedidos───────────────────────── (polling a cada 5s)
[DEV Browser] ────────GET /api/pedidos (global)─────────────────
```

**Estratégia de sincronização:** Polling simples (`setInterval` de 5 segundos) com `fetch`. Não usar WebSockets por ora — polling é suficiente para este MVP e é mais simples de manter no Docker.

---

## 📁 Estrutura de Arquivos Atual

```
restaurante-pedidos-sistema-hermes/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts     ✅ Existe — NextAuth handlers
│   │   │   └── seed/route.ts              ✅ Existe — Seed de usuários
│   │   ├── qrcode/
│   │   │   ├── gerar/route.ts             ✅ Existe
│   │   │   └── validar/route.ts           ✅ Existe
│   │   └── pedidos/                       ❌ CRIAR — PRIORIDADE 1
│   │       ├── route.ts                   ❌ GET (listar) + POST (criar)
│   │       └── [id]/
│   │           └── route.ts               ❌ PATCH (atualizar status)
│   ├── context/
│   │   ├── PedidoContext.tsx              ⚠️ MOCK — Manter para fallback local, mas substituir nas páginas
│   │   └── ThemeContext.tsx               ✅ OK — Paletas de cor (8 temas)
│   ├── atendente/
│   │   ├── page.tsx                       ⚠️ Usa PedidoContext mock — Migrar para API
│   │   └── atendente.module.css           ✅ OK
│   ├── cozinha/
│   │   ├── page.tsx                       ⚠️ Usa PedidoContext mock — Adicionar polling
│   │   └── cozinha.module.css             ✅ OK
│   ├── adm/
│   │   └── page.tsx                       ⚠️ Usa PedidoContext mock — Adicionar polling
│   ├── dev/
│   │   ├── page.tsx                       ✅ OK (sem pedidos, só lista restaurantes)
│   │   └── restaurante/[slug]/page.tsx    ⚠️ Usa PedidoContext mock — Migrar para API
│   └── totem/
│       └── [slug]/page.tsx                ✅ OK (valida QR Code)
├── prisma/
│   └── schema.prisma                      ✅ Schema completo com todos os modelos
├── lib/
│   └── prisma.ts                          ✅ PrismaClient singleton
├── auth.ts                                ✅ NextAuth v5 com Credentials
├── middleware.ts                          ⚠️ DEPRECATED — Migrar para proxy.ts (Next.js 16)
├── next.config.ts                         ✅ output: 'standalone' configurado
├── Dockerfile                             ✅ Multi-stage build funcional
└── docker-compose.yml                     ✅ app + db rodando
```

---

## 🔨 Plano de Implementação — Etapas Ordenadas

### ETAPA 0 — Pré-requisitos (Antes de Qualquer Código)

**0.1 Verificar se o banco tem dados seed**

O modelo `Pedido` no Prisma tem `restauranteId` como campo obrigatório (`String`, não opcional). Isso significa que todo pedido precisa estar vinculado a um `Restaurante` no banco. Antes de criar pedidos via API, o registro da "Pastelaria do Galo" deve existir no banco.

**Ação:** Verificar/criar seed em `app/api/auth/seed/route.ts` para incluir:
- Restaurante: `{ nome: "Pastelaria do Galo", id: "rest-pastelaria-do-galo" }` (UUID fixo para simplicidade)
- Produtos do mock (opcional na fase 1 — usar mock no front por enquanto)

**0.2 Verificar o campo `clienteNome` no schema**

No `schema.prisma`, o campo é `clienteNome String` (obrigatório). No front, o campo é opcional. Isso vai causar erro se enviado como `null`. **Solução:** Tornar `clienteNome String?` no schema e rodar `npx prisma db push`.

**0.3 Migrar `middleware.ts` → `proxy.ts`**

O Next.js 16 deprecou `middleware.ts`. O build emite um aviso. Rodar o codemod:
```bash
npx @next/codemod@canary middleware-to-proxy .
```
Ou renomear manualmente. Verificar se a lógica de proteção de rotas continua funcionando.

---

### ETAPA 1 — API Routes de Pedidos (Backend)

> **Arquivos a criar:** `app/api/pedidos/route.ts` e `app/api/pedidos/[id]/route.ts`

#### `app/api/pedidos/route.ts`

**GET** — Listar pedidos com filtros opcionais:
```
GET /api/pedidos                          → todos os pedidos
GET /api/pedidos?status=PAGO,EM_PREPARO   → filtra por status (csv)
GET /api/pedidos?restauranteId=xxx        → filtra por restaurante
```

Lógica:
```typescript
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");
  const restauranteId = searchParams.get("restauranteId");

  const where: Record<string, unknown> = {};
  if (statusParam) where.status = { in: statusParam.split(",") };
  if (restauranteId) where.restauranteId = restauranteId;

  const pedidos = await prisma.pedido.findMany({
    where,
    include: { itens: { include: { produto: true } } },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json(pedidos);
}
```

**POST** — Criar pedido:
```
POST /api/pedidos
Body: {
  restauranteId: string,
  clienteNome?: string,
  nota?: string,
  agendadoPara?: string,
  itens: Array<{ produtoId: string, quantidade: number, precoUnitario: number }>
}
```

Lógica: Calcular `total` no servidor como soma de `precoUnitario * quantidade`. Retornar pedido criado com `include: { itens: true }`.

> ⚠️ **Atenção:** Como os produtos no front são dados mock (sem IDs reais no banco), na Fase 1 pode-se criar `ItemPedido` com `produtoId` de um produto "placeholder" ou tornar `produtoId` opcional via schema. Decidir com o usuário — opção mais simples: tornar `produtoId` nullable no schema (`produtoId String?`) para não bloquear o desenvolvimento.

#### `app/api/pedidos/[id]/route.ts`

**PATCH** — Atualizar status:
```
PATCH /api/pedidos/[id]
Body: { status: "EM_PREPARO" | "PRONTO" | "ENTREGUE" | "CANCELADO" }
```

Lógica: `prisma.pedido.update({ where: { id }, data: { status } })`. Retornar pedido atualizado.

---

### ETAPA 2 — Migração das Páginas para API Real

> **Estratégia:** NÃO remover o `PedidoContext`. Substituir as chamadas nas páginas por `fetch` + `useEffect` com polling. O contexto pode ser mantido como type definitions.

#### 2.1 Hook Reutilizável `usePedidosApi`

Criar `app/hooks/usePedidosApi.ts` — hook que encapsula o fetch com polling:

```typescript
"use client";
import { useEffect, useState, useCallback } from "react";

// Tipo espelhando o retorno da API (Prisma Pedido com itens)
export interface ItemApi {
  id: string;
  quantidade: number;
  precoUnitario: number;
  produto: { id: string; nome: string; preco: number } | null;
  // Para itens sem produto (fase de transição):
  nomeProdutoManual?: string;
}

export interface PedidoApi {
  id: string;
  clienteNome: string | null;
  status: string;
  total: number;
  nota: string | null;
  agendadoPara: string | null;
  restauranteId: string;
  criadoEm: string; // ISO string vindo da API
  itens: ItemApi[];
}

interface Options {
  statusFilter?: string;   // ex: "PAGO,EM_PREPARO"
  restauranteId?: string;
  pollingInterval?: number; // ms, padrão 5000
}

export function usePedidosApi(options: Options = {}) {
  const [pedidos, setPedidos] = useState<PedidoApi[]>([]);
  const [loading, setLoading] = useState(true);
  const { statusFilter, restauranteId, pollingInterval = 5000 } = options;

  const fetchPedidos = useCallback(async () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (restauranteId) params.set("restauranteId", restauranteId);

    const res = await fetch(`/api/pedidos?${params}`);
    if (res.ok) {
      const data = await res.json();
      setPedidos(data);
    }
    setLoading(false);
  }, [statusFilter, restauranteId]);

  useEffect(() => {
    fetchPedidos();
    const interval = setInterval(fetchPedidos, pollingInterval);
    return () => clearInterval(interval);
  }, [fetchPedidos, pollingInterval]);

  const atualizarStatus = async (id: string, status: string) => {
    await fetch(`/api/pedidos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchPedidos(); // Refetch imediato após update
  };

  const criarPedido = async (payload: {
    restauranteId: string;
    clienteNome?: string;
    nota?: string;
    agendadoPara?: string;
    itens: Array<{ nomeProdutoManual: string; quantidade: number; precoUnitario: number }>;
  }) => {
    const res = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) await fetchPedidos();
    return res.ok;
  };

  return { pedidos, loading, atualizarStatus, criarPedido };
}
```

#### 2.2 Atualizar `/atendente/page.tsx`

- Remover `import { usePedido }` e `const { adicionarPedido } = usePedido()`
- Adicionar `const { pedidos, criarPedido } = usePedidosApi({ restauranteId: "RESTAURANTE_ID_FIXO" })`
- Em `handleConfirmarPedido()`, chamar `criarPedido({ restauranteId, clienteNome, nota, agendadoPara, itens })`
- A aba "Prontos" vai ler `pedidos.filter(p => p.status === "PRONTO")` da API
- **IMPORTANTE:** Usar `RESTAURANTE_ID_FIXO = "rest-pastelaria-do-galo"` por enquanto (ou ler da sessão via `useSession()`)

#### 2.3 Atualizar `/cozinha/page.tsx`

- Remover `import { usePedido }` e `const { pedidos, atualizarStatus } = usePedido()`
- Adicionar `const { pedidos, atualizarStatus, loading } = usePedidosApi({ statusFilter: "PAGO,EM_PREPARO,PRONTO" })`
- O polling de 5s já está embutido no hook — a cozinha vai se atualizar automaticamente
- Adicionar indicador visual de "Atualizando..." quando o polling rodar (opcional — usar um estado `isRefreshing`)

**KDS Timer (Temporizador Visual):**
Adicionar em cada card da cozinha um timer que calcula `Date.now() - new Date(pedido.criadoEm).getTime()` e muda a cor da borda:
- `< 10min` → borda verde `#10B981`
- `10-20min` → borda amarela `#F59E0B`
- `> 20min` → borda vermelha `#EF4444` com animação `pulse`

Implementação:
```typescript
function usarTempoDecorrido(criadoEm: string) {
  const [minutos, setMinutos] = useState(0);
  useEffect(() => {
    const calcular = () => {
      const diff = Date.now() - new Date(criadoEm).getTime();
      setMinutos(Math.floor(diff / 60000));
    };
    calcular();
    const id = setInterval(calcular, 10000); // Atualiza a cada 10s
    return () => clearInterval(id);
  }, [criadoEm]);
  return minutos;
}
```

#### 2.4 Atualizar `/adm/page.tsx`

- Remover `import { usePedido }` e `const { pedidos, atualizarStatus } = usePedido()`
- Adicionar `const { pedidos, atualizarStatus } = usePedidosApi()` (sem filtro — ADM vê tudo)
- Polling de 5s já embutido no hook
- Lógica das tabs já está correta: `aoVivo`, `prontos`, `historico` filtram por status no front (sem alterar a API)

#### 2.5 Atualizar `/dev/restaurante/[slug]/page.tsx`

- Remover `import { usePedido }` e `const { pedidos } = usePedido()`
- Adicionar `const { pedidos } = usePedidosApi()` — DEV vê tudo globalmente
- Mapear os campos: `pedido.criadoEm` (string ISO) ao invés de `pedido.createdAt` (Date)
- Usar `pedido.itens` ao invés de `pedido.items`

---

### ETAPA 3 — Correções de Schema e Seed

#### 3.1 Patch no `schema.prisma`

Campos a tornar opcionais/ajustar:
```prisma
model Pedido {
  clienteNome   String?    // Era obrigatório — tornar opcional
  // ... resto igual
}

model ItemPedido {
  produtoId       String?        // Tornar opcional para fase de transição
  produto         Produto?       @relation(fields: [produtoId], references: [id])
  nomeProduto     String?        // Novo campo — nome manual do produto
  // ... resto igual
}
```

Depois de alterar, rodar dentro do container Docker:
```bash
docker compose exec app sh -c "cd /app && npx prisma@5.22.0 db push --accept-data-loss"
```

**Ou localmente** com `DATABASE_URL` apontando para `localhost:5432`:
```bash
# No .env.local, colocar:
# DATABASE_URL="postgresql://hermes:password123@localhost:5432/hermes_db?schema=public"
npx prisma db push
```

#### 3.2 Atualizar Seed (`app/api/auth/seed/route.ts`)

O seed deve criar:
1. Restaurante "Pastelaria do Galo" com ID fixo (ou upsert pelo nome)
2. Usuário DEV (`dev@hermes.com` / senha `dev123`)
3. Usuário ADM (`adm@hermes.com` / senha `adm123`)
4. Usuário Cozinha (`cozinha@hermes.com` / senha `cozinha123`)

Exemplo de upsert para restaurante:
```typescript
await prisma.restaurante.upsert({
  where: { id: "rest-pastelaria-do-galo" },
  update: {},
  create: {
    id: "rest-pastelaria-do-galo",
    nome: "Pastelaria do Galo",
    cores: JSON.stringify({ prim: "#7A1E2E", sec: "#F5C518" }),
  }
});
```

---

### ETAPA 4 — Melhorias de UX por Interface

#### 4.1 Totem do Atendente (`/atendente`)

**Referência:** Totem McDonald's (mobile-first) + iFood (sticky button, fluxo rápido)

Melhorias específicas:
- [ ] Imagens dos produtos em destaque (já implementado com Unsplash, validar carregamento)
- [ ] Botão "Adicionar" maior e mais visível no card do produto
- [ ] Botão de Checkout **sticky no rodapé** (`position: fixed; bottom: 0`) exibindo o total atual
- [ ] Sidebar do carrinho colapsável em mobile (ícone de carrinho com badge de quantidade)
- [ ] Campos opcionais (Nome, Nota, Horário) aparecem em **modal de confirmação**, não na sidebar (menos poluição visual)
- [ ] Modal de sucesso com stepper animado já existe — manter e melhorar animação

#### 4.2 Cozinha — KDS (`/cozinha`)

**Referência:** Kitchen Display Systems de fast food

Melhorias específicas:
- [ ] Timer visual em cada card (verde → amarelo → vermelho)
- [ ] Badge com tempo decorrido ("há 5 min", "há 23 min")
- [ ] Sons de notificação quando novo pedido chega (API Web Audio ou `<audio>` tag) — **verificar se o usuário aprova**
- [ ] Reorganizar cards por ordem de chegada (mais antigos primeiro)
- [ ] Botão "Bump" (dispensar pedido entregue) grande e acessível
- [ ] Indicador de "Conectado" / "Atualizando" no header

#### 4.3 Painel ADM (`/adm`)

**Referência:** iFood para Parceiros / Dashboards modernos

Melhorias específicas:
- [ ] Cards de analytics com cores mais expressivas e ícones de tendência
- [ ] Aba "Prontos / Entregar" mais visível quando há pedidos prontos (badge pulsante)
- [ ] Botão de cancelar pedido com confirmação (`window.confirm` ou modal)
- [ ] Histórico com filtro por data (básico: hoje / últimos 7 dias)
- [ ] Opção de fechar pedido pelo ADM (além da cozinha) — já existe na aba "Prontos"

#### 4.4 Workspace DEV (`/dev`)

**Referência:** Dashboards de desenvolvedor (Vercel, Railway)

Melhorias específicas:
- [ ] Paleta de cores expandida de 8 para 16 temas no `ThemeContext.tsx`
  - Adicionar: `Café Escuro`, `Mint Fresh`, `Sunset Gradient`, `Midnight Blue`, `Coral`, `Sage Green`, `Neon Cyber`, `Lavanda`
- [ ] Visualização das cores em formato de **swatches maiores** (não apenas bolhas de 48px)
- [ ] Mostrar nome da paleta abaixo do swatch com preview do hex
- [ ] Adicionar preview live: o header da página muda de cor ao hover (antes de confirmar)
- [ ] Log de pedidos global com paginação simples

---

### ETAPA 5 — Migração do Middleware (Next.js 16)

O `middleware.ts` está depreciado no Next.js 16. O build emite aviso:
```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
```

**Ação:** Renomear `middleware.ts` → `proxy.ts` e verificar se a lógica de proteção de rotas continua funcionando. A API do `proxy.ts` é idêntica ao `middleware.ts` do Next.js 14/15.

```bash
# No projeto
mv middleware.ts proxy.ts
```

---

### ETAPA 6 — Validação e Testes

#### Checklist de verificação:

**Backend:**
- [ ] `GET /api/pedidos` retorna array vazio sem erro
- [ ] `POST /api/pedidos` cria pedido no banco e retorna com ID
- [ ] `PATCH /api/pedidos/[id]` atualiza status e retorna pedido atualizado
- [ ] Seed funciona e cria restaurante + usuários

**Fluxo Completo:**
- [ ] Atendente abre `/atendente`, adiciona itens e confirma pedido
- [ ] Cozinha abre `/cozinha` em OUTRA ABA — pedido aparece em ≤5s (polling)
- [ ] Cozinha clica "Iniciar Preparo" — status muda para `EM_PREPARO`
- [ ] Atendente vê aba "Prontos" vazia (ainda em preparo) ✓
- [ ] Cozinha clica "Marcar como Pronto" — status muda para `PRONTO`
- [ ] Atendente vê pedido na aba "Prontos" com nome do cliente
- [ ] ADM abre `/adm` — pedido aparece em "Prontos / Entregar"
- [ ] Cozinha ou ADM clica "Entregar" — status muda para `ENTREGUE`
- [ ] ADM: pedido some de "Prontos" e aparece em "Histórico"
- [ ] DEV abre `/dev/restaurante/pastelaria-do-galo` — log global mostra pedido

**Docker:**
- [ ] `docker compose up --build` funciona sem erros
- [ ] App acessível em `http://localhost:3000`
- [ ] Login com `adm@hermes.com` / `adm123` funciona e redireciona para `/adm`

---

## 🧩 Contextos e Tipos Atuais

### `PedidoContext.tsx` — Estado atual (mock)
```typescript
export type StatusPedido = "PAGO" | "EM_PREPARO" | "PRONTO" | "ENTREGUE" | "CANCELADO";

export interface Pedido {
  id: string;
  items: ItemPedido[];     // ← no banco é "itens"
  total: number;
  status: StatusPedido;
  createdAt: Date;          // ← no banco é "criadoEm" (string ISO)
  clienteNome?: string;
  nota?: string;
  agendadoPara?: string;
}
```

**Diferenças entre tipo do contexto e tipo da API** (atenção ao migrar):
| Front (Context) | API/Banco (Prisma) |
|---|---|
| `items` | `itens` |
| `createdAt: Date` | `criadoEm: string` (ISO) |
| `item.name` | `item.produto.nome` ou `item.nomeProduto` |
| `item.price` | `item.precoUnitario` |
| `item.quantity` | `item.quantidade` |

---

## 🔑 Variáveis de Ambiente

```env
# .env (desenvolvimento local — aponta para Docker)
DATABASE_URL="postgresql://hermes:password123@localhost:5432/hermes_db?schema=public"
NEXTAUTH_SECRET="secret-super-seguro-gerado-com-openssl"
NEXTAUTH_URL="http://localhost:3000"
```

```env
# docker-compose.yml (produção Docker)
DATABASE_URL="postgresql://hermes:password123@db:5432/hermes_db?schema=public"
NEXTAUTH_SECRET="secret-super-seguro-gerado-com-openssl"
NEXTAUTH_URL="http://localhost:3000"
```

**Diferença crítica:** No `.env` local, host é `localhost`. No Docker, host é `db` (nome do serviço no compose).

---

## 📦 Dependências Instaladas

```json
{
  "prisma": "5.22.0",
  "@prisma/client": "5.22.0",
  "next-auth": "^5.0.0-beta.22",
  "bcryptjs": "^2.4.3",
  "qrcode.react": "^4.2.0",
  "lucide-react": "latest"
}
```

> **Atenção:** Não fazer upgrade do Prisma para v7 — há breaking changes de API e incompatibilidade com a versão do Node/Alpine no Docker.

---

## 🚫 O Que NÃO Fazer

1. **Não usar `npm ci`** no Dockerfile — usar `npm install` (o lockfile pode estar dessincronizado)
2. **Não usar `npx prisma` sem versão** dentro do container Docker — usar `npx prisma@5.22.0`
3. **Não adicionar `output: 'standalone'` como comentário** — é obrigatório no `next.config.ts` para o Docker funcionar
4. **Não fazer upgrade do Next.js** sem verificar breaking changes no App Router
5. **Não usar WebSockets/Socket.io** nesta fase — polling é suficiente e mais simples de manter no Docker
6. **Não remover o `PedidoContext`** abruptamente — migrar página por página para evitar quebras

---

## ✅ Ordem de Execução Recomendada

```
[ETAPA 0] Correções de pré-requisito
  └─ 0.1 Seed com Restaurante "Pastelaria do Galo"
  └─ 0.2 Tornar clienteNome nullable no schema
  └─ 0.3 Migrar middleware.ts → proxy.ts

[ETAPA 1] Criar API Routes de Pedidos
  └─ app/api/pedidos/route.ts (GET + POST)
  └─ app/api/pedidos/[id]/route.ts (PATCH)

[ETAPA 2] Criar hook usePedidosApi
  └─ app/hooks/usePedidosApi.ts

[ETAPA 3] Migrar páginas (uma a uma, testar cada)
  └─ 3.1 /atendente → usar criarPedido() da API
  └─ 3.2 /cozinha → usar polling + atualizarStatus() da API
  └─ 3.3 /adm → usar polling + atualizarStatus() da API
  └─ 3.4 /dev/restaurante/[slug] → usar API (log global)

[ETAPA 4] Melhorias de UX
  └─ 4.1 Atendente: sticky checkout, modal de confirmação
  └─ 4.2 Cozinha: timer visual, cores dinâmicas
  └─ 4.3 ADM: aba prontos pulsante, confirmação de cancelamento
  └─ 4.4 DEV: expandir paletas para 16 temas

[ETAPA 5] Deploy e Validação
  └─ docker compose up --build
  └─ Seed via GET /api/auth/seed
  └─ Testar fluxo completo entre abas
```

---

## 🐳 Comandos Docker Úteis

```bash
# Subir (com rebuild)
docker compose up -d --build

# Ver logs do app
docker compose logs -f app

# Ver logs do banco
docker compose logs -f db

# Rodar seed
curl http://localhost:3000/api/auth/seed

# Acessar bash do container
docker compose exec app sh

# Parar tudo e apagar volumes (reset total do banco)
docker compose down -v

# Reiniciar sem rebuild
docker compose restart app
```

---

*Este arquivo é mantido pelo agente de desenvolvimento. Atualize sempre que houver mudanças de arquitetura.*

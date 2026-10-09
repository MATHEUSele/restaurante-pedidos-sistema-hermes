# Implementation Plan – What's Missing

## ✅ Completed Items (From BACKLOG)
- **Etapa 0 – Pré-requisitos e Banco de Dados**
  - Seed atualizado (`app/api/auth/seed/route.ts`).
  - `schema.prisma` ajustado (campos opcionais).
  - Banco sincronizado (`prisma db push`).
- **Etapa 1 – APIs (Backend)**
  - Rota `GET /api/pedidos` ✅
  - Rota `POST /api/pedidos` ✅
  - Rota `PATCH /api/pedidos/[id]` ✅
- **Etapa 2 – Frontend**
  - Hook `usePedidosApi` ✅
  - Tela **Atendente** usando API ✅
  - Tela **Cozinha** com polling ✅
  - Painel **ADM** lendo dados reais ✅
- **Testes**
  - Teste de registro (`tests/pedidos.spec.ts`).
  - Teste de login (`tests/login.spec.ts`).

## ❌ Missing / Pending Tasks
| Item | Description | Owner | Priority |
|------|-------------|-------|----------|
| 1 | **Start Docker Compose** – The `docker compose up -d` command fails because Docker Desktop daemon is not running and the `version` key in `docker-compose.yml` is obsolete. | Dev | High |
| 2 | **Generate Prisma client** – Run `npx prisma generate` after updating schema to ensure type‑safe client. | Dev | High |
| 3 | **Add authentication middleware** to the pedidos API routes so only logged‑in users can create / update orders. | Dev | Medium |
| 4 | **Write GET‑list unit test** – Verify that `GET /api/pedidos` returns an array and respects query filters. | QA | Medium |
| 5 | **Add end‑to‑end test for order flow** – Simulate a full order creation from Atendente UI and status update in ADM. | QA | Medium |
| 6 | **Fix Docker Compose version warning** – Remove the `version:` field to avoid future confusion. | DevOps | Low |
| 7 | **Documentation** – Add API reference section in `docs/arquitetura/` describing request/response shapes. | Docs | Low |
| 8 | **Continuous Integration** – Wire up GitHub Action to run Playwright tests on push. | DevOps | Low |

## 📋 Step‑by‑Step Implementation Plan

### Phase 1 – Infrastructure (Day 1)
1. **Start Docker**
   - Ensure Docker Desktop (or Docker Engine) is running on the host.
   - Run `docker compose up -d`.
   - Verify containers with `docker ps` (should see `postgres` service).
2. **Fix `docker-compose.yml`**
   - Open `docker-compose.yml` and **remove** the top‑level `version:` entry (it is ignored in newer compose specs).
   - Commit the change.
3. **Generate Prisma client**
   - Execute `npx prisma generate`.
   - Run `npx prisma db push --accept-data-loss` again to guarantee DB schema matches.

### Phase 2 – Security (Day 2)
4. **Add Auth Guard**
   - Create a `middleware.ts` at `app/api/pedidos/` that checks `await getSession()` (from `next-auth`).
   - Return `401` if no session.
   - Apply the same guard to the `[id]` route.
5. **Update API responses** – Ensure error messages are consistent (JSON `{ error: "…" }`).

### Phase 3 – Testing (Day 3‑4)
6. **Write GET test** (`tests/pedidos_get.spec.ts`)
   ```ts
   test('GET /api/pedidos returns list', async ({ request }) => {
     const res = await request.get('/api/pedidos');
     expect(res.status()).toBe(200);
     const data = await res.json();
     expect(Array.isArray(data)).toBe(true);
   });
   ```
7. **End‑to‑end order flow**
   - Use Playwright to navigate to `/atendente`, add a product, fill client name, submit.
   - Verify the order appears in `/adm` list with status `PAGO`.
   - Update status via PATCH and confirm UI reflects change.
8. **Run test suite**
   - `npx playwright test` – fix any failing assertions.

### Phase 4 – Documentation & CI (Day 5‑6)
9. **API Docs** – Add a markdown file `docs/arquitetura/pedidos_api.md` with request/response examples.
10. **GitHub Action** – Create `.github/workflows/ci.yml` running `npm ci && npx playwright install && npx playwright test` on each PR.
11. **Update README** – Include steps to start the project locally (Docker, .env, `npm run dev`).

## 🚀 Acceptance Criteria
- Docker containers run without errors and the database is reachable.
- All API routes require an authenticated session.
- All Playwright tests (login, register, pedidos CRUD, full order flow) pass on a clean checkout.
- Documentation is up‑to‑date and CI reports green on every push.

## 📦 Deliverables
- Updated `docker-compose.yml` (no version key).
- `middleware.ts` protecting pedidos routes.
- New test files (`tests/pedidos_get.spec.ts`, `tests/order_flow.spec.ts`).
- API documentation markdown.
- CI workflow YAML.

*Once the above tasks are completed, the project will be fully functional, secure, and covered by automated tests.*

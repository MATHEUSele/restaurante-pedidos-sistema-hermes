# 📖 Diário de Modificações e Backlog

Este documento serve como um registro contínuo das alterações feitas no projeto (Changelog) e uma lista das próximas tarefas a serem realizadas (Backlog).

---

## 📝 Backlog (Próximos Passos)

### Etapa 0 — Pré-requisitos e Banco de Dados
- [x] Atualizar o Seed (`app/api/auth/seed/route.ts`) para incluir o restaurante padrão ("Pastelaria do Galo").
- [x] Ajustar o `schema.prisma` para tornar campos flexíveis (como `clienteNome` e `produtoId` opcionais).
- [x] Sincronizar o banco de dados com as alterações do schema (`npx prisma db push`).

### Etapa 1 — Desenvolvimento de APIs (Backend)
- [x] Criar rota `GET /api/pedidos` (listar pedidos com filtros e polling).
- [x] Criar rota `POST /api/pedidos` (criar novos pedidos).
- [x] Criar rota `PATCH /api/pedidos/[id]` (atualizar status do pedido).

### Etapa 2 — Integração com Frontend (Sincronização Real)
- [x] Criar o hook customizado `usePedidosApi` para gerenciar as requisições ao backend.
- [x] Atualizar a tela do **Atendente** (`/atendente`) para usar a nova API ao invés do mock.
- [x] Atualizar a tela da **Cozinha** (`/cozinha`) para atualizar a fila automaticamente (polling).
- [x] Atualizar o painel do **ADM** (`/adm`) para ler os dados reais do banco.
### Sprint 3 — UI Premium & Feedback Visual
- [x] Instalar/Configurar Google Fonts (Inter) via `next/font`.
- [x] Refatorar `app/login/page.tsx` para usar CSS Modules com estilos modernos.
- [x] Criar componente Toast reutilizável e integrá-lo ao fluxo de login/cadastro.

### Sprint 4 — Persistência & Cache
- [x] Introduzir cache/persistência no hook `usePedidosApi`.
- [x] Persistir estado de filtro de pedidos no `localStorage`.

### Sprint 5 — Segurança e Autorização
- [x] Criar HOC/Componente `RequireAuth`.
- [x] Aplicar `RequireAuth` nas rotas `/atendente`, `/cozinha`, `/adm`.

### Sprint 6 — Cobertura de Testes
- [x] Testes unitários para `usePedidosApi`, `auth.ts` e componentes de UI.
- [x] Testes E2E com Playwright para fluxo principal.

### Sprint 7 — CI/CD & Melhorias Extras
### Sprint 8-9 — Segurança, UI Premium e Performance
- [x] Auditar vulnerabilidades e corrigir configs de CI.
- [x] Hardening de headers (HSTS, CSP).
- [x] Dark mode (`ThemeToggle`) e tipografia Inter.
- [x] Migrar imagens para `next/image` otimizadas.

### Sprint 10 — Testes, CI Avançado e Monitoramento
- [x] Testes de Integração de API (`tests/api/pedidos.spec.ts`).
- [x] Refatoração do OS Matrix no GitHub Actions para Suporte a Postgres.
- [x] Utilitário de log estruturado (`app/utils/logger.ts`).
- [x] Health check com Logging estruturado.

---

## 🔄 Diário de Modificações (Changelog)

### [2026-10-09]
- **Documentação:** Criação das pastas `docs/arquitetura/`, `docs/planejamento/` e `docs/agentes/`.
- **Documentação:** Movidos os arquivos `.md` que estavam soltos na raiz para suas respectivas pastas organizacionais (mantendo apenas `README.md` e `AGENTS.md` na raiz por limitações técnicas dos frameworks).
- **Planejamento:** Criação deste diário (`BACKLOG.md`) para guiar as futuras implementações.

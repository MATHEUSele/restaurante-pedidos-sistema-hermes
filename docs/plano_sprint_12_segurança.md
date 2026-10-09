# Sprint 12 – Segurança & Dependências

## Objetivo
Fortalecer a postura de segurança do **Sistema Hermes** e garantir que todas as dependências estejam em versões estáveis, livre de vulnerabilidades críticas.

## Tasks Principais
| # | Tarefa | Descrição | Critério de Aceite |
|---|--------|-----------|--------------------|
| 1 | **Auditoria completa** | Executar `npm audit --production` e analisar relatório. | Nenhuma vulnerabilidade de nível **high** ou **critical** apresentadas.
| 2 | **Atualização de pacotes** | Atualizar dependências principais (`next`, `react`, `next-auth`, `prisma`, `eslint`, `typescript`). Utilizar `npm outdated` + `npm install <pkg>@latest`.
| 3 | **Hardening de Headers** | Revisar `next.config.ts` para garantir CSP completo, HSTS, X‑Content‑Type‑Options, Referrer‑Policy. | Headers presentes em todas as respostas (verifica‑se via `curl -I`).
| 4 | **Revisão RBAC** | Garantir que `RequireAuth` verifica permissões de forma consistente e que respostas `403` nunca expõem detalhes internos.
| 5 | **Testes de segurança** | Criar testes de integração que simulam ataques XSS e CSRF usando Playwright.
| 6 | **Dependências não‑usadas** | Remover pacotes não importados (`npm prune`).
| 7 | **Snyk / Dependabot** | Configurar integração (arquivo `.github/dependabot.yml`).
| 8 | **Documentação de segurança** | Atualizar `docs/SECURITY.md` com políticas de atualização e checklist de auditoria.
| 9 | **CI Quality Gate** | Fail build se `npm audit` encontrar vulnerabilidades > low.

## Cronograma (5 dias úteis)
| Dia | Atividade |
|-----|-----------|
| 1 | Auditoria `npm audit`, análise de vulnerabilidades e criação de branch `sprint-12-sec`. |
| 2 | Atualização de dependências críticas + `npm audit fix` (forçado). |
| 3 | Implementação de headers avançados e revisão RBAC. |
| 4 | Escrita/execução de testes de segurança + remoção de dependências obsoletas. |
| 5 | Atualização da documentação, configuração Dependabot e merge via PR.

## Commit & Push (conforme `AGENTS.md`)
- Cada task deve gerar um commit individual com mensagens padronizadas (`feat(security): …`, `chore(deps): …`).
- Push automático ao final de cada task.

---

[Link para o plano]([plano_sprint_12_segurança.md](file:///c:/Users/matheuss/OneDrive/Desktop/trabalho%20-%20desctop/restaurante-pedidos-sistema-hermes/docs/plano_sprint_12_segurança.md))

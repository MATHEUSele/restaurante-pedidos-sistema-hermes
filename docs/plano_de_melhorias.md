# Plano de Ação – Melhorias Pendentes

## 1️⃣ Segurança e Dependências
- **Auditar vulnerabilidades**: rodar `npm audit` e corrigir com `npm audit fix` ou atualização manual de pacotes críticos (ex.: ESLint, Prisma).
- **Atualizar dependências**: garantir que todas as libs estejam na última versão estável, especialmente `next`, `react`, `next-auth`.
- **Hardening de headers**: configurar `helmet` via middleware Next.js para proteção contra XSS, click‑jacking, CSP.
- **Revisão de permissões**: validar regras de acesso em `RequireAuth` e confirmar que não há fuga de dados entre perfis.

## 2️⃣ UI/UX Premium
- **Responsividade**: revisar breakpoints, usar CSS Grid/Flex para garantir layout em tablets e smartphones.
- **Modo escuro**: implementar theme toggle usando `next-themes` com cores harmoniosas (HSL) e transições suaves.
- **Micro‑animações**: aplicar `@keyframes` ou `framer‑motion` para feedback visual em botões, toast e mudança de status de pedidos.
- **Tipografia**: garantir uso consistente da fonte *Inter* em todos os componentes, inclusive em PDFs/exports.
- **Acessibilidade (a11y)**: adicionar atributos `aria-*`, foco visível, contraste adequado (WCAG AA).

## 3️⃣ Performance
- **Code‑splitting**: usar `dynamic` import para módulos pesados (ex.: dashboards, relatórios).
- **Imagem otimizada**: substituir imagens estáticas por `next/image` com lazy‑loading.
- **Cache de API**: melhorar SWR/React‑Query para invalidação automática quando status do pedido mudar.
- **Auditar bundle**: rodar `next build` e analisar relatório de tamanho, aplicar treeshaking.

## 4️⃣ Cobertura de Testes
- **Aumentar coverage**: meta de 90% nas linhas e 80% nos branches.
- **Testes integração API**: criar arquivos em `tests/api/` usando `supertest` contra rotas `/api/pedidos` (GET/POST/PATCH).
- **Testes de permissão**: garantir que usuários sem perfil adequado recebam 403.
- **E2E avançado**: incluir fluxo de cadastro de novo usuário, recuperação de senha e logout.

## 5️⃣ CI/CD Avançado
- **Cache de dependências**: usar `actions/cache` para `node_modules`.
- **Matrix de Node/OS**: validar em Node 18/20 e Windows/Linux.
- **Deploy automático**: conectar workflow ao Vercel com `vercel-action` para preview em PRs.
- **Quality gates**: falhar build se cobertura < 80% ou se `npm audit` encontrar vulnerabilidades críticas.

## 6️⃣ Documentação
- **OpenAPI (Swagger)**: gerar esquema das rotas `/api/*` e publicar em `/docs/api`.
- **README aprimorado**: incluir instruções de setup local, variáveis de ambiente e comando `npm run dev`.
- **Guia de contribuição**: checklist de lint, testes e commit‑message padrão.

## 7️⃣ Monitoramento & Observabilidade
- **Sentry**: integrar SDK para captura de exceções client‑side.
- **Health checks**: endpoint `/api/health` que verifica DB e dependências.
- **Logging estruturado**: usar `pino` ou `winston` nos handlers de API.

## 8️⃣ Internacionalização (i18n)
- **next‑i18next**: preparar estrutura de arquivos `public/locales/pt-BR`, `en-US`.
- **Componentes multilíngues**: substituir textos estáticos por `t('key')`.
- **Teste de idioma**: validar swap de idioma nos testes E2E.

---
### Roadmap sugerido (Sprints 8‑10)
| Sprint | Objetivo | Principais Tasks |
|--------|----------|------------------|
| **Sprint 8** | Segurança & Dependências | Auditar, atualizar, hardening, revisão de auth |
| **Sprint 9** | UI/UX Premium & Performance | Dark mode, micro‑animações, otimizações de bundle |
| **Sprint 10** | Testes avançados & CI aprimorado | Integração API, coverage, matrix CI, deploy automático |

> **Nota:** Cada task deve ser acompanhada de *commit* e *push* automáticos, conforme a regra de `AGENTS.md`.

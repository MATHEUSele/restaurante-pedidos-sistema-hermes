# Plano de Implementação – CI/CD para **Restaurante Pedidos Sistema Hermes**

## Visão Geral
Este plano detalha as etapas necessárias para implementar um pipeline de CI/CD robusto que:
- **Verifique a estrutura** do código (TypeScript compilation).
- **Aplique um padrão de formatação** (ESLint + Prettier).
- **Garanta que a aplicação suba** corretamente.
- **Teste o fluxo de login** com usuário `adm@gmail.com` e senha `123`.
- **Utilize GitHub Actions** e **Playwright** para testes end‑to‑end.

> **Referências criadas nesta conversa**
> - Workflow CI: [ci.yml](file:///c:/Users/mathe/Desktop/pastas%20-%20trabalho/restaurante-pedidos-sistema-hermes/.github/workflows/ci.yml)
> - Teste Playwright: [login.spec.ts](file:///c:/Users/mathe/Desktop/pastas%20-%20trabalho/restaurante-pedidos-sistema-hermes/tests/login.spec.ts)
> - Configuração Playwright: [playwright.config.ts](file:///c:/Users/mathe/Desktop/pastas%20-%20trabalho/restaurante-pedidos-sistema-hermes/playwright.config.ts)

---

## 1. Preparação do Ambiente Local
| Etapa | Descrição | Comando |
|------|-----------|---------|
| **1.1** | Instalar dependências de desenvolvimento | `npm ci` |
| **1.2** | Instalar Playwright (navegadores) | `npx playwright install --with-deps` |
| **1.3** | Copiar `.env.example` → `.env` e configurar variáveis locais (ex.: `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`). | `cp .env.example .env` |
| **1.4** | Executar migrações + seed do Prisma | `npx prisma migrate dev --name init`<br/>`npm run seed` |
| **1.5** | Verificar lint/formatting | `npm run lint` |
| **1.6** | Compilar TypeScript sem gerar artefato | `npx tsc --noEmit` |
| **1.7** | Rodar a aplicação localmente | `npm run dev` (verificar porta 3001) |
| **1.8** | Executar teste de login manualmente (opcional) | Acessar `http://localhost:3001/login` e usar credenciais `adm@gmail.com / 123` |

---

## 2. Estrutura do Repositório
| Diretório/Arquivo | Propósito |
|-------------------|----------|
| `.github/workflows/ci.yml` | Pipeline CI/CD completo (lint, type‑check, build, testes E2E). |
| `tests/login.spec.ts` | Teste Playwright que valida o login usando as credenciais especificadas. |
| `playwright.config.ts` | Configurações do Playwright (browser, server, baseURL). |
| `package.json` scripts | `lint`, `build`, `dev`, `seed`, `test:e2e` (opcional). |
| `.eslintrc.*` + `.prettierrc` | Regras de formatação e qualidade de código. |
| `prisma/seed.ts` | Garante a existência do usuário admin (`adm@gmail.com`/`123`). |

---

## 3. Implementação do Pipeline (GitHub Actions)
### 3.1. Workflow (`ci.yml`)
1️⃣ **checkout** – garante código atualizado.
2️⃣ **setup‑node** – usa Node 20 + cache npm.
3️⃣ **install** – `npm ci` (instalação limpa).
4️⃣ **lint** – `npm run lint` (ESLint). Falha impede avançar.
5️⃣ **type‑check** – `npx tsc --noEmit`. Detecta erros de estrutura.
6️⃣ **playwright‑install** – download de navegadores.
7️⃣ **env‑file** – cria `.env` a partir de `.env.example` (segurança: variáveis sensíveis devem ser configuradas como **Secrets** no GitHub).
8️⃣ **prisma‑setup** – gera cliente e migrações, roda seed.
9️⃣ **build** – `npm run build` (garante que a aplicação compila).
🔟 **e2e‑tests** – `npx playwright test` usando a configuração que inicia o servidor (`npm run start`).
1️⃣1️⃣ **upload‑artifact** – salva relatório do Playwright para inspeção.

> **Observação:** O passo `webServer` no `playwright.config.ts` inicia a app com `npm run start`. O pipeline aguarda até a URL estar disponível antes de executar os testes.

### 3.2. Segredos Necessários no GitHub
- `DATABASE_URL` – URL do banco usado nos testes (ex.: SQLite em memória ou Postgres temporário). 
- `NEXTAUTH_URL` – `http://localhost:3000` (ou a porta configurada).
- `NEXTAUTH_SECRET` – string aleatória.
- `ADMIN_EMAIL` e `ADMIN_PASSWORD` – opcional, caso queira gerar o admin dinamicamente no seed.

---

## 4. Teste End‑to‑End (Playwright)
```ts
// tests/login.spec.ts
import { test, expect } from '@playwright/test';

test('login com usuário admin', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'adm@gmail.com');
  await page.fill('input[type="password"]', '123');
  await page.click('button[type="submit"]');
  // Verifica redirecionamento para a página protegida (ex.: /dev)
  await expect(page).toHaveURL(/\/dev/);
});
```
- O teste usa a **baseURL** definida no `playwright.config.ts` (`http://localhost:3000`).
- O `webServer` inicia a aplicação antes dos testes, garantindo que o front‑end esteja “subindo”.
- Caso a porta padrão esteja ocupada, o Next.js muda para 3001 – o script ainda funciona porque `playwright.config.ts` detecta a porta via variável de ambiente `PORT` (configurada no step **Run E2E Tests**).

---

## 5. Cronograma (estimativa)
| Semana | Atividades | Resultados esperados |
|--------|------------|----------------------|
| **0** (hoje) | - Criação dos arquivos (`ci.yml`, `login.spec.ts`, `playwright.config.ts`).<br/>- Instalação do Playwright. | Repositório com CI básico pronto. |
| **1** | - Configurar secrets no GitHub.<br/>- Ajustar seed para garantir usuário admin.
| **2** | - Rodar pipeline em `main` e validar que todos os jobs passam.<br/>- Corrigir possíveis falhas de lint/tsc.<br/>- Revisar relatório do Playwright. | Pipeline verde, artefato de teste disponível. |
| **3** | - Integrar Prettier (opcional) e adicionar hook `pre‑commit` (husky) para garantir formatação local.
| **4** | - Documentar fluxos (README) e instruções de execução local.
| **5** | - Revisão final e merge para `main`. Deploy automático (se houver) pode ser adicionado como job extra. |

---

## 6. Checklist de Validação
- [ ] Lint (`npm run lint`) sem erros.
- [ ] TypeScript compila (`npx tsc --noEmit`).
- [ ] Seed cria usuário admin (`adm@gmail.com` / `123`).
- [ ] `npm run build` gera o build sem falhas.
- [ ] Playwright encontra a página `/login` e realiza login com sucesso.
- [ ] Artefato de relatório do Playwright está disponível no GitHub Actions.
- [ ] Todos os secrets necessários estão configurados.

---

## 7. Próximos Passos Pós‑Implementação
1. **Monitoramento** – habilitar alertas de falha no GitHub (via GitHub Ops ou integração Slack). 
2. **Ambiente de Staging** – adicionar job opcional que faz deploy em ambiente de teste (Vercel/Netlify). 
3. **Testes de Regressão** – expandir a suíte Playwright para cobrir outras rotas (ex.: cadastro, página do totém, pedidos). 
4. **Automação de Dados** – usar factories ou fixtures para gerar dados realistas nos testes (`faker`).

---

### Conclusão
Com este plano você tem tudo que precisa para garantir qualidade contínua, conformidade com padrões de código e a validação crítica do fluxo de login.  Basta seguir as etapas, ajustar os segredos e, ao fazer push para `main`, o GitHub Actions cuidará do resto.

---

*Este documento foi gerado como um artefato (`IMPLEMENTATION_PLAN.md`).*

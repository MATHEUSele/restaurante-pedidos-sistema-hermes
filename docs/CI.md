# CI/CD - Troubleshooting e Solução de Problemas

Este documento descreve as decisões de arquitetura em relação ao pipeline de Integração Contínua (CI) e como lidar com erros comuns que podem surgir no GitHub Actions.

## ⚠️ Problemas Resolvidos

### 1. Falha no Vitest (Erro de ESM e CommonJS)
**Problema:** O Vitest disparava erros como `ESM syntax in a file loaded as CommonJS` e não conseguia resolver módulos, causando a quebra do CI no job `Run Unit Tests`.
**Solução Aplicada:** O arquivo de configuração do Vitest foi renomeado de `vitest.config.ts` para `vitest.config.mts`. Ao utilizar a extensão `.mts` (Module TypeScript), garantimos que o Node e o Vite tratem a configuração como ES Module, independente da propriedade `"type": "module"` não estar no `package.json` principal (o que poderia quebrar as rotas do Next.js).

### 2. Falhas do Serviço Postgres na Matrix Windows
**Problema:** O job `Setup Database (Prisma)` estava quebrando durante o deploy porque o banco de dados falhava ao conectar. O motivo raiz é que o runner `windows-latest` do GitHub Actions **não oferece suporte** à funcionalidade de `services` (Docker Containers nativos).
**Solução Aplicada:** A estratégia de Matrix no `.github/workflows/ci.yml` foi ajustada para executar as verificações exclusivamente em `ubuntu-latest`, que possui total compatibilidade com containers Postgres para os testes de banco de dados e Prisma.

### 3. Falha Local `EPERM` vs GitHub Actions
**Problema:** Em máquinas Windows de desenvolvimento local, comandos como `npm install` ou `npm prune` muitas vezes retornam erro `EPERM` (operação não permitida). Isso se deve a bloqueios no sistema de arquivos causados pelo OS ou antivírus travando pastas no `node_modules`.
**Como lidar:** 
- Não se assuste se os testes quebrarem localmente acusando a falta de dependências (ex: `Cannot find module 'react'`). 
- Isso significa que o seu `node_modules` local quebrou. 
- O Github Actions rodará perfeitamente, pois inicia uma máquina limpa e executa um `npm ci` fresco.
- Caso precise forçar localmente, delete a pasta `node_modules` e reinstale.

## 🧪 Estratégia de Mocks (Vitest)
Para testar os componentes de autenticação do `next-auth/react` (como o `RequireAuth`), não precisamos de credenciais reais.
Nós utilizamos as APIs do próprio framework nos arquivos `.test.tsx`:
```tsx
import { vi } from 'vitest';

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));
```
Isso é suficiente para simular usuários logados ou deslogados no frontend.

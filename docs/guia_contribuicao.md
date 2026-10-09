# Guia de Contribuição - Sistema Hermes

Obrigado por querer contribuir com o Sistema Hermes! Siga as orientações abaixo.

## 🚀 Como começar

1. Faça o Fork deste repositório.
2. Crie uma branch para sua feature ou correção:
   `git checkout -b feature/minha-feature`
3. Certifique-se de que todas as dependências estão instaladas (`npm install`).

## ✅ Padrão de Commits

Utilizamos o [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Alterações na documentação
- `style:` Formatação, ponto e vírgula, etc
- `refactor:` Refatoração de código
- `test:` Adição ou correção de testes
- `chore:` Atualizações de build, pacotes, etc

## 🧪 Testes

- Todo novo endpoint de API deve ser acompanhado de seu respectivo teste de integração em `tests/api/`.
- Novos fluxos de interface devem ser mapeados em E2E com Playwright em `tests/e2e/`.
- Rode a suite antes de enviar seu PR:
  ```bash
  npm run test
  npx playwright test
  ```

## 🔍 Pull Requests

1. O CI irá rodar automaticamente (Quality Gates).
2. O coverage não pode cair.
3. Se aprovação do CI for dada, um mantenedor fará a revisão do código.

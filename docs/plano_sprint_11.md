# Plano de Sprint 11 – Implementação Multitópicos

## Visão Geral
Esta rodada visa avançar de forma integral nos pontos ainda pendentes descritos no **Plano de Ação – Melhorias Pendentes** (`docs/plano_de_melhorias.md`).  A estratégia consiste em entregar **todos os tópicos** (Segurança, UI/UX, Performance, Testes, CI/CD, Documentação, Monitoramento & Observabilidade, e Internacionalização) dentro de um único sprint, organizados em blocos que podem ser desenvolvidos paralelamente por equipes diferentes.

## Objetivo Principal
> Garantir que o **Sistema Hermes** esteja pronto para implantação em produção com **alta segurança**, **UX premium**, **performance otimizada**, **cobertura de testes >90%**, **CI/CD robusto**, **documentação completa**, **monitoramento ativo** e **suporte multilíngue**.

## Estrutura da Sprint (S11)
| Área | Tasks Principais | Descrição resumida | Critério de Aceite |
|------|------------------|--------------------|--------------------|
| **Segurança & Dependências** | 1. Auditar vulnerabilidades (`npm audit`) <br>2. Atualizar dependências críticas <br>3. Aplicar Hardening de Headers via `helmet` <br>4. Revisar regras de RBAC em `RequireAuth` | Consertar todas as vulnerabilidades de nível alto/ crítico, garantir que os headers de segurança estejam ativos e validar controle de acesso. | `npm audit` sem vulnerabilidades críticas; Header `Content‑Security‑Policy` presente nas respostas da API. |
| **UI/UX Premium** | 5. Refatorar breakpoints para tablets & smartphones <br>6. Implementar toggle de tema (dark/light) com persistência no `localStorage` <br>7. Aplicar micro‑animações em botões, toasts e transição de status de pedidos <br>8. Acessibilidade – atributos `aria-*`, contraste WCAG AA, foco visível | UI responsiva, experiência fluida e visualmente agradável, acessível a todos os usuários. | Testes visuais em viewport mobile e desktop; auditoria Lighthouse >90 em acessibilidade. |
| **Performance** | 9. Code‑splitting de dashboards via `next/dynamic` <br>10. Migrar imagens estáticas para `next/image` com lazy‑loading <br>11. Otimizar cache de API usando SWR + revalidação automática <br>12. Analisar bundle (`next build`) e eliminar módulos não utilizados | Redução do TTI (Time To Interactive) e tamanho total de bundle. | Bundle < 110 MB; TTI < 2 s em conexão 3G simulada. |
| **Cobertura de Testes** | 13. Aumentar coverage unitária para 90% (Vitest) <br>14. Testes de integração API (`supertest`) para todos os endpoints CRUD <br>15. Testes de permissão (403) <br>16. E2E avançado: fluxo cadastro, recuperação senha, logout, troca de idioma | Garantir alta confiabilidade e prevenção de regressões. | Coverage >90% linhas, >80% branches; todos os testes (unit, integration, e2e) passam no CI. |
| **CI/CD Avançado** | 17. Cache de `node_modules` no GitHub Actions <br>18. Matrix de builds (Node 18/20 × Ubuntu/Windows) <br>19. Deploy automático preview em Vercel via `vercel-action` <br>20. Quality gates (coverage, audit) que falham o build | Pipelines totalmente automatizados e seguros. | Pull‑request gera preview e falha quando cobertura <80% ou vulnerabilidades críticas. |
| **Documentação** | 21. Gerar OpenAPI (Swagger) para rotas `/api/*` <br>22. Atualizar `README.md` com guia de contribuição, checklist de lint e instruções de deploy <br>23. Criar `docs/guia_contribuicao.md` <br>24. Publicar Swagger UI em `/docs/api` | Documentação clara para desenvolvedores e consumidores da API. | Swagger UI acessível; guia de contribuição revisado. |
| **Monitoramento & Observabilidade** | 25. Integrar Sentry client‑side e server‑side <br>26. Criar health‑check endpoint `/api/health` <br>27. Implementar logging estruturado com `pino` nos handlers <br>28. Dashboard de métricas (ex.: Grafana via Prometheus) | Visibilidade completa de falhas e performance em produção. | Errors capturados no Sentry; `/api/health` retorna 200; logs JSON. |
| **Internacionalização (i18n)** | 29. Configurar `next-i18next` com locales `pt-BR` e `en-US` <br>30. Substituir textos estáticos por chaves de tradução <br>31. Testar troca de idioma nos testes E2E <br>32. Documentar fluxo de adição de novos idiomas | Aplicação pronta para expansão global. | Alternância de idioma funciona sem recarregar; coverage de i18n nos testes. |

## Cronograma Sugerido (7 dias úteis)
| Dia | Atividade |
|-----|-----------|
| 1   | Setup de ambiente (branch `sprint-11`), auditoria de segurança, início das atualizações de dependências |
| 2   | Implementação de hardening de headers + revisão de RBAC |
| 3   | UI/UX – breakpoints, tema dark, micro‑animações |
| 4   | Performance – code‑splitting, otimização de imagens, cache de API |
| 5   | Testes – coverage unitária, integração API, início dos E2E de fluxo completo |
| 6   | CI/CD – cache, matrix, deploy preview + quality gates |
| 7   | Documentação, monitoramento (Sentry, health‑check) e i18n, revisão final e **Release** |

## Métricas de Sucesso Pós‑Sprint
- **Segurança**: Zero vulnerabilidades críticas (`npm audit` clean).
- **UX**: Lighthouse score > 95 % (Performance, SEO, Accessibility, Best Practices).
- **Performance**: TTI < 2 s em rede 3G, bundle < 110 MB.
- **Testes**: Coverage > 90 % linhas, 80 % branches, todos os testes CI verdes.
- **CI**: Deploy preview automático gerado para cada PR.
- **Documentação**: Swagger UI pública, README completo e guia de contribuição.
- **Monitoramento**: Sentry captura 0 erros críticos em 24h de produção.
- **i18n**: Troca de idioma funcional sem regressões.

---

> **Próximos Passos**: criar a branch `sprint-11`, abrir um Pull Request e iniciar as tasks conforme a tabela acima. Cada task deve ser **commitada e pushada** individualmente, seguindo a regra definida em `AGENTS.md`.

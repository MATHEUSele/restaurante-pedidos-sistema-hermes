# Política de Segurança - Sistema Hermes

A segurança é prioridade máxima no Sistema Hermes. Este documento descreve nossas diretrizes para reportar vulnerabilidades e nossas práticas de segurança contínua.

## 🛡️ Reportando Vulnerabilidades

Se você descobrir uma vulnerabilidade de segurança, por favor NÃO a divulgue publicamente.

1. Entre em contato com a equipe de engenharia/administração do projeto através de chamados internos.
2. Forneça detalhes sobre a falha, ambiente de reprodução e possíveis cenários de exploração.
3. Responderemos confirmando o recebimento em até 48 horas.

## 🔒 Práticas de Segurança no Código

- **Headers Hardening**: O projeto utiliza `Content-Security-Policy` (CSP) estrito, HSTS e políticas de frame/referrer configuradas no `next.config.ts`.
- **Autenticação RBAC**: Nenhuma rota da API ou interface confia no cliente. Tudo é validado server-side usando as Sessions do Next-Auth e JWT.
- **Prevenção de CSRF**: Habilitado nativamente pelas cookies SameSite do Next-Auth.
- **Validação de Input**: Utilize zod (ou similiar) para sanitizar todas as entradas e payload da API, impedindo Injeção SQL via Prisma.

## 🤖 Dependabot & Auditorias

- O GitHub Actions está configurado com `Dependabot` para atualizações de segurança diárias/semanais.
- O Quality Gate do CI falha automaticamente se uma falha acima de nível `low` for identificada pelo comando `npm audit`.

## 📦 Versões Suportadas

Atualmente apenas a branch `main` e a tag de release mais recente recebem patches de segurança urgentes.

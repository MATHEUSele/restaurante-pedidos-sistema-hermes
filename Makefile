# ==============================================================================
# Makefile - Sistema Hermes
# Atalhos para inicialização, gerenciamento de containers Docker e banco Prisma
# ==============================================================================

.PHONY: dev docker-up docker-down docker-logs docker-migrate

# Inicia o servidor de desenvolvimento local do Next.js (porta padrão: 3000)
dev:
	npm run dev

# Constrói as imagens e inicializa os containers do Docker em segundo plano (-d)
docker-up:
	docker compose up -d --build

# Para e encerra a execução de todos os containers ativos do Docker Compose
docker-down:
	docker compose down

# Acompanha e transmite em tempo real (-f) os logs de todos os containers Docker
docker-logs:
	docker compose logs -f

# Executa as migrações do Prisma ORM no banco de dados para ambiente de desenvolvimento
docker-migrate:
	npx prisma migrate dev --name init


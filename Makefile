dev:
	npm run dev

docker-up:
	docker compose up -d --build

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

docker-migrate:
	npx prisma migrate dev --name init

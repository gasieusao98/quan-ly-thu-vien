.PHONY: help build up down restart logs clean test deploy

help:
	@echo "📚 Thư Viện - Docker Commands"
	@echo ""
	@echo "Build Commands:"
	@echo "  make build              - Build Docker images"
	@echo "  make build-prod         - Build production images"
	@echo ""
	@echo "Run Commands:"
	@echo "  make up                 - Start all services"
	@echo "  make up-prod            - Start production services"
	@echo "  make down               - Stop all services"
	@echo "  make restart            - Restart all services"
	@echo ""
	@echo "Logs & Monitoring:"
	@echo "  make logs               - View all logs"
	@echo "  make logs-backend       - View backend logs"
	@echo "  make logs-frontend      - View frontend logs"
	@echo "  make logs-mongodb       - View MongoDB logs"
	@echo ""
	@echo "Database:"
	@echo "  make db-shell           - Enter MongoDB shell"
	@echo "  make db-backup          - Backup MongoDB"
	@echo "  make db-restore         - Restore MongoDB"
	@echo ""
	@echo "Development:"
	@echo "  make shell-backend      - Shell into backend container"
	@echo "  make shell-frontend     - Shell into frontend container"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean              - Remove all containers and volumes"
	@echo "  make prune              - Clean up unused Docker resources"
	@echo "  make ps                 - List running containers"
	@echo ""
	@echo "Testing & Deployment:"
	@echo "  make test               - Run tests"
	@echo "  make deploy             - Deploy to production"

# ===== BUILD =====
build:
	docker-compose build

build-prod:
	docker-compose build --no-cache

# ===== RUN =====
up:
	docker-compose up -d
	@echo "✅ Services started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:5000"
	@echo "MongoDB: mongodb://localhost:27017"

up-prod:
	docker-compose -f docker-compose.yml up -d
	@echo "✅ Production services started!"

down:
	docker-compose down
	@echo "✅ Services stopped!"

restart:
	docker-compose restart
	@echo "✅ Services restarted!"

# ===== LOGS =====
logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-mongodb:
	docker-compose logs -f mongodb

# ===== DATABASE =====
db-shell:
	docker-compose exec mongodb mongosh -u admin -p admin123 --authenticationDatabase admin quan_ly_thu_vien

db-backup:
	@mkdir -p backups
	docker-compose exec -T mongodb mongodump --uri="mongodb://admin:admin123@localhost:27017/quan_ly_thu_vien?authSource=admin" --out=/data/db/backup
	@echo "✅ Database backed up to backups/"

db-restore:
	docker-compose exec -T mongodb mongorestore --uri="mongodb://admin:admin123@localhost:27017" --nsInclude="quan_ly_thu_vien.*" /data/db/backup/quan_ly_thu_vien
	@echo "✅ Database restored!"

# ===== SHELL ACCESS =====
shell-backend:
	docker-compose exec backend sh

shell-frontend:
	docker-compose exec frontend sh

# ===== MAINTENANCE =====
clean:
	docker-compose down -v
	docker system prune -f
	@echo "✅ Cleaned up!"

prune:
	docker system prune -a --volumes
	@echo "✅ Docker system pruned!"

ps:
	docker-compose ps

# ===== TESTING =====
test:
	docker-compose exec backend npm test

# ===== STATUS =====
status:
	@echo "📊 Service Status:"
	@docker-compose ps

# ===== ENVIRONMENT SETUP =====
env-setup:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "✅ Created .env file from template. Please update with your values!"; \
	else \
		echo "⚠️  .env file already exists"; \
	fi

# ===== DEPLOYMENT =====
deploy:
	@echo "🚀 Deploying to production..."
	docker-compose -f docker-compose.yml build --no-cache
	docker-compose -f docker-compose.yml up -d
	@echo "✅ Deployment complete!"
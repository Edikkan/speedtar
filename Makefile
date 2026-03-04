# Speedtar Makefile
# Provides shortcuts for common development tasks

.PHONY: help install dev build test lint clean docker-up docker-down k8s-deploy k8s-delete

# Default target
help:
	@echo "Speedtar - Available Commands:"
	@echo ""
	@echo "  make install         - Install all dependencies"
	@echo "  make dev             - Start development servers"
	@echo "  make build           - Build production images"
	@echo "  make test            - Run all tests"
	@echo "  make lint            - Run linting"
	@echo "  make clean           - Clean build artifacts"
	@echo "  make docker-up       - Start with Docker Compose"
	@echo "  make docker-down     - Stop Docker Compose"
	@echo "  make k8s-deploy      - Deploy to Kubernetes"
	@echo "  make k8s-delete      - Remove from Kubernetes"
	@echo ""

# Install dependencies
install:
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Installing backend dependencies..."
	cd backend && npm install

# Start development servers
dev:
	@echo "Starting development servers..."
	@make -j2 dev-frontend dev-backend

dev-frontend:
	cd frontend && npm run dev

dev-backend:
	cd backend && npm run dev

# Build production images
build:
	@echo "Building Docker images..."
	docker build -t speedtar-frontend:latest ./frontend
	docker build -t speedtar-backend:latest ./backend

# Run tests
test:
	@echo "Running tests..."
	cd frontend && npm test -- --watchAll=false
	cd backend && npm test

# Run linting
lint:
	@echo "Running linters..."
	cd frontend && npm run lint
	cd backend && npm run lint

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf frontend/.next frontend/node_modules
	rm -rf backend/node_modules
	rm -rf frontend/build backend/dist

# Docker Compose commands
docker-up:
	@echo "Starting with Docker Compose..."
	docker-compose up -d

docker-down:
	@echo "Stopping Docker Compose..."
	docker-compose down

docker-logs:
	@echo "Showing Docker logs..."
	docker-compose logs -f

docker-build:
	@echo "Building Docker images..."
	docker-compose build

# Kubernetes commands
k8s-deploy:
	@echo "Deploying to Kubernetes..."
	kubectl apply -k k8s/base
	kubectl wait --for=condition=available --timeout=300s deployment/frontend -n speedtar
	kubectl wait --for=condition=available --timeout=300s deployment/backend -n speedtar

k8s-delete:
	@echo "Removing from Kubernetes..."
	kubectl delete -k k8s/base

k8s-status:
	@echo "Checking Kubernetes status..."
	kubectl get pods -n speedtar
	kubectl get svc -n speedtar
	kubectl get ingress -n speedtar

k8s-logs:
	@echo "Showing Kubernetes logs..."
	kubectl logs -f deployment/backend -n speedtar

# Helm commands
helm-install:
	@echo "Installing with Helm..."
	helm install speedtar ./helm/speedtar

helm-upgrade:
	@echo "Upgrading Helm release..."
	helm upgrade speedtar ./helm/speedtar

helm-delete:
	@echo "Deleting Helm release..."
	helm delete speedtar

# Database commands
db-migrate:
	@echo "Running database migrations..."
	cd backend && npx sequelize-cli db:migrate

db-seed:
	@echo "Seeding database..."
	cd backend && npx sequelize-cli db:seed:all

db-reset:
	@echo "Resetting database..."
	cd backend && npx sequelize-cli db:drop
	cd backend && npx sequelize-cli db:create
	cd backend && npx sequelize-cli db:migrate
	cd backend && npx sequelize-cli db:seed:all

# Utility commands
format:
	@echo "Formatting code..."
	cd frontend && npm run format
	cd backend && npm run format

update:
	@echo "Updating dependencies..."
	cd frontend && npm update
	cd backend && npm update

security-audit:
	@echo "Running security audit..."
	cd frontend && npm audit
	cd backend && npm audit

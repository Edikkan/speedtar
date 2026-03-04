#!/bin/bash

# Speedtar Deployment Script
# Usage: ./deploy.sh [environment] [action]
# Environment: development | staging | production
# Action: deploy | rollback | status | logs

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-development}
ACTION=${2:-deploy}
NAMESPACE="speedtar"
if [ "$ENVIRONMENT" != "production" ]; then
    NAMESPACE="speedtar-${ENVIRONMENT}"
fi

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed"
        exit 1
    fi
    
    # Check kustomize
    if ! command -v kustomize &> /dev/null; then
        log_error "kustomize is not installed"
        exit 1
    fi
    
    # Check docker
    if ! command -v docker &> /dev/null; then
        log_error "docker is not installed"
        exit 1
    fi
    
    log_success "All prerequisites met"
}

# Build and push images
build_images() {
    log_info "Building Docker images..."
    
    # Build frontend
    log_info "Building frontend image..."
    docker build -t edikkan/speedtar-frontend:latest -f frontend/Dockerfile frontend/
    
    # Build backend
    log_info "Building backend image..."
    docker build -t edikkan/speedtar-backend:latest -f backend/Dockerfile backend/
    
    log_success "Images built successfully"
    
    # Push images (if registry is configured)
    read -p "Push images to registry? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Pushing images to registry..."
        docker push edikkan/speedtar-frontend:latest
        docker push edikkan/speedtar-backend:latest
        log_success "Images pushed successfully"
    fi
}

# Deploy to Kubernetes
deploy() {
    log_info "Deploying to ${ENVIRONMENT} environment..."
    
    # Apply kustomization
    kustomize build k8s/overlays/${ENVIRONMENT} | kubectl apply -f -
    
    # Wait for deployments
    log_info "Waiting for deployments to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/frontend -n ${NAMESPACE}
    kubectl wait --for=condition=available --timeout=300s deployment/backend -n ${NAMESPACE}
    
    log_success "Deployment completed successfully!"
    
    # Show status
    show_status
}

# Rollback deployment
rollback() {
    log_info "Rolling back deployment..."
    
    # Rollback frontend
    kubectl rollout undo deployment/frontend -n ${NAMESPACE}
    
    # Rollback backend
    kubectl rollout undo deployment/backend -n ${NAMESPACE}
    
    log_success "Rollback completed"
}

# Show deployment status
show_status() {
    log_info "Deployment Status for ${NAMESPACE}:"
    echo
    
    echo -e "${YELLOW}Pods:${NC}"
    kubectl get pods -n ${NAMESPACE} -o wide
    echo
    
    echo -e "${YELLOW}Services:${NC}"
    kubectl get svc -n ${NAMESPACE}
    echo
    
    echo -e "${YELLOW}Ingress:${NC}"
    kubectl get ingress -n ${NAMESPACE}
    echo
    
    echo -e "${YELLOW}Deployments:${NC}"
    kubectl get deployments -n ${NAMESPACE}
}

# Show logs
show_logs() {
    local service=${3:-backend}
    log_info "Showing logs for ${service}..."
    kubectl logs -f deployment/${service} -n ${NAMESPACE} --tail=100
}

# Port forward for local development
port_forward() {
    log_info "Setting up port forwarding..."
    
    # Forward frontend
    kubectl port-forward svc/frontend 3000:3000 -n ${NAMESPACE} &
    FRONTEND_PID=$!
    
    # Forward backend
    kubectl port-forward svc/backend 5000:5000 -n ${NAMESPACE} &
    BACKEND_PID=$!
    
    # Forward postgres
    kubectl port-forward svc/postgres 5432:5432 -n ${NAMESPACE} &
    POSTGRES_PID=$!
    
    # Forward redis
    kubectl port-forward svc/redis 6379:6379 -n ${NAMESPACE} &
    REDIS_PID=$!
    
    log_success "Port forwarding enabled:"
    log_info "Frontend: http://localhost:3000"
    log_info "Backend API: http://localhost:5000"
    log_info "PostgreSQL: localhost:5432"
    log_info "Redis: localhost:6379"
    
    # Wait for interrupt
    trap "kill $FRONTEND_PID $BACKEND_PID $POSTGRES_PID $REDIS_PID; exit" INT
    wait
}

# Database migration
migrate() {
    log_info "Running database migrations..."
    
    # Get postgres pod name
    POSTGRES_POD=$(kubectl get pods -n ${NAMESPACE} -l app=postgres -o jsonpath='{.items[0].metadata.name}')
    
    # Copy init script
    kubectl cp database/init.sql ${NAMESPACE}/${POSTGRES_POD}:/tmp/init.sql
    
    # Execute migration
    kubectl exec -it ${POSTGRES_POD} -n ${NAMESPACE} -- psql -U speedtar_user -d speedtar -f /tmp/init.sql
    
    log_success "Migration completed"
}

# Seed database
seed() {
    log_info "Seeding database..."
    
    # Get backend pod name
    BACKEND_POD=$(kubectl get pods -n ${NAMESPACE} -l app=backend -o jsonpath='{.items[0].metadata.name}')
    
    # Run seed script
    kubectl exec -it ${BACKEND_POD} -n ${NAMESPACE} -- node database/seeds.js
    
    log_success "Database seeded"
}

# Main execution
case ${ACTION} in
    deploy)
        check_prerequisites
        build_images
        deploy
        ;;
    rollback)
        rollback
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs "$@"
        ;;
    port-forward)
        port_forward
        ;;
    migrate)
        migrate
        ;;
    seed)
        seed
        ;;
    *)
        echo "Usage: $0 [environment] [action]"
        echo ""
        echo "Environments:"
        echo "  development  - Deploy to development environment"
        echo "  staging      - Deploy to staging environment"
        echo "  production   - Deploy to production environment"
        echo ""
        echo "Actions:"
        echo "  deploy       - Build and deploy (default)"
        echo "  rollback     - Rollback to previous version"
        echo "  status       - Show deployment status"
        echo "  logs         - Show logs (requires service name)"
        echo "  port-forward - Set up port forwarding"
        echo "  migrate      - Run database migrations"
        echo "  seed         - Seed database with test data"
        echo ""
        echo "Examples:"
        echo "  $0 production deploy"
        echo "  $0 staging status"
        echo "  $0 production logs backend"
        exit 1
        ;;
esac

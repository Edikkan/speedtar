# Speedtar - Modern E-commerce Platform

[![CI/CD](https://github.com/edikkan/speedtar/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/edikkan/speedtar/actions/workflows/ci-cd.yml)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://hub.docker.com/r/edikkan/speedtar)
[![Kubernetes](https://img.shields.io/badge/kubernetes-ready-blue.svg)](https://kubernetes.io)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Speedtar is a modern, full-stack e-commerce platform built with Next.js, Node.js, PostgreSQL, and Kubernetes. Designed for scalability and performance.

## Live Demo

- **Frontend**: https://shop.hitension.live
- **API Documentation**: https://api.hitension.live/api-docs

## Features

### Frontend
- Modern React 18 with Next.js 14
- Server-Side Rendering (SSR) for SEO
- Responsive design with Tailwind CSS
- Shopping cart with persistent state
- User authentication and profiles
- Product search and filtering
- Checkout with Stripe integration
- Order tracking

### Backend
- RESTful API with Express.js
- JWT authentication
- Role-based access control
- PostgreSQL with Sequelize ORM
- Redis caching
- Rate limiting
- Input validation
- Swagger API documentation

### DevOps
- Docker containerization
- Kubernetes deployment
- Helm charts for package management
- ArgoCD for GitOps
- GitHub Actions CI/CD
- Prometheus monitoring
- Grafana dashboards
- Auto-scaling

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
| Auth | JWT |
| Payment | Stripe |
| Container | Docker |
| Orchestration | Kubernetes |
| CI/CD | GitHub Actions |
| GitOps | ArgoCD |
| Monitoring | Prometheus, Grafana |

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Kubernetes cluster (for deployment)
- kubectl

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/edikkan/speedtar.git
cd speedtar
```

2. Start with Docker Compose:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost:3000
- API: http://localhost:5000
- API Docs: http://localhost:5000/api-docs

### Manual Setup

1. Install dependencies:
```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && npm install
```

2. Set up environment variables:
```bash
cp frontend/.env.local.example frontend/.env.local
cp backend/.env.example backend/.env
```

3. Start PostgreSQL and Redis:
```bash
docker-compose up -d postgres redis
```

4. Run database migrations:
```bash
cd backend
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

5. Start development servers:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## Deployment

### Kubernetes

1. Create namespace and deploy:
```bash
kubectl apply -k k8s/base
```

2. Or use Helm:
```bash
helm install speedtar ./helm/speedtar
```

3. Check deployment status:
```bash
kubectl get pods -n speedtar
```

### ArgoCD (GitOps)

1. Install ArgoCD:
```bash
kubectl apply -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

2. Apply the application:
```bash
kubectl apply -f argocd/application.yaml
```

## Project Structure

```
speedtar/
├── frontend/           # Next.js frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Next.js pages
│   │   ├── context/    # React contexts
│   │   ├── services/   # API services
│   │   └── styles/     # CSS styles
│   ├── public/         # Static assets
│   └── Dockerfile
├── backend/            # Node.js backend
│   ├── src/
│   │   ├── controllers/# Route controllers
│   │   ├── models/     # Database models
│   │   ├── routes/     # API routes
│   │   ├── middleware/ # Express middleware
│   │   ├── validators/ # Input validators
│   │   └── utils/      # Utility functions
│   └── Dockerfile
├── database/           # Database migrations and seeds
├── k8s/               # Kubernetes manifests
├── helm/              # Helm charts
├── argocd/            # ArgoCD configurations
├── monitoring/        # Prometheus & Grafana configs
└── scripts/           # Deployment scripts
```

## API Documentation

API documentation is available via Swagger UI at `/api-docs` when running the backend.

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/register | Register new user |
| POST | /api/v1/auth/login | Login user |
| GET | /api/v1/auth/me | Get current user |
| PATCH | /api/v1/auth/update-profile | Update profile |

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/products | Get all products |
| GET | /api/v1/products/:id | Get product by ID |
| POST | /api/v1/products | Create product (Admin) |
| PATCH | /api/v1/products/:id | Update product (Admin) |
| DELETE | /api/v1/products/:id | Delete product (Admin) |

### Order Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/orders | Create order |
| GET | /api/v1/orders/my-orders | Get user orders |
| GET | /api/v1/orders/:id | Get order details |
| PATCH | /api/v1/orders/:id/cancel | Cancel order |

## Environment Variables

### Frontend

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe public key |

### Backend

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Environment mode |
| `PORT` | Server port |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | JWT signing secret |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `SMTP_*` | Email SMTP settings |

## Monitoring

### Prometheus Metrics

Access metrics at `/metrics` on the backend.

### Grafana Dashboard

Import the dashboard from `monitoring/grafana-dashboard.json`.

Key metrics:
- Request rate and latency
- Error rates
- CPU and memory usage
- Database connections

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- All API endpoints are protected with JWT authentication
- Input validation on all routes
- Rate limiting to prevent abuse
- SQL injection protection via parameterized queries
- XSS protection via React's built-in escaping
- HTTPS enforced in production

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@speedtar.com or join our Slack channel.

## Roadmap

- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered product recommendations
- [ ] Multi-vendor marketplace support

---

Built with by the Speedtar Team

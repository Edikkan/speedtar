# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 apiuser

COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN chown -R apiuser:nodejs /app

USER apiuser

EXPOSE 5000
CMD ["node", "server.js"]

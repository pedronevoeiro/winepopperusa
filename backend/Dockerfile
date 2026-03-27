FROM node:20-alpine AS base

RUN apk add --no-cache python3 make g++

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install --legacy-peer-deps; fi && npm install ts-node --legacy-peer-deps

# Add node_modules/.bin to PATH
ENV PATH="/app/node_modules/.bin:$PATH"

# Copy source code
COPY . .

# Build (dummy DATABASE_URL needed for config loader during build)
RUN DATABASE_URL=postgres://dummy:dummy@localhost:5432/dummy \
    REDIS_URL=redis://localhost:6379 \
    medusa build && \
    echo "=== Checking admin build ===" && \
    find /app -name "index.html" -path "*/admin*" 2>/dev/null && \
    ls -la /app/.medusa/server/public/admin/ 2>/dev/null || true

# Production
ENV NODE_ENV=production
ENV PORT=9000

EXPOSE 9000

CMD ["sh", "-c", "\
  echo '=== Running migrations ===' && \
  medusa db:migrate && \
  echo '=== Migrations complete ===' && \
  if [ -n \"$ADMIN_EMAIL\" ] && [ -n \"$ADMIN_PASSWORD\" ]; then \
    echo '=== Creating admin user ===' && \
    medusa exec ./src/scripts/create-admin.ts || true; \
  fi && \
  echo '=== Starting Medusa ===' && \
  medusa start \
"]

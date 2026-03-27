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

# Build backend and admin
RUN DATABASE_URL=postgres://dummy:dummy@localhost:5432/dummy \
    REDIS_URL=redis://localhost:6379 \
    medusa build

# Debug: find where admin build output is located
RUN echo "=== All index.html files ===" && \
    find /app -name "index.html" 2>/dev/null && \
    echo "=== .medusa directory ===" && \
    ls -laR /app/.medusa/ 2>/dev/null | head -80 && \
    echo "=== dist directory ===" && \
    ls -laR /app/dist/ 2>/dev/null | head -40 && \
    echo "=== build directory ===" && \
    ls -laR /app/build/ 2>/dev/null | head -40 || true

# Production
ENV NODE_ENV=production
ENV PORT=9000

EXPOSE 9000

CMD ["sh", "-c", "medusa db:migrate && if [ -n \"$ADMIN_EMAIL\" ] && [ -n \"$ADMIN_PASSWORD\" ]; then medusa exec ./src/scripts/create-admin.ts || true; fi && medusa start"]

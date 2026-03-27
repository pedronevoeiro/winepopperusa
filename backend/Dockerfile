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

# Ensure admin files are available everywhere medusa might look
RUN mkdir -p /app/.medusa/server/public/admin && \
    cp -r /app/dist/public/admin/* /app/.medusa/server/public/admin/ && \
    mkdir -p /app/public/admin && \
    cp -r /app/dist/public/admin/* /app/public/admin/ && \
    ls -la /app/.medusa/server/public/admin/index.html && \
    ls -la /app/public/admin/index.html && \
    ls -la /app/dist/public/admin/index.html

# Production
ENV NODE_ENV=production
ENV PORT=9000

EXPOSE 9000

CMD ["sh", "-c", "cd /app && medusa db:migrate && if [ -n \"$ADMIN_EMAIL\" ] && [ -n \"$ADMIN_PASSWORD\" ]; then medusa exec ./src/scripts/create-admin.ts || true; fi && medusa start"]

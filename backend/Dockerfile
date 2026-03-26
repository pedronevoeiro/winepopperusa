FROM node:20-alpine AS base

RUN apk add --no-cache python3 make g++

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps && npm install ts-node --legacy-peer-deps

# Add node_modules/.bin to PATH
ENV PATH="/app/node_modules/.bin:$PATH"

# Copy source code
COPY . .

# Build (dummy DATABASE_URL needed for config loader during build)
RUN DATABASE_URL=postgres://dummy:dummy@localhost:5432/dummy \
    REDIS_URL=redis://localhost:6379 \
    medusa build

# Production
ENV NODE_ENV=production
ENV PORT=9000

EXPOSE 9000

CMD ["sh", "-c", "medusa db:migrate && medusa start"]

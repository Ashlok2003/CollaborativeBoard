# -------- Stage 1: Build --------
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod=false

COPY . .

# -------- Stage 2: Production --------
FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app /app

RUN pnpm install --prod --frozen-lockfile

EXPOSE 5000

CMD ["pnpm", "start"]

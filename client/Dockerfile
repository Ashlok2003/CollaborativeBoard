#------------ Stage 1 — build ------------
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY client/pnpm-lock.yaml client/package.json ./

RUN pnpm install --frozen-lockfile

COPY client/ .

RUN pnpm build

#------------ Stage 2 — serve with nginx ------------
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

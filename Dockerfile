FROM node:alpine AS builder

ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --registry=https://registry.npmmirror.com

COPY . ./

RUN pnpm dlx prisma generate \
    && rm -rf /app/dist \
    && pnpm run build

FROM node:alpine AS runtime

WORKDIR /app

COPY --from=builder /app .

EXPOSE 3020

CMD [ "pnpm", "start:prod" ]
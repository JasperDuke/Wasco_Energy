# =========================
# Dependencies
# =========================
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci


# =========================
# Build
# =========================
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build


# =========================
# Production
# =========================
FROM node:22-alpine AS runner

ARG APP_UID=1001
ARG APP_GID=1001

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV HOME=/home/nextjs
ENV npm_config_cache=/tmp/.npm

RUN addgroup -g ${APP_GID} -S nextjs && \
    adduser -u ${APP_UID} -S nextjs -G nextjs && \
    mkdir -p /app/.next/cache /tmp/.npm && \
    chown ${APP_UID}:${APP_GID} /app /app/.next /app/.next/cache /tmp/.npm

COPY --from=builder --chown=${APP_UID}:${APP_GID} /app/public ./public
COPY --from=builder --chown=${APP_UID}:${APP_GID} /app/.next/standalone ./
COPY --from=builder --chown=${APP_UID}:${APP_GID} /app/.next/static ./.next/static

USER ${APP_UID}

EXPOSE 3000

CMD ["node", "server.js"]

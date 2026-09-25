# =========================
# Build stage
# =========================
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build


# =========================
# Production stage
# =========================
FROM node:22-alpine AS runner

ARG APP_UID=1001
ARG APP_GID=1001

WORKDIR /app

ENV NODE_ENV=production
ENV HOME=/home/appuser
ENV npm_config_cache=/tmp/.npm

COPY package.json package-lock.json ./

RUN npm ci --omit=dev && npm cache clean --force

RUN addgroup -g ${APP_GID} -S appgroup && \
    adduser -u ${APP_UID} -S appuser -G appgroup && \
    mkdir -p /app/uploads/temp /app/logs /tmp/.npm && \
    chown ${APP_UID}:${APP_GID} /app /app/uploads /app/uploads/temp /app/logs /tmp/.npm

COPY --from=builder --chown=${APP_UID}:${APP_GID} /app/dist ./dist

USER ${APP_UID}

EXPOSE 4014

CMD ["node", "dist/index.js"]

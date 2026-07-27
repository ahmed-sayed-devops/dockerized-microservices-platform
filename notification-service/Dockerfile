############################################################
# Stage 1 - Builder
############################################################
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

############################################################
# Stage 2 - Development
############################################################
FROM node:22-alpine AS development

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]

############################################################
# Stage 3 - Production
############################################################
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup

# Copy production dependencies
COPY --from=builder /app/node_modules ./node_modules

# Copy application files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js ./

# Set ownership
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
CMD wget -q --spider http://localhost:5000/health || exit 1

CMD ["node", "server.js"]

############################################################
# Stage 1 - Builder
# Install application dependencies
############################################################
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests first
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy application source
COPY . .

############################################################
# Stage 2 - Development
# Used for local development with hot reload
############################################################
FROM node:22-alpine AS development

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./

# Install all dependencies (including nodemon)
RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]

############################################################
# Stage 3 - Production
# Optimized runtime image
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
COPY --from=builder /app/src ./src

# Set ownership
RUN chown -R appuser:appgroup /app

# Run as non-root user
USER appuser

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
CMD wget -q --spider http://localhost:4000/health || exit 1

CMD ["npm", "start"]

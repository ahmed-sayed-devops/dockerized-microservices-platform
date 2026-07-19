##################################################
# Stage 1 - Builder
##################################################
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

##################################################
# Stage 2 - Development
##################################################
FROM node:22-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV NODE_ENV=development

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

##################################################
# Stage 3 - Production
##################################################
FROM nginx:1.28-alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
CMD wget -q --spider http://localhost || exit 1

CMD ["nginx", "-g", "daemon off;"]

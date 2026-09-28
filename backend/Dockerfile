# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies (legacy-peer-deps for npm v10 compatibility)
RUN npm install --legacy-peer-deps

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production Runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package definitions and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]

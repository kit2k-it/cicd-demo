# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Build arguments (e.g. backend URL for frontend environment)
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

# Copy code and build
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine AS runner

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

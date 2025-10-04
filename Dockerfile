# Dockerfile (OPTIMIZED Multi-Stage Build)

# Stage 1: Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only package files first (better caching)
COPY package*.json ./

# Install ALL dependencies (needed for building)
RUN npm ci

# Copy source code
COPY . .

# Stage 2: Production Stage
FROM node:18-alpine

WORKDIR /app

# Copy only package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production

# Copy app code from builder stage
COPY --from=builder /app/server.js ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

# Run node directly (not npm)
CMD ["node", "server.js"]
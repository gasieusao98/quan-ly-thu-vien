# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Install dumb-init để xử lý signals đúng cách
RUN apk add --no-cache dumb-init

# Copy package files và cài production dependencies
COPY package*.json ./
RUN npm ci --only=production --omit=dev

# Copy app source từ builder
COPY --from=builder /app ./

# Create uploads directory
RUN mkdir -p uploads && \
    chmod -R 755 uploads

# Seed database
RUN node scripts/seed.js || true

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/test', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init để ensure process signals được handle đúng
ENTRYPOINT ["dumb-init", "--"]

# Run application
CMD ["npm", "start"]
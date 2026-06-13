# Base image
FROM node:20-alpine

# Working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3003

# Start server
CMD ["npm", "start"]
# Base image
FROM node:20-alpine

# App directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Expose port
EXPOSE 3001

# Start app
CMD ["npm", "start"]
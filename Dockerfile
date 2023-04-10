# Base image
FROM node:14-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Development image
FROM base AS dev

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]

# Production image
FROM base AS prod

# Build the application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
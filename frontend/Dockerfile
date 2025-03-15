# Use Node.js as the base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all project files
COPY . .

# Build the React app
RUN npm run build

# Use NGINX to serve the built files
FROM nginx:alpine

# Copy built files to NGINX
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for the frontend
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]

# Stage 1: Build the React app using Vite
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
# If you want to copy the .env file too (since it's non-sensitive), do so
COPY .env ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the app (Vite defaults to building into the "dist" folder)
RUN npm run build

# Stage 2: Serve the built app with Nginx
FROM nginx:alpine

# Copy built files from the builder stage to Nginx's default directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Optionally, copy a custom Nginx configuration if you want to modify defaults
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

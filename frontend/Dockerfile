# Build Stage
FROM node:20-alpine AS build

# Working Directory
WORKDIR /app

# Copy Package Files 
COPY package.json package-lock.json ./
RUN npm ci

# Copy Source Code 
COPY . .

# Build Project
RUN npm run build

# Production Stage 
FROM nginx:alpine 

# Copy Custom Nginx Configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Built Assets to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose Port 
EXPOSE 80

# Start Nginx 
CMD ["nginx", "-g", "daemon off;"]

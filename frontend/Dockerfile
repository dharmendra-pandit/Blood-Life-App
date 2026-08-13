# Build Stage
FROM node:20-alpine as build

# Working Directory
WORKDIR /app

# Copy Package Files 
COPY package.json package.lock-json ./
RUN npm ci

# Copy Source Code 
COPY . .


# Build Project
RUN npm run build

# Production Stage 
FROM nginx:alpine 

# Copy Built Assets to Nginx
COPY --from=builder  /app/dist  /usr/share/nginx/html

# Expose Port 
EXPOSE 80

# Start Nginx 
CMD ["nginx", "-g", "daemon off;"]



# Base Image (Runtime)
FROM node:20-alpine

# Working Directory
WORKDIR /app

# Copy Package Files
COPY package.json package-lock.json ./

# Install Dependencies
RUN npm ci --omit=dev || npm install

# Copy Source Code 
COPY . .

# Expose Application Port
EXPOSE 5000

# Start Command
CMD ["npm", "start"]
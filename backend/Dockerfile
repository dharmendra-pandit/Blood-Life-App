# Base Image (Runtime)
FROM node:20-alpine

# Working Directory
WORKDIR /app

# Copy Package Files
COPY package.json package-lock.json ./

# Install Dependencies
RUN  npm install

# Copy Source Code 
COPY . .

# Start Command
CMD ["npm","start"]
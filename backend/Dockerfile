# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the files
COPY . .

# Install dotenv CLI so we can load .env
RUN npm install -g dotenv-cli

# Expose backend port
EXPOSE 5000

# Start the app with .env loaded
CMD ["dotenv", "-e", ".env", "--", "npm", "start"]

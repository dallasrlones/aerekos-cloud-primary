# Use slim Node.js 22
FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port
EXPOSE 2222

# Run the app
CMD ["npm", "start"]
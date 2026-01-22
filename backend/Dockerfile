# Use lightweight Node.js LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first (for caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy backend source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "index.js"]

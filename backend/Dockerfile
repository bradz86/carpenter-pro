FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only backend package files
COPY backend/package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy backend source files
COPY backend/ ./

# Ensure port binding
ENV PORT=3000
EXPOSE 3000

# Start the backend server
CMD ["node", "server.js"]

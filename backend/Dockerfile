FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create cron job for price updates
RUN echo "0 2 1,15 * * node /app/scripts/scrape-prices.js" > /etc/crontabs/root

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
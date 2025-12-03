# Base image
FROM node:22

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "src/app.js"]

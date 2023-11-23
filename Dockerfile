# Use the Node.js Alpine image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application to the container
COPY . .

# Build the application using Vite
RUN npx vite build

# Expose port 8080
EXPOSE 8080

# Command to run the application
CMD ["node", "index.js"]

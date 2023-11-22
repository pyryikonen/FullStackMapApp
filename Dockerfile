# Use the Node.js Alpine image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the entire root directory into the container
COPY . .

# Install dependencies
RUN npm install

# Expose the port
EXPOSE 8080

# Command to run the application
CMD ["node", "index.js"]


# Use the Alpine Linux-based which will have node 20 already installed
FROM node:14-alpine

# Inform Docker that the container will listen on port 3000
EXPOSE 8080

# Copy all files from the current directory to the /app directory inside the container
COPY . /app

# Set the working directory inside the container to /app
WORKDIR /app

# Run the npm install command to install Node.js dependencies for the application
RUN npm install

# Set the default command for the container to start the Node.js application using index.js
CMD ["node", "index.js"]

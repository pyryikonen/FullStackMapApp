# Use a lightweight Nginx image as the final image
FROM nginx:alpine

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Copy the built assets from the frontend/dist directory into the container
COPY frontend/dist .

# Expose port 80
EXPOSE 80

# Start Nginx to serve the application
CMD ["nginx", "-g", "daemon off;"]